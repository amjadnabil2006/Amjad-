import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Appointment, 
  Doctor, 
  Patient, 
  StaffMember, 
  EmailNotification,
  AppointmentStatus 
} from '../../types';
import { 
  LayoutDashboard, 
  Mail, 
  Calendar, 
  Stethoscope, 
  Users, 
  ShieldCheck, 
  Settings, 
  ArrowRight, 
  Lock, 
  Unlock, 
  LogOut, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Eye, 
  RefreshCw, 
  Phone, 
  MapPin, 
  DollarSign, 
  FileText, 
  Sparkles,
  Shield,
  Activity,
  Check,
  X,
  Play,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';
import { EditDoctorModal } from './EditDoctorModal';
import { EditAppointmentModal } from './EditAppointmentModal';
import { EditPatientModal } from './EditPatientModal';
import { EmailPreviewModal } from '../email/EmailPreviewModal';
import { ConsultationModal } from '../dashboard/ConsultationModal';
import { RescheduleModal } from '../dashboard/RescheduleModal';
import { AddEditStaffModal } from '../admin/AddEditStaffModal';
import { AdminSecurityGateModal } from '../admin/AdminSecurityGateModal';

interface ExecutiveControlPanelProps {
  onBackToPortal: () => void;
}

export const ExecutiveControlPanel: React.FC<ExecutiveControlPanelProps> = ({
  onBackToPortal
}) => {
  const {
    currentUser,
    logoutStaff,
    theme,
    toggleTheme,
    doctors,
    editDoctor,
    addDoctor,
    deleteDoctor,
    appointments,
    editAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
    sendAppointmentReminder,
    sendAppointmentConfirmationEmail,
    autoDispatchUpcomingReminders,
    patients,
    editPatient,
    emailNotifications,
    sendCustomEmail,
    deleteEmailNotification,
    markEmailAsOpened,
    staffMembers,
    updateStaffMember,
    addStaffMember,
    deleteStaffMember,
    toggleStaffTwoFactor,
    changeStaffStatus,
    securityAuditLogs,
    addAuditLog,
    clinicSettings,
    updateClinicSettings,
    isAdminUnlocked,
    unlockAdminPanel,
    lockAdminPanel,
    quickLoginAsAdmin,
    quickLoginAsDoctor
  } = useApp();

  // Active Hub
  const [activeTab, setActiveTab] = useState<'messages' | 'appointments' | 'doctors' | 'patients' | 'security' | 'settings'>('messages');

  // Modals state
  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState<Doctor | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const [selectedAppointmentForEdit, setSelectedAppointmentForEdit] = useState<Appointment | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<Patient | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const [selectedEmailForPreview, setSelectedEmailForPreview] = useState<EmailNotification | null>(null);

  const [selectedAppointmentForConsultation, setSelectedAppointmentForConsultation] = useState<Appointment | null>(null);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState<Appointment | null>(null);

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<StaffMember | null>(null);
  const [isSecurityGateOpen, setIsSecurityGateOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');

  // Messages sub-state
  const [messageSearch, setMessageSearch] = useState('');
  const [messageTypeFilter, setMessageTypeFilter] = useState<string>('all');
  const [isComposingMessage, setIsComposingMessage] = useState(false);
  const [composeRecipientId, setComposeRecipientId] = useState(patients[0]?.id || '');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Notification Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Automated notification batch trigger
  const handleRunAutoNotificationEngine = () => {
    const result = autoDispatchUpcomingReminders();
    if (result.sentCount > 0) {
      showToast(`تم فحص المواعيد بنجاح: تم إرسال ${result.sentCount} إشعار تذكير تلقائي للمرضى الذين اقترب موعدهم (${result.newlyNotifiedPatientNames.join('، ')}).`);
    } else {
      showToast(`تم فحص المواعيد بنجاح: كافة المواعيد القريبة (${result.upcomingCount}) تم إرسال إشعاراتها التذكيرية مسبقاً.`);
    }
  };

  // Automated Quick Confirmation
  const handleQuickConfirm = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'confirmed');
    showToast(`تم تأكيد الموعد #${apt.id} بنجاح، وتم إرسال إشعار بريدي تلقائي فوري للمريض ${apt.patientName}.`);
  };

  // Automated Reminder
  const handleSendReminder = (apt: Appointment) => {
    sendAppointmentReminder(apt.id);
    showToast(`تم إرسال تذكير فوري بقرب موعد الزيارة إلى ${apt.patientName} (${apt.patientEmail}) بنجاح.`);
  };

  // Cancel with note
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState('ظرف طارئ أو اعتذار الطبيب');

  const handleConfirmCancel = () => {
    if (cancelModalApt) {
      updateAppointmentStatus(cancelModalApt.id, 'cancelled', cancelReasonText);
      showToast(`تم إلغاء الموعد #${cancelModalApt.id} وإرسال إشعار اعتذار بالبريد للمريض.`);
      setCancelModalApt(null);
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchDoc = doctorFilter === 'all' || apt.doctorId === doctorFilter;
    const matchDate = 
      dateFilter === 'all' || 
      (dateFilter === 'today' && (apt.date === '2026-09-26' || apt.date === new Date().toISOString().split('T')[0])) ||
      (dateFilter === 'tomorrow' && (apt.date === '2026-09-27' || apt.date === new Date(Date.now() + 86400000).toISOString().split('T')[0]));

    return matchSearch && matchStatus && matchDoc && matchDate;
  });

  // Filtered Emails
  const filteredEmails = emailNotifications.filter(e => {
    const matchSearch = 
      e.recipientName.toLowerCase().includes(messageSearch.toLowerCase()) ||
      e.recipientEmail.toLowerCase().includes(messageSearch.toLowerCase()) ||
      e.subject.toLowerCase().includes(messageSearch.toLowerCase());

    const matchType = 
      messageTypeFilter === 'all' || 
      e.type === messageTypeFilter ||
      (messageTypeFilter === 'confirmations' && e.type === 'appointment_confirmed') ||
      (messageTypeFilter === 'reminders' && e.type === 'appointment_reminder');

    return matchSearch && matchType;
  });

  // Calculated Stats
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const autoConfirmedEmailsCount = emailNotifications.filter(e => e.type === 'appointment_confirmed').length;
  const autoReminderEmailsCount = emailNotifications.filter(e => e.type === 'appointment_reminder').length;

  const handleSendComposeMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === composeRecipientId) || patients[0];
    if (!patient || !composeSubject.trim() || !composeBody.trim()) return;

    sendCustomEmail(
      patient.email,
      patient.name,
      composeSubject.trim(),
      composeBody.trim(),
      'appointment_reminder',
      currentUser?.name || 'إدارة العيادات'
    );

    showToast(`تم إرسال الرسالة البريدية بنجاح إلى ${patient.name}`);
    setIsComposingMessage(false);
    setComposeSubject('');
    setComposeBody('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors" dir="rtl">
      
      {/* Top Command Bar */}
      <header className="bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand & Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 hover:bg-teal-100 dark:hover:bg-teal-900/80 border border-teal-200 dark:border-teal-800/80 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              title="العودة إلى موقع المرضى وحجز المواعيد"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لبوابة المرضى</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-900/30">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                    صِحّة كير | لوحة التحكم والإدارة الطبية الشاملة
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    <span>حماية مشفرة AES-256</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  تحكم كامل في المواعيد، الأطباء، السجلات، وتنبيهات البريد الآلية
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Theme Toggle & Logout Button */}
          <div className="flex items-center gap-2.5 self-end md:self-center">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
              title={theme === 'dark' ? 'التحويل للوضع النهاري (فاتح)' : 'التحويل للوضع الليلي (داكن)'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">الوضع النهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span className="font-bold">الوضع الليلي</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                logoutStaff();
                onBackToPortal();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 rounded-xl transition-colors cursor-pointer shadow-xs"
              title="تسجيل الخروج والعودة للرئيسية"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>

        </div>
      </header>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[90%] bg-teal-900/95 border border-teal-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0" />
          <span className="flex-1 leading-relaxed">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-teal-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
          
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>مركز الرسائل والتنبيهات الآلية</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-mono">
              {emailNotifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>إدارة وتعديل المواعيد</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-mono">
              {appointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'doctors'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>إدارة وتعديل الأطباء والعيادات</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-mono">
              {doctors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'patients'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة وتعديل المرضى والملفات</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-mono">
              {patients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>مركز الحماية، الموظفين والتدقيق</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono">
              {staffMembers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات وسياسات المنظومة</span>
          </button>

        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* ============================================================== */}
        {/* TAB 1: MESSAGES & AUTOMATED NOTIFICATIONS HUB                  */}
        {/* ============================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Banner: Automated Notification Engine Status */}
            <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-sky-950/80 border border-teal-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 animate-pulse">
                      <Sparkles className="w-3 h-3 text-teal-300" />
                      <span>نظام الإشعارات البريدية التلقائي الفوري</span>
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>نشط ويعمل بالخلفية</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white">
                    نظام التنبيهات البريدية التلقائية للمرضى
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    يتم إرسال إشعار بريدي رسمي تلقائي ومفصل للمريض عند <strong>تأكيد الموعد</strong>، بالإضافة إلى فحص آلي للمواعيد القادمة خلال 24 إلى 48 ساعة لإرسال <strong>تذكير قرب موعد الزيارة</strong> شاملاً تعليمات الحضور وموقع العيادة.
                  </p>
                </div>

                {/* Instant Actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={handleRunAutoNotificationEngine}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 active:scale-95 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>فحص وإرسال تذكيرات المواعيد القريبة الآن</span>
                  </button>

                  <button
                    onClick={() => setIsComposingMessage(!isComposingMessage)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-teal-300 bg-teal-950/70 hover:bg-teal-900 border border-teal-800 rounded-xl transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>إنشاء رسالة مخصصة لمريض</span>
                  </button>
                </div>
              </div>

              {/* Live Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-right">
                  <span className="text-[11px] text-slate-400 block mb-0.5">إجمالي الرسائل المرسلة</span>
                  <span className="text-xl font-bold font-mono text-white">{emailNotifications.length}</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-right">
                  <span className="text-[11px] text-teal-400 block mb-0.5">إشعارات التأكيد التلقائية</span>
                  <span className="text-xl font-bold font-mono text-teal-300">{autoConfirmedEmailsCount}</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-right">
                  <span className="text-[11px] text-sky-400 block mb-0.5">تذكيرات قرب موعد الزيارة</span>
                  <span className="text-xl font-bold font-mono text-sky-300">{autoReminderEmailsCount}</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-right">
                  <span className="text-[11px] text-emerald-400 block mb-0.5">معدل التسليم والوصول</span>
                  <span className="text-xl font-bold font-mono text-emerald-300">100% (ناجح)</span>
                </div>
              </div>
            </div>

            {/* Compose Custom Message Form */}
            {isComposingMessage && (
              <div className="bg-slate-950 border border-teal-800/80 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-teal-400" />
                    <span>إنشاء وإرسال إشعار بريدي جديد إلى مريض</span>
                  </h3>
                  <button
                    onClick={() => setIsComposingMessage(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSendComposeMessage} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        اختر المريض المستلم:
                      </label>
                      <select
                        value={composeRecipientId}
                        onChange={(e) => setComposeRecipientId(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                      >
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.email}) - {p.phone}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        موضوع الرسالة:
                      </label>
                      <input
                        type="text"
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        placeholder="مثال: تعليمات المتابعة الطبية ونتائج الفحص"
                        className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {/* Ready quick templates */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">قوالب سريعة:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setComposeSubject('تذكير بموعد زيارتكم غداً في مجمع صِحّة كير');
                        setComposeBody('نود تذكيركم بموعدكم الطبي المجدول غداً بالعيادة. نرجو الحضور قبل الموعد بـ 10 دقائق لفتح السجل.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] cursor-pointer"
                    >
                      تذكير بالموعد
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setComposeSubject('تعليمات الصيام قبل إجراء الفحوصات المخبرية');
                        setComposeBody('نرجو الالتزام بالصيام لمدة 8 ساعات قبل إجراء تحاليل الدم المخبرية في مختبر المركز. يسمح فقط بشرب الماء.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] cursor-pointer"
                    >
                      تعليمات الصيام
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setComposeSubject('تقرير الفحوصات الطبية جاهز للاطلاع');
                        setComposeBody('يسرنا إبلاغكم بأن التقرير الطبي ونتائج الفحوصات قد تم اعتمادها من الطبيب المعالج وأصبحت متاحة في ملفكم الطبي.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] cursor-pointer"
                    >
                      جاهزية التقرير
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      نص الرسالة:
                    </label>
                    <textarea
                      rows={3}
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      placeholder="اكتب رسالتك للمريض هنا..."
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsComposingMessage(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 rounded-xl"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال الإشعار الآن</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Email Notifications List with Filters */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-teal-400" />
                    <span>سجل الإشعارات والرسائل الصادرة ({filteredEmails.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    استعراض ومعاينة كافة رسائل البريد الإلكتروني المرسلة تلقائياً ويدوياً
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="بحث في الرسائل والمستلمين..."
                      value={messageSearch}
                      onChange={(e) => setMessageSearch(e.target.value)}
                      className="pl-3 pr-8 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-500 outline-hidden w-48 sm:w-60"
                    />
                  </div>

                  <select
                    value={messageTypeFilter}
                    onChange={(e) => setMessageTypeFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 outline-hidden"
                  >
                    <option value="all">كافة أنواع الرسائل</option>
                    <option value="confirmations">إشعارات تأكيد المواعيد</option>
                    <option value="reminders">تذكيرات قرب موعد الزيارة</option>
                    <option value="appointment_cancelled">إشعارات الإلغاء</option>
                    <option value="prescription_ready">إشعارات الوصفات الطبية</option>
                  </select>
                </div>
              </div>

              {/* Messages Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                      <th className="py-3 px-4 font-semibold">المستلم والبريد</th>
                      <th className="py-3 px-4 font-semibold">نوع الإشعار</th>
                      <th className="py-3 px-4 font-semibold">موضوع البريد</th>
                      <th className="py-3 px-4 font-semibold">تاريخ ووقت الإرسال</th>
                      <th className="py-3 px-4 font-semibold">الحالة</th>
                      <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredEmails.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          لا توجد رسائل مطابقة لخيارات البحث المحددة.
                        </td>
                      </tr>
                    ) : (
                      filteredEmails.map(email => (
                        <tr key={email.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 font-medium text-white">
                            <div>{email.recipientName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{email.recipientEmail}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              email.type === 'appointment_confirmed' 
                                ? 'bg-teal-950 text-teal-300 border border-teal-800' 
                                : email.type === 'appointment_reminder'
                                ? 'bg-sky-950 text-sky-300 border border-sky-800'
                                : email.type === 'appointment_cancelled'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {email.type === 'appointment_confirmed' && 'تأكيد موعد آلي ✓'}
                              {email.type === 'appointment_reminder' && 'تذكير بقرب الزيارة ⏰'}
                              {email.type === 'appointment_cancelled' && 'إلغاء موعد'}
                              {email.type === 'prescription_ready' && 'وصفة طبية'}
                              {email.type === 'appointment_booked' && 'حجز جديد'}
                              {email.type === 'medical_report_ready' && 'تقرير طبي'}
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-xs truncate text-slate-300">
                            {email.subject}
                          </td>

                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(email.sentAt).toLocaleDateString('ar-SA')} - {new Date(email.sentAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                          </td>

                          <td className="py-3 px-4">
                            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تم التسليم</span>
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  markEmailAsOpened(email.id);
                                  setSelectedEmailForPreview(email);
                                }}
                                className="p-1.5 text-teal-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                title="معاينة البريد الإلكتروني الحقيقي"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  deleteEmailNotification(email.id);
                                  showToast('تم حذف سجل الرسالة بنجاح.');
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                title="حذف الرسالة"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: APPOINTMENTS EDITING & MANAGEMENT HUB                   */}
        {/* ============================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header with Search and Filters */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-400" />
                    <span>إدارة وتعديل المواعيد الطبية ({filteredAppointments.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    تعديل التواريخ والأوقات والحالات مع إرسال إشعارات بريدية تلقائية فورية للمرضى
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="بحث باسم المريض، الجوال، أو رقم الموعد..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-3 pr-8 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl focus:ring-1 focus:ring-teal-500 outline-hidden w-56 sm:w-64"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 outline-hidden"
                  >
                    <option value="all">كافة الحالات</option>
                    <option value="confirmed">المؤكدة فقط</option>
                    <option value="pending">قيد الانتظار</option>
                    <option value="in_progress">قيد الكشف بالعيادة</option>
                    <option value="completed">المكتملة</option>
                    <option value="cancelled">الملغاة</option>
                  </select>

                  <select
                    value={doctorFilter}
                    onChange={(e) => setDoctorFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 outline-hidden"
                  >
                    <option value="all">كافة الأطباء</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointments Interactive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                      <th className="py-3 px-4 font-semibold">رقم الموعد والمريض</th>
                      <th className="py-3 px-4 font-semibold">الطبيب والعيادة</th>
                      <th className="py-3 px-4 font-semibold">التاريخ والوقت</th>
                      <th className="py-3 px-4 font-semibold">النوع والرسوم</th>
                      <th className="py-3 px-4 font-semibold">الحالة والإشعار الآلي</th>
                      <th className="py-3 px-4 font-semibold text-center">إجراءات التعديل والتنبيه</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          لا توجد مواعيد مطابقة لخيارات الفلترة.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map(apt => {
                        const hasConfirmedEmail = emailNotifications.some(
                          e => e.appointmentId === apt.id && e.type === 'appointment_confirmed'
                        );
                        const hasReminderEmail = emailNotifications.some(
                          e => e.appointmentId === apt.id && e.type === 'appointment_reminder'
                        );

                        return (
                          <tr key={apt.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-white">{apt.patientName}</div>
                              <div className="text-[11px] text-teal-400 font-mono">#{apt.id}</div>
                              <div className="text-[10px] text-slate-400">{apt.patientPhone}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-200">{apt.doctorName}</div>
                              <div className="text-[11px] text-slate-400">{apt.doctorSpecialty}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-sky-400 font-mono">{apt.date}</div>
                              <div className="text-[11px] text-slate-300 font-mono">الساعة {apt.timeSlot}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="text-slate-300">
                                {apt.consultationType === 'in_clinic' ? 'كشف حضوري' : 'استشارة مرئية'}
                              </div>
                              <div className="text-[11px] text-emerald-400 font-bold">{apt.fee} ر.س</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="mb-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  apt.status === 'confirmed'
                                    ? 'bg-teal-950 text-teal-300 border border-teal-800'
                                    : apt.status === 'in_progress'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                    : apt.status === 'completed'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : apt.status === 'cancelled'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}>
                                  {apt.status === 'confirmed' && 'مؤكد ومثبت ✓'}
                                  {apt.status === 'in_progress' && 'المريض بالعيادة ⏳'}
                                  {apt.status === 'completed' && 'مكتمل الكشف ✓'}
                                  {apt.status === 'cancelled' && 'ملغي'}
                                  {apt.status === 'pending' && 'قيد الانتظار'}
                                </span>
                              </div>

                              {/* Automated email delivery badges */}
                              <div className="flex flex-wrap gap-1">
                                {hasConfirmedEmail && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-950 text-teal-400 border border-teal-800" title="تم إرسال إشعار تأكيد الموعد بالبريد">
                                    بريد التأكيد ✓
                                  </span>
                                )}
                                {hasReminderEmail && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800" title="تم إرسال تذكير قرب الموعد بالبريد">
                                    تذكير الزيارة ⏰
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                
                                {/* Quick Confirm button */}
                                {apt.status !== 'confirmed' && apt.status !== 'completed' && (
                                  <button
                                    onClick={() => handleQuickConfirm(apt)}
                                    className="px-2 py-1 text-[11px] font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-lg shadow-2xs transition-all cursor-pointer"
                                    title="تأكيد فوري وإرسال إشعار بريدي للمريض"
                                  >
                                    تأكيد وإشعار
                                  </button>
                                )}

                                {/* Send Reminder Now button */}
                                {apt.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleSendReminder(apt)}
                                    className="px-2 py-1 text-[11px] font-bold bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 rounded-lg transition-all cursor-pointer"
                                    title="إرسال تذكير قرب موعد الزيارة الآن للمريض"
                                  >
                                    تذكير المريض
                                  </button>
                                )}

                                {/* Edit Full Appointment button */}
                                <button
                                  onClick={() => {
                                    setSelectedAppointmentForEdit(apt);
                                    setIsAppointmentModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="تعديل تفاصيل الموعد بالكامل"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                {/* Reschedule button */}
                                <button
                                  onClick={() => setSelectedAppointmentForReschedule(apt)}
                                  className="p-1.5 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="إعادة جدولة الموعد"
                                >
                                  <Clock className="w-4 h-4" />
                                </button>

                                {/* Cancel button */}
                                {apt.status !== 'cancelled' && (
                                  <button
                                    onClick={() => setCancelModalApt(apt)}
                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                    title="إلغاء الموعد وإرسال إشعار بالبريد"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: DOCTORS & CLINICS EDITING HUB                           */}
        {/* ============================================================== */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-400" />
                  <span>إدارة وتعديل الأطباء والعيادات الاستشارية ({doctors.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  تعديل رسوم الاستشارات، ساعات وأيام الدوام، التخصصات، وإضافة أطباء جدد للمنظومة
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedDoctorForEdit(null);
                  setIsDoctorModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة طبيب استشاري جديد</span>
              </button>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(doc => (
                <div key={doc.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-lg space-y-4 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-800 text-teal-400 flex items-center justify-center font-bold text-lg">
                        {doc.name.slice(0, 1)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                        <span className="text-[11px] text-teal-400 font-medium block">{doc.specialty}</span>
                        <span className="text-[10px] text-slate-400">{doc.title}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      نشط
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>

                  <div className="space-y-1.5 text-xs pt-3 border-t border-slate-800/80 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">رسوم الكشف:</span>
                      <strong className="text-emerald-400 font-bold">{doc.consultationFee} ر.س</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">ساعات الدوام:</span>
                      <span className="font-mono text-slate-300">{doc.workingHours.start} - {doc.workingHours.end}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">مدة الكشف:</span>
                      <span>{doc.slotDurationMinutes} دقيقة</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">مقر العيادة:</span>
                      <span className="text-slate-300 truncate max-w-[150px]">{doc.clinicName}</span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[11px] text-slate-400 block mb-1">أيام العمل المعتمدة:</span>
                      <div className="flex flex-wrap gap-1">
                        {doc.availableDays.map(day => (
                          <span key={day} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedDoctorForEdit(doc);
                        setIsDoctorModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-teal-400 bg-teal-950/70 hover:bg-teal-900 border border-teal-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>تعديل بيانات الطبيب</span>
                    </button>

                    {doctors.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف الطبيب (${doc.name})؟`)) {
                            deleteDoctor(doc.id);
                            showToast(`تم حذف الطبيب (${doc.name}) بنجاح.`);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                        title="حذف الطبيب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PATIENTS & EMR EDITING HUB                              */}
        {/* ============================================================== */}
        {activeTab === 'patients' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  <span>إدارة وتعديل سجلات المرضى والملفات الطبية EMR ({patients.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  تحديث بيانات الاتصال، فصائل الدم، الحساسيات الدوائية، والأمراض المزمنة
                </p>
              </div>

              {/* Patients Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                      <th className="py-3 px-4 font-semibold">المريض</th>
                      <th className="py-3 px-4 font-semibold">رقم الجوال والبريد</th>
                      <th className="py-3 px-4 font-semibold">فصيلة الدم</th>
                      <th className="py-3 px-4 font-semibold">الحساسيات والأمراض المزمنة</th>
                      <th className="py-3 px-4 font-semibold">جهة الاتصال الطارئة</th>
                      <th className="py-3 px-4 font-semibold text-center">إجراءات التعديل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {patients.map(p => (
                      <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {p.gender === 'male' ? 'ذكر' : 'أنثى'} · {p.dateOfBirth}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-mono text-teal-400">{p.phone}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.email}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                            {p.bloodType}
                          </span>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="text-[11px] text-amber-300 truncate">
                            <strong>الحساسية:</strong> {p.allergies.join('، ') || 'لا يوجد'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            <strong>المزمنة:</strong> {p.chronicDiseases.join('، ') || 'سليم'}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[11px] text-slate-300">
                          <div>{p.emergencyContact?.name || '-'}</div>
                          <div className="text-slate-400 font-mono">{p.emergencyContact?.phone || '-'}</div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedPatientForEdit(p);
                              setIsPatientModalOpen(true);
                            }}
                            className="flex items-center gap-1 mx-auto px-3 py-1.5 text-xs font-bold text-teal-400 bg-teal-950/70 hover:bg-teal-900 border border-teal-800 rounded-xl transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>تعديل السجل الطبي</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: SECURITY, STAFF & LIVE AUDIT TRAIL                      */}
        {/* ============================================================== */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Security Clearance Overview */}
            <div className="bg-slate-950 border border-purple-900/60 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    <span>منظومة الحماية، صلاحيات الموظفين، وسجل التدقيق المباشر</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    إدارة التحقق الثنائي 2FA، مستويات الأمان، وسجل التدقيق لجميع العمليات الحساسة
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedStaffForEdit(null);
                    setIsAddStaffModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة حساب موظف جديد</span>
                </button>
              </div>

              {/* Staff Members List with 2FA Toggles */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300">قائمة الكوادر الطبية والموظفين المصرح لهم:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staffMembers.map(staff => (
                    <div key={staff.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{staff.name}</span>
                          <span className="text-[10px] font-mono text-teal-400 dir-ltr bg-slate-800 px-1.5 py-0.5 rounded">
                            {staff.email}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {staff.jobTitle} · {staff.department}
                        </p>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-slate-400">مستوى الأمان:</span>
                          <strong className="text-purple-400 font-mono">Level {staff.securityLevel}</strong>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => {
                            toggleStaffTwoFactor(staff.id);
                            showToast(`تم ${staff.twoFactorEnabled ? 'تعطيل' : 'تفعيل'} التحقق الثنائي للموظف ${staff.name}`);
                          }}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${
                            staff.twoFactorEnabled
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          2FA: {staff.twoFactorEnabled ? 'مفعل ✓' : 'معطل'}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedStaffForEdit(staff);
                            setIsAddStaffModalOpen(true);
                          }}
                          className="text-[11px] text-teal-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>تعديل الصلاحيات</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Audit Trail */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>سجل التدقيق الأمني المباشر (Security Audit Trail):</span>
                </h4>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px]">
                        <th className="py-2.5 px-3">الوقت والـ IP</th>
                        <th className="py-2.5 px-3">الفاعل</th>
                        <th className="py-2.5 px-3">الحدث الأمني</th>
                        <th className="py-2.5 px-3">مستوى الخطورة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-[11px]">
                      {securityAuditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-800/40">
                          <td className="py-2 px-3 font-mono text-slate-400">
                            <div>{new Date(log.timestamp).toLocaleTimeString('ar-SA')}</div>
                            <div className="text-[10px] text-slate-500">{log.ipAddress}</div>
                          </td>
                          <td className="py-2 px-3 text-slate-200 font-medium">{log.actorName}</td>
                          <td className="py-2 px-3 text-slate-300">{log.details}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.severity === 'critical'
                                ? 'bg-rose-950 text-rose-300'
                                : log.severity === 'warning'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-emerald-950 text-emerald-300'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: CLINIC & SYSTEM POLICIES SETTINGS                       */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-teal-400" />
                  <span>إعدادات وسياسات المنظومة الطبية والعيادة</span>
                </h3>
                <p className="text-xs text-slate-400">
                  تعديل السياسات العامة للحجوزات، هواتف الطوارئ، وتفضيلات الإشعارات الآلية
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('تم حفظ كافة إعدادات وسياسات المنظومة بنجاح.');
                }} 
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      اسم المجمع الطبي الرسمي:
                    </label>
                    <input
                      type="text"
                      value={clinicSettings.clinicName}
                      onChange={(e) => updateClinicSettings({ clinicName: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      رقم طوارئ العيادات الموحد:
                    </label>
                    <input
                      type="text"
                      value={clinicSettings.emergencyPhone}
                      onChange={(e) => updateClinicSettings({ emergencyPhone: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      مهلة الحجز المسبق (بالساعات):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={clinicSettings.appointmentLeadHours}
                      onChange={(e) => updateClinicSettings({ appointmentLeadHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      الحد الأقصى للمواعيد اليومية لكل طبيب:
                    </label>
                    <input
                      type="number"
                      min="5"
                      value={clinicSettings.maxDailyAppointmentsPerDoctor}
                      onChange={(e) => updateClinicSettings({ maxDailyAppointmentsPerDoctor: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Switches */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl">
                    <div>
                      <span className="text-xs font-bold text-white block">إرسال تنبيهات بريدية تلقائية للمرضى</span>
                      <span className="text-[11px] text-slate-400">إشعار تأكيد الموعد فوراً وتذكير قبل الزيارة بـ 24-48 ساعة</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateClinicSettings({ enableEmailAlerts: !clinicSettings.enableEmailAlerts })}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        clinicSettings.enableEmailAlerts ? 'bg-teal-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        clinicSettings.enableEmailAlerts ? '-translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl">
                    <div>
                      <span className="text-xs font-bold text-white block">التأكيد التلقائي للمواعيد فور الحجز</span>
                      <span className="text-[11px] text-slate-400">اعتماد الحجز مباشرة مع إرسال بريد التأكيد دون انتظار مراجعة الاستقبال</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateClinicSettings({ autoConfirmAppointments: !clinicSettings.autoConfirmAppointments })}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        clinicSettings.autoConfirmAppointments ? 'bg-teal-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        clinicSettings.autoConfirmAppointments ? '-translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl">
                    <div>
                      <span className="text-xs font-bold text-white block">إلزام التحقق الثنائي (2FA) للأطباء</span>
                      <span className="text-[11px] text-slate-400">تطبيق حماية مشددة على ملفات المرضى الإلكترونية</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateClinicSettings({ enforceTwoFactorForDoctors: !clinicSettings.enforceTwoFactorForDoctors })}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        clinicSettings.enforceTwoFactorForDoctors ? 'bg-teal-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        clinicSettings.enforceTwoFactorForDoctors ? '-translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    حفظ سياسات المنظومة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODALS INTEGRATION                                             */}
      {/* ============================================================== */}

      {/* Edit Doctor Modal */}
      <EditDoctorModal
        isOpen={isDoctorModalOpen}
        doctor={selectedDoctorForEdit}
        onClose={() => setIsDoctorModalOpen(false)}
        onSave={(data) => {
          if (selectedDoctorForEdit) {
            editDoctor(selectedDoctorForEdit.id, data);
            showToast(`تم تحديث بيانات الطبيب (${data.name || selectedDoctorForEdit.name}) بنجاح.`);
          } else {
            const nextId = `doc-${Date.now().toString().slice(-4)}`;
            const newDoc: Doctor = {
              id: nextId,
              name: data.name || 'طبيب استشاري',
              title: data.title || 'استشاري معتمد',
              specialty: data.specialty || 'الطب العام',
              avatar: '/src/assets/images/doctor_ahmed_cardiologist_1790397170312.jpg',
              rating: 5.0,
              reviewsCount: 1,
              experienceYears: data.experienceYears || 10,
              clinicName: data.clinicName || 'مجمع صِحّة كير',
              clinicAddress: data.clinicAddress || 'الرياض',
              consultationFee: data.consultationFee || 300,
              availableDays: data.availableDays || ['الأحد', 'الإثنين', 'الثلاثاء'],
              workingHours: data.workingHours || { start: '09:00', end: '17:00' },
              slotDurationMinutes: data.slotDurationMinutes || 30,
              bio: data.bio || '',
              education: ['بكالوريوس طب وجراحة', 'الزمالة التخصصية المعتمدة'],
              languages: ['العربية', 'الإنجليزية'],
              phone: data.phone || '0500000000',
              email: data.email || 'doc@sehacare.med'
            };
            addDoctor(newDoc);
            showToast(`تمت إضافة الطبيب (${newDoc.name}) للمنظومة بنجاح.`);
          }
        }}
      />

      {/* Edit Appointment Modal */}
      <EditAppointmentModal
        isOpen={isAppointmentModalOpen}
        appointment={selectedAppointmentForEdit}
        doctors={doctors}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={(aptId, updates) => {
          editAppointment(aptId, updates);
          showToast(`تم تحديث الموعد #${aptId} بنجاح.`);
        }}
        onSendReminderNow={(aptId) => {
          sendAppointmentReminder(aptId);
          showToast(`تم إرسال تذكير بالبريد للموعد #${aptId} بنجاح.`);
        }}
      />

      {/* Edit Patient Modal */}
      <EditPatientModal
        isOpen={isPatientModalOpen}
        patient={selectedPatientForEdit}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={(patientId, updates) => {
          editPatient(patientId, updates);
          showToast(`تم تحديث السجل الطبي للمريض (${updates.name || 'المريض'}) بنجاح.`);
        }}
      />

      {/* Email Preview Modal */}
      <EmailPreviewModal
        email={selectedEmailForPreview}
        onClose={() => setSelectedEmailForPreview(null)}
      />

      {/* Consultation Modal */}
      {selectedAppointmentForConsultation && (
        <ConsultationModal
          appointment={selectedAppointmentForConsultation}
          onClose={() => setSelectedAppointmentForConsultation(null)}
          onCompleted={() => {
            setSelectedAppointmentForConsultation(null);
            showToast('تم إنهاء الاستشارة واعتماد السجل الطبي للمريض بنجاح.');
          }}
        />
      )}

      {/* Reschedule Modal */}
      {selectedAppointmentForReschedule && (
        <RescheduleModal
          appointment={selectedAppointmentForReschedule}
          onClose={() => {
            setSelectedAppointmentForReschedule(null);
            showToast('تمت إعادة جدولة الموعد وإرسال إشعار للمريض بالموعد الجديد.');
          }}
        />
      )}

      {/* Add / Edit Staff Modal */}
      <AddEditStaffModal
        isOpen={isAddStaffModalOpen}
        staffToEdit={selectedStaffForEdit}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSave={(data) => {
          if (selectedStaffForEdit) {
            updateStaffMember(selectedStaffForEdit.id, data);
            showToast(`تم تحديث بيانات وصلاحيات الموظف (${selectedStaffForEdit.name}) بنجاح.`);
          } else {
            addStaffMember(data);
            showToast(`تمت إضافة الموظف الجديد بنجاح.`);
          }
          setIsAddStaffModalOpen(false);
        }}
      />

      {/* Admin Security PIN Unlock Modal */}
      <AdminSecurityGateModal
        isOpen={isSecurityGateOpen}
        onClose={() => setIsSecurityGateOpen(false)}
        onSuccess={() => {
          setIsSecurityGateOpen(false);
          showToast('تم فك قفل لوحة التحكم بالرمز السري المعتمد.');
        }}
      />

      {/* Cancel Reason Confirmation Modal */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in" dir="rtl">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-900">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">إلغاء الموعد #{cancelModalApt.id}</h3>
                <p className="text-xs text-slate-400">سيتم إرسال إشعار اعتذار بالبريد الإلكتروني للمريض فوراً</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                سبب الإلغاء (يُدرج في رسالة البريد للمريض):
              </label>
              <input
                type="text"
                value={cancelReasonText}
                onChange={(e) => setCancelReasonText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl outline-hidden text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalApt(null)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                تراجع
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md cursor-pointer"
              >
                تأكيد الإلغاء وإرسال الإشعار
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
