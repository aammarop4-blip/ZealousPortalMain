import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDb } from './db.ts';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import multer from 'multer';

const bcrypt = (bcryptjs as any).default || bcryptjs;
const upload = multer({ dest: 'uploads/' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JWT_SECRET = process.env.JWT_SECRET || 'zealous-secret-key';

// --- Helpers ---
const logAudit = async (userId: number | null, action: string, details: string, req: any) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await db('audit_logs').insert({
      user_id: userId,
      action,
      details,
      ip_address: String(ip)
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
};

async function startServer() {
  await initDb();
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', async (req, res) => {
    const { loginId, password } = req.body; // loginId can be email or employee_id
    try {
      const user = await db('users')
        .where('email', loginId)
        .orWhere('employee_id', loginId)
        .first();

      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      
      await logAudit(user.id, 'LOGIN', 'User logged in successfully', req);
      
      res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name, employee_id: user.employee_id } });
    } catch (err: any) {
      console.error('Login Error:', err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  // Forgot Password
  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await db('users').where({ email }).first();
      if (!user) return res.status(404).json({ error: 'Email not found' });

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour

      await db('password_reset_tokens').insert({
        email,
        token,
        expires_at: expiresAt
      });

      await logAudit(user.id, 'PASSWORD_RESET_REQUEST', 'User requested password reset', req);

      // In a real app, send email here. Mocking for now.
      console.log(`Reset link: http://localhost:3000/reset-password?token=${token}`);
      
      res.json({ message: 'Reset link generated (check server logs for mock link)' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      const resetToken = await db('password_reset_tokens')
        .where({ token, used: false })
        .andWhere('expires_at', '>', new Date())
        .first();

      if (!resetToken) return res.status(400).json({ error: 'Invalid or expired token' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db('users').where({ email: resetToken.email }).update({ password: hashedPassword });
      await db('password_reset_tokens').where({ id: resetToken.id }).update({ used: true });

      const user = await db('users').where({ email: resetToken.email }).first();
      await logAudit(user.id, 'PASSWORD_RESET_COMPLETE', 'User successfully reset password', req);

      res.json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Middleware for Auth
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Employees
  app.get('/api/employees', authenticate, async (req: any, res) => {
    if (!['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized role' });
    }
    try {
      const employees = await db('employees')
        .join('users', 'employees.user_id', 'users.id')
        .select('employees.*', 'users.email as user_email');
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/employees/:id', authenticate, async (req: any, res) => {
    if (!['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized role' });
    }
    try {
      const employee = await db('employees')
        .where('employees.EmployeeID', req.params.id)
        .leftJoin('users', 'employees.user_id', 'users.id')
        .select('employees.*', 'users.email as user_email')
        .first();
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/employees/:id/performance', authenticate, async (req, res) => {
    try {
      const records = await db('PerformanceRecords')
        .where({ EmployeeID: req.params.id })
        .orderBy('RecordDate', 'desc');
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/employees/:id/training', authenticate, async (req, res) => {
    try {
      const training = await db('EmployeeTraining')
        .join('TrainingModules', 'EmployeeTraining.ModuleID', 'TrainingModules.ModuleID')
        .where({ EmployeeID: req.params.id })
        .select('EmployeeTraining.*', 'TrainingModules.ModuleName');
      res.json(training);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/api/employees', authenticate, async (req, res) => {
    const { FirstName, LastName, Email, Phone, Department, Position, HireDate, Status, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [userId] = await db('users').insert({ name: `${FirstName} ${LastName}`, email: Email, password: hashedPassword, role });
      const [employeeId] = await db('employees').insert({
        user_id: userId,
        FirstName,
        LastName,
        Email,
        Phone,
        Department,
        Position,
        HireDate,
        Status
      });
      res.json({ id: employeeId, userId });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Training
  app.get('/api/training/modules', authenticate, async (req: any, res) => {
    try {
      const emp = await db('employees').where({ user_id: req.user.id }).first();
      
      const modules = await db('TrainingModules')
        .select(
          'TrainingModules.*',
          'EmployeeTraining.Status as CompletionStatus',
          'EmployeeAssessments.Score as LastScore'
        )
        .leftJoin('EmployeeTraining', function() {
          this.on('TrainingModules.ModuleID', '=', 'EmployeeTraining.ModuleID')
              .andOn('EmployeeTraining.EmployeeID', '=', db.raw('?', [emp?.EmployeeID || 0]));
        })
        .leftJoin('Assessments', 'TrainingModules.ModuleID', 'Assessments.ModuleID')
        .leftJoin('EmployeeAssessments', function() {
          this.on('Assessments.AssessmentID', '=', 'EmployeeAssessments.AssessmentID')
              .andOn('EmployeeAssessments.EmployeeID', '=', db.raw('?', [emp?.EmployeeID || 0]));
        });

      res.json(modules);
    } catch (err) {
      console.error('Training Modules Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Salary Slips
  // User Creation (Admin/Management/TeamLead/HR)
  app.post('/api/users', authenticate, async (req: any, res) => {
    if (!['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let { email, name, role, employee_id, password } = req.body;
    try {
      // Auto-generate employee_id if not provided
      if (!employee_id) {
        const lastEmp = await db('employees')
          .where('custom_employee_id', 'like', 'ZS-%')
          .orderBy('custom_employee_id', 'desc')
          .first();
        
        let nextNum = 1;
        if (lastEmp && lastEmp.custom_employee_id) {
          const match = lastEmp.custom_employee_id.match(/ZS-(\d+)/);
          if (match) {
            nextNum = parseInt(match[1]) + 1;
          }
        }
        employee_id = `ZS-${nextNum.toString().padStart(3, '0')}`;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [userId] = await db('users').insert({
        email,
        name,
        role,
        employee_id,
        password: hashedPassword
      });

      // Link to employee record if needed
      await db('employees').insert({
        FirstName: name.split(' ')[0],
        LastName: name.split(' ')[1] || '',
        Email: email,
        user_id: userId,
        custom_employee_id: employee_id,
        Status: 'Active'
      });

      res.json({ success: true, userId, employee_id });
    } catch (err) {
      console.error('User Creation Error:', err);
      res.status(500).json({ error: 'Error creating user' });
    }
  });

  // Performance CSV Upload
  app.post('/api/performance/upload-data', authenticate, async (req: any, res) => {
    if (!['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data } = req.body;
    try {
      if (Array.isArray(data)) {
        for (const row of data) {
          // Simulation of saving to DB
          await db('performance_reports').insert({
            EmployeeID: row.EmployeeID,
            Date: row.Date,
            Score: row.Score,
            MetricName: row.MetricName,
            Comments: row.Comments
          });
        }
      }
      res.json({ success: true, message: `${data.length} records processed` });
    } catch (err) {
      console.error('CSV Data Save Error:', err);
      res.status(500).json({ error: 'Failed to save performance data' });
    }
  });

  app.post('/api/performance/upload', authenticate, upload.single('file'), async (req: any, res) => {
    if (!['ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'HR'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // In a real app, we'd parse the CSV here using papaparse
    // For now, we'll just acknowledge the upload
    res.json({ success: true, message: 'File uploaded and processing' });
  });

  // Job Postings (Public)
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await db('job_postings').where({ is_active: true });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Alerts
  app.get('/api/alerts', authenticate, async (req: any, res) => {
    try {
      const emp = await db('employees').where({ user_id: req.user.id }).first();
      if (!emp) return res.json([]);
      const alerts = await db('Alerts').where({ EmployeeID: emp.EmployeeID }).orderBy('IssuedDate', 'desc');
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Attendance
  app.get('/api/attendance', authenticate, async (req: any, res) => {
    try {
      let query = db('attendance').join('employees', 'attendance.EmployeeID', 'employees.EmployeeID');
      if (req.user.role === 'EMPLOYEE') {
        const emp = await db('employees').where({ user_id: req.user.id }).first();
        query = query.where('attendance.EmployeeID', emp.EmployeeID);
      }
      const records = await query.select('attendance.*', 'employees.FirstName', 'employees.LastName').orderBy('Date', 'desc');
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/api/attendance/check-in', authenticate, async (req: any, res) => {
    try {
      const emp = await db('employees').where({ user_id: req.user.id }).first();
      if (!emp) return res.status(404).json({ error: 'Employee record not found' });

      const today = new Date().toISOString().split('T')[0];
      const existing = await db('attendance').where({ EmployeeID: emp.EmployeeID, Date: today }).first();
      if (existing) return res.status(400).json({ error: 'Already checked in today' });

      const now = new Date();
      const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      await db('attendance').insert({
        EmployeeID: emp.EmployeeID,
        Date: today,
        CheckIn: checkInTime,
        Status: now.getHours() >= 9 && now.getMinutes() > 0 ? 'Late' : 'Present'
      });

      await logAudit(req.user.id, 'ATTENDANCE_CHECK_IN', `User checked in at ${checkInTime}`, req);
      res.json({ message: 'Checked in successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Assessments
  app.post('/api/assessments/submit', authenticate, async (req: any, res) => {
    const { assessmentId, score } = req.body;
    try {
      const emp = await db('employees').where({ user_id: req.user.id }).first();
      if (!emp) return res.status(404).json({ error: 'Employee record not found' });

      const result = score >= 70 ? 'Pass' : 'Fail';
      await db('EmployeeAssessments').insert({
        EmployeeID: emp.EmployeeID,
        AssessmentID: assessmentId,
        Score: score,
        Result: result
      });

      await logAudit(req.user.id, 'ASSESSMENT_SUBMIT', `User submitted assessment ${assessmentId} with score ${score}%`, req);
      
      // sp_IssueHRAlert simulation
      if (result === 'Fail') {
        await db('Alerts').insert({
          EmployeeID: emp.EmployeeID,
          AlertType: 'Warning',
          Message: `Failed assessment for module ${assessmentId}. Please retake training.`,
          IssuedDate: new Date().toISOString().split('T')[0]
        });
      }

      res.json({ message: 'Assessment submitted successfully', result });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // --- Vite Setup ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
