import React, { useState, useEffect } from 'react';
import { StaffMember, StaffRole, StaffStatus, StaffPermissions } from '../../types';
import { X, UserPlus, Save, Shield, ShieldCheck, Mail, Phone, User, Building, Briefcase } from 'lucide-react';

interface AddEditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: StaffMember | null;
  onSave: (data: any) => void;
}

const DEPARTMENTS = [
  'الإدارة الطبية العليا والتنفيذية',
  'عيادات القلب والأوعية الدموية',
  'عيادات طب الأطفال وحديثي الولادة',
  'عيادات المخ والأعصاب',
  'الاستقبال وخدمة العملاء',
  'الصيدلية السريرية',
  'المختبرات والتحاليل الطبية',
  'التمريض والرعاية السريرية'
];

export const AddEditStaffModal: React.FC<AddEditStaffModalProps> = ({
  isOpen,
  onClose,
  staffToEdit,
  onSave
}) => {
  const isEditing = !!staffToEdit;

  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('receptionist');
  const [department, setDepartment] = useState(DEPARTMENTS[4]);
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState<StaffStatus>('active');
  const [securityLevel, setSecurityLevel] = useState<1 | 2 | 3 | 4>(2);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [permissions, setPermissions] = useState<StaffPermissions>({
    canManageAppointments: true,
    canAccessMedicalRecords: false,
    canManageStaff: false,
    canIssuePrescriptions: false,
    canViewAuditLogs: false,
    canManageClinicSettings: false
  });

  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name);
      setNationalId(staffToEdit.nationalId);
      setEmail(staffToEdit.email);
      setPhone(staffToEdit.phone);
      setRole(staffToEdit.role);
      setDepartment(staffToEdit.department);
      setJobTitle(staffToEdit.jobTitle);
      setStatus(staffToEdit.status);
      setSecurityLevel(staffToEdit.securityLevel);
      setTwoFactorEnabled(staffToEdit.twoFactorEnabled);
      setPermissions(staffToEdit.permissions);
    } else {
      // Defaults for new
      setName('');
      setNationalId('');
      setEmail('');
      setPhone('');
      setRole('receptionist');
      setDepartment(DEPARTMENTS[4]);
      setJobTitle('');
      setStatus('active');
      setSecurityLevel(2);
      setTwoFactorEnabled(true);
      setPermissions({
        canManageAppointments: true,
        canAccessMedicalRecords: false,
        canManageStaff: false,
        canIssuePrescriptions: false,
        canViewAuditLogs: false,
        canManageClinicSettings: false
      });
    }
  }, [staffToEdit, isOpen]);

  // Adjust default permissions when role changes
  const handleRoleChange = (newRole: StaffRole) => {
    setRole(newRole);
    if (newRole === 'super_admin') {
      setSecurityLevel(4);
      setPermissions({
        canManageAppointments: true,
        canAccessMedicalRecords: true,
        canManageStaff: true,
        canIssuePrescriptions: true,
        canViewAuditLogs: true,
        canManageClinicSettings: true
      });
    } else if (newRole === 'doctor') {
      setSecurityLevel(3);
      setPermissions({
        canManageAppointments: true,
        canAccessMedicalRecords: true,
        canManageStaff: false,
        canIssuePrescriptions: true,
        canViewAuditLogs: false,
        canManageClinicSettings: false
      });
    } else if (newRole === 'pharmacist' || newRole === 'lab_tech') {
      setSecurityLevel(2);
      setPermissions({
        canManageAppointments: false,
        canAccessMedicalRecords: true,
        canManageStaff: false,
        canIssuePrescriptions: false,
        canViewAuditLogs: false,
        canManageClinicSettings: false
      });
    } else {
      setSecurityLevel(1);
      setPermissions({
        canManageAppointments: true,
        canAccessMedicalRecords: false,
        canManageStaff: false,
        canIssuePrescriptions: false,
        canViewAuditLogs: false,
        canManageClinicSettings: false
      });
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !jobTitle) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSave({
      name,
      nationalId: nationalId || '1098765432',
      email,
      phone,
      role,
      department,
      jobTitle,
      status,
      securityLevel,
      twoFactorEnabled,
      permissions
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEditing ? `تعديل بيانات الموظف: ${staffToEdit?.name}` : 'إضافة موظف جديد إلى المنظومة'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تسجيل الكادر الطبي والإداري وتحديد درجات الأمان والصلاحيات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="staff-form" onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Section 1: Basic Info */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-600" />
              <span>البيانات الشخصية والمهنية:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">اسم الموظف الرباعي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: د. عبدالرحمن سعد العتيبي"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">رقم الهوية الوطنية / الإقامة *</label>
                <input
                  type="text"
                  required
                  placeholder="10XXXXXXXX"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني المهني *</label>
                <input
                  type="email"
                  required
                  placeholder="user@sehacare.med"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-left"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">رقم الجوال الرسمي *</label>
                <input
                  type="tel"
                  required
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-left"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role & Department */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-teal-600" />
              <span>الدور الوظيفي والقسم:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">الدور والصلاحية (Role):</label>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as StaffRole)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                >
                  <option value="super_admin">مدير عام (Super Admin)</option>
                  <option value="doctor">طبيب استشاري (Doctor)</option>
                  <option value="receptionist">موظف استقبال (Receptionist)</option>
                  <option value="pharmacist">صيدلي (Pharmacist)</option>
                  <option value="lab_tech">فني مختبر (Lab Tech)</option>
                  <option value="nurse">ممرض / ممرضة (Nurse)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">المسمى الوظيفي المعتمد *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: استشاري أمراض القلب"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">القسم / العيادة:</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white truncate"
                >
                  {DEPARTMENTS.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">الحالة الوظيفية:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StaffStatus)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                >
                  <option value="active">نشط بالخدمة (Active)</option>
                  <option value="on_leave">في إجازة رسمية (On Leave)</option>
                  <option value="suspended">معلق الصلاحيات مؤقتاً (Suspended)</option>
                  <option value="inactive">غير نشط (Inactive)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">مستوى الأمان (Security Tier):</label>
                <select
                  value={securityLevel}
                  onChange={(e) => setSecurityLevel(Number(e.target.value) as any)}
                  className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                >
                  <option value={4}>المستوى 4 - وصول تنفيذي كامل وسجل الأمان</option>
                  <option value={3}>المستوى 3 - كشف طبي سريري ووصفات</option>
                  <option value={2}>المستوى 2 - صيدلية، مختبر، أو إدارة مواعيد</option>
                  <option value={1}>المستوى 1 - استقبال وقراءة مواعيد فقط</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Granular Permissions & 2FA */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>صلاحيات الوصول الدقيقة (Granular Permissions):</span>
              </span>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-teal-700 dark:text-teal-300">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>تفعيل المصادقة الثنائية (2FA OTP)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canManageAppointments}
                  onChange={(e) => setPermissions(p => ({ ...p, canManageAppointments: e.target.checked }))}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>إدارة وحجز وتعديل المواعيد</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canAccessMedicalRecords}
                  onChange={(e) => setPermissions(p => ({ ...p, canAccessMedicalRecords: e.target.checked }))}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>الاطلاع على الملفات الطبية والسجلات</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canIssuePrescriptions}
                  onChange={(e) => setPermissions(p => ({ ...p, canIssuePrescriptions: e.target.checked }))}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>إصدار الوصفات الطبية الإلكترونية (Rx)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canManageStaff}
                  onChange={(e) => setPermissions(p => ({ ...p, canManageStaff: e.target.checked }))}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>إضافة وتعديل وحذف الموظفين</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canViewAuditLogs}
                  onChange={(e) => setPermissions(p => ({ ...p, canViewAuditLogs: e.target.checked }))}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>استعراض سجلات الأمان ومحاولات الاختراق</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.canManageClinicSettings}
                  onChange={(e) => setPermissions(p => ({ ...p, canManageClinicSettings: e.target.checked }))}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>تعديل إعدادات العيادة وساعات الدوام</span>
              </label>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            إلغاء
          </button>

          <button
            type="submit"
            form="staff-form"
            className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-lg transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'حفظ تعديلات الموظف' : 'إضافة الموظف للمنظومة'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
