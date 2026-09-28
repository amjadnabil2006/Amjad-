import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus, ConsultationType, Doctor } from '../../types';
import { X, Save, Calendar, Clock, User, Stethoscope, Mail, CheckCircle2, AlertCircle, FileText, Send } from 'lucide-react';

interface EditAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  doctors: Doctor[];
  onClose: () => void;
  onSave: (appointmentId: string, updates: Partial<Appointment>) => void;
  onSendReminderNow?: (appointmentId: string) => void;
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  appointment,
  doctors,
  onClose,
  onSave,
  onSendReminderNow
}) => {
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>('confirmed');
  const [consultationType, setConsultationType] = useState<ConsultationType>('in_clinic');
  const [reason, setReason] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [fee, setFee] = useState<number>(300);
  const [paid, setPaid] = useState<boolean>(true);
  const [reminderSentNotice, setReminderSentNotice] = useState(false);

  useEffect(() => {
    if (appointment) {
      setDoctorId(appointment.doctorId);
      setDate(appointment.date);
      setTimeSlot(appointment.timeSlot);
      setStatus(appointment.status);
      setConsultationType(appointment.consultationType);
      setReason(appointment.reason || '');
      setPatientNotes(appointment.patientNotes || '');
      setCancellationReason(appointment.cancellationReason || '');
      setFee(appointment.fee || 300);
      setPaid(appointment.paid ?? true);
      setReminderSentNotice(false);
    }
  }, [appointment, isOpen]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDoc = doctors.find(d => d.id === doctorId);

    onSave(appointment.id, {
      doctorId,
      doctorName: selectedDoc ? selectedDoc.name : appointment.doctorName,
      doctorSpecialty: selectedDoc ? selectedDoc.specialty : appointment.doctorSpecialty,
      date,
      timeSlot,
      status,
      consultationType,
      reason,
      patientNotes,
      cancellationReason: status === 'cancelled' ? cancellationReason : undefined,
      fee: Number(fee),
      paid
    });

    onClose();
  };

  const handleTriggerReminder = () => {
    if (onSendReminderNow) {
      onSendReminderNow(appointment.id);
      setReminderSentNotice(true);
      setTimeout(() => setReminderSentNotice(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in" dir="rtl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  تعديل الموعد الطبي #{appointment.id}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {appointment.patientName}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تحديث التاريخ والوقت والحالة مع إرسال إشعار بريدي تلقائي فوري
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Notice for Automated Email */}
          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl flex items-center justify-between gap-3 text-xs text-teal-800 dark:text-teal-200">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>نظام الإشعارات الآلية:</strong> عند حفظ الحالة كـ (مؤكد)، يُرسل بريد تأكيد رسمي فوراً إلى {appointment.patientEmail}.
              </span>
            </div>
            {onSendReminderNow && (
              <button
                type="button"
                onClick={handleTriggerReminder}
                className="shrink-0 px-2.5 py-1 text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>إرسال تذكير الآن</span>
              </button>
            )}
          </div>

          {reminderSentNotice && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم إرسال إشعار تذكيري بريدي إلى المريض بنجاح!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                الطبيب المعالج
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                حالة الموعد
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden font-bold"
              >
                <option value="confirmed">مؤكد ومثبت (Confirmed) ✓</option>
                <option value="pending">قيد الانتظار والمراجعة (Pending)</option>
                <option value="in_progress">المريض بالعيادة حالياً (In Progress)</option>
                <option value="completed">تم الكشف واكتمل (Completed)</option>
                <option value="rescheduled">مُعاد جدولته (Rescheduled)</option>
                <option value="cancelled">ملغي (Cancelled)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                تاريخ الموعد
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                وقت الزيارة (الساعة)
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="10:30"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                نوع الاستشارة
              </label>
              <select
                value={consultationType}
                onChange={(e) => setConsultationType(e.target.value as ConsultationType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                <option value="in_clinic">كشف حضوري بالعيادة</option>
                <option value="video_call">استشارة مرئية عن بُعد</option>
                <option value="home_visit">زيارة طبية منزلية</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                رسوم الكشف (ر.س)
              </label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
              />
            </div>
          </div>

          {status === 'cancelled' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl space-y-1">
              <label className="block text-xs font-bold text-rose-700 dark:text-rose-300">
                سبب الإلغاء (سيتم إدراجه في إشعار البريد الإلكتروني للمريض):
              </label>
              <input
                type="text"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="مثلاً: اعتذار الطبيب لظرف طارئ أو بناءً على طلب المريض"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-lg outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              الشكوى أو سبب الزيارة
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات المريض السريرية والإدارية
            </label>
            <textarea
              rows={2}
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="أي ملاحظات خاصة بالمريض أو توجيهات للاستقبال"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديل وإرسال التنبيهات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
