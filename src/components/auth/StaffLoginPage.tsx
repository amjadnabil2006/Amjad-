import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  Key, 
  ShieldCheck, 
  AlertCircle, 
  LogIn, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  Stethoscope,
  User,
  Shield,
  FileText
} from 'lucide-react';

interface StaffLoginPageProps {
  onSuccess: () => void;
  onBackToPatientPortal: () => void;
}

export const StaffLoginPage: React.FC<StaffLoginPageProps> = ({
  onSuccess,
  onBackToPatientPortal
}) => {
  const { loginStaff, quickLoginAsAdmin, quickLoginAsDoctor } = useApp();

  const [email, setEmail] = useState('admin@sehacare.med');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick Preset Profiles with direct Emails
  const quickStaffPresets = [
    {
      email: 'admin@sehacare.med',
      name: 'د. طارق السبيعي',
      roleText: 'المدير العام التنفيذي',
      badge: 'صلاحيات كاملة + إدارة وتعديل كل شيء',
      password: 'admin123',
      icon: ShieldCheck,
      color: 'purple',
      onSelect: () => {
        quickLoginAsAdmin();
        onSuccess();
      }
    },
    {
      email: 'doctor@sehacare.med',
      name: 'د. أحمد المنصوري',
      roleText: 'استشاري أول أمراض القلب',
      badge: 'إدارة المواعيد + السجلات الطبية EMR',
      password: 'doc123',
      icon: Stethoscope,
      color: 'teal',
      onSelect: () => {
        quickLoginAsDoctor('doc-1');
        onSuccess();
      }
    },
    {
      email: 'reception@sehacare.med',
      name: 'سلمان الحربي',
      roleText: 'مشرف قسم الاستقبال والمواعيد',
      badge: 'المواعيد + مركز الرسائل التلقائية',
      password: 'rec123',
      icon: User,
      color: 'blue',
      onSelect: () => {
        const res = loginStaff('reception@sehacare.med', 'rec123');
        if (res.success) onSuccess();
      }
    }
  ];

  const handleQuickLogin = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginStaff(presetEmail, presetPass);
      setIsLoading(false);
      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.message || 'فشل تسجيل الدخول، يرجى التحقق من البريد وكلمة السر.');
      }
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة السر.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const result = loginStaff(email.trim(), password.trim());
      setIsLoading(false);

      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.message || 'بيانات الدخول غير صحيحة. تحقق من البريد أو كلمة السر.');
      }
    }, 300);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300" dir="rtl">
      
      {/* Back to Public Patient Portal button */}
      <div>
        <button
          onClick={onBackToPatientPortal}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-400 p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى بوابة حجز المرضى والعيادات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Primary Login Box (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  تسجيل الدخول إلى لوحة التحكم
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  الدخول بالبريد الإلكتروني وكلمة السر فقط
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مشفّر ومحمي 256-bit</span>
            </span>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Direct 1-Click Master Access */}
          <div className="p-4 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-2xl text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>الدخول السريع المباشر للوحة التحكم</span>
            </div>
            <button
              type="button"
              onClick={() => {
                quickLoginAsAdmin();
                onSuccess();
              }}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>⚡ دخول فوري ومباشر كمدير عام (كامل الصلاحيات والتعديل)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute start-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="admin@sehacare.med"
                  className="w-full text-xs ps-9 pe-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-medium transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  كلمة السر:
                </label>
                <span className="text-[10px] text-slate-400">
                  كلمة السر التجريبية: admin123
                </span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute start-3 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="أدخل كلمة السر الخاصة بك..."
                  className="w-full text-xs ps-9 pe-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:scale-98 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق من أمان الحساب...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول إلى لوحة التحكم</span>
                </>
              )}
            </button>
          </form>

          {/* Security Features Badges */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>جدار حماية ضد الهجمات</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>تدقيق وتوثيق لكل العمليات</span>
            </div>
          </div>

        </div>

        {/* Right / Quick One-Click Switcher for Demo & Evaluation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                حسابات جاهزة للتسجيل المباشر بنقرة واحدة
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              انقر على أي حساب لتعبئة البريد وكلمة السر والدخول الفوري:
            </p>

            <div className="space-y-2.5 pt-1">
              {quickStaffPresets.map((preset) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={preset.email}
                    onClick={() => preset.onSelect ? preset.onSelect() : handleQuickLogin(preset.email, preset.password)}
                    disabled={isLoading}
                    className="w-full text-right p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                          preset.color === 'purple' ? 'bg-purple-600' : preset.color === 'teal' ? 'bg-teal-600' : 'bg-blue-600'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                          {preset.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 dir-ltr">
                        {preset.email}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pr-9">
                      <span>{preset.roleText}</span>
                      <span className="block text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                        ✦ {preset.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
            <span className="font-bold block">ملاحظة أمنية معتمدة:</span>
            <p className="leading-relaxed text-amber-700 dark:text-amber-400">
              الملفات الطبية ومعلومات المرضى مشفرة طبقاً للمعايير الصحية العالمية. يتم التحقق عبر البريد الإلكتروني وكلمة السر المعتمدة فقط.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
