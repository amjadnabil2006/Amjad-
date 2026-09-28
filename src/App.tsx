/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PatientPortal } from './components/patient/PatientPortal';
import { StaffUnifiedDashboard } from './components/dashboard/StaffUnifiedDashboard';
import { StaffLoginModal } from './components/auth/StaffLoginModal';
import { StaffLoginPage } from './components/auth/StaffLoginPage';
import { ExecutiveControlPanel } from './components/control-panel/ExecutiveControlPanel';
import { AIChatAssistant } from './components/ai/AIChatAssistant';
import { BookingWizardModal } from './components/patient/BookingWizardModal';
import { EmailCenterModal } from './components/email/EmailCenterModal';
import { ScheduleSettingsModal } from './components/dashboard/ScheduleSettingsModal';
import { AppointmentUpcomingToast } from './components/common/AppointmentUpcomingToast';
import { AppointmentDetailModal } from './components/patient/AppointmentDetailModal';
import { Doctor, Appointment } from './types';
import { 
  Lock, 
  ShieldAlert, 
  LogIn, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  Users, 
  Sparkles 
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    currentUser, 
    isStaffAuthenticated, 
    doctors, 
    appointments, 
    activePatientId, 
    patients 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('doctors');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedDoctor, setPreselectedDoctor] = useState<Doctor | null>(null);
  const [isEmailCenterOpen, setIsEmailCenterOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedAppointmentForDetail, setSelectedAppointmentForDetail] = useState<Appointment | null>(null);
  const [dismissedToastId, setDismissedToastId] = useState<string | null>(null);
  const [forceToastTrigger, setForceToastTrigger] = useState(0);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  // Detect upcoming confirmed appointment for active patient
  const upcomingAppointment = appointments.find(
    apt => (apt.patientId === activePatient?.id || apt.patientEmail.toLowerCase() === activePatient?.email.toLowerCase()) &&
           (apt.status === 'confirmed' || apt.status === 'in_progress') &&
           (apt.id !== dismissedToastId || forceToastTrigger > 0)
  ) || null;

  const handleOpenBooking = (doctor?: Doctor) => {
    setPreselectedDoctor(doctor || null);
    setIsBookingModalOpen(true);
  };

  const handleTriggerToastTest = () => {
    setDismissedToastId(null);
    setForceToastTrigger(prev => prev + 1);
  };

  // Dedicated Full-Page Executive Control Panel
  if (activeTab === 'dashboard' && isStaffAuthenticated) {
    return (
      <ExecutiveControlPanel onBackToPortal={() => setActiveTab('doctors')} />
    );
  }

  // Dedicated Full-Page Staff & Admin Login Gateway
  if (activeTab === 'staff-login' || (activeTab === 'dashboard' && !isStaffAuthenticated)) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans transition-colors" dir="rtl">
        <StaffLoginPage
          onSuccess={() => setActiveTab('dashboard')}
          onBackToPatientPortal={() => setActiveTab('doctors')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors" dir="rtl">
      
      {/* Top Header with Unified Login/Logout and Organization */}
      <Header
        onOpenBookingModal={() => handleOpenBooking()}
        onOpenEmailCenter={() => setActiveTab('dashboard')}
        onOpenLoginModal={() => {
          setActiveTab('dashboard');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Public Organized Patient Portal */}
        <PatientPortal
          onOpenBookingModal={handleOpenBooking}
          onOpenEmailCenter={() => setActiveTab('dashboard')}
          activeSubTab={activeTab}
          setActiveSubTab={setActiveTab}
          onTriggerToastTest={handleTriggerToastTest}
          hasUpcomingAppointment={!!upcomingAppointment}
        />

      </main>

      {/* AI Interactive Guide Chatbot */}
      <AIChatAssistant
        onOpenBooking={() => handleOpenBooking()}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenLogin={() => {
          if (!isStaffAuthenticated) {
            setActiveTab('staff-login');
          } else {
            setActiveTab('dashboard');
          }
        }}
      />

      {/* Staff Login Modal */}
      <StaffLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setActiveTab('dashboard');
        }}
      />

      {/* Booking Wizard Modal */}
      <BookingWizardModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedDoctor={preselectedDoctor}
        onSuccessBooking={() => {
          setActiveTab('patient-appointments');
        }}
      />

      {/* Email Notifications Center Modal */}
      <EmailCenterModal
        isOpen={isEmailCenterOpen}
        onClose={() => setIsEmailCenterOpen(false)}
      />

      {/* Schedule Settings Modal */}
      <ScheduleSettingsModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* Upcoming Appointment Toast Notification for Patients */}
      {!isStaffAuthenticated && (
        <AppointmentUpcomingToast
          appointment={upcomingAppointment}
          onViewDetails={(apt) => setSelectedAppointmentForDetail(apt)}
          onDismiss={() => {
            if (upcomingAppointment) {
              setDismissedToastId(upcomingAppointment.id);
            }
          }}
        />
      )}

      {/* Appointment Detail Quick Pass Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointmentForDetail}
        onClose={() => setSelectedAppointmentForDetail(null)}
      />

      {/* Clean, editorial enterprise footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">صِحّة كير</span>
            <span>·</span>
            <span>المنظومة الطبية المعتمدة لإدارة المواعيد والملفات الصحية</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>الرياض، المملكة العربية السعودية</span>
            <span>·</span>
            <span>هاتف المركز: 966114829100+</span>
            <span>·</span>
            <span>© 2026 جميع الحقوق محفوظة</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
