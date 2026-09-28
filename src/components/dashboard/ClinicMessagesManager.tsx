import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmailNotification, EmailType } from '../../types';
import { 
  Mail, 
  Send, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Trash2, 
  User, 
  Calendar, 
  Stethoscope, 
  FileText, 
  Inbox, 
  PlusCircle, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { EmailPreviewModal } from '../email/EmailPreviewModal';

export const ClinicMessagesManager: React.FC = () => {
  const { 
    emailNotifications, 
    sendCustomEmail, 
    deleteEmailNotification, 
    markEmailAsOpened,
    patients,
    doctors 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'appointments' | 'prescriptions' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailForView, setSelectedEmailForView] = useState<EmailNotification | null>(null);
  
  // Compose message state
  const [isComposing, setIsComposing] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageCategory, setMessageCategory] = useState<EmailType>('appointment_reminder');
  const [sendSuccessAlert, setSendSuccessAlert] = useState(false);

  // Filter messages
  const filteredMessages = emailNotifications.filter(msg => {
    const matchesSearch = 
      msg.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'appointments') {
      return msg.type.includes('appointment');
    }
    if (activeFilter === 'prescriptions') {
      return msg.type === 'prescription_ready' || msg.type === 'medical_report_ready';
    }
    return true;
  });

  const handleSendNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    if (!patient || !subject.trim() || !messageBody.trim()) return;

    sendCustomEmail(
      patient.email,
      patient.name,
      subject.trim(),
      messageBody.trim(),
      messageCategory,
      'إدارة مجمع صِحّة كير الطبي'
    );

    setSendSuccessAlert(true);
    setTimeout(() => setSendSuccessAlert(false), 3000);
    setIsComposing(false);
    setSubject('');
    setMessageBody('');
  };

  const handleApplyQuickTemplate = (templateType: string) => {
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    if (templateType === 'reminder') {
      setSubject(`تذكير بموعدكم القادم في مجمع صِحّة كير`);
      setMessageBody(`عزيزي المريض ${patient?.name || ''}، نود تذكيركم بموعدكم الطبي غداً في العيادة. نرجو الحضور قبل الموعد بـ 10 دقائق لإتمام إجراءات الاستقبال. مع تمنياتنا لكم بدوام الصحة.`);
      setMessageCategory('appointment_reminder');
    } else if (templateType === 'fasting') {
      setSubject(`تعليمات الصيام قبل الفحوصات والتحاليل المخبرية`);
      setMessageBody(`نرجو منكم الالتزام بالصيام لمدة 8 إلى 10 ساعات قبل إجراء تحاليل الدم المجدولة. يسمح بشرب الماء فقط.`);
      setMessageCategory('appointment_reminder');
    } else if (templateType === 'report') {
      setSubject(`تقرير الفحوصات الطبية جاهز للاطلاع`);
      setMessageBody(`يسعدنا إبلاغكم بأن التقرير الطبي ونتائج الفحوصات قد تم اعتمادها من الطبيب المعالج وأصبحت متاحة في ملفكم الطبي.`);
      setMessageCategory('medical_report_ready');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Compose Action */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              مركز الرسائل والتواصل الداخلي
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {emailNotifications.length} رسالة مسجلة
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            متابعة الرسائل الصادرة والواردة وتنبيهات البريد الإلكتروني للمرضى وتأكيدات الحجز
          </p>
        </div>

        <button
          onClick={() => setIsComposing(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl shadow-xs transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إرسال رسالة / بريد جديد</span>
        </button>
      </div>

      {sendSuccessAlert && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم إرسال الرسالة وتسجيلها في النظام بنجاح، ووصل إشعار فوري إلى المريض!</span>
        </div>
      )}

      {/* Compose Message Panel */}
      {isComposing && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-200 dark:border-teal-800/80 shadow-md space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                صياغة رسالة جديدة للمريض
              </h3>
            </div>
            <button
              onClick={() => setIsComposing(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              إلغاء
            </button>
          </div>

          {/* Quick Medical Templates */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
              قوالب جاهزة سريعة:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyQuickTemplate('reminder')}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                ⏰ تذكير بالموعد
              </button>
              <button
                type="button"
                onClick={() => handleApplyQuickTemplate('fasting')}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                🧪 تعليمات الصيام والتحاليل
              </button>
              <button
                type="button"
                onClick={() => handleApplyQuickTemplate('report')}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                📋 التقرير الطبي جاهز
              </button>
            </div>
          </div>

          <form onSubmit={handleSendNewMessage} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  المريض المستلم:
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.phone}) - {p.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  نوع الإشعار:
                </label>
                <select
                  value={messageCategory}
                  onChange={(e) => setMessageCategory(e.target.value as EmailType)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="appointment_reminder">تذكير بالموعد</option>
                  <option value="appointment_confirmed">تأكيد حجز موعد</option>
                  <option value="medical_report_ready">تقرير طبي جاهز</option>
                  <option value="prescription_ready">وصفة دوائية معتمدة</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                عنوان الرسالة (الموضوع):
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: تذكير بموعدكم القادم في مجمع صِحّة كير..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                نص الرسالة:
              </label>
              <textarea
                required
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="اكتب تفاصيل الرسالة والتعليمات الطبية للمريض..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال فوري الآن</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم المستلم، البريد، أو الموضوع..."
            className="w-full text-xs ps-9 pe-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            الكل ({emailNotifications.length})
          </button>

          <button
            onClick={() => setActiveFilter('appointments')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
              activeFilter === 'appointments'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            المواعيد والتأكيدات
          </button>

          <button
            onClick={() => setActiveFilter('prescriptions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
              activeFilter === 'prescriptions'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            الوصفات والتقارير
          </button>
        </div>
      </div>

      {/* Messages List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <Mail className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-semibold">لا توجد رسائل مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.type.includes('prescription')
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600'
                      : msg.type.includes('confirmed')
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                      : 'bg-teal-100 dark:bg-teal-950/60 text-teal-600'
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {msg.subject}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        msg.status === 'delivered'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      }`}>
                        {msg.status === 'delivered' ? '✓ تم التسليم' : '✓ مفتوحة'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        المستلم: <strong className="text-slate-700 dark:text-slate-300">{msg.recipientName}</strong> ({msg.recipientEmail})
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {msg.sentAt}
                      </span>
                      {msg.doctorName && (
                        <>
                          <span>·</span>
                          <span>الطبيب: {msg.doctorName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      markEmailAsOpened(msg.id);
                      setSelectedEmailForView(msg);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>معاينة الإشعار</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد حذف هذا الإشعار من السجل؟')) {
                        deleteEmailNotification(msg.id);
                      }
                    }}
                    title="حذف الرسالة"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Preview Modal */}
      {selectedEmailForView && (
        <EmailPreviewModal
          email={selectedEmailForView}
          onClose={() => setSelectedEmailForView(null)}
        />
      )}

    </div>
  );
};
