import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentsManager } from './AppointmentsManager';
import { MedicalRecordsManager } from './MedicalRecordsManager';
import { StaffManager } from '../admin/StaffManager';
import { ClinicMessagesManager } from './ClinicMessagesManager';
import { SystemSettingsManager } from './SystemSettingsManager';
import { ScheduleSettingsModal } from './ScheduleSettingsModal';
import { 
  Calendar, 
  FileText, 
  Users, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  User, 
  Stethoscope, 
  Activity,
  Lock,
  Building2,
  Mail,
  Sliders,
  Settings,
  AlertCircle
} from 'lucide-react';

interface StaffUnifiedDashboardProps {
  onOpenEmailCenter: () => void;
  onOpenScheduleModal: () => void;
}

export const StaffUnifiedDashboard: React.FC<StaffUnifiedDashboardProps> = ({
  onOpenEmailCenter,
  onOpenScheduleModal
}) => {
  const { 
    currentUser, 
    logoutStaff, 
    doctors, 
    selectedDoctorId, 
    setSelectedDoctorId 
  } = useApp();

  const canManageStaff = currentUser?.role === 'super_admin' || currentUser?.permissions?.canManageStaff;
  const canAccessMedicalRecords = currentUser?.role === 'super_admin' || currentUser?.role === 'doctor' || currentUser?.permissions?.canAccessMedicalRecords;
  const canManageSettings = currentUser?.role === 'super_admin' || currentUser?.permissions?.canManageClinicSettings;

  const [activeTab, setActiveTab] = useState<'staff_management' | 'appointments' | 'medical_records' | 'messages' | 'settings' | 'schedule'>(
    canManageStaff ? 'staff_management' : 'appointments'
  );
  const [selectedPatientIdForRecords, setSelectedPatientIdForRecords] = useState<string | undefined>(undefined);

  const handleViewPatientRecords = (patientId: string) => {
    setSelectedPatientIdForRecords(patientId);
    setActiveTab('medical_records');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Staff Identity & Role Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-teal-400 flex items-center justify-center text-xl font-bold border border-slate-700 dark:border-slate-700 shrink-0 shadow-inner">
            {currentUser?.role === 'super_admin' ? (
              <ShieldCheck className="w-7 h-7 text-purple-400" />
            ) : currentUser?.role === 'doctor' ? (
              <Stethoscope className="w-7 h-7 text-teal-400" />
            ) : (
              <User className="w-7 h-7 text-blue-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentUser?.name || 'الكادر الطبي المعتمد'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {currentUser?.jobTitle}
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                كود: {currentUser?.employeeCode}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              القسم: <strong className="text-slate-700 dark:text-slate-300">{currentUser?.department}</strong> · مستوى الصلاحية: <strong className="font-mono text-teal-600 dark:text-teal-400">T-{currentUser?.securityLevel}</strong>
            </p>
          </div>
        </div>

        {/* Dashboard Fast Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={onOpenEmailCenter}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800 rounded-xl transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-teal-600" />
            <span>مركز التنبيهات</span>
          </button>

          <button
            onClick={logoutStaff}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors"
            title="إنهاء الجلسة والخروج الآمن"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs inside Staff Dashboard */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Protected Staff Management Tab */}
        {canManageStaff && (
          <button
            onClick={() => setActiveTab('staff_management')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'staff_management'
                ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>إدارة الموظفين والكوادر</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>إدارة المواعيد اليومية</span>
        </button>

        {/* Protected Medical Records Tab */}
        {canAccessMedicalRecords && (
          <button
            onClick={() => setActiveTab('medical_records')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'medical_records'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>سجل الملفات الطبية (EMR)</span>
            <span className="text-[10px] bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.2 rounded-full font-mono">
              محمي
            </span>
          </button>
        )}

        {/* Messages & Communications Tab inside Control Panel */}
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'messages'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4 text-teal-600" />
          <span>مركز الرسائل والتواصل</span>
        </button>

        {/* Settings & Permissions Tab */}
        {canManageSettings && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>الإعدادات والصلاحيات</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-500" />
          <span>جدول الدوام والمناوبات</span>
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === 'staff_management' && canManageStaff && (
        <StaffManager />
      )}

      {activeTab === 'appointments' && (
        <AppointmentsManager onViewPatientRecords={handleViewPatientRecords} />
      )}

      {activeTab === 'medical_records' && (
        <MedicalRecordsManager initialPatientId={selectedPatientIdForRecords} />
      )}

      {activeTab === 'messages' && (
        <ClinicMessagesManager />
      )}

      {activeTab === 'settings' && canManageSettings && (
        <SystemSettingsManager />
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">جدول مواعيد الأطباء وأوقات العمل</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">مواعيد العمل الرسمية وفترات الكشف في العيادات التخصصية</p>
            </div>
            <button
              onClick={onOpenScheduleModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
            >
              تعديل أوقات الطبيب
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctors.map(doc => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                    <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">{doc.specialty}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ساعات العمل:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {doc.workingHours.start} - {doc.workingHours.end}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">مدة الكشف:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{doc.slotDurationMinutes} دقيقة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">رسوم الاستشارة:</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300 font-mono tabular-nums">{doc.consultationFee} ر.س</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-slate-500 block mb-1">أيام الحجز المتاحة:</span>
                  <div className="flex flex-wrap gap-1">
                    {doc.availableDays.map(day => (
                      <span key={day} className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded text-slate-700 dark:text-slate-200">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
