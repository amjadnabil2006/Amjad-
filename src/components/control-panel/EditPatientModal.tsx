import React, { useState, useEffect } from 'react';
import { Patient } from '../../types';
import { X, Save, User, Phone, Mail, Droplet, AlertTriangle, Activity, Heart, ShieldAlert } from 'lucide-react';

interface EditPatientModalProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSave: (patientId: string, updates: Partial<Patient>) => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  patient,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bloodType, setBloodType] = useState<Patient['bloodType']>('O+');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [chronicDiseasesText, setChronicDiseasesText] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setNationalId(patient.nationalId || '');
      setPhone(patient.phone);
      setEmail(patient.email);
      setGender(patient.gender);
      setBloodType(patient.bloodType);
      setDateOfBirth(patient.dateOfBirth);
      setAllergiesText(patient.allergies.join('، '));
      setChronicDiseasesText(patient.chronicDiseases.join('، '));
      setEmergencyName(patient.emergencyContact?.name || '');
      setEmergencyPhone(patient.emergencyContact?.phone || '');
    }
  }, [patient, isOpen]);

  if (!isOpen || !patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allergies = allergiesText
      .split(/[،,]/)
      .map(s => s.trim())
      .filter(Boolean);

    const chronicDiseases = chronicDiseasesText
      .split(/[،,]/)
      .map(s => s.trim())
      .filter(Boolean);

    onSave(patient.id, {
      name: name.trim(),
      nationalId: nationalId.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gender,
      bloodType,
      dateOfBirth,
      allergies: allergies.length > 0 ? allergies : ['لا توجد حساسية معروفة'],
      chronicDiseases,
      emergencyContact: {
        name: emergencyName.trim() || 'جهة اتصال طارئة',
        relationship: patient.emergencyContact?.relationship || 'عائلة',
        phone: emergencyPhone.trim() || phone
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in" dir="rtl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                تعديل بيانات الملف الطبي للمريض: {patient.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تحديث سجل المريض الصحي، الحساسيات الدوائية، وبيانات التواصل
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                اسم المريض الكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                رقم الهوية الوطنية / الإقامة
              </label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="10XXXXXXXX"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                رقم الجوال
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                البريد الإلكتروني (لتلقي إشعارات المواعيد)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                فصيلة الدم
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as Patient['bloodType'])}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden font-bold"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                تاريخ الميلاد
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>الحساسيات الدوائية والغذائية (مفصولة بفاصلة)</span>
            </label>
            <input
              type="text"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="مثلاً: حساسية البنسلين، حساسية الفول السوداني"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>الأمراض المزمنة (مفصولة بفاصلة)</span>
            </label>
            <input
              type="text"
              value={chronicDiseasesText}
              onChange={(e) => setChronicDiseasesText(e.target.value)}
              placeholder="مثلاً: ارتفاع ضغط الدم، السكري النوع الثاني"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                اسم جهة الاتصال في الطوارئ
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="أحمد - الأخ"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                هاتف الطوارئ
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden font-mono"
              />
            </div>
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
              <span>حفظ بيانات المريض</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
