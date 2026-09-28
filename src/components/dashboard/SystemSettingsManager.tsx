import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Save, 
  CheckCircle2, 
  Sliders, 
  Bell, 
  Building, 
  Clock, 
  Key, 
  Phone, 
  Mail,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const SystemSettingsManager: React.FC = () => {
  const { addAuditLog } = useApp();

  const [clinicName, setClinicName] = useState('مجمع صِحّة كير الطبي الاستشاري');
  const [emergencyPhone, setEmergencyPhone] = useState('+966 11 482 9100');
  const [allowOnlineBooking, setAllowOnlineBooking] = useState(true);
  const [autoConfirmAppointments, setAutoConfirmAppointments] = useState(true);
  const [appointmentLeadHours, setAppointmentLeadHours] = useState(2);
  const [maxDailyAppointments, setMaxDailyAppointments] = useState(16);
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
  const [enforceTwoFactor, setEnforceTwoFactor] = useState(true);
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);

  // Granular Access Permissions by Role
  const [rolePermissions, setRolePermissions] = useState({
    doctor: {
      appointments: true,
      medicalRecords: true,
      staffManagement: false,
      prescriptions: true,
      messages: true,
      auditLogs: false,
      settings: false,
    },
    receptionist: {
      appointments: true,
      medicalRecords: false,
      staffManagement: false,
      prescriptions: false,
      messages: true,
      auditLogs: false,
      settings: false,
    },
    nurse: {
      appointments: true,
      medicalRecords: true,
      staffManagement: false,
      prescriptions: false,
      messages: false,
      auditLogs: false,
      settings: false,
    },
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTogglePermission = (role: 'doctor' | 'receptionist' | 'nurse', key: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key as keyof typeof prev[typeof role]]
      }
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog({
      action: 'update_staff',
      actorName: 'مدير النظام العام',
      details: 'تم تحديث سياسات وإعدادات الأمان وصلاحيات الوصول للمنظومة',
      ipAddress: '192.168.1.100',
      severity: 'info'
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              إعدادات المنظومة وصلاحيات الوصول
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              تحكم إداري كامل
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تخصيص سياسات العيادة، الصلاحيات المسموح بها لكل فئة، وإعدادات الأمان وجدار الحماية
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ وتطبيق الإعدادات بنجاح!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Section 1: Granular Role Permissions Matrix */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                مصفوفة الصلاحيات والسماح بالوصول
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                حدد الأدوار المسموح لها بالدخول لأقسام المنظومة المختلفة
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-bold">القسم / الإعداد المسموح بالوصول إليه</th>
                  <th className="py-2.5 px-3 font-bold text-center">أطباء واستشاريون</th>
                  <th className="py-2.5 px-3 font-bold text-center">موظفو الاستقبال</th>
                  <th className="py-2.5 px-3 font-bold text-center">التمريض والفنيون</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-semibold">إدارة وحجز المواعيد اليومية</td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.doctor.appointments}
                      onChange={() => handleTogglePermission('doctor', 'appointments')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.receptionist.appointments}
                      onChange={() => handleTogglePermission('receptionist', 'appointments')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.nurse.appointments}
                      onChange={() => handleTogglePermission('nurse', 'appointments')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-semibold">الاطلاع على السجلات والملفات الطبية (EMR)</td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.doctor.medicalRecords}
                      onChange={() => handleTogglePermission('doctor', 'medicalRecords')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.receptionist.medicalRecords}
                      onChange={() => handleTogglePermission('receptionist', 'medicalRecords')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.nurse.medicalRecords}
                      onChange={() => handleTogglePermission('nurse', 'medicalRecords')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-semibold">صرف واعتماد الوصفات الطبية الإلكترونية</td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.doctor.prescriptions}
                      onChange={() => handleTogglePermission('doctor', 'prescriptions')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.receptionist.prescriptions}
                      onChange={() => handleTogglePermission('receptionist', 'prescriptions')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.nurse.prescriptions}
                      onChange={() => handleTogglePermission('nurse', 'prescriptions')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-semibold">الدخول لمركز الرسائل والتواصل مع المرضى</td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.doctor.messages}
                      onChange={() => handleTogglePermission('doctor', 'messages')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.receptionist.messages}
                      onChange={() => handleTogglePermission('receptionist', 'messages')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.nurse.messages}
                      onChange={() => handleTogglePermission('nurse', 'messages')}
                      className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 font-semibold">إضافة وتعديل وحذف الموظفين</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-slate-400 font-mono text-[10px]">ممنوع (خاص بالمدير)</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-slate-400 font-mono text-[10px]">ممنوع</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-slate-400 font-mono text-[10px]">ممنوع</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: General Clinic Policies */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              سياسات الحجز والمواعيد للعيادات
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                اسم المركز الطبي:
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                هاتف الطوارئ والاستعلامات:
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الحد الأدنى للإشعار المسبق للحجز (بالساعات):
              </label>
              <input
                type="number"
                min={1}
                max={48}
                value={appointmentLeadHours}
                onChange={(e) => setAppointmentLeadHours(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الحد الأقصى للمواعيد اليومية لكل طبيب:
              </label>
              <input
                type="number"
                min={5}
                max={40}
                value={maxDailyAppointments}
                onChange={(e) => setMaxDailyAppointments(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                مهلة إنهاء الجلسة التلقائي (بالدقائق):
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex flex-col justify-center space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowOnlineBooking}
                  onChange={(e) => setAllowOnlineBooking(e.target.checked)}
                  className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  تفعيل الحجز الإلكتروني عبر الموقع
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoConfirmAppointments}
                  onChange={(e) => setAutoConfirmAppointments(e.target.checked)}
                  className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  تأكيد الحجز الفوري التلقائي للمرضى
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Advanced Security & Emergency Lockdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              الأمان، الحماية ضد الاختراق، وقفل الطوارئ
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-teal-600" />
                  إلزام التحقق بخطوتين (2FA) للأطباء
                </span>
                <input
                  type="checkbox"
                  checked={enforceTwoFactor}
                  onChange={(e) => setEnforceTwoFactor(e.target.checked)}
                  className="rounded accent-teal-600 w-4 h-4 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                يطلب من كل طبيب وموظف إدخال رمز الأمان الإضافي عند الدخول لمنع أي وصول غير مصرح به.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  وضع قفل الطوارئ العام (Emergency Lockdown)
                </span>
                <input
                  type="checkbox"
                  checked={emergencyLockdown}
                  onChange={(e) => setEmergencyLockdown(e.target.checked)}
                  className="rounded accent-rose-600 w-4 h-4 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-rose-700/80 dark:text-rose-400 leading-relaxed">
                في حالات الطوارئ القصوى، يقفل النظام إمكانية التعديل للموظفين ويقتصر فقط على المدير العام.
              </p>
            </div>
          </div>
        </div>

        {/* Save Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ واعتماد كافة الإعدادات والصلاحيات</span>
          </button>
        </div>

      </form>
    </div>
  );
};
