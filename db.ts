import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isMSSQL = process.env.DB_CLIENT === 'mssql';

const dbConfig = isMSSQL ? {
  client: 'mssql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
      encrypt: true, // For Azure/Cloud connections
      trustServerCertificate: true // Useful for local dev instances
    }
  }
} : {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'database.sqlite'),
  },
  useNullAsDefault: true,
};

const db = knex(dbConfig);

export async function initDb() {
  // Users table
  if (!(await db.schema.hasTable('users'))) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('employee_id').unique().nullable(); // For User ID login
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('role').notNullable(); // 'ADMIN', 'MANAGEMENT', 'TEAM_LEAD', 'AGENT'
      table.string('name').notNullable();
      table.timestamps(true, true);
    });
  } else {
    // Migration: Add employee_id if missing
    const hasEmployeeId = await db.schema.hasColumn('users', 'employee_id');
    if (!hasEmployeeId) {
      await db.schema.table('users', (table) => {
        table.string('employee_id').unique().nullable();
      });
    }
  }

  // Employees table
  if (!(await db.schema.hasTable('employees'))) {
    await db.schema.createTable('employees', (table) => {
      table.increments('EmployeeID').primary();
      table.string('FirstName', 50);
      table.string('LastName', 50);
      table.string('Email', 100).unique();
      table.string('Phone', 20);
      table.string('Department', 50);
      table.string('Position', 50);
      table.date('HireDate');
      table.string('Status', 20); // Active, Terminated, On Probation
      table.integer('user_id').references('id').inTable('users');
      table.string('custom_employee_id').unique(); // e.g. ZS-001
      table.timestamps(true, true);
    });
  } else {
    // Migration: Add missing columns if they don't exist
    const hasUserId = await db.schema.hasColumn('employees', 'user_id');
    const hasCustomId = await db.schema.hasColumn('employees', 'custom_employee_id');
    
    if (!hasUserId || !hasCustomId) {
      await db.schema.table('employees', (table) => {
        if (!hasUserId) table.integer('user_id').references('id').inTable('users');
        if (!hasCustomId) table.string('custom_employee_id').unique();
      });
    }
  }

  // Performance Reports (CSV Uploads)
  if (!(await db.schema.hasTable('performance_reports'))) {
    await db.schema.createTable('performance_reports', (table) => {
      table.increments('id').primary();
      table.integer('EmployeeID').references('EmployeeID').inTable('employees');
      table.string('date');
      table.float('score');
      table.string('metric_name');
      table.text('comments');
      table.integer('uploaded_by').references('id').inTable('users');
      table.timestamps(true, true);
    });
  }

  // Training Modules
  if (!(await db.schema.hasTable('TrainingModules'))) {
    await db.schema.createTable('TrainingModules', (table) => {
      table.increments('ModuleID').primary();
      table.string('ModuleName', 100);
      table.text('Description');
      table.boolean('Mandatory');
      table.timestamps(true, true);
    });
  }

  // Employee Training
  if (!(await db.schema.hasTable('EmployeeTraining'))) {
    await db.schema.createTable('EmployeeTraining', (table) => {
      table.increments('EmployeeTrainingID').primary();
      table.integer('EmployeeID').references('EmployeeID').inTable('employees');
      table.integer('ModuleID').references('ModuleID').inTable('TrainingModules');
      table.date('CompletionDate');
      table.string('Status', 20); // Completed, Pending, Failed
      table.timestamps(true, true);
    });
  }

  // Assessments
  if (!(await db.schema.hasTable('Assessments'))) {
    await db.schema.createTable('Assessments', (table) => {
      table.increments('AssessmentID').primary();
      table.integer('ModuleID').references('ModuleID').inTable('TrainingModules');
      table.string('AssessmentType', 50); // MCQ, Practical
      table.integer('MaxScore');
      table.timestamps(true, true);
    });
  }

  // Employee Assessments
  if (!(await db.schema.hasTable('EmployeeAssessments'))) {
    await db.schema.createTable('EmployeeAssessments', (table) => {
      table.increments('EmployeeAssessmentID').primary();
      table.integer('EmployeeID').references('EmployeeID').inTable('employees');
      table.integer('AssessmentID').references('AssessmentID').inTable('Assessments');
      table.integer('Score');
      table.string('Result', 20); // Pass, Fail
      table.timestamps(true, true);
    });
  }

  // Performance Records
  if (!(await db.schema.hasTable('PerformanceRecords'))) {
    await db.schema.createTable('PerformanceRecords', (table) => {
      table.increments('PerformanceID').primary();
      table.integer('EmployeeID').references('EmployeeID').inTable('employees');
      table.date('RecordDate');
      table.integer('KPI_Score');
      table.text('ActionPlan');
      table.string('Status', 20); // Good, Needs Improvement, Warning
      table.timestamps(true, true);
    });
  }

  // Salary Slips
  if (!(await db.schema.hasTable('SalarySlips'))) {
    await db.schema.createTable('SalarySlips', (table) => {
      table.increments('SalarySlipID').primary();
      table.integer('EmployeeID').references('EmployeeID').inTable('employees');
      table.string('MonthYear', 20);
      table.decimal('BasicSalary', 10, 2);
      table.decimal('Allowances', 10, 2);
      table.decimal('Deductions', 10, 2);
      table.decimal('NetSalary', 10, 2); // Calculated manually for SQLite compatibility
      table.date('GeneratedDate');
      table.timestamps(true, true);
    });
  }

  // Alerts
  if (!(await db.schema.hasTable('Alerts'))) {
    await db.schema.createTable('Alerts', (table) => {
      table.increments('AlertID').primary();
      table.integer('EmployeeID').references('EmployeeID').inTable('employees');
      table.string('AlertType', 50); // Warning, Termination, Appreciation
      table.text('Message');
      table.date('IssuedDate');
      table.timestamps(true, true);
    });
  }

  // Job Postings
  if (!(await db.schema.hasTable('job_postings'))) {
    await db.schema.createTable('job_postings', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.string('location');
      table.string('type'); // 'Full-time', 'Part-time'
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
  }

  // Attendance Table
  if (!(await db.schema.hasTable('attendance'))) {
    await db.schema.createTable('attendance', (table) => {
      table.increments('AttendanceID').primary();
      table.integer('EmployeeID').references('EmployeeID').inTable('employees');
      table.date('Date');
      table.string('CheckIn');
      table.string('CheckOut');
      table.string('Status', 20); // Present, Absent, Late, Leave
      table.timestamps(true, true);
    });
  }

  // Password Reset Tokens
  if (!(await db.schema.hasTable('password_reset_tokens'))) {
    await db.schema.createTable('password_reset_tokens', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable();
      table.string('token').notNullable();
      table.timestamp('expires_at').notNullable();
      table.boolean('used').defaultTo(false);
      table.timestamps(true, true);
    });
  }

  // Audit Logs
  if (!(await db.schema.hasTable('audit_logs'))) {
    await db.schema.createTable('audit_logs', (table) => {
      table.increments('id').primary();
      table.integer('user_id').nullable();
      table.string('action').notNullable();
      table.string('details');
      table.string('ip_address');
      table.timestamps(true, true);
    });
  }

  console.log('Database initialized');

  // Create default admin if not exists
  const admin = await db('users').where({ email: 'admin@zealous.com' }).first();
  const bcryptModule = await import('bcryptjs');
  const bcrypt = bcryptModule.default || bcryptModule;

  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db('users').insert({
      employee_id: 'ZS-000',
      email: 'admin@zealous.com',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'System Admin',
    });
    console.log('Default admin created');
  }

  // Create HR if not exists
  const hrUser = await db('users').where({ email: 'hr@zealous.com' }).first();
  if (!hrUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db('users').insert({
      employee_id: 'ZS-999',
      email: 'hr@zealous.com',
      password: hashedPassword,
      role: 'HR',
      name: 'HR Manager',
    });
    console.log('Default HR created');
  }

  // Seed some employees if empty
  const empCount = await db('employees').count('EmployeeID as count').first();
  if (empCount && (empCount as any).count === 0) {
    await db('employees').insert([
      { FirstName: 'Sarah', LastName: 'Connor', Email: 'sarah@zealous.com', Phone: '555-0101', Department: 'HR', Position: 'Director', Status: 'Active', HireDate: '2024-01-15', custom_employee_id: 'ZS-001' },
      { FirstName: 'John', LastName: 'Doe', Email: 'john@zealous.com', Phone: '555-0102', Department: 'Operations', Position: 'Manager', Status: 'On Probation', HireDate: '2024-03-01', custom_employee_id: 'ZS-002' },
      { FirstName: 'Mark', LastName: 'Smith', Email: 'mark@zealous.com', Phone: '555-0103', Department: 'Compliance', Position: 'Officer', Status: 'Active', HireDate: '2024-02-20', custom_employee_id: 'ZS-003' }
    ]);
    console.log('Employee seed data added');
  }

  // Seed Training Modules
  const moduleCount = await db('TrainingModules').count('ModuleID as count').first();
  if (moduleCount && (moduleCount as any).count === 0) {
    await db('TrainingModules').insert([
      { ModuleName: 'MVA Compliance', Description: 'Motor Vehicle Accident compliance training.', Mandatory: true },
      { ModuleName: 'Medicare Basics', Description: 'Introduction to Medicare policies.', Mandatory: true },
      { ModuleName: 'ACA Regulations', Description: 'Affordable Care Act guidelines.', Mandatory: false }
    ]);
    console.log('Training modules seeded');
  }

  // Seed Performance Records
  const perfCount = await db('PerformanceRecords').count('PerformanceID as count').first();
  if (perfCount && (perfCount as any).count === 0) {
    await db('PerformanceRecords').insert([
      { EmployeeID: 1, RecordDate: '2026-03-15', KPI_Score: 92, Status: 'Good', ActionPlan: 'Maintain current performance and focus on mentoring new hires.' },
      { EmployeeID: 1, RecordDate: '2025-12-10', KPI_Score: 85, Status: 'Good', ActionPlan: 'Focus on communication skills and cross-departmental collaboration.' },
      { EmployeeID: 2, RecordDate: '2026-04-01', KPI_Score: 65, Status: 'Needs Improvement', ActionPlan: 'Technical skills workshop required. Weekly check-ins with supervisor.' }
    ]);
    console.log('Performance records seeded');
  }

  // Seed Employee Training
  const empTrainCount = await db('EmployeeTraining').count('EmployeeTrainingID as count').first();
  if (empTrainCount && (empTrainCount as any).count === 0) {
    await db('EmployeeTraining').insert([
      { EmployeeID: 1, ModuleID: 1, CompletionDate: '2026-02-20', Status: 'Completed' },
      { EmployeeID: 1, ModuleID: 2, CompletionDate: '2026-03-01', Status: 'Completed' },
      { EmployeeID: 1, ModuleID: 3, CompletionDate: null, Status: 'Pending' },
      { EmployeeID: 2, ModuleID: 1, CompletionDate: null, Status: 'Pending' }
    ]);
    console.log('Employee training seeded');
  }

  // Seed Attendance
  const attCount = await db('attendance').count('AttendanceID as count').first();
  if (attCount && (attCount as any).count === 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    await db('attendance').insert([
      { EmployeeID: 1, Date: today, CheckIn: '09:00', CheckOut: '18:00', Status: 'Present' },
      { EmployeeID: 1, Date: yesterday, CheckIn: '09:15', CheckOut: '18:05', Status: 'Late' },
      { EmployeeID: 2, Date: today, CheckIn: '08:55', CheckOut: '17:55', Status: 'Present' }
    ]);
    console.log('Attendance seeded');
  }

  // Seed Salary Slips
  const slipCount = await db('SalarySlips').count('SalarySlipID as count').first();
  if (slipCount && (slipCount as any).count === 0) {
    await db('SalarySlips').insert([
      { EmployeeID: 1, MonthYear: 'March 2026', BasicSalary: 150000, Allowances: 25000, Deductions: 12000, NetSalary: 163000, GeneratedDate: '2026-03-31' },
      { EmployeeID: 1, MonthYear: 'February 2026', BasicSalary: 150000, Allowances: 20000, Deductions: 12000, NetSalary: 158000, GeneratedDate: '2026-02-28' },
      { EmployeeID: 2, MonthYear: 'March 2026', BasicSalary: 120000, Allowances: 15000, Deductions: 8000, NetSalary: 127000, GeneratedDate: '2026-03-31' }
    ]);
    console.log('Salary slips seeded');
  }
}

export default db;
