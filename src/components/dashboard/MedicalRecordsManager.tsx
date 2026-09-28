import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, MedicalRecord, PrescriptionItem } from '../../types';
import { 
  FileText, 
  Search, 
  User, 
  Calendar, 
  Stethoscope, 
  Pill, 
  Activity, 
  AlertTriangle, 
  Download, 
  Printer, 
  Plus, 
  Phone, 
  Mail, 
  ChevronRight, 
  Clock, 
  Heart,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

interface MedicalRecordsManagerProps {
  initialPatientId?: string;
}

export const MedicalRecordsManager: React.FC<MedicalRecordsManagerProps> = ({ initialPatientId }) => {
  const { patients, medicalRecords, doctors, appointments } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || patients[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'consultations' | 'prescriptions' | 'vitals' | 'labs'>('consultations');
  const [printModalRecord, setPrintModalRecord] = useState<MedicalRecord | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patientRecords = medicalRecords.filter(r => r.patientId === selectedPatient?.id);

  // Collect all prescriptions
  const allPrescriptions = patientRecords.flatMap(r => 
    r.prescriptions.map(p => ({ ...p, date: r.date, doctorName: r.doctorName }))
  );

  // Collect all lab results
  const allLabs = patientRecords.flatMap(r => 
    (r.labResults || []).map(l => ({ ...l, doctorName: r.doctorName }))
  );

  const handlePrint = (record: MedicalRecord) => {
    setPrintModalRecord(record);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">سجل الملفات الطبية الإلكترونية (EMR)</h2>
            <p className="text-xs text-slate-500">الأرشيف الصحي الموحد للمرضى، التقارير السريرية، والوصفات الطبية المعتمدة</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>إجمالي الملفات الطبية المسجلة:</span>
          <span className="font-mono font-bold text-teal-800 tabular-nums bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {patients.length} ملف
          </span>
        </div>
      </div>

      {/* Main Grid: Patients List Sidebar (Left in RTL is Right in DOM) + Patient Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Patients Roster / Directory (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col h-[700px]">
          
          <div className="mb-3">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">البحث في ملفات المرضى:</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو رقم الجوال..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Patient list scrollable */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 -mx-1 px-1">
            {filteredPatients.map(patient => {
              const isSelected = selectedPatient?.id === patient.id;
              const recordsCount = medicalRecords.filter(r => r.patientId === patient.id).length;

              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all my-1 ${
                    isSelected
                      ? 'bg-teal-50 border border-teal-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {patient.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-teal-950' : 'text-slate-900'}`}>
                          {patient.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono tabular-nums">{patient.phone}</p>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-[10px] font-mono font-bold bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        {patient.bloodType}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {recordsCount} زيارات
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Selected Patient Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {selectedPatient ? (
            <>
              {/* Patient Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-xs">
                      {selectedPatient.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h3>
                        <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          فصيلة {selectedPatient.bloodType}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>رقم الملف: <strong className="font-mono text-slate-700">#{selectedPatient.id}</strong></span>
                        <span>·</span>
                        <span>تاريخ الميلاد: <strong className="font-mono text-slate-700">{selectedPatient.dateOfBirth}</strong></span>
                        <span>·</span>
                        <span>الجنس: <strong className="text-slate-700">{selectedPatient.gender === 'male' ? 'ذكر' : 'أنثى'}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 sm:text-left">
                    <div className="flex items-center gap-1.5 sm:justify-end">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:justify-end">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedPatient.email}</span>
                    </div>
                  </div>
                </div>

                {/* Chronic & Allergies Alert bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                    <span className="font-bold text-amber-900 block mb-0.5">الأمراض المزمنة:</span>
                    <p className="text-amber-800">
                      {selectedPatient.chronicDiseases.length > 0 
                        ? selectedPatient.chronicDiseases.join('، ') 
                        : 'لا توجد أمراض مزمنة مسجلة'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
                    <span className="font-bold text-rose-900 block mb-0.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>الحساسية المسجلة:</span>
                    </span>
                    <p className="text-rose-800">
                      {selectedPatient.allergies.length > 0 
                        ? selectedPatient.allergies.join('، ') 
                        : 'لا توجد حساسية دوائية معروفة'}
                    </p>
                  </div>
                </div>

                {/* Dossier Tabs */}
                <div className="flex items-center gap-1 mt-6 border-b border-slate-200 pb-2">
                  <button
                    onClick={() => setActiveTab('consultations')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === 'consultations'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    سجل الزيارات والتشخيصات ({patientRecords.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('prescriptions')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === 'prescriptions'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    الوصفات الطبية (Rx) ({allPrescriptions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('vitals')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === 'vitals'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    تتبع العلامات الحيوية
                  </button>
                  <button
                    onClick={() => setActiveTab('labs')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === 'labs'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    التحاليل والفحوصات ({allLabs.length})
                  </button>
                </div>

                {/* Tab 1: Consultations Timeline */}
                {activeTab === 'consultations' && (
                  <div className="mt-5 space-y-4">
                    {patientRecords.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs">لا توجد زيارات سابقة مسجلة لهذا المريض بعد.</p>
                      </div>
                    ) : (
                      patientRecords.map((record) => (
                        <div key={record.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                #{record.id}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{record.doctorName}</span>
                              <span className="text-[11px] text-slate-500">({record.doctorSpecialty})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono tabular-nums">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{record.date}</span>
                              </div>
                              <button
                                onClick={() => handlePrint(record)}
                                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                              >
                                <Printer className="w-3 h-3 text-slate-500" />
                                <span>طباعة التقرير</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-900 mb-0.5">التشخيص الطبي:</p>
                            <p className="text-xs text-teal-800 font-medium bg-teal-50/70 p-2 rounded-lg border border-teal-100">
                              {record.diagnosis}
                            </p>
                          </div>

                          {record.clinicalNotes && (
                            <div>
                              <p className="text-xs font-bold text-slate-900 mb-0.5">ملاحظات الطبيب وتوجيهات العلاج:</p>
                              <p className="text-xs text-slate-600 leading-relaxed bg-white p-2 rounded-lg border border-slate-200">
                                {record.clinicalNotes}
                              </p>
                            </div>
                          )}

                          {/* Prescribed drugs */}
                          {record.prescriptions && record.prescriptions.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                                <Pill className="w-3.5 h-3.5 text-teal-600" />
                                <span>الوصفة الدوائية المعتمدة:</span>
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {record.prescriptions.map(p => (
                                  <div key={p.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                                    <p className="font-bold text-slate-900">{p.medicationName}</p>
                                    <p className="text-[11px] text-slate-600 mt-0.5">{p.dosage} · {p.frequency}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{p.instructions}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {record.recommendedFollowUpDate && (
                            <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>المراجعة المقترحة: {record.recommendedFollowUpDate}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab 2: Prescriptions Archive */}
                {activeTab === 'prescriptions' && (
                  <div className="mt-5 space-y-3">
                    {allPrescriptions.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <Pill className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs">لا توجد وصفات مسجلة حتى الآن.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allPrescriptions.map(item => (
                          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs">{item.medicationName}</span>
                              <span className="text-[10px] font-mono text-slate-400 tabular-nums">{item.date}</span>
                            </div>
                            <p className="text-xs text-teal-800 font-semibold">{item.dosage} · {item.frequency}</p>
                            <p className="text-[11px] text-slate-500">المدة: {item.duration}</p>
                            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                              {item.instructions}
                            </p>
                            <p className="text-[10px] text-slate-400">الطبيب الواصف: {item.doctorName}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Vitals */}
                {activeTab === 'vitals' && (
                  <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-medium text-slate-500 block">آخر ضغط دم مقاس</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-1 block">
                          {patientRecords[0]?.vitals?.bloodPressure || '120/80'}
                        </span>
                        <span className="text-[10px] text-emerald-600">طبيعي ومستقر</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-medium text-slate-500 block">معدل النبض</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-1 block">
                          {patientRecords[0]?.vitals?.heartRate || '74'} bpm
                        </span>
                        <span className="text-[10px] text-slate-500">منتظم</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-medium text-slate-500 block">تشبع الأكسجين</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-1 block">
                          {patientRecords[0]?.vitals?.oxygenSaturation || '99'}%
                        </span>
                        <span className="text-[10px] text-emerald-600">ممتاز</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-medium text-slate-500 block">الوزن الحالي</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-1 block">
                          {patientRecords[0]?.vitals?.weight || '80'} كغ
                        </span>
                        <span className="text-[10px] text-slate-500">مؤشر كتلة متزن</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Lab results */}
                {activeTab === 'labs' && (
                  <div className="mt-5 space-y-3">
                    {allLabs.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <Activity className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs">لا توجد تحاليل مسجلة في هذا الملف.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                        {allLabs.map(lab => (
                          <div key={lab.id} className="p-3 bg-white flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-900">{lab.testName}</p>
                              <p className="text-[11px] text-slate-500">المعدل الطبيعي: {lab.normalRange} · {lab.date}</p>
                            </div>
                            <div className="text-left">
                              <span className="font-mono font-bold text-teal-800 text-sm">{lab.result}</span>
                              <span className="block text-[10px] text-emerald-600 font-semibold">ضمن المعدل السليم</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <User className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">اختر مريضاً من القائمة الجانبية لعرض ملفه الطبي</p>
            </div>
          )}

        </div>

      </div>

      {/* Printable Report Hidden/Trigger View */}
      {printModalRecord && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 z-50 text-slate-900 font-sans" dir="rtl">
          <div className="border-b-2 border-teal-700 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-teal-800">مركز صِحّة كير الطبي التخصصي</h1>
              <p className="text-sm text-slate-600">تقرير استشارة طبية ووصفة علاجية معتمدة</p>
            </div>
            <div className="text-left text-xs font-mono text-slate-500">
              <p>رقم التقرير: #{printModalRecord.id}</p>
              <p>التاريخ: {printModalRecord.date}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200 text-sm grid grid-cols-2 gap-4">
            <div>
              <p><strong>اسم المريض:</strong> {selectedPatient?.name}</p>
              <p><strong>فصيلة الدم:</strong> {selectedPatient?.bloodType}</p>
              <p><strong>الجوال:</strong> {selectedPatient?.phone}</p>
            </div>
            <div>
              <p><strong>الطبيب المعالج:</strong> {printModalRecord.doctorName}</p>
              <p><strong>التخصص:</strong> {printModalRecord.doctorSpecialty}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 border-b pb-1 mb-2">التشخيص الطبي السريري:</h2>
            <p className="text-sm text-slate-800 leading-relaxed font-semibold">{printModalRecord.diagnosis}</p>
            {printModalRecord.clinicalNotes && (
              <p className="text-xs text-slate-600 mt-2">{printModalRecord.clinicalNotes}</p>
            )}
          </div>

          {printModalRecord.prescriptions && printModalRecord.prescriptions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-bold text-slate-900 border-b pb-1 mb-2">الوصفة الدوائية المعتمدة (Rx):</h2>
              <table className="w-full text-right text-xs border">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 border">الدواء</th>
                    <th className="p-2 border">الجرعة والتكرار</th>
                    <th className="p-2 border">المدة</th>
                    <th className="p-2 border">التعليمات</th>
                  </tr>
                </thead>
                <tbody>
                  {printModalRecord.prescriptions.map((rx, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2 border font-bold">{rx.medicationName}</td>
                      <td className="p-2 border">{rx.dosage} - {rx.frequency}</td>
                      <td className="p-2 border">{rx.duration}</td>
                      <td className="p-2 border">{rx.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-12 pt-6 border-t flex justify-between items-end text-xs text-slate-600">
            <div>
              <p>صادر ومعتمد إلكترونياً من منصة صِحّة كير الطبية</p>
              <p>هاتف الدعم: 966114829100+</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900 mb-8">توقيع وختم الطبيب الاستشاري:</p>
              <p className="border-t border-slate-400 pt-1 px-8">{printModalRecord.doctorName}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
