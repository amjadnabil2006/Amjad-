import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, Appointment } from '../../types';
import { DoctorCard } from './DoctorCard';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Pill, 
  Mail, 
  FileText, 
  Printer, 
  Video, 
  Building2,
  AlertCircle
} from 'lucide-react';

interface PatientPortalProps {
  onOpenBookingModal: (doctor?: Doctor) => void;
  onOpenEmailCenter: () => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  onTriggerToastTest?: () => void;
  hasUpcomingAppointment?: boolean;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  onOpenBookingModal,
  onOpenEmailCenter,
  activeSubTab,
  setActiveSubTab,
  onTriggerToastTest,
  hasUpcomingAppointment
}) => {
  const { doctors, appointments, medicalRecords, patients, activePatientId, updateAppointmentStatus } = useApp();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchDoctorQuery, setSearchDoctorQuery] = useState('');
  const [selectedRecordForPrint, setSelectedRecordForPrint] = useState<any | null>(null);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  // Filtered doctors
  const specialties = ['all', 'أمراض القلب', 'طب الأطفال', 'المخ والأعصاب'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === 'all' || doc.specialty === selectedSpecialty;
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchDoctorQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchDoctorQuery.toLowerCase()) ||
      doc.bio.toLowerCase().includes(searchDoctorQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  // Patient's own appointments
  const myAppointments = appointments.filter(
    a => a.patientEmail.toLowerCase() === activePatient?.email.toLowerCase() ||
         a.patientPhone === activePatient?.phone ||
         a.patientId === activePatient?.id
  );

  // Patient's own medical records
  const myRecords = medicalRecords.filter(r => r.patientId === activePatient?.id);

  const handlePrintPrescription = (record: any) => {
    setSelectedRecordForPrint(record);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Section (When on doctors tab) */}
      {activeSubTab === 'doctors' && (
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/medical_clinic_hero_1790397153153.jpg"
              alt="مركز صِحّة كير الطبي"
              className="w-full h-full object-cover"
            />
            {/* Scrim overlay for strong contrast */}
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/95 via-slate-900/85 to-slate-900/60" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>منظومة الحجز الطبي المعتمدة والملفات الصحية الذكية</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance leading-tight">
              احجز موعدك الطبي مع نخبة الاستشاريين في صِحّة كير
            </h1>

            <p className="text-sm sm:text-base text-slate-200 mb-6 leading-relaxed">
              اختر الطبيب المناسب، حدد موعدك بسهولة، وتلقَّ تأكيد الحجز والتذكير عبر بريدك الإلكتروني فورياً مع إمكانية الوصول إلى ملفك الطبي ووصفاتك الدوائية المعتمدة على مدار الساعة.
            </p>

            {/* Quick Search Card in Hero */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-300" />
                <input
                  type="text"
                  placeholder="ابحث باسم الطبيب، التخصص، أو الأعراض..."
                  value={searchDoctorQuery}
                  onChange={(e) => setSearchDoctorQuery(e.target.value)}
                  className="w-full text-xs pr-10 pl-3 py-2.5 bg-white/15 border border-white/20 rounded-xl text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <button
                onClick={() => onOpenBookingModal()}
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm whitespace-nowrap"
              >
                احجز موعداً الآن
              </button>
            </div>

            {/* Proof Points */}
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-xs text-slate-300">
              <div>
                <p className="font-bold text-white font-mono tabular-nums text-base">100%</p>
                <p className="text-[11px] text-slate-300">أطباء استشاريون مرخصون</p>
              </div>
              <div>
                <p className="font-bold text-teal-400 font-mono tabular-nums text-base">فوري</p>
                <p className="text-[11px] text-slate-300">تأكيد بريدي وتذكير ذكي</p>
              </div>
              <div>
                <p className="font-bold text-white font-mono tabular-nums text-base">إلكتروني</p>
                <p className="text-[11px] text-slate-300">سجل صحي ووصفات رقمية</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 1: Doctors Directory & Booking */}
      {activeSubTab === 'doctors' && (
        <div className="space-y-6">
          
          {/* Upcoming Appointment Status & Toast Trigger Bar */}
          {hasUpcomingAppointment && (
            <div className="bg-teal-50 border border-teal-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-950">نظام التنبيهات المرئية الذكي نشط:</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>موعد مقترب اليوم</span>
                    </span>
                  </div>
                  <p className="text-xs text-teal-800 mt-0.5">
                    يتم إظهار إشعار مرئي عائم (Toast Notification) تلقائياً لتنبيهك قبل موعد زيارتك للطبيب.
                  </p>
                </div>
              </div>

              {onTriggerToastTest && (
                <button
                  onClick={onTriggerToastTest}
                  className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-white hover:bg-teal-100/80 border border-teal-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
                  title="عرض إشعار Toast التجريبي فوراً"
                >
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>إظهار التنبيه المرئي الآن (Toast)</span>
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">الأطباء الاستشاريون المتاحون</h2>
              <p className="text-xs text-slate-500">اختر الطبيب المناسب للاطلاع على المؤهلات والمواعيد المتاحة</p>
            </div>

            {/* Specialty filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl">
              {specialties.map(spec => {
                const label = spec === 'all' ? 'جميع التخصصات' : spec;
                return (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      selectedSpecialty === spec
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBook={(doc) => onOpenBookingModal(doc)}
              />
            ))}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: My Booked Appointments */}
      {activeSubTab === 'patient-appointments' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">مواعيدي الطبية المحجوزة</h2>
              <p className="text-xs text-slate-500">المريض الحالي: {activePatient?.name} ({activePatient?.email})</p>
            </div>

            <div className="flex items-center gap-2">
              {onTriggerToastTest && (
                <button
                  onClick={onTriggerToastTest}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                  title="عرض تنبيه Toast للموعد القادم"
                >
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>تنبيه الموعد (Toast)</span>
                </button>
              )}

              <button
                onClick={() => onOpenBookingModal()}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
              >
                + حجز موعد جديد
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-3">
            {myAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-800">لا توجد مواعيد محجوزة حالياً</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">يمكنك تصفح قائمة الأطباء وحجز موعدك الأول خلال دقيقة واحدة</p>
                <button
                  onClick={() => onOpenBookingModal()}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  حجز موعد طبي الآن
                </button>
              </div>
            ) : (
              myAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={apt.doctorAvatar}
                      alt={apt.doctorName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          #{apt.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{apt.doctorName}</h3>
                        <span className="text-xs text-slate-500">({apt.doctorSpecialty})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          <span>{apt.date}</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1 font-mono font-bold text-teal-800 tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>{apt.timeSlot}</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          {apt.consultationType === 'in_clinic' ? (
                            <>
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>كشف حضوري بالعيادة</span>
                            </>
                          ) : (
                            <>
                              <Video className="w-3.5 h-3.5 text-indigo-600" />
                              <span>استشارة مرئية عن بُعد</span>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        سبب الحجز: <span className="text-slate-800">{apt.reason}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                      apt.status === 'confirmed' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                      apt.status === 'in_progress' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                      apt.status === 'completed' ? 'text-slate-600 bg-slate-100 border-slate-200' :
                      'text-rose-700 bg-rose-50 border-rose-200'
                    }`}>
                      {apt.status === 'confirmed' ? 'مؤكد' :
                       apt.status === 'in_progress' ? 'جاري الكشف' :
                       apt.status === 'completed' ? 'مكتمل' : 'ملغي'}
                    </span>

                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟')) {
                            updateAppointmentStatus(apt.id, 'cancelled', 'بناءً على طلب المريض');
                          }
                        }}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                      >
                        إلغاء الموعد
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 3: My Medical File & Prescriptions */}
      {activeSubTab === 'patient-records' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center text-lg font-bold">
                  {activePatient?.name.slice(0, 1)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{activePatient?.name}</h2>
                  <p className="text-xs text-slate-500">
                    رقم الهوية: {activePatient?.nationalId || '1098234120'} · فصيلة الدم: {activePatient?.bloodType}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                <span>تحديث الملف: </span>
                <span className="font-mono text-slate-800 font-semibold">2026-09-26</span>
              </div>
            </div>

            {/* Past consultations list for patient */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>التقارير الطبية والوصفات المعتمدة ({myRecords.length}):</span>
              </h3>

              {myRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                  <p className="text-xs">لا توجد تقارير طبية منتهية في ملفك بعد.</p>
                </div>
              ) : (
                myRecords.map(record => (
                  <div key={record.id} className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          #{record.id}
                        </span>
                        <span className="mr-2 text-xs font-bold text-slate-900">{record.doctorName}</span>
                        <span className="text-[11px] text-slate-500"> - {record.doctorSpecialty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">{record.date}</span>
                        <button
                          onClick={() => handlePrintPrescription(record)}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" />
                          <span>طباعة الوصفة</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-800 block mb-1">التشخيص الطبي:</span>
                      <p className="text-xs text-teal-900 font-semibold bg-teal-50 p-2.5 rounded-xl border border-teal-200">
                        {record.diagnosis}
                      </p>
                    </div>

                    {record.prescriptions && record.prescriptions.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5 text-teal-600" />
                          <span>الأدوية الموصوفة:</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {record.prescriptions.map(p => (
                            <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                              <p className="font-bold text-slate-900">{p.medicationName}</p>
                              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">{p.dosage} · {p.frequency}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{p.instructions}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 4: About Clinic */}
      {activeSubTab === 'clinic-about' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">عن مركز صِحّة كير الطبي التخصصي</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              مركز طبي متكامل يجمع نخبة من كبار الأطباء والاستشاريين الحاصلين على أعلى البوردات العالمية في مجالات القلب والأوعية الدموية، طب الأطفال، المخ والأعصاب، والعيادات التخصصية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>العنوان والموقع:</span>
              </span>
              <p className="text-slate-600">طريق الملك فهد، حي الصحافة، الرياض، المملكة العربية السعودية</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-teal-600" />
                <span>أرقام التواصل وحجز الطوارئ:</span>
              </span>
              <p className="text-slate-600 font-mono">+966 11 482 9100 / +966 50 123 4567</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>أوقات العمل:</span>
              </span>
              <p className="text-slate-600">السبت إلى الخميس: 08:30 صباحاً إلى 09:30 مساءً</p>
            </div>
          </div>
        </div>
      )}

      {/* Printable prescription sheet if requested */}
      {selectedRecordForPrint && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 z-50 text-slate-900" dir="rtl">
          <div className="border-b-2 border-teal-600 pb-3 mb-4 flex justify-between">
            <div>
              <h1 className="text-xl font-bold text-teal-800">صِحّة كير - وصفة طبية رسمية</h1>
              <p className="text-xs text-slate-500">المريض: {activePatient?.name}</p>
            </div>
            <div className="text-xs text-left">
              <p>رقم السجل: #{selectedRecordForPrint.id}</p>
              <p>التاريخ: {selectedRecordForPrint.date}</p>
            </div>
          </div>
          <div className="mb-4 text-xs">
            <p><strong>الطبيب:</strong> {selectedRecordForPrint.doctorName} ({selectedRecordForPrint.doctorSpecialty})</p>
            <p><strong>التشخيص:</strong> {selectedRecordForPrint.diagnosis}</p>
          </div>
          <div className="text-xs">
            <h3 className="font-bold mb-2">الوصفة الدوائية:</h3>
            {selectedRecordForPrint.prescriptions.map((p: any, i: number) => (
              <p key={i} className="mb-1">
                - {p.medicationName} ({p.dosage}) : {p.frequency} لمدة {p.duration} ({p.instructions})
              </p>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
