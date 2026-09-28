import React, { useState, useEffect } from 'react';
import { Appointment } from '../../types';
import { 
  Bell, 
  Calendar, 
  Clock, 
  X, 
  Video, 
  Building2, 
  ChevronLeft, 
  AlertCircle,
  CheckCircle2,
  Volume2
} from 'lucide-react';

interface AppointmentUpcomingToastProps {
  appointment: Appointment | null;
  onViewDetails: (appointment: Appointment) => void;
  onDismiss: () => void;
}

export const AppointmentUpcomingToast: React.FC<AppointmentUpcomingToastProps> = ({
  appointment,
  onViewDetails,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);

  useEffect(() => {
    if (!appointment || isSnoozed) {
      setIsVisible(false);
      return;
    }

    // Auto-trigger toast after short initial delay (1.2 seconds) for a smooth user entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [appointment, isSnoozed]);

  if (!appointment || !isVisible || isSnoozed) return null;

  const handleSnooze = () => {
    setIsVisible(false);
    setIsSnoozed(true);
    // Snooze for 45 seconds during demo
    setTimeout(() => {
      setIsSnoozed(false);
    }, 45000);
  };

  const isVideoCall = appointment.consultationType === 'video_call';

  return (
    <div 
      className="fixed bottom-6 left-6 z-50 max-w-md w-[calc(100vw-3rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300"
      dir="rtl"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 sm:p-5 overflow-hidden relative">
        
        {/* Subtle accent indicator line on top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-indigo-500" />

        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-start gap-3 min-w-0">
            {/* Pulsing Bell / Status Icon */}
            <div className="relative shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-teal-400 tracking-wide">
                  تنبيه: اقتراب موعدك الطبي
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded border border-slate-700">
                  #{appointment.id}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white truncate">
                موعد مع {appointment.doctorName}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {appointment.doctorSpecialty}
              </p>

              {/* Time and location pill */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-teal-300 bg-teal-950/70 border border-teal-800/80 px-2.5 py-1 rounded-lg font-semibold font-mono tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>اليوم في تمام {appointment.timeSlot}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-300 bg-slate-800/90 px-2 py-1 rounded-lg text-[11px]">
                  {isVideoCall ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-indigo-400" />
                      <span>استشارة مرئية</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>كشف بالعيادة</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                سبب الزيارة: {appointment.reason}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleSnooze}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 hover:bg-slate-800 rounded-md"
          >
            تذكيري لاحقاً
          </button>

          <button
            onClick={() => {
              setIsVisible(false);
              onViewDetails(appointment);
            }}
            className="flex items-center gap-1 text-xs font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95"
          >
            <span>عرض تفاصيل الموعد</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
