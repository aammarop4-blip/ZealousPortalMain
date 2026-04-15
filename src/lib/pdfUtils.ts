import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateSalaryPDF = (slip: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(234, 88, 12); // Orange-600
  doc.text('ZEALOUS SOLUTIONS', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('SALARY STATEMENT', 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Statement Period: ${slip.MonthYear}`, 105, 38, { align: 'center' });
  
  // Employee Info
  doc.setDrawColor(200);
  doc.line(20, 45, 190, 45);
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Employee Details', 20, 55);
  
  doc.setFontSize(10);
  doc.text(`Employee Code: ${slip.emp_code}`, 20, 62);
  doc.text(`Generated Date: ${new Date(slip.GeneratedDate).toLocaleDateString()}`, 20, 67);
  
  // Salary Table
  (doc as any).autoTable({
    startY: 75,
    head: [['Description', 'Amount']],
    body: [
      ['Basic Salary', `$${slip.BasicSalary.toLocaleString()}`],
      ['Allowances', `$${slip.Allowances.toLocaleString()}`],
      ['Deductions', `-$${slip.Deductions.toLocaleString()}`],
      [{ content: 'Net Payable', styles: { fontStyle: 'bold' } }, { content: `$${slip.NetSalary.toLocaleString()}`, styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [234, 88, 12] },
  });
  
  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('This is a computer-generated document and does not require a physical signature.', 105, finalY + 20, { align: 'center' });
  
  doc.save(`Salary_Slip_${slip.MonthYear.replace(' ', '_')}.pdf`);
};

export const generatePerformancePDF = (record: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(234, 88, 12);
  doc.text('ZEALOUS SOLUTIONS', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('PERFORMANCE EVALUATION REPORT', 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Employee: ${record.FirstName} ${record.LastName}`, 20, 50);
  doc.text(`Department: ${record.Department}`, 20, 57);
  doc.text(`Review Date: ${record.RecordDate}`, 20, 64);
  
  doc.setFontSize(14);
  doc.text('KPI Assessment', 20, 80);
  doc.setFontSize(30);
  doc.setTextColor(234, 88, 12);
  doc.text(`${record.KPI_Score}%`, 20, 95);
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Status: ${record.Status}`, 20, 105);
  
  doc.setFontSize(14);
  doc.text('Improvement & Action Plan', 20, 125);
  doc.setFontSize(10);
  doc.setTextColor(80);
  const splitAction = doc.splitTextToSize(record.ActionPlan, 170);
  doc.text(splitAction, 20, 135);
  
  doc.save(`Performance_Report_${record.FirstName}_${record.LastName}.pdf`);
};

export const generateWarningPDF = (employee: any, message: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(234, 88, 12);
  doc.text('ZEALOUS SOLUTIONS', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(200, 0, 0);
  doc.text('OFFICIAL WARNING LETTER', 105, 35, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
  doc.text(`To: ${employee.FirstName} ${employee.LastName}`, 20, 55);
  doc.text(`Employee ID: ZS-${employee.EmployeeID.toString().padStart(4, '0')}`, 20, 60);
  
  doc.setFontSize(11);
  const content = `Dear ${employee.FirstName},\n\nThis letter serves as a formal warning regarding your performance/conduct. We have noted areas that require immediate improvement as detailed below:\n\n${message}\n\nPlease be advised that further instances of non-compliance or failure to meet performance standards may result in additional disciplinary action, up to and including termination of employment.\n\nWe value your contribution to Zealous Solutions and hope to see immediate positive changes.\n\nSincerely,\n\nHR Department\nZealous Solutions`;
  
  const splitContent = doc.splitTextToSize(content, 170);
  doc.text(splitContent, 20, 80);
  
  doc.save(`Warning_Letter_${employee.LastName}.pdf`);
};
