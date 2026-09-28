import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface RescheduleModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ appointment, onClose }) => {
  const { rescheduleAppointment, doctors } = useApp();

  const doctor = appointment ? (doctors.find(d => d.id === appointment.doctorId) || doctors[0]) : doctors[0];

  const availableDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateString = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('ar-SA', { weekday: 'long' });
    const formatted = d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
    return { dateString, dayName, formatted };
  });

  const [newDate, setNewDate] = useState(availableDates[0].dateString);
  const [newTime, setNewTime] = useState('11:00');

  if (!appointment) return null;

  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rescheduleAppointment(appointment.id, newDate, newTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">إعادة جدولة الموعد</h3>
            <p className="text-xs text-slate-500">رقم الموعد: #{appointment.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <p className="text-slate-600">المريض: <strong className="text-slate-900">{appointment.patientName}</strong></p>
            <p className="text-slate-600 mt-1">الموعد الحالي: {appointment.date} - {appointment.timeSlot}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">اختر التاريخ الجديد:</label>
            <div className="grid grid-cols-2 gap-2">
              {availableDates.map(d => (
                <button
                  type="button"
                  key={d.dateString}
                  onClick={() => setNewDate(d.dateString)}
                  className={`p-2.5 rounded-lg border text-right text-xs transition-all ${
                    newDate === d.dateString
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p>{d.dayName}</p>
                  <p className="text-[10px] text-slate-500">{d.formatted}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">اختر التوقيت الجديد:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {times.map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setNewTime(t)}
                  className={`py-1.5 rounded-md border text-xs font-mono tabular-nums ${
                    newTime === t
                      ? 'border-teal-600 bg-teal-600 text-white font-bold'
                      : 'border-slate-200 hover:border-teal-400 text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50 text-amber-900 p-2.5 rounded-lg border border-amber-200 flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>سيتم إرسال رسالة بريد إلكتروني فورية للمريض تحتوي على التوقيت الجديد تلقائياً.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
            >
              حفظ الموعد وإرسال البريد
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
