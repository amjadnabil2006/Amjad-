import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  User, 
  Stethoscope, 
  FileText, 
  PlusCircle, 
  Activity, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Shield, 
  Users, 
  LogIn, 
  LogOut, 
  Lock, 
  LayoutDashboard 
} from 'lucide-react';

interface HeaderProps {
  onOpenBookingModal: () => void;
  onOpenEmailCenter: () => void;
  onOpenLoginModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBookingModal,
  onOpenEmailCenter,
  onOpenLoginModal,
  activeTab,
  setActiveTab
}) => {
  const { 
    theme, 
    toggleTheme, 
    currentUser, 
    isStaffAuthenticated, 
    logoutStaff 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand title, single line text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('doctors')}
              className="flex items-center gap-2.5 text-right group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                  صِحّة كير
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block leading-none">
                  المنظومة الطبية الذكية
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-6 Clean navigation links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'doctors'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              حجز موعد
            </button>

            <button
              onClick={() => setActiveTab('patient-appointments')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'patient-appointments'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              مواعيدي المحجوزة
            </button>

            <button
              onClick={() => setActiveTab('clinic-about')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'clinic-about'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              عن المركز الطبي
            </button>

            {/* Always Visible Control Dashboard Tab */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-700 font-bold'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>لوحة التحكم</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions + Dark Mode + Unified Login/Logout */}
          <div className="flex items-center gap-2.5">
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'التبديل إلى الوضع النهاري (الفاتح)' : 'التبديل إلى الوضع الداكن (Dark Mode)'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              aria-label="تبديل الوضع الداكن"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-90 duration-200" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 hover:text-indigo-600 duration-200" />
              )}
            </button>

            {/* Quick Action Button for public */}
            <button
              onClick={onOpenBookingModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>حجز موعد فوري</span>
            </button>

            {/* Unified Login / Logout Button */}
            {!isStaffAuthenticated ? (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50/90 dark:bg-teal-950/70 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200/80 dark:border-teal-800/80 rounded-lg transition-all whitespace-nowrap shadow-2xs active:scale-95 cursor-pointer"
                title="تسجيل دخول الأطباء وموظفي العيادة"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>دخول الموظفين</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl">
                {/* Staff User Profile Tag */}
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors text-right"
                  title="الانتقال إلى لوحة التحكم الخاصة بك"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {currentUser?.name.slice(0, 1)}
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block leading-tight max-w-[90px] truncate">
                      {currentUser?.name.split(' ')[0]} {currentUser?.name.split(' ')[1] || ''}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 block leading-none">
                      لوحة التحكم
                    </span>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={logoutStaff}
                  title="تسجيل الخروج الآمن وإنهاء الجلسة"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'doctors' ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            حجز موعد
          </button>
          <button
            onClick={() => setActiveTab('patient-appointments')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'patient-appointments' ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            مواعيدي
          </button>
          <button
            onClick={() => setActiveTab('clinic-about')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'clinic-about' ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            عن المركز
          </button>

          {isStaffAuthenticated && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 text-xs font-bold rounded-md whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-400'
              }`}
            >
              لوحة التحكم
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
