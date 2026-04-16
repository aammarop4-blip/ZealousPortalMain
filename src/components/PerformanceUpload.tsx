import React from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';

export default function PerformanceUpload() {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv') {
        setError('Please upload a valid CSV file.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        console.log('Parsed CSV Data:', results.data);
        try {
          // Send parsed data to backend instead of raw file
          const res = await fetch('/api/performance/upload-data', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ data: results.data })
          });

          if (!res.ok) throw new Error('Upload failed');

          setSuccess(true);
          setFile(null);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setUploading(false);
        }
      },
      error: (err) => {
        setError('Error parsing CSV: ' + err.message);
        setUploading(false);
      }
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Performance Reports</h1>
        <p className="text-zinc-500">Upload daily performance CSV files to sync with the database.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            file ? 'border-orange-600 bg-orange-600/5' : 'border-zinc-800 hover:border-zinc-700'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <input 
            type="file" 
            id="csv-upload" 
            className="hidden" 
            accept=".csv"
            onChange={handleFileChange}
          />
          <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 mb-4">
              <Upload size={32} />
            </div>
            <div className="text-white font-bold text-lg mb-1">
              {file ? file.name : 'Click to upload or drag and drop'}
            </div>
            <div className="text-zinc-500 text-sm">CSV files only (Max 10MB)</div>
          </label>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">Report uploaded successfully!</span>
            <button onClick={() => setSuccess(false)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            !file || uploading 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20'
          }`}
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <FileText size={20} />
              Process CSV Report
            </>
          )}
        </button>
      </div>

      <div className="mt-12 space-y-4">
        <h3 className="text-white font-bold">CSV Format Requirements</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <code className="text-zinc-400 text-sm block leading-relaxed">
            EmployeeID, Date, Score, MetricName, Comments<br />
            1, 2026-04-16, 95, "Call Quality", "Excellent handling"<br />
            2, 2026-04-16, 82, "Response Time", "Good average"
          </code>
        </div>
      </div>
    </div>
  );
}
