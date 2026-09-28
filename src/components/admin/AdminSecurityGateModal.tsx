import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Mail, Key, Eye, EyeOff, AlertCircle, X, CheckCircle2, Sparkles } from 'lucide-react';

interface AdminSecurityGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminSecurityGateModal: React.FC<AdminSecurityGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { unlockAdminPanel, currentUser } = useApp();
  const [email, setEmail] = useState(currentUser?.email || 'admin@sehacare.med');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const ok = unlockAdminPanel(email.trim(), password.trim());
      setIsLoading(false);

      if (ok) {
        setErrorMsg('');
        onSuccess();
        onClose();
      } else {
        setErrorMsg('بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.');
      }
    }, 250);
  };

  const handleQuickFill = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" dir="rtl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white text-center relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold">اللوحة الأمنية - التحقق من الهوية</h3>
          <p className="text-xs text-slate-400 mt-1">
            تسجيل الدخول بالبريد الإلكتروني وكلمة السر لتأكيد الصلاحيات الإدارية
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              البريد الإلكتروني المعتمد:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute start-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="admin@sehacare.med"
                className="w-full text-xs ps-10 pe-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              كلمة المرور:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute start-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="أدخل كلمة المرور..."
                className="w-full text-xs ps-10 pe-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Helpers */}
          <div className="pt-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">
              بيانات الدخول السريعة للاختبار:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@sehacare.med', 'admin123')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
              >
                المدير: admin@sehacare.med
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('doctor@sehacare.med', 'doc123')}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                الطبيب: doctor@sehacare.med
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:scale-98 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق من الهوية...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>تأكيد الدخول وفك قفل اللوحة الأمنية</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
