import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffMember, StaffRole, StaffStatus } from '../../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  FileText, 
  Phone, 
  Mail, 
  Check, 
  Sparkles,
  Building,
  Activity
} from 'lucide-react';
import { AddEditStaffModal } from './AddEditStaffModal';
import { AdminSecurityGateModal } from './AdminSecurityGateModal';

export const StaffManager: React.FC = () => {
  const { 
    staffMembers, 
    securityAuditLogs, 
    deleteStaffMember, 
    addStaffMember, 
    updateStaffMember, 
    toggleStaffTwoFactor,
    changeStaffStatus,
    isAdminUnlocked,
    lockAdminPanel 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'staff_list' | 'audit_logs'>('staff_list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);
  const [isSecurityGateOpen, setIsSecurityGateOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Security Gate trigger
  const requireAdminAuth = (action: () => void) => {
    if (isAdminUnlocked) {
      action();
    } else {
      setPendingAction(() => action);
      setIsSecurityGateOpen(true);
    }
  };

  const handleOpenAdd = () => {
    requireAdminAuth(() => {
      setStaffToEdit(null);
      setIsAddEditModalOpen(true);
    });
  };

  const handleOpenEdit = (staff: StaffMember) => {
    requireAdminAuth(() => {
      setStaffToEdit(staff);
      setIsAddEditModalOpen(true);
    });
  };

  const handleDelete = (staff: StaffMember) => {
    requireAdminAuth(() => {
      if (staff.role === 'super_admin' && staffMembers.filter(s => s.role === 'super_admin').length <= 1) {
        alert('أمان المنظومة: لا يمكن حذف حساب المدير العام الرئيسي الأخير.');
        return;
      }
      if (window.confirm(`تحذير أمني: هل أنت متأكد من حذف الموظف (${staff.name}) وسحب كافة صلاحياته وحساباته نهائياً؟`)) {
        deleteStaffMember(staff.id);
      }
    });
  };

  const handleSaveStaff = (data: any) => {
    if (staffToEdit) {
      updateStaffMember(staffToEdit.id, data);
    } else {
      addStaffMember(data);
    }
  };

  // Filter staff
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery);

    const matchesDept = filterDepartment === 'all' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Unique departments for filter
  const departments = ['all', ...Array.from(new Set(staffMembers.map(s => s.department)))];

  // Stats
  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter(s => s.status === 'active').length;
  const twoFactorCount = staffMembers.filter(s => s.twoFactorEnabled).length;
  const twoFactorPercent = Math.round((twoFactorCount / (totalStaff || 1)) * 100);

  const getRoleBadge = (role: StaffRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded text-[11px] font-bold">مدير عام</span>;
      case 'doctor':
        return <span className="text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded text-[11px] font-bold">طبيب استشاري</span>;
      case 'pharmacist':
        return <span className="text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded text-[11px] font-bold">صيدلاني</span>;
      case 'lab_tech':
        return <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">فني مختبر</span>;
      case 'receptionist':
        return <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">استقبال ومواعيد</span>;
      default:
        return <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">كادر طبي</span>;
    }
  };

  const getStatusBadge = (status: StaffStatus) => {
    switch (status) {
      case 'active':
        return <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded text-[11px] font-semibold">نشط</span>;
      case 'on_leave':
        return <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded text-[11px] font-semibold">في إجازة</span>;
      case 'suspended':
        return <span className="text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 rounded text-[11px] font-semibold">معلق الصلاحيات</span>;
      case 'inactive':
        return <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">غير نشط</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Security Banner & Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-teal-500/20 text-teal-400 flex items-center justify-center border border-slate-700 dark:border-teal-500/40 shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                لوحة تحكم إدارة الموظفين والأمان السيبراني
              </h1>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>الحماية القصوى نشطة</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              إدارة الكوادر الطبية والإدارية، الصلاحيات الدقيقة، المصادقة الثنائية، وسجل التدقيق الأمني المضاد للاختراق
            </p>
          </div>
        </div>

        {/* Lock / Unlock Status & Add Employee button */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          {isAdminUnlocked ? (
            <button
              onClick={lockAdminPanel}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 rounded-xl transition-colors"
              title="قفل جلسة الإدارة لمنع التعديلات غير المصرح بها"
            >
              <Unlock className="w-4 h-4 text-amber-600" />
              <span>الجلسة مفككة (انقر للقفل)</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSecurityGateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>لوحة مقفلة برمز PIN</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة موظف جديد</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">إجمالي الموظفين</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">{totalStaff}</span>
            <span className="text-[11px] text-teal-600 dark:text-teal-400">كافة الأقسام</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">الموظفون على رأس العمل</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{activeStaff}</span>
            <span className="text-[11px] text-slate-400">حسابات نشطة</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400">نسبة الحماية الثنائية 2FA</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums">%{twoFactorPercent}</span>
            <span className="text-[11px] text-purple-600">{twoFactorCount} من {totalStaff} حساب</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">سجل الأمان والمحاولات</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">{securityAuditLogs.length}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">مشفّر ومؤمن</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          
          {/* Main Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('staff_list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'staff_list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>دليل الموظفين ({filteredStaff.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'audit_logs'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>سجل الأمان والعمليات المشفرة ({securityAuditLogs.length})</span>
            </button>
          </div>

          {/* Quick Search */}
          {activeTab === 'staff_list' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="بحث بالاسم، الكود، الجوال أو المسمى..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Department & Status filters */}
        {activeTab === 'staff_list' && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">القسم:</span>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
              >
                <option value="all">كافة الأقسام والعيادات</option>
                {departments.filter(d => d !== 'all').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <span className="text-slate-500 dark:text-slate-400 mr-2">الحالة:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
              >
                <option value="all">الكل</option>
                <option value="active">نشط</option>
                <option value="on_leave">في إجازة</option>
                <option value="suspended">معلق</option>
              </select>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>كافة إجراءات التعديل والحذف تخضع للتسجيل في سجل التدقيق الأمني المشفّر</span>
            </div>
          </div>
        )}

      </div>

      {/* TAB 1: Staff Table */}
      {activeTab === 'staff_list' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {filteredStaff.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold">لا يوجد موظفون مطابقون لخيارات البحث</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    <th className="py-3.5 px-4">كود الموظف</th>
                    <th className="py-3.5 px-4">اسم الموظف والتواصل</th>
                    <th className="py-3.5 px-4">القسم والمسمى الوظيفي</th>
                    <th className="py-3.5 px-4">الدور ومستوى الأمان</th>
                    <th className="py-3.5 px-4">المصادقة 2FA</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStaff.map(staff => (
                    <tr key={staff.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                        {staff.employeeCode}
                      </td>

                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {staff.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {staff.phone} · {staff.email}
                        </div>
                      </td>

                      {/* Dept & Job */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {staff.jobTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {staff.department}
                        </div>
                      </td>

                      {/* Role & Security Tier */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>{getRoleBadge(staff.role)}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          مستوى الصلاحية: T-{staff.securityLevel}
                        </div>
                      </td>

                      {/* 2FA Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => requireAdminAuth(() => toggleStaffTwoFactor(staff.id))}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                            staff.twoFactorEnabled
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                          }`}
                          title="انقر لتفعيل أو إلغاء التحقق الثنائي"
                        >
                          <Key className="w-3 h-3" />
                          <span>{staff.twoFactorEnabled ? 'مفعّل (2FA)' : 'معطل'}</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={staff.status}
                          onChange={(e) => requireAdminAuth(() => changeStaffStatus(staff.id, e.target.value as StaffStatus))}
                          className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="active">نشط</option>
                          <option value="on_leave">في إجازة</option>
                          <option value="suspended">معلق</option>
                          <option value="inactive">غير نشط</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(staff)}
                            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                            title="تعديل بيانات وصلاحيات الموظف"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(staff)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                            title="حذف الموظف نهائياً وسحب الصلاحيات"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Security Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">سجل الرقابة الأمنية والتحقق غير القابل للتلاعب (Tamper-Proof Audit Trail)</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              تشفير السجلات: SHA-256 HMAC
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {securityAuditLogs.map(log => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === 'critical' 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                        : log.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                    }`}>
                      {log.severity === 'critical' ? 'محاولة اختراق محظورة' : log.severity === 'warning' ? 'تنبيه أمني' : 'عملية موثقة'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{log.actorName}</span>
                    {log.targetName && (
                      <span className="text-slate-500">→ {log.targetName}</span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                    {log.details}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    عنوان المصدر: {log.ipAddress}
                  </div>
                </div>

                <div className="text-left shrink-0 text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  {new Date(log.timestamp).toLocaleString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      <AddEditStaffModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        staffToEdit={staffToEdit}
        onSave={handleSaveStaff}
      />

      {/* Security Gate PIN Modal */}
      <AdminSecurityGateModal
        isOpen={isSecurityGateOpen}
        onClose={() => {
          setIsSecurityGateOpen(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          setIsSecurityGateOpen(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
      />

    </div>
  );
};
