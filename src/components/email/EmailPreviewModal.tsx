import React from 'react';
import { EmailNotification } from '../../types';
import { X, Mail, CheckCircle2, Clock, Calendar, User, Stethoscope, Printer } from 'lucide-react';

interface EmailPreviewModalProps {
  email: EmailNotification | null;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ email, onClose }) => {
  if (!email) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>${email.subject}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
          </style>
        </head>
        <body>
          ${email.htmlContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">معاينة الرسالة البريدية</h3>
              <p className="text-xs text-slate-500">تم إرسالها آلياً عبر خادم البريد لعيادة صِحّة كير</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="طباعة الرسالة"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Meta bar */}
        <div className="px-6 py-3 bg-slate-100/60 border-b border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">إلى:</span>
              <span className="text-slate-800">{email.recipientName} ({email.recipientEmail})</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم التسليم بنجاح</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <div>
              <span className="font-semibold text-slate-900">الموضوع:</span> {email.subject}
            </div>
            <div className="font-mono tabular-nums text-[11px]">
              {new Date(email.sentAt).toLocaleString('ar-SA')}
            </div>
          </div>
        </div>

        {/* Rendered Email Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
          <div 
            className="prose max-w-none text-slate-800"
            dangerouslySetInnerHTML={{ __html: email.htmlContent }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-400">
            معرف الرسالة: <span className="font-mono">{email.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            إغلاق المعاينة
          </button>
        </div>

      </div>
    </div>
  );
};
