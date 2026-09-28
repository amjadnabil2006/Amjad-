import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, PrescriptionItem, LabResult, Vitals } from '../../types';
import { 
  X, 
  Stethoscope, 
  FileText, 
  Pill, 
  Activity, 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Calendar
} from 'lucide-react';

interface ConsultationModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onCompleted?: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  appointment,
  onClose,
  onCompleted
}) => {
  const { addMedicalRecord, doctors, patients } = useApp();

  const doctor = appointment ? (doctors.find(d => d.id === appointment.doctorId) || doctors[0]) : doctors[0];
  const patient = appointment ? (patients.find(p => p.id === appointment.patientId) || patients[0]) : patients[0];

  // Clinical inputs
  const [chiefComplaint, setChiefComplaint] = useState(appointment?.reason || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  // Vitals
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState(72);
  const [temp, setTemp] = useState(37.0);
  const [weight, setWeight] = useState(70);
  const [oxygen, setOxygen] = useState(99);

  // Follow-up
  const [followUpDate, setFollowUpDate] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx-new-1',
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }
  ]);

  if (!appointment) return null;

  const handleAddMedication = () => {
    setPrescriptions(prev => [
      ...prev,
      {
        id: `rx-new-${Date.now()}`,
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }
    ]);
  };

  const handleRemoveMedication = (id: string) => {
    if (prescriptions.length === 1) return;
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateMedication = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptions(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis) {
      alert('يرجى إدخال التشخيص الطبي للحالة');
      return;
    }

    // Filter valid prescriptions
    const validPrescriptions = prescriptions.filter(p => p.medicationName.trim() !== '');

    const vitalsData: Vitals = {
      bloodPressure: bp,
      heartRate: hr,
      temperature: temp,
      weight,
      oxygenSaturation: oxygen
    };

    addMedicalRecord({
      patientId: appointment.patientId,
      doctorId: doctor.id,
      appointmentId: appointment.id,
      chiefComplaint: chiefComplaint || appointment.reason,
      diagnosis,
      clinicalNotes,
      vitals: vitalsData,
      prescriptions: validPrescriptions,
      recommendedFollowUpDate: followUpDate || undefined,
      sendEmailToPatient: sendEmail
    });

    if (onCompleted) onCompleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">جلسة الكشف الطبي المباشر</h2>
                <span className="text-[11px] font-mono bg-slate-800 text-teal-400 px-2 py-0.5 rounded border border-slate-700">
                  #{appointment.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                المريض: <span className="text-white font-medium">{appointment.patientName}</span> · الطبيب: {doctor.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient quick badge banner */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>فصيلة الدم: <strong className="text-slate-900">{patient?.bloodType || 'غير محدد'}</strong></span>
            <span>·</span>
            <span>العمر: <strong className="text-slate-900">38 سنة</strong></span>
            <span>·</span>
            <span>الهاتف: <strong className="font-mono text-slate-900">{appointment.patientPhone}</strong></span>
          </div>
          {patient?.allergies && patient.allergies.length > 0 && (
            <div className="text-rose-700 font-semibold flex items-center gap-1 text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>تحذير حساسية: {patient.allergies.join('، ')}</span>
            </div>
          )}
        </div>

        {/* Body form */}
        <form id="consultation-form" onSubmit={handleSubmitConsultation} className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Vitals */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>العلامات الحيوية (Vitals):</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">ضغط الدم (BP)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">النبض (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">الحرارة (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">الوزن (كغ)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">الأكسجين (SpO2%)</label>
                <input
                  type="number"
                  value={oxygen}
                  onChange={(e) => setOxygen(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Diagnosis & Notes */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                التشخيص الطبي للحالة (Diagnosis) *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: التهاب الشعب الهوائية الحاد / ارتفاع ضغط دم أولي مستقر..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                الملاحظات السريرية وخطة العلاج (Clinical Notes)
              </label>
              <textarea
                rows={3}
                placeholder="تدوين ملاحظات الفحص السريري، نتائج الفحص، التوجيهات الغذائية ونمط الحياة..."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 3: Prescriptions (Rx) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>الوصفة الطبية الإلكترونية (e-Prescription):</span>
              </h3>
              <button
                type="button"
                onClick={handleAddMedication}
                className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-1 rounded-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة دواء آخر</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {prescriptions.map((rx, idx) => (
                <div key={rx.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">الدواء #{idx + 1}</span>
                    {prescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(rx.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="اسم الدواء العلمي أو التجاري"
                        value={rx.medicationName}
                        onChange={(e) => handleUpdateMedication(rx.id, 'medicationName', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="الجرعة (مثال: 500 ملغ)"
                        value={rx.dosage}
                        onChange={(e) => handleUpdateMedication(rx.id, 'dosage', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="المدة (مثال: 7 أيام)"
                        value={rx.duration}
                        onChange={(e) => handleUpdateMedication(rx.id, 'duration', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="التكرار (مثال: مرتين يومياً بعد الطعام)"
                      value={rx.frequency}
                      onChange={(e) => handleUpdateMedication(rx.id, 'frequency', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      placeholder="تعليمات الاستخدام والتحذيرات"
                      value={rx.instructions}
                      onChange={(e) => handleUpdateMedication(rx.id, 'instructions', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Follow up & Notification option */}
          <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-teal-900 mb-1">تاريخ المراجعة المقترحة (Follow-up):</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="text-xs bg-white border border-slate-300 rounded-md px-3 py-1.5 text-slate-800"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-teal-950">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>إرسال التقرير والوصفة الطبية مباشرة إلى بريد المريض فور الاعتماد</span>
              </label>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            إلغاء
          </button>

          <button
            type="submit"
            form="consultation-form"
            className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>اعتماد التقرير وإنهاء الكشف</span>
          </button>
        </div>

      </div>
    </div>
  );
};
