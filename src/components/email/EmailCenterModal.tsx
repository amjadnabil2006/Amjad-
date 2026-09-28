import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmailNotification } from '../../types';
import { 
  X, 
  Mail, 
  Search, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Trash2,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { EmailPreviewModal } from './EmailPreviewModal';

interface EmailCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailCenterModal: React.FC<EmailCenterModalProps> = ({ isOpen, onClose }) => {
  const { 
    emailNotifications, 
    markEmailAsOpened, 
    deleteEmailNotification, 
    sendCustomEmail,
    doctors,
    patients 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'patient' | 'doctor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  
  // Custom email compose state
  const [showCompose, setShowCompose] = useState(false);
  const [composeToEmail, setComposeToEmail] = useState('');
  const [composeToName, setComposeToName] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredEmails = emailNotifications.filter(email => {
    const matchesFilter = activeFilter === 'all' || email.recipientRole === activeFilter;
    const matchesSearch = 
      email.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (email.appointmentId && email.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleOpenEmail = (email: EmailNotification) => {
    markEmailAsOpened(email.id);
    setSelectedEmail(email);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeToEmail || !composeSubject || !composeMessage) return;

    const formattedHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0 0 6px 0; font-size: 22px;">مركز صِحّة كير الطبي</h2>
          <p style="margin: 0; font-size: 14px; opacity: 0.95;">إشعار وتنبيه طبي مباشر</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 15px; margin: 0 0 14px 0;">مرحباً <strong>${composeToName || 'عزيزنا المراجع'}</strong>،</p>
          <div style="font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-line; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            ${composeMessage}
          </div>
          <p style="font-size: 13px; color: #64748b; margin: 0;">لأي استفسار إضافي، يمكنك الرد على هذه الرسالة أو التواصل مع العيادة هاتفياً.</p>
        </div>
        <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">إدارة صِحّة كير - نظام المراسلات الطبية</p>
        </div>
      </div>
    `;

    sendCustomEmail(
      composeToEmail,
      composeToName || 'المراجع',
      composeSubject,
      formattedHtml,
      'appointment_reminder'
    );

    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setShowCompose(false);
      setComposeToEmail('');
      setComposeToName('');
      setComposeSubject('');
      setComposeMessage('');
    }, 1500);
  };

  const handleSelectQuickPatient = (patientEmail: string) => {
    const p = patients.find(pat => pat.email === patientEmail);
    if (p) {
      setComposeToEmail(p.email);
      setComposeToName(p.name);
      setComposeSubject(`تنبيه ومتابعة طبية من عيادة صِحّة كير - ${p.name}`);
      setComposeMessage(`عزيزنا ${p.name}،\nنود متابعة حالتك الصحية وتذكيرك بأهمية الالتزام بمواعيد الفحص والجرعات الدوائية الموصى بها.\n\nمع تمنياتنا لك بالصحة والسلامة.`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">مركز التنبيهات والبريد الإلكتروني</h2>
                <p className="text-xs text-slate-500">سجل الرسائل الصادرة والواردة وتأكيدات المواعيد الطبية التلقائية</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompose(!showCompose)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال بريد يدوي</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Compose Drawer / Sub-section */}
          {showCompose && (
            <div className="p-5 border-b border-slate-200 bg-teal-50/40">
              <form onSubmit={handleSendCustom} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-teal-900">إنشاء رسالة بريد إلكتروني مخصصة لمريض</h3>
                  
                  {/* Quick autofill from patients */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">اختيار سريع لمريض:</span>
                    <select
                      onChange={(e) => handleSelectQuickPatient(e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
                    >
                      <option value="">-- اختر مريضاً للتعبئة التلقائية --</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.email}>{p.name} ({p.phone})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">البريد الإلكتروني للمستلم *</label>
                    <input
                      type="email"
                      required
                      placeholder="patient@example.com"
                      value={composeToEmail}
                      onChange={(e) => setComposeToEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">اسم المستلم</label>
                    <input
                      type="text"
                      placeholder="اسم المريض أو الطبيب"
                      value={composeToName}
                      onChange={(e) => setComposeToName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">عنوان الموضوع *</label>
                    <input
                      type="text"
                      required
                      placeholder="تنبيه بموعد / تقرير الفحص"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">نص الرسالة *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="اكتب التوجيهات الطبية أو التذكير هنا..."
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {sendSuccess && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      تم إرسال البريد بنجاح!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال التنبيه الآن</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Controls bar: Filters & Search */}
          <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                جميع الرسائل ({emailNotifications.length})
              </button>
              <button
                onClick={() => setActiveFilter('patient')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeFilter === 'patient'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                تنبيهات المرضى ({emailNotifications.filter(e => e.recipientRole === 'patient').length})
              </button>
              <button
                onClick={() => setActiveFilter('doctor')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeFilter === 'doctor'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                إشعارات الأطباء ({emailNotifications.filter(e => e.recipientRole === 'doctor').length})
              </button>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالمريض، الطبيب، أو رقم الموعد..."
                className="w-full text-xs pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Email list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredEmails.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Mail className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-medium">لا توجد رسائل بريد إلكتروني مطابقة</p>
                <p className="text-xs text-slate-400 mt-1">تظهر هنا جميع التأكيدات والتنبيهات البريدية الصادرة آلياً فور حجز المواعيد</p>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isOpened = email.status === 'opened';
                return (
                  <div
                    key={email.id}
                    onClick={() => handleOpenEmail(email)}
                    className={`flex items-center justify-between p-4 hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      !isOpened ? 'bg-teal-50/20 font-medium' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        email.recipientRole === 'patient'
                          ? 'bg-teal-100/70 text-teal-700'
                          : 'bg-indigo-100/70 text-indigo-700'
                      }`}>
                        {email.type === 'prescription_ready' ? (
                          <FileCheck className="w-4 h-4" />
                        ) : email.type === 'appointment_cancelled' ? (
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {email.recipientName}
                          </span>
                          <span className="text-[11px] text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500 truncate">
                            {email.recipientEmail}
                          </span>
                          {email.appointmentId && (
                            <>
                              <span className="text-[11px] text-slate-400">·</span>
                              <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                                #{email.appointmentId}
                              </span>
                            </>
                          )}
                        </div>

                        <p className={`text-xs truncate ${!isOpened ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                          {email.subject}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span>الطبيب: {email.doctorName}</span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">
                            {new Date(email.sentAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })} - {new Date(email.sentAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 mr-4">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        email.status === 'opened' 
                          ? 'text-slate-500 bg-slate-100'
                          : 'text-emerald-700 bg-emerald-50'
                      }`}>
                        {email.status === 'opened' ? 'تمت القراءة' : 'تم التسليم'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEmailNotification(email.id);
                        }}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="حذف السجل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>إجمالي الرسائل: {emailNotifications.length} رسالة بريدية</span>
            <span>الخادم: mail.sehacare.med (مشفّر بنظام TLS 1.3)</span>
          </div>

        </div>
      </div>

      {/* Email Preview Modal */}
      {selectedEmail && (
        <EmailPreviewModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </>
  );
};
