import React from 'react';
import { Appointment } from '../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Video, 
  ShieldCheck, 
  Printer, 
  User, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  onClose
}) => {
  if (!appointment) return null;

  const isVideo = appointment.consultationType === 'video_call';

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">بطاقة الموعد الطبي</h3>
              <p className="text-xs text-slate-500 font-mono">رقم الحجز: #{appointment.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Status banner */}
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-teal-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>الموعد مؤكد في جدول العيادة</span>
            </div>
            <span className="font-mono text-teal-800 font-semibold">اليوم {appointment.date}</span>
          </div>

          {/* Doctor Info */}
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src={appointment.doctorAvatar}
              alt={appointment.doctorName}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{appointment.doctorName}</h4>
              <p className="text-xs text-teal-700 font-medium">{appointment.doctorSpecialty}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">مركز صِحّة كير الطبي التخصصي</p>
            </div>
          </div>

          {/* Time & Consultation Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>الوقت المحدد:</span>
              </span>
              <p className="font-bold text-slate-900 font-mono text-sm tabular-nums">{appointment.timeSlot}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                {isVideo ? <Video className="w-3.5 h-3.5 text-indigo-500" /> : <Building2 className="w-3.5 h-3.5 text-teal-600" />}
                <span>نوع الاستشارة:</span>
              </span>
              <p className="font-bold text-slate-900">
                {isVideo ? 'استشارة مرئية عن بُعد' : 'كشف حضوري بالعيادة'}
              </p>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="text-xs space-y-1">
            <span className="font-bold text-slate-800">سبب الزيارة المسجل:</span>
            <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {appointment.reason}
            </p>
          </div>

          {isVideo ? (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-900">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>غرفة الاستشارة الافتراضية الآمنة</span>
              </div>
              <p className="text-indigo-800 text-[11px]">
                سيتاح الدخول للغرفة المرئية مع الطبيب قبل 5 دقائق من الموعد المجدول. تم إرسال رابط الدخول المشفر إلى بريدك الإلكتروني.
              </p>
              <button
                onClick={() => alert('تم تسجيل دخولك بنجاح. الطبيب بانتظارك في غرفة الاتصال الآمنة.')}
                className="w-full mt-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors"
              >
                دخول المكالمة المرئية الآن
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>موقع العيادة:</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                طريق الملك فهد، حي الصحافة، الرياض - مبنى العيادات الرئيسية (الدور 3).
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handlePrintTicket}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>طباعة التذكرة</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
          >
            حسناً، فهمت
          </button>
        </div>

      </div>
    </div>
  );
};
