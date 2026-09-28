import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCw, 
  FileText, 
  AlertCircle,
  MoreVertical,
  Check,
  Video,
  Building2,
  Send
} from 'lucide-react';
import { ConsultationModal } from './ConsultationModal';
import { RescheduleModal } from './RescheduleModal';

interface AppointmentsManagerProps {
  onViewPatientRecords?: (patientId: string) => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  onViewPatientRecords
}) => {
  const { 
    appointments, 
    doctors, 
    updateAppointmentStatus, 
    sendAppointmentReminder,
    selectedDoctorId,
    setSelectedDoctorId 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [selectedAppointmentForConsultation, setSelectedAppointmentForConsultation] = useState<Appointment | null>(null);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState<Appointment | null>(null);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Today & Tomorrow strings
  const todayStr = '2026-09-26';
  const tomorrowStr = '2026-09-27';

  // Stats
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const inProgressCount = appointments.filter(a => a.status === 'in_progress').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  const filteredAppointments = appointments.filter(apt => {
    // Search query
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

    // Doctor filter
    const matchesDoctor = selectedDoctorId === 'all' || apt.doctorId === selectedDoctorId;

    // Date filter
    const matchesDate = 
      dateFilter === 'all' ||
      (dateFilter === 'today' && apt.date === todayStr) ||
      (dateFilter === 'tomorrow' && apt.date === tomorrowStr);

    return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
  });

  const handleSendReminder = (apt: Appointment) => {
    sendAppointmentReminder(apt.id);
    setReminderToast(`تم إرسال تذكير بالبريد الإلكتروني إلى ${apt.patientName} (${apt.patientEmail}) بنجاح.`);
    setTimeout(() => {
      setReminderToast(null);
    }, 4000);
  };

  const handleCancel = (apt: Appointment) => {
    const reason = window.prompt('يرجى ذكر سبب إلغاء الموعد (سيتم إدراجه في رسالة البريد للمريض):', 'ظرف طارئ أو اعتذار الطبيب');
    if (reason !== null) {
      updateAppointmentStatus(apt.id, 'cancelled', reason);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">مؤكد</span>;
      case 'in_progress':
        return <span className="text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-blue-200 animate-pulse">جاري الكشف</span>;
      case 'completed':
        return <span className="text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-slate-200">مكتمل</span>;
      case 'pending':
        return <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-amber-200">قيد الانتظار</span>;
      case 'cancelled':
        return <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-rose-200">ملغي</span>;
      case 'rescheduled':
        return <span className="text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-purple-200">تمت إعادة جدولته</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {reminderToast && (
        <div className="bg-teal-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Mail className="w-4 h-4 text-teal-200 shrink-0" />
            <span>{reminderToast}</span>
          </div>
          <button onClick={() => setReminderToast(null)} className="text-teal-200 hover:text-white">
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">إجمالي المواعيد</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{totalCount}</span>
            <span className="text-[11px] text-slate-400">سجل كامل</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-emerald-700">المواعيد المؤكدة</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">{confirmedCount}</span>
            <span className="text-[11px] text-emerald-600">جاهزة للاستقبال</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-amber-700">قيد الانتظار</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-amber-700 tabular-nums">{pendingCount}</span>
            <span className="text-[11px] text-amber-600">تحتاج تأكيد</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-blue-700">المكتملة اليوم</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-blue-700 tabular-nums">{completedCount}</span>
            <span className="text-[11px] text-blue-600">تم الفحص</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم، الجوال، رقم الموعد أو الشكوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Doctor selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 whitespace-nowrap">العيادة/الطبيب:</span>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none"
              >
                <option value="all">جميع الأطباء والعيادات</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  dateFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  dateFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                اليوم (26 سبتمبر)
              </button>
              <button
                onClick={() => setDateFilter('tomorrow')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  dateFilter === 'tomorrow' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                غداً (27 سبتمبر)
              </button>
            </div>
          </div>
        </div>

        {/* Status segmented tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            جميع الحالات ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'confirmed'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            المؤكدة ({confirmedCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'in_progress'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            جاري الكشف ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            المكتملة ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'pending'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            قيد الانتظار ({pendingCount})
          </button>
        </div>
      </div>

      {/* Appointments Data Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold">لا توجد مواعيد مطابقة لخيارات البحث</p>
            <p className="text-xs text-slate-400 mt-1">جرّب تغيير التصفية أو تصفير حقول البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600">
                  <th className="py-3 px-4">رقم الموعد</th>
                  <th className="py-3 px-4">المريض والاتصال</th>
                  <th className="py-3 px-4">الطبيب والعيادة</th>
                  <th className="py-3 px-4">التاريخ والوقت</th>
                  <th className="py-3 px-4">نوع الزيارة والشكوى</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">إجراءات الطبيب والتحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 tabular-nums">
                      #{apt.id}
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <div>
                        <button
                          onClick={() => onViewPatientRecords && onViewPatientRecords(apt.patientId)}
                          className="font-bold text-slate-900 hover:text-teal-700 text-right block"
                          title="عرض الملف الطبي للمريض"
                        >
                          {apt.patientName}
                        </button>
                        <span className="text-[11px] text-slate-500 font-mono block tabular-nums">
                          {apt.patientPhone}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                          {apt.patientEmail}
                        </span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={apt.doctorAvatar}
                          alt={apt.doctorName}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{apt.doctorName}</p>
                          <p className="text-[11px] text-slate-500">{apt.doctorSpecialty}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-teal-700 font-mono tabular-nums mt-0.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        <span>{apt.timeSlot}</span>
                      </div>
                    </td>

                    {/* Visit Type & Reason */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-0.5">
                        {apt.consultationType === 'in_clinic' ? (
                          <>
                            <Building2 className="w-3 h-3 text-teal-600" />
                            <span>كشف بالعيادة</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-3 h-3 text-indigo-600" />
                            <span>استشارة مرئية</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-800 font-medium truncate" title={apt.reason}>
                        {apt.reason}
                      </p>
                      {apt.patientNotes && (
                        <p className="text-[10px] text-slate-400 italic truncate" title={apt.patientNotes}>
                          ملاحظة: {apt.patientNotes}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(apt.status)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        
                        {/* Consultation room button */}
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button
                            onClick={() => setSelectedAppointmentForConsultation(apt)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-xs"
                            title="فتح شاشة الكشف الطبي وكتابة الوصفة"
                          >
                            <Stethoscope className="w-3 h-3" />
                            <span>بدء الكشف</span>
                          </button>
                        )}

                        {/* Send Email Reminder */}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleSendReminder(apt)}
                            className="p-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors border border-teal-200"
                            title="إرسال تذكير فوري بالبريد الإلكتروني"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Confirm action for pending */}
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200"
                            title="تأكيد الموعد"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Reschedule */}
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button
                            onClick={() => setSelectedAppointmentForReschedule(apt)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
                            title="إعادة جدولة الموعد"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* View patient records */}
                        {onViewPatientRecords && (
                          <button
                            onClick={() => onViewPatientRecords(apt.patientId)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
                            title="الملف الطبي"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Cancel */}
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancel(apt)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-rose-200"
                            title="إلغاء الموعد"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      {selectedAppointmentForConsultation && (
        <ConsultationModal
          appointment={selectedAppointmentForConsultation}
          onClose={() => setSelectedAppointmentForConsultation(null)}
          onCompleted={() => {
            setSelectedAppointmentForConsultation(null);
            setReminderToast('تم حفظ الكشف الطبي والتشخيص وإرسال التقرير والوصفة لبريد المريض.');
          }}
        />
      )}

      {/* Reschedule Modal */}
      {selectedAppointmentForReschedule && (
        <RescheduleModal
          appointment={selectedAppointmentForReschedule}
          onClose={() => setSelectedAppointmentForReschedule(null)}
        />
      )}

    </div>
  );
};
