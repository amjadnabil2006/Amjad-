import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, ConsultationType, Appointment } from '../../types';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Video, 
  Building2, 
  FileText, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctor?: Doctor | null;
  onSuccessBooking?: (apt: Appointment) => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctor,
  onSuccessBooking
}) => {
  const { doctors, bookAppointment, appointments } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctor?.id || doctors[0]?.id || ''
  );
  const [consultationType, setConsultationType] = useState<ConsultationType>('in_clinic');
  
  // Date & Time
  // Format today's date YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Generate next 7 dates
  const availableDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateString = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('ar-SA', { weekday: 'long' });
    const formatted = d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
    return { dateString, dayName, formatted };
  });

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.dateString || getTodayString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:30');

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [reason, setReason] = useState('');
  const [patientNotes, setPatientNotes] = useState('');

  // Confirmed Appointment state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const currentDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Generate slots for selected doctor
  const generateSlots = () => {
    const slots = [];
    const startHour = parseInt(currentDoctor?.workingHours?.start?.split(':')[0] || '9', 10);
    const endHour = parseInt(currentDoctor?.workingHours?.end?.split(':')[0] || '17', 10);
    const duration = currentDoctor?.slotDurationMinutes || 30;

    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += duration) {
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        // Check if already taken on selected date for this doctor
        const isTaken = appointments.some(
          apt => apt.doctorId === currentDoctor.id && 
                 apt.date === selectedDate && 
                 apt.timeSlot === timeStr && 
                 apt.status !== 'cancelled'
        );
        slots.push({ timeStr, isTaken });
      }
    }
    return slots;
  };

  const availableSlots = generateSlots();

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !patientEmail || !reason) {
      alert('يرجى ملء جميع الحقول الإلزامية');
      return;
    }

    const newApt = bookAppointment({
      doctorId: currentDoctor.id,
      patientName,
      patientPhone,
      patientEmail,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationType,
      reason,
      patientNotes,
      gender
    });

    setConfirmedAppointment(newApt);
    setStep(4);
    if (onSuccessBooking) onSuccessBooking(newApt);
  };

  const resetFormAndClose = () => {
    setStep(1);
    setConfirmedAppointment(null);
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setReason('');
    setPatientNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {step === 4 ? 'تم تأكيد الحجز بنجاح' : 'حجز موعد طبي جديد'}
            </h2>
            <p className="text-xs text-slate-500">
              {step === 1 && 'الخطوة 1 من 3: اختيار الطبيب ونوع الاستشارة'}
              {step === 2 && 'الخطوة 2 من 3: تحديد اليوم والوقت المناسب'}
              {step === 3 && 'الخطوة 3 من 3: بيانات المريض والشكوى الطبية'}
              {step === 4 && 'تم إرسال تفاصيل الموعد إلى بريدك الإلكتروني'}
            </p>
          </div>

          <button
            onClick={resetFormAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (if not completed) */}
        {step < 4 && (
          <div className="px-6 py-2.5 bg-slate-100/50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-teal-700 text-white' : 'bg-slate-300 text-slate-700'}`}>
                1
              </span>
              <span>الطبيب والخدمة</span>
            </div>
            <div className="w-8 h-px bg-slate-200" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-teal-700 text-white' : 'bg-slate-300 text-slate-700'}`}>
                2
              </span>
              <span>الموعد والوقت</span>
            </div>
            <div className="w-8 h-px bg-slate-200" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-teal-700' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-teal-700 text-white' : 'bg-slate-300 text-slate-700'}`}>
                3
              </span>
              <span>بيانات المريض</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* STEP 1: Select Doctor & Type */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">اختر الطبيب الاستشاري:</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {doctors.map(doc => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                            <p className="text-[11px] text-teal-700 font-medium">{doc.specialty}</p>
                            <p className="text-[10px] text-slate-500">{doc.clinicName}</p>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">{doc.consultationFee} ر.س</span>
                          <span className="text-[10px] text-slate-400 block">{doc.slotDurationMinutes} دقيقة</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">طريقة الاستشارة الطبية:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationType('in_clinic')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-right transition-all ${
                      consultationType === 'in_clinic'
                        ? 'border-teal-600 bg-teal-50/50 text-teal-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">كشف حضوري بالعيادة</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">فحص سريري كامل واستقبال في مركز صِحّة كير</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('video_call')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-right transition-all ${
                      consultationType === 'video_call'
                        ? 'border-teal-600 bg-teal-50/50 text-teal-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Video className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">استشارة مرئية عن بُعد</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">مكالمة فيديو آمنة ومباشرة مع الطبيب الاستشاري</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time Picker */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">اختر يوم الزيارة:</label>
                  <span className="text-[11px] text-slate-500">أيام العمل المتاحة للطبيب: {currentDoctor.availableDays.join('، ')}</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableDates.map(item => {
                    const isSelected = selectedDate === item.dateString;
                    return (
                      <button
                        key={item.dateString}
                        type="button"
                        onClick={() => setSelectedDate(item.dateString)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {item.dayName}
                        </p>
                        <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                          {item.formatted}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">الأوقات المتاحة لهذا اليوم:</label>
                  <span className="text-[11px] text-slate-500">فترة الكشف: {currentDoctor.slotDurationMinutes} دقيقة</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                  {availableSlots.map(slot => {
                    const isSelected = selectedTimeSlot === slot.timeStr;
                    return (
                      <button
                        key={slot.timeStr}
                        type="button"
                        disabled={slot.isTaken}
                        onClick={() => setSelectedTimeSlot(slot.timeStr)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold font-mono tabular-nums transition-all ${
                          slot.isTaken
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-600 font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        {slot.timeStr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Slot Recap */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">الموعد المحدد:</span>
                <span className="font-bold text-teal-800">
                  {selectedDate} في تمام الساعة {selectedTimeSlot}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Information Form */}
          {step === 3 && (
            <form id="booking-form" onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">اسم المريض الكامل *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="مثال: محمد عبدالله الشمري"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full text-xs pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">رقم الجوال *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="05XXXXXXXX"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full text-xs pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-left font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    البريد الإلكتروني (لتلقي التنبيهات والتأكيد) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full text-xs pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">الجنس</label>
                  <div className="flex items-center gap-4 py-1.5 text-xs text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>ذكر</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>أنثى</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">الشكوى الرئيسية أو سبب الزيارة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فحص دوري، متابعة علاج، صداع مستمر، ألم بالصدر..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">ملاحظات إضافية أو أعراض يشعر بها المريض</label>
                <textarea
                  rows={2}
                  placeholder="أي معلومات إضافية تود إبلاغ الطبيب بها مسبقاً..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-start gap-2.5 text-xs text-teal-800">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p>
                  فور إتمام الحجز، سيتم إرسال رسالة تأكيد إلكترونية فورية تحتوي على تذكرة الموعد ورابط الاستشارة إلى بريدك الإلكتروني المدخل أعلاه.
                </p>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Confirmation */}
          {step === 4 && confirmedAppointment && (
            <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">تم حجز موعدك الطبي بنجاح!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  رقم الموعد المرجعي: <span className="font-mono font-bold text-teal-700">#{confirmedAppointment.id}</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-right text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">الطبيب الاستشاري:</span>
                  <span className="font-bold text-slate-800">{confirmedAppointment.doctorName} ({confirmedAppointment.doctorSpecialty})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">الموعد المحدد:</span>
                  <span className="font-bold text-teal-700">{confirmedAppointment.date} - {confirmedAppointment.timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">نوع الاستشارة:</span>
                  <span className="font-medium text-slate-800">
                    {confirmedAppointment.consultationType === 'in_clinic' ? 'كشف حضوري بالعيادة' : 'استشارة مرئية عن بُعد'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">تم إرسال التأكيد إلى:</span>
                  <span className="font-semibold text-slate-800">{confirmedAppointment.patientEmail}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 bg-emerald-50 py-2 px-4 rounded-lg max-w-md mx-auto">
                <Mail className="w-4 h-4" />
                <span>تم إرسال إشعار بريدي فوري للمريض وللطبيب بالموعد الجديد</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          {step < 4 ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as any)}
                  className="flex items-center gap-1 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="booking-form"
                  className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد الحجز وإرسال التنبيه</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFormAndClose}
                className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
              >
                إغلاق والعودة للرئيسية
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
