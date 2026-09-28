import React, { useState, useEffect } from 'react';
import { Doctor } from '../../types';
import { X, Save, Stethoscope, Clock, Calendar, DollarSign, MapPin, Phone, Mail, Award, AlertCircle } from 'lucide-react';

interface EditDoctorModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
  onSave: (doctorData: Partial<Doctor>) => void;
}

const ALL_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

export const EditDoctorModal: React.FC<EditDoctorModalProps> = ({
  isOpen,
  doctor,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consultationFee, setConsultationFee] = useState<number>(300);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(10);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (doctor) {
      setName(doctor.name);
      setTitle(doctor.title);
      setSpecialty(doctor.specialty);
      setConsultationFee(doctor.consultationFee);
      setStartTime(doctor.workingHours.start);
      setEndTime(doctor.workingHours.end);
      setSlotDuration(doctor.slotDurationMinutes || 30);
      setSelectedDays(doctor.availableDays || []);
      setClinicName(doctor.clinicName);
      setClinicAddress(doctor.clinicAddress);
      setPhone(doctor.phone);
      setEmail(doctor.email);
      setBio(doctor.bio);
      setExperienceYears(doctor.experienceYears);
      setErrorMsg('');
    } else {
      setName('');
      setTitle('طبيب استشاري معتمد');
      setSpecialty('الطب العام والأسرة');
      setConsultationFee(250);
      setStartTime('09:00');
      setEndTime('17:00');
      setSlotDuration(30);
      setSelectedDays(['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']);
      setClinicName('مجمع صِحّة كير الاستشاري');
      setClinicAddress('الرياض، حي الصحافة');
      setPhone('0501234567');
      setEmail('doctor@sehacare.med');
      setBio('طبيب متميز يقدم رعاية صحية شاملة وفق المعايير الطبية المعتمدة.');
      setExperienceYears(8);
      setErrorMsg('');
    }
  }, [doctor, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length <= 1) {
        setErrorMsg('يجب أن يعمل الطبيب يوماً واحداً على الأقل في الأسبوع');
        return;
      }
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !specialty.trim() || !clinicName.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية');
      return;
    }

    onSave({
      name: name.trim(),
      title: title.trim(),
      specialty: specialty.trim(),
      consultationFee: Number(consultationFee),
      workingHours: {
        start: startTime,
        end: endTime
      },
      slotDurationMinutes: Number(slotDuration),
      availableDays: selectedDays,
      clinicName: clinicName.trim(),
      clinicAddress: clinicAddress.trim(),
      phone: phone.trim(),
      email: email.trim(),
      bio: bio.trim(),
      experienceYears: Number(experienceYears)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in" dir="rtl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {doctor ? `تعديل بيانات الطبيب: ${doctor.name}` : 'إضافة طبيب استشاري جديد'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تحكم في جدول مواعيد الكشف، رسوم الاستشارة، وأيام وساعات الدوام
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>البيانات المهنية والتخصص</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  اسم الطبيب <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="د. أحمد المنصوري"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  التخصص الطبي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="أمراض القلب والأوعية الدموية"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  المسمى واللقب المهني
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="استشاري أول ورئيس وحدة القسطرة التداخلية"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  رسوم الاستشارة والكشف (ريال)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden font-bold"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">ر.س</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  سنوات الخبرة السريرية
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Working Hours & Days */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>مواعيد العمل اليومي وساعات الكشف</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  بداية الدوام اليومي
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  نهاية الدوام اليومي
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  مدة كشف المريض (بالدقائق)
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                >
                  <option value={15}>15 دقيقة (كشف سريع)</option>
                  <option value={20}>20 دقيقة</option>
                  <option value={30}>30 دقيقة (قياسي)</option>
                  <option value={45}>45 دقيقة</option>
                  <option value={60}>60 دقيقة (شامل مطول)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                أيام العمل واستقبال المرضى:
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map(day => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-500'
                      }`}
                    >
                      {day} {isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Clinic & Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>مقر العيادة وبيانات الاتصال</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  اسم العيادة / القسم
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="عيادة أمراض القلب - مبنى أ الدور 3"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  عنوان المركز
                </label>
                <input
                  type="text"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  placeholder="طريق الملك فهد، الرياض"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  هاتف التواصل
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني المهني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  النبذة التعريفية للمرضى
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
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
              <span>حفظ التعديلات والتحديث الفوري</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
