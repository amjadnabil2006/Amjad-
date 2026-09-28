import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';
import { 
  X, 
  Lock, 
  KeyRound, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Stethoscope, 
  Shield, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { loginStaff, staffMembers } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('يرجى إدخال اسم المستخدم/البريد وكلمة المرور');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginStaff(identifier, password);
      setIsLoading(false);
      if (res.success) {
        setErrorMsg('');
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.message || 'فشل تسجيل الدخول، تحقق من البيانات');
      }
    }, 400);
  };

  const handleSelectQuickAccount = (staff: StaffMember) => {
    setIdentifier(staff.email);
    setPassword('2026');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white text-center relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold">بوابة دخول الكادر الطبي والإداري</h3>
          <p className="text-xs text-slate-400 mt-1">
            صِحّة كير | الدخول الموحد للوحة التحكم والملفات الطبية
          </p>
        </div>

        {/* Security Alert Badge */}
        <div className="px-6 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/60 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>منطقة مقيدة: الوصول متاح حصرياً للموظفين والأطباء المصرح لهم.</span>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@sehacare.med"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full text-xs pr-9 pl-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                كلمة السر:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full text-xs pr-9 pl-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>جاري التحقق من الصلاحيات...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>دخول لوحة التحكم الموحدة</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Staff Accounts Selector */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>اختر حساباً تجريبياً لتسجيل الدخول السريع:</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {staffMembers.slice(0, 4).map(staff => (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => handleSelectQuickAccount(staff)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-right transition-colors group flex items-start gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {staff.role === 'super_admin' ? <Shield className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-700 dark:group-hover:text-teal-300">
                      {staff.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {staff.jobTitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>كلمة المرور الافتراضية للتجربة: <strong className="font-mono text-teal-600 dark:text-teal-400">2026</strong></span>
          <span>صِحّة كير للمنشآت الطبية</span>
        </div>

      </div>
    </div>
  );
};
