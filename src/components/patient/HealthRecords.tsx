import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HealthRecord } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Upload, 
  Plus, 
  Download, 
  Calendar, 
  ShieldCheck, 
  Trash2, 
  FileCheck, 
  Lock,
  RefreshCw,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { DisclaimerBadge } from '../common/DisclaimerBadge';

export const HealthRecords: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRecordForPreview, setSelectedRecordForPreview] = useState<HealthRecord | null>(null);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState<HealthRecord['recordType']>('lab_report');
  const [doctorOrClinic, setDoctorOrClinic] = useState('');
  const [notes, setNotes] = useState('');
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await api.getHealthRecords(user?.id || 'patient-sunita');
      setRecords(data);
    } catch (err) {
      console.error('Failed to load health records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [user]);

  const handleSimulatedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !doctorOrClinic.trim()) return;

    setIsUploading(true);
    try {
      await api.uploadHealthRecord({
        patientId: user?.id || 'patient-sunita',
        title,
        recordType,
        date: new Date().toISOString().split('T')[0],
        doctorOrClinic,
        fileSize: '420 KB',
        fileType: 'PDF',
        notes
      });

      setSuccessMsg('Health record uploaded and securely linked to your patient profile.');
      setShowUploadModal(false);
      setTitle('');
      setDoctorOrClinic('');
      setNotes('');
      setSimulatedFileName('');
      await loadRecords();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const getRecordTypeBadge = (type: HealthRecord['recordType']) => {
    switch (type) {
      case 'lab_report':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Lab Diagnostic Report</span>;
      case 'prescription':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Doctor Prescription</span>;
      case 'consultation_summary':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">Consultation Summary</span>;
      case 'vaccination_record':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Immunization / Vaccine</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Health Records (ABHA Aligned)
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Strict Patient Privacy Isolation</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Access your verified diagnostic reports, telemedicine prescriptions, and immunization logs. Records are strictly private to your authenticated identity.
          </p>
        </div>

        <button
          onClick={() => {
            setShowUploadModal(true);
            setSuccessMsg(null);
          }}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Record</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="font-semibold">{successMsg}</p>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs text-emerald-700 underline">Dismiss</button>
        </div>
      )}

      {/* Record List */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your private health records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Health Records Saved</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have not uploaded any lab reports or prescriptions yet. Upload your files to share them with doctors during consultations.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700"
          >
            Upload First Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle hover:border-teal-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{rec.title}</h3>
                      <p className="text-xs text-slate-500">{rec.doctorOrClinic}</p>
                    </div>
                  </div>
                  {getRecordTypeBadge(rec.recordType)}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {rec.date}
                  </span>
                  <span>•</span>
                  <span>{rec.fileSize || 'PDF Document'}</span>
                  {rec.isDemoUploaded && (
                    <span className="text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded font-medium">
                      Simulated
                    </span>
                  )}
                </div>

                {rec.notes && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <strong>Observations / Clinical Notes:</strong> {rec.notes}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Strict Patient Sandbox</span>
                <button
                  onClick={() => setSelectedRecordForPreview(rec)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-700" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Upload Health Document</h3>
                <p className="text-xs text-slate-500">Attach Lab Test, Prescription, or Discharge Summary</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulatedUpload} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CBC Blood Count & Thyroid Panel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Document Category
                  </label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value as HealthRecord['recordType'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white"
                  >
                    <option value="lab_report">Diagnostic Lab Report</option>
                    <option value="prescription">Doctor Prescription</option>
                    <option value="consultation_summary">Consultation Summary</option>
                    <option value="vaccination_record">Immunization Record</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Doctor / Diagnostic Lab
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorOrClinic}
                    onChange={(e) => setDoctorOrClinic(e.target.value)}
                    placeholder="e.g. Dr. Lal PathLabs"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Select File (Simulated)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600">Click to choose PDF or JPG report</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSimulatedFileName(e.target.files[0].name);
                      }
                    }}
                    className="mt-2 text-xs text-slate-500"
                  />
                  {simulatedFileName && (
                    <p className="text-xs font-bold text-teal-700 mt-2">
                      Selected: {simulatedFileName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Key Findings / Summary Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Fasting glucose normal, Vitamin D deficiency noted..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
                >
                  {isUploading ? 'Uploading & Encrypting...' : 'Save to Health Records'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Preview Modal */}
      {selectedRecordForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{selectedRecordForPreview.title}</h3>
                <p className="text-xs text-slate-500">{selectedRecordForPreview.doctorOrClinic}</p>
              </div>
              <button
                onClick={() => setSelectedRecordForPreview(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Record ID:</span>
                <span className="font-mono text-slate-800">{selectedRecordForPreview.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Date Issued:</span>
                <span className="text-slate-800">{selectedRecordForPreview.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Category:</span>
                <span className="capitalize text-slate-800">{selectedRecordForPreview.recordType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">File Metadata:</span>
                <span className="text-slate-800">{selectedRecordForPreview.fileSize || 'Standard PDF Document'}</span>
              </div>
            </div>

            {selectedRecordForPreview.notes && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950">
                <p className="font-bold text-teal-900 mb-1">Clinical Notes & Observations:</p>
                <p>{selectedRecordForPreview.notes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecordForPreview(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
