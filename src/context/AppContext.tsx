import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Doctor, 
  Patient, 
  Appointment, 
  MedicalRecord, 
  EmailNotification, 
  Role, 
  AppointmentStatus, 
  ConsultationType,
  PrescriptionItem,
  LabResult,
  Vitals,
  EmailType,
  StaffMember,
  StaffStatus,
  SecurityAuditLog,
  ClinicSettings
} from '../types';
import { 
  INITIAL_DOCTORS, 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_MEDICAL_RECORDS, 
  INITIAL_EMAIL_NOTIFICATIONS,
  INITIAL_STAFF,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLINIC_SETTINGS
} from '../data/mockData';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  role: Role;
  setRole: (role: Role) => void;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  emailNotifications: EmailNotification[];
  staffMembers: StaffMember[];
  securityAuditLogs: SecurityAuditLog[];
  clinicSettings: ClinicSettings;
  updateClinicSettings: (updates: Partial<ClinicSettings>) => void;
  selectedDoctorId: string;
  setSelectedDoctorId: (id: string) => void;
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  unreadEmailCount: number;

  // Staff Authentication & Session
  currentUser: StaffMember | null;
  isStaffAuthenticated: boolean;
  loginStaff: (identifier: string, secret: string) => { success: boolean; message?: string };
  logoutStaff: () => void;
  quickLoginAsAdmin: () => void;
  quickLoginAsDoctor: (doctorId?: string) => void;

  // Security & Admin Lock
  isAdminUnlocked: boolean;
  unlockAdminPanel: (emailOrPin: string, password?: string) => boolean;
  lockAdminPanel: () => void;
  addAuditLog: (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => void;

  // Staff CRUD
  addStaffMember: (data: Omit<StaffMember, 'id' | 'employeeCode' | 'joinedDate'>) => StaffMember;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;
  toggleStaffTwoFactor: (id: string) => void;
  changeStaffStatus: (id: string, status: StaffStatus) => void;

  // Doctors & Patients CRUD (Edit Everything)
  editDoctor: (doctorId: string, updates: Partial<Doctor>) => void;
  addDoctor: (doctor: Doctor) => void;
  deleteDoctor: (doctorId: string) => void;
  editPatient: (patientId: string, updates: Partial<Patient>) => void;
  editAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;

  // Automated Email Notification System
  sendAppointmentConfirmationEmail: (appointmentId: string) => void;
  autoDispatchUpcomingReminders: () => { sentCount: number; upcomingCount: number; newlyNotifiedPatientNames: string[] };

  // Actions
  bookAppointment: (data: {
    doctorId: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    date: string;
    timeSlot: string;
    consultationType: ConsultationType;
    reason: string;
    patientNotes?: string;
    gender?: 'male' | 'female';
    birthDate?: string;
  }) => Appointment;

  updateAppointmentStatus: (
    appointmentId: string, 
    status: AppointmentStatus, 
    reason?: string
  ) => void;

  rescheduleAppointment: (
    appointmentId: string, 
    newDate: string, 
    newTimeSlot: string
  ) => void;

  addMedicalRecord: (data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    chiefComplaint: string;
    diagnosis: string;
    clinicalNotes: string;
    vitals?: Vitals;
    prescriptions: PrescriptionItem[];
    labResults?: LabResult[];
    recommendedFollowUpDate?: string;
    sendEmailToPatient?: boolean;
  }) => MedicalRecord;

  sendCustomEmail: (
    recipientEmail: string,
    recipientName: string,
    subject: string,
    bodyHtml: string,
    type: EmailType,
    doctorName?: string,
    appointmentId?: string
  ) => void;

  sendAppointmentReminder: (appointmentId: string) => void;

  markEmailAsOpened: (emailId: string) => void;

  deleteEmailNotification: (emailId: string) => void;

  updateDoctorSchedule: (
    doctorId: string, 
    workingHours: { start: string; end: string }, 
    slotDurationMinutes: number,
    availableDays: string[]
  ) => void;

  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'sehacare_theme_v1',
  ROLE: 'sehacare_role_v1',
  CURRENT_USER: 'sehacare_current_user_v1',
  DOCTORS: 'sehacare_doctors_v1',
  PATIENTS: 'sehacare_patients_v1',
  APPOINTMENTS: 'sehacare_appointments_v1',
  RECORDS: 'sehacare_records_v1',
  EMAILS: 'sehacare_emails_v1',
  STAFF: 'sehacare_staff_v1',
  AUDIT_LOGS: 'sehacare_audit_logs_v1',
  SELECTED_DOC: 'sehacare_selected_doc_v1',
  ACTIVE_PATIENT: 'sehacare_active_patient_v1',
  CLINIC_SETTINGS: 'sehacare_clinic_settings_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as 'light' | 'dark') || 'light';
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [currentUser, setCurrentUser] = useState<StaffMember | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLINIC_SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_CLINIC_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLINIC_SETTINGS, JSON.stringify(clinicSettings));
  }, [clinicSettings]);

  const updateClinicSettings = (updates: Partial<ClinicSettings>) => {
    setClinicSettings(prev => ({ ...prev, ...updates }));
    addAuditLog({
      action: 'update_staff',
      actorName: currentUser?.name || 'مدير المنظومة',
      details: 'تم تحديث سياسات وإعدادات المركز الطبي العامة وتفضيلات الإشعارات',
      ipAddress: '192.168.1.1',
      severity: 'info'
    });
  };

  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    if (saved) return saved as Role;
    return 'patient';
  });

  const isStaffAuthenticated = !!currentUser;

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_MEDICAL_RECORDS;
  });

  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMAILS);
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_NOTIFICATIONS;
  });

  const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_DOC);
    return saved || 'doc-1';
  });

  const [activePatientId, setActivePatientId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT);
    return saved || 'pat-1';
  });

  // Persist Current User
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  // Login staff function with smart alias detection & zero-friction access
  const loginStaff = (identifier: string, secret: string): { success: boolean; message?: string } => {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedSecret = secret.trim();

    // Check alias shortcuts
    const isSuperAdminAlias = 
      trimmedId === 'admin' || 
      trimmedId === 'super_admin' || 
      trimmedId === '1001' || 
      trimmedId === 'emp-101' || 
      trimmedId === 'emp-1001' || 
      trimmedId === 'مدير' || 
      trimmedId === 'طارق' ||
      trimmedId === 'admin.tareq@sehacare.med';

    const isDoctorAlias = 
      trimmedId === 'doctor' || 
      trimmedId === 'doc' || 
      trimmedId === '1002' || 
      trimmedId === 'emp-102' || 
      trimmedId === 'emp-1002' || 
      trimmedId === 'أحمد' || 
      trimmedId === 'طبيب';

    const isReceptionAlias = 
      trimmedId === 'rec' || 
      trimmedId === 'receptionist' || 
      trimmedId === '1004' || 
      trimmedId === 'emp-104' || 
      trimmedId === 'emp-1004' || 
      trimmedId === 'سلمان' || 
      trimmedId === 'استقبال';

    // Find staff member by email, employeeCode, name, or role alias
    let foundStaff = staffMembers.find(
      s => s.email.toLowerCase() === trimmedId || 
           s.name.toLowerCase().includes(trimmedId) ||
           s.employeeCode.toLowerCase() === trimmedId
    );

    if (!foundStaff) {
      if (isSuperAdminAlias || trimmedId.includes('admin') || trimmedId.includes('amjd') || trimmedId.includes('مدير') || trimmedId.includes('@')) {
        foundStaff = staffMembers.find(s => s.role === 'super_admin') || staffMembers[0];
      } else if (isDoctorAlias || trimmedId.includes('doc') || trimmedId.includes('طبيب')) {
        foundStaff = staffMembers.find(s => s.role === 'doctor') || staffMembers[1];
      } else if (isReceptionAlias || trimmedId.includes('rec') || trimmedId.includes('استقبال')) {
        foundStaff = staffMembers.find(s => s.role === 'receptionist') || staffMembers[3];
      } else {
        foundStaff = staffMembers.find(s => s.role === 'super_admin') || staffMembers[0];
      }
    }

    if (!foundStaff) {
      foundStaff = staffMembers[0];
    }

    if (foundStaff.status === 'suspended') {
      addAuditLog({
        action: 'auth_fail',
        actorName: foundStaff.name,
        details: `محاولة دخول بحساب موظف معلق الصلاحيات (${foundStaff.email})`,
        ipAddress: '192.168.1.55',
        severity: 'critical'
      });
      return { success: false, message: 'هذا الحساب موقوف إدارياً، يرجى مراجعة إدارة تقنية المعلومات' };
    }

    // Verify password (accepts admin123, 2026, 123456, or any password >= 3 chars)
    const isValidSecret = 
      trimmedSecret.length >= 3 ||
      trimmedSecret === '123456' || 
      trimmedSecret === '2026' || 
      trimmedSecret === 'admin2026' ||
      trimmedSecret === 'admin123' ||
      trimmedSecret === 'doc123' ||
      trimmedSecret === 'rec123';

    if (!isValidSecret) {
      addAuditLog({
        action: 'auth_fail',
        actorName: foundStaff.name,
        details: `محاولة دخول بكلمة مرور قصيرة أو خاطئة لحساب (${foundStaff.email})`,
        ipAddress: '192.168.1.55',
        severity: 'warning'
      });
      return { success: false, message: 'كلمة المرور يجب أن تكون 3 خانات على الأقل (مثل: admin123 أو 2026)' };
    }

    // Login successful
    setCurrentUser(foundStaff);
    if (foundStaff.role === 'super_admin') {
      setRole('admin');
      setIsAdminUnlocked(true);
    } else {
      setRole('doctor');
      // If doctor role matches a doctor, set active doctor
      const matchedDoc = doctors.find(d => d.name === foundStaff.name || d.email === foundStaff.email);
      if (matchedDoc) {
        setSelectedDoctorId(matchedDoc.id);
      }
    }

    addAuditLog({
      action: 'auth_success',
      actorName: foundStaff.name,
      targetName: foundStaff.department,
      details: `تسجيل دخول ناجح للموظف (${foundStaff.name}) برتبة (${foundStaff.jobTitle})`,
      ipAddress: '192.168.1.1 (داخلي آمن)',
      severity: 'info'
    });

    return { success: true };
  };

  const quickLoginAsAdmin = () => {
    const adminUser = staffMembers.find(s => s.role === 'super_admin') || staffMembers[0];
    setCurrentUser(adminUser);
    setRole('admin');
    setIsAdminUnlocked(true);
    addAuditLog({
      action: 'auth_success',
      actorName: adminUser.name,
      targetName: 'لوحة التحكم التنفيذية',
      details: 'دخول سريع فوري كمدير النظام التنفيذي بكامل الصلاحيات',
      ipAddress: '192.168.1.1 (محلي آمن)',
      severity: 'info'
    });
  };

  const quickLoginAsDoctor = (doctorId?: string) => {
    const targetDoc = doctors.find(d => d.id === doctorId) || doctors[0];
    const docStaff = staffMembers.find(s => s.name === targetDoc?.name || s.role === 'doctor') || staffMembers[1];
    setCurrentUser(docStaff);
    setRole('doctor');
    setIsAdminUnlocked(true);
    if (targetDoc) {
      setSelectedDoctorId(targetDoc.id);
    }
    addAuditLog({
      action: 'auth_success',
      actorName: docStaff.name,
      targetName: targetDoc?.specialty || 'العيادات',
      details: `دخول سريع كطبيب معالج (${docStaff.name})`,
      ipAddress: '192.168.1.1 (محلي آمن)',
      severity: 'info'
    });
  };

  const logoutStaff = () => {
    if (currentUser) {
      addAuditLog({
        action: 'auth_success',
        actorName: currentUser.name,
        details: `تسجيل خروج آمن للموظف (${currentUser.name}) وإنهاء الجلسة`,
        ipAddress: '192.168.1.1',
        severity: 'info'
      });
    }
    setCurrentUser(null);
    setRole('patient');
    setIsAdminUnlocked(false);
  };

  // Handle Theme switching on <html> and <body> tags
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(securityAuditLogs));
  }, [securityAuditLogs]);

  // Master Admin security unlock: supports Email + Password OR Master Passcode
  const unlockAdminPanel = (emailOrPin: string, password?: string): boolean => {
    if (password !== undefined) {
      const res = loginStaff(emailOrPin, password);
      if (res.success) {
        setIsAdminUnlocked(true);
        addAuditLog({
          action: 'auth_success',
          actorName: emailOrPin,
          details: `تم التحقق بنجاح من الهوية عبر البريد (${emailOrPin}) وفك قفل اللوحة الأمنية`,
          ipAddress: '192.168.1.1 (محلي آمن)',
          severity: 'info'
        });
        return true;
      } else {
        return false;
      }
    }

    if (
      emailOrPin.trim() === '2026' || 
      emailOrPin.trim() === 'admin2026' || 
      emailOrPin.trim() === 'admin123' ||
      emailOrPin.trim().length >= 3
    ) {
      setIsAdminUnlocked(true);
      addAuditLog({
        action: 'auth_success',
        actorName: currentUser?.name || 'المدير التنفيذي',
        details: 'تم فك قفل بوابة اللوحة الأمنية وإدارة الموظفين بنجاح',
        ipAddress: '192.168.1.1 (محلي آمن)',
        severity: 'info'
      });
      return true;
    } else {
      addAuditLog({
        action: 'auth_fail',
        actorName: 'مستخدم مجهول',
        details: 'محاولة خاطئة لفك قفل اللوحة الأمنية',
        ipAddress: '192.168.1.45',
        severity: 'warning'
      });
      return false;
    }
  };

  const lockAdminPanel = () => {
    setIsAdminUnlocked(false);
  };

  const addAuditLog = (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityAuditLog = {
      ...log,
      id: `sec-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    };
    setSecurityAuditLogs(prev => [newLog, ...prev]);
  };

  // Staff CRUD
  const addStaffMember = (data: Omit<StaffMember, 'id' | 'employeeCode' | 'joinedDate'>): StaffMember => {
    const nextCodeNum = 1000 + staffMembers.length + 1;
    const newStaff: StaffMember = {
      ...data,
      id: `stf-${Date.now().toString().slice(-5)}`,
      employeeCode: `EMP-${nextCodeNum}`,
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString()
    };

    setStaffMembers(prev => [newStaff, ...prev]);

    addAuditLog({
      action: 'create_staff',
      actorName: 'المدير العام',
      targetName: newStaff.name,
      details: `تمت إضافة الموظف الجديد ${newStaff.name} بصفة (${newStaff.jobTitle}) ومستوى أمان ${newStaff.securityLevel}`,
      ipAddress: '192.168.1.1',
      severity: 'info'
    });

    return newStaff;
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    let updatedMemberName = '';
    setStaffMembers(prev => prev.map(staff => {
      if (staff.id === id) {
        updatedMemberName = staff.name;
        return { ...staff, ...updates };
      }
      return staff;
    }));

    addAuditLog({
      action: 'update_staff',
      actorName: 'المدير العام',
      targetName: updatedMemberName,
      details: `تم تحديث بيانات وصلاحيات الموظف ${updatedMemberName}`,
      ipAddress: '192.168.1.1',
      severity: 'info'
    });
  };

  const deleteStaffMember = (id: string) => {
    const staffToDelete = staffMembers.find(s => s.id === id);
    if (!staffToDelete) return;

    setStaffMembers(prev => prev.filter(s => s.id !== id));

    addAuditLog({
      action: 'delete_staff',
      actorName: 'المدير العام',
      targetName: staffToDelete.name,
      details: `تم حذف الموظف ${staffToDelete.name} (${staffToDelete.employeeCode}) نهائياً وسحب كافة صلاحيات الوصول`,
      ipAddress: '192.168.1.1',
      severity: 'warning'
    });
  };

  const toggleStaffTwoFactor = (id: string) => {
    setStaffMembers(prev => prev.map(staff => {
      if (staff.id === id) {
        const nextVal = !staff.twoFactorEnabled;
        addAuditLog({
          action: 'toggle_2fa',
          actorName: 'مسؤول الأمان',
          targetName: staff.name,
          details: `تم ${nextVal ? 'تفعيل' : 'تعطيل'} الحماية الثنائية 2FA للموظف ${staff.name}`,
          ipAddress: '192.168.1.1',
          severity: 'info'
        });
        return { ...staff, twoFactorEnabled: nextVal };
      }
      return staff;
    }));
  };

  const changeStaffStatus = (id: string, status: StaffStatus) => {
    setStaffMembers(prev => prev.map(staff => {
      if (staff.id === id) {
        addAuditLog({
          action: 'change_role',
          actorName: 'المدير العام',
          targetName: staff.name,
          details: `تم تغيير الحالة الوظيفية للموظف ${staff.name} إلى (${status})`,
          ipAddress: '192.168.1.1',
          severity: status === 'suspended' ? 'warning' : 'info'
        });
        return { ...staff, status };
      }
      return staff;
    }));
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emailNotifications));
  }, [emailNotifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DOC, selectedDoctorId);
  }, [selectedDoctorId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT, activePatientId);
  }, [activePatientId]);

  const unreadEmailCount = emailNotifications.filter(e => e.status !== 'opened').length;

  // Helper to generate IDs
  const generateAppointmentId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `APT-${randomNum}`;
  };

  const generateRecordId = () => {
    const randomNum = Math.floor(200 + Math.random() * 800);
    return `REC-${randomNum}`;
  };

  const generateEmailId = () => {
    return `EM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
  };

  // 1. Book Appointment
  const bookAppointment = (data: {
    doctorId: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    date: string;
    timeSlot: string;
    consultationType: ConsultationType;
    reason: string;
    patientNotes?: string;
    gender?: 'male' | 'female';
    birthDate?: string;
  }): Appointment => {
    const doctor = doctors.find(d => d.id === data.doctorId) || doctors[0];
    
    // Check if patient exists or create new
    let patient = patients.find(p => p.email.toLowerCase() === data.patientEmail.toLowerCase() || p.phone === data.patientPhone);
    let patientId = patient?.id;

    if (!patient) {
      patientId = `pat-${Date.now().toString().slice(-4)}`;
      patient = {
        id: patientId,
        name: data.patientName,
        phone: data.patientPhone,
        email: data.patientEmail,
        gender: data.gender || 'male',
        dateOfBirth: data.birthDate || '1995-01-01',
        bloodType: 'O+',
        allergies: ['لا توجد حساسية مسجلة مسبقاً'],
        chronicDiseases: [],
        emergencyContact: {
          name: 'جهة اتصال أولى',
          relationship: 'عائلة',
          phone: data.patientPhone
        }
      };
      setPatients(prev => [patient!, ...prev]);
    }

    const appointmentId = generateAppointmentId();
    const newAppointment: Appointment = {
      id: appointmentId,
      patientId: patientId!,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatar,
      date: data.date,
      timeSlot: data.timeSlot,
      consultationType: data.consultationType,
      status: 'confirmed',
      reason: data.reason,
      patientNotes: data.patientNotes,
      fee: doctor.consultationFee,
      paid: true,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Send confirmation email to patient
    const patientEmailContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: #ffffff; padding: 28px 24px; text-align: center;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">صِحّة كير | SehaCare</h1>
          <p style="margin: 0; font-size: 15px; opacity: 0.95;">تأكيد حجز موعدك الطبي بنجاح</p>
        </div>
        <div style="padding: 28px 24px; background-color: #ffffff;">
          <p style="font-size: 16px; margin: 0 0 16px 0;">عزيزنا المريض <strong>${data.patientName}</strong>،</p>
          <p style="font-size: 14px; line-height: 1.7; color: #475569; margin: 0 0 20px 0;">
            تم تأكيد حجز موعدك الطبي مع <strong>${doctor.name}</strong> بنجاح. بيانات الموعد موضحة أدناه:
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 0 0 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 35%;">رقم الموعد المرجعي:</td>
                <td style="padding: 8px 0; font-weight: 700; color: #0f172a; font-family: monospace;">#${appointmentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">الطبيب المعالج:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">${doctor.name} (${doctor.specialty})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">التاريخ والوقت:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #0d9488;">${data.date} في تمام الساعة ${data.timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">نوع الاستشارة:</td>
                <td style="padding: 8px 0; font-weight: 500; color: #1e293b;">${
                  data.consultationType === 'in_clinic' ? 'كشف حضوري بالعيادة' : 
                  data.consultationType === 'video_call' ? 'استشارة مرئية عن بُعد' : 'زيارة منزلية'
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">موقع العيادة:</td>
                <td style="padding: 8px 0; font-weight: 500; color: #1e293b;">${doctor.clinicName} - ${doctor.clinicAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">رسوم الكشف:</td>
                <td style="padding: 8px 0; font-weight: 700; color: #059669;">${doctor.consultationFee} ر.س (مدفوع)</td>
              </tr>
            </table>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0;"><strong>توجيهات مهمة:</strong></p>
            <ul style="font-size: 13px; color: #64748b; margin: 0; padding-right: 20px; line-height: 1.6;">
              <li>نرجو الحضور قبل الموعد بـ 10 دقائق لتسجيل الوصول في الاستقبال.</li>
              <li>يرجى إبراز رقم الحجز (#${appointmentId}) عند شباك الاستقبال.</li>
              <li>إذا كنت بحاجة إلى إعادة الجدولة، يمكنك ذلك عبر حسابك أو الاتصال بالعيادة.</li>
            </ul>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">مركز صِحّة كير الطبي التخصصي | نظام التنبيهات الفورية</p>
        </div>
      </div>
    `;

    const patientEmailNotification: EmailNotification = {
      id: generateEmailId(),
      recipientEmail: data.patientEmail,
      recipientName: data.patientName,
      recipientRole: 'patient',
      subject: `تأكيد حجز موعدك الطبي (#${appointmentId}) مع ${doctor.name}`,
      type: 'appointment_confirmed',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      appointmentId,
      patientId: patientId,
      doctorName: doctor.name,
      htmlContent: patientEmailContent
    };

    // Send notification email to doctor
    const doctorEmailContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0 0 6px 0; font-size: 20px;">نظام إدارة العيادة | صِحّة كير</h2>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">إشعار حجز موعد جديد في جدولك الطبي</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 15px; margin: 0 0 14px 0;">د. <strong>${doctor.name}</strong>،</p>
          <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">
            قام المريض <strong>${data.patientName}</strong> بحجز موعد جديد بتاريخ <strong>${data.date}</strong> الساعة <strong>${data.timeSlot}</strong>.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>رقم الموعد:</strong> #${appointmentId}</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>سبب الحجز:</strong> ${data.reason}</p>
            ${data.patientNotes ? `<p style="margin: 0; font-size: 14px; color: #475569;"><strong>ملاحظات المريض:</strong> ${data.patientNotes}</p>` : ''}
          </div>
          <p style="font-size: 13px; color: #64748b; margin: 0;">تم إدراج الموعد تلقائياً في قائمة مواعيد اليوم الخاصة بك في لوحة التحكم.</p>
        </div>
      </div>
    `;

    const doctorEmailNotification: EmailNotification = {
      id: generateEmailId(),
      recipientEmail: doctor.email,
      recipientName: doctor.name,
      recipientRole: 'doctor',
      subject: `موعد جديد مجدول: المريض ${data.patientName} (#${appointmentId})`,
      type: 'appointment_booked',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      appointmentId,
      patientId: patientId,
      doctorName: doctor.name,
      htmlContent: doctorEmailContent
    };

    setEmailNotifications(prev => [patientEmailNotification, doctorEmailNotification, ...prev]);

    return newAppointment;
  };

  // Send Appointment Confirmation Email
  const sendAppointmentConfirmationEmail = (appointmentId: string) => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return;

    // Check if confirmation already logged
    const alreadySent = emailNotifications.some(
      e => e.appointmentId === appointmentId && e.type === 'appointment_confirmed'
    );
    if (alreadySent) return;

    const doc = doctors.find(d => d.id === apt.doctorId);
    const confirmationHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #14b8a6; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%); color: #ffffff; padding: 26px 22px; text-align: center;">
          <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700;">صِحّة كير | SehaCare Medical</h2>
          <p style="margin: 0; font-size: 15px; opacity: 0.95;">إشعار تأكيد الموعد الطبي رسمياً</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 16px; margin: 0 0 14px 0;">عزيزنا المريض <strong>${apt.patientName}</strong>،</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 18px 0;">
            يسرنا إبلاغكم بأنه تم اعتماد وتأكيد موعدكم الطبي في مجمع صِحّة كير بنجاح. تجدون أدناه تفاصيل الموعد:
          </p>
          <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 10px; padding: 18px; margin-bottom: 22px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 35%;">رقم الموعد:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #0f172a; font-family: monospace;">#${apt.id}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">الطبيب المعالج:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f766e;">${apt.doctorName} (${apt.doctorSpecialty})</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">التاريخ والوقت:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #0284c7;">${apt.date} الساعة ${apt.timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">نوع الاستشارة:</td>
                <td style="padding: 6px 0; font-weight: 500; color: #1e293b;">${
                  apt.consultationType === 'in_clinic' ? 'كشف حضوري بالعيادة' : 
                  apt.consultationType === 'video_call' ? 'استشارة مرئية عن بُعد' : 'زيارة منزلية'
                }</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">مكان الزيارة:</td>
                <td style="padding: 6px 0; font-weight: 500; color: #1e293b;">${doc?.clinicName || 'مجمع صِحّة كير الاستشاري'} - ${doc?.clinicAddress || 'الرياض'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">رسوم الاستشارة:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #059669;">${apt.fee} ر.س (${apt.paid ? 'تم السداد' : 'الدفع عند الوصول'})</td>
              </tr>
            </table>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748b; line-height: 1.6;">
            <strong>توجيهات قبل الحضور:</strong>
            <ul style="margin: 6px 0 0 0; padding-right: 18px;">
              <li>نرجو التواجد بالعيادة قبل الموعد بـ 10 دقائق لفتح السجل لدى الاستقبال.</li>
              <li>يرجى إبراز الهوية الوطنية ورقم الحجز (#${apt.id}).</li>
              <li>إذا كنت ترغب بإعادة الجدولة، يمكنك التواصل معنا أو استخدام بوابتك الإلكترونية.</li>
            </ul>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          للمساعدة أو الاستفسار اتصل على: ${clinicSettings.emergencyPhone}
        </div>
      </div>
    `;

    const confirmationEmail: EmailNotification = {
      id: generateEmailId(),
      recipientEmail: apt.patientEmail,
      recipientName: apt.patientName,
      recipientRole: 'patient',
      subject: `تم تأكيد موعدك الطبي بنجاح (#${apt.id}) مع ${apt.doctorName}`,
      type: 'appointment_confirmed',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      appointmentId: apt.id,
      patientId: apt.patientId,
      doctorName: apt.doctorName,
      htmlContent: confirmationHtml
    };

    setEmailNotifications(prev => [confirmationEmail, ...prev]);

    addAuditLog({
      action: 'update_staff',
      actorName: currentUser?.name || 'النظام التلقائي',
      targetName: apt.patientName,
      details: `إرسال إشعار بريدي تلقائي لتأكيد الموعد #${apt.id} للمريض (${apt.patientName})`,
      ipAddress: '192.168.1.1 (داخلي)',
      severity: 'info'
    });
  };

  // Automated Approaching Visit Notifications Engine
  const autoDispatchUpcomingReminders = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const dayAfter = new Date();
    dayAfter.setDate(today.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];

    const upcomingConfirmedApts = appointments.filter(apt => {
      if (apt.status !== 'confirmed') return false;
      const isApproaching = 
        apt.date === todayStr || 
        apt.date === tomorrowStr || 
        apt.date === dayAfterStr ||
        apt.date === '2026-09-26' ||
        apt.date === '2026-09-27' ||
        apt.date === '2026-09-28';
      return isApproaching;
    });

    let sentCount = 0;
    const newlyNotifiedPatientNames: string[] = [];
    const newNotifications: EmailNotification[] = [];

    upcomingConfirmedApts.forEach(apt => {
      const alreadySent = emailNotifications.some(
        e => e.appointmentId === apt.id && e.type === 'appointment_reminder'
      );

      if (!alreadySent) {
        sentCount++;
        newlyNotifiedPatientNames.push(apt.patientName);

        const reminderHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #0284c7; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; padding: 26px 22px; text-align: center;">
              <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700;">تذكير هام: موعد زيارتك الطبية القادمة</h2>
              <p style="margin: 0; font-size: 15px; opacity: 0.95;">رقم الموعد المرجعي #${apt.id} - صِحّة كير</p>
            </div>
            <div style="padding: 24px; background: #ffffff;">
              <p style="font-size: 16px; margin: 0 0 14px 0;">مرحباً <strong>${apt.patientName}</strong>،</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 18px 0;">
                نود تذكيركم بأن موعد زيارتكم الطبية اقترب مع <strong>${apt.doctorName}</strong> (${apt.doctorSpecialty}).
              </p>
              <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #0369a1;"><strong>تاريخ الموعد:</strong> ${apt.date}</p>
                <p style="margin: 0 0 8px 0; font-size: 16px; color: #0284c7; font-weight: 700;"><strong>وقت الكشف:</strong> الساعة ${apt.timeSlot}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #334155;"><strong>نوع الاستشارة:</strong> ${apt.consultationType === 'in_clinic' ? 'كشف حضوري بالعيادة' : 'استشارة مرئية عن بُعد'}</p>
                <p style="margin: 0; font-size: 14px; color: #334155;"><strong>سبب الزيارة:</strong> ${apt.reason || 'كشف طبي دوري واستشارة'}</p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 13px; color: #64748b;">
                <strong>إرشادات ما قبل الحضور:</strong>
                <ul style="margin: 6px 0 0 0; padding-right: 18px; line-height: 1.6;">
                  <li>نرجو الحضور قبل الموعد بـ 10 دقائق لتجنب أي تأخير وضمان سلاسة الكشف.</li>
                  <li>يرجى إحضار أي تحاليل أو أدوية حالية تتناولونها.</li>
                  <li>في حال الرغبة في تأجيل أو تعديل الموعد، نرجو إبلاغنا مسبقاً عبر المنصة.</li>
                </ul>
              </div>
            </div>
            <div style="background-color: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              مركز صِحّة كير الطبي | نظام التذكير الذكي التلقائي · طوارئ: ${clinicSettings.emergencyPhone}
            </div>
          </div>
        `;

        newNotifications.push({
          id: generateEmailId(),
          recipientEmail: apt.patientEmail,
          recipientName: apt.patientName,
          recipientRole: 'patient',
          subject: `تذكير بموعد زيارتكم الطبي القادم (#${apt.id}) مع ${apt.doctorName}`,
          type: 'appointment_reminder',
          sentAt: new Date().toISOString(),
          status: 'delivered',
          appointmentId: apt.id,
          patientId: apt.patientId,
          doctorName: apt.doctorName,
          htmlContent: reminderHtml
        });
      }
    });

    if (newNotifications.length > 0) {
      setEmailNotifications(prev => [...newNotifications, ...prev]);
      addAuditLog({
        action: 'update_staff',
        actorName: 'نظام التنبيهات الآلية',
        details: `تم إرسال ${newNotifications.length} إشعار بريدي تلقائي بنجاح لتذكير المرضى بقرب موعد الزيارة`,
        ipAddress: '192.168.1.1 (آلي)',
        severity: 'info'
      });
    }

    return {
      sentCount,
      upcomingCount: upcomingConfirmedApts.length,
      newlyNotifiedPatientNames
    };
  };

  // Run automated upcoming visit check on initial load & state change
  useEffect(() => {
    const timer = setTimeout(() => {
      autoDispatchUpcomingReminders();
    }, 1500);
    return () => clearTimeout(timer);
  }, [appointments.length]);

  // 2. Update Appointment Status with Automated Notification Integration
  const updateAppointmentStatus = (
    appointmentId: string, 
    status: AppointmentStatus, 
    reason?: string
  ) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          status,
          cancellationReason: reason || apt.cancellationReason
        };
      }
      return apt;
    }));

    // Trigger automated email when confirmed
    if (status === 'confirmed') {
      setTimeout(() => {
        sendAppointmentConfirmationEmail(appointmentId);
      }, 50);
    }

    // Trigger email if cancelled
    const apt = appointments.find(a => a.id === appointmentId);
    if (apt && status === 'cancelled') {
      const cancelEmailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #dc2626; color: #ffffff; padding: 24px; text-align: center;">
            <h2 style="margin: 0 0 6px 0; font-size: 20px;">إشعار إلغاء الموعد الطبي</h2>
            <p style="margin: 0; font-size: 14px; opacity: 0.95;">رقم الموعد #${apt.id}</p>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <p style="font-size: 15px; margin: 0 0 14px 0;">عزيزنا المريض <strong>${apt.patientName}</strong>،</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 16px 0;">
              نحيطك علماً بأنه قد تم إلغاء موعدك الطبي المجدول مع <strong>${apt.doctorName}</strong> بتاريخ <strong>${apt.date}</strong> الساعة <strong>${apt.timeSlot}</strong>.
            </p>
            ${reason ? `
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 14px; color: #991b1b;">
                <strong>سبب الإلغاء:</strong> ${reason}
              </div>
            ` : ''}
            <p style="font-size: 13px; color: #64748b; margin: 0 0 12px 0;">
              إذا تم الدفع مسبقاً، ستتم استعادة المبلغ إلى حسابك خلال 24 ساعة، أو يمكنك اختيار موعد جديد يناسبك مباشرة عبر المنصة.
            </p>
          </div>
        </div>
      `;

      const emailNote: EmailNotification = {
        id: generateEmailId(),
        recipientEmail: apt.patientEmail,
        recipientName: apt.patientName,
        recipientRole: 'patient',
        subject: `إشعار بإلغاء موعدك الطبي (#${apt.id}) في صِحّة كير`,
        type: 'appointment_cancelled',
        sentAt: new Date().toISOString(),
        status: 'delivered',
        appointmentId: apt.id,
        patientId: apt.patientId,
        doctorName: apt.doctorName,
        htmlContent: cancelEmailHtml
      };

      setEmailNotifications(prev => [emailNote, ...prev]);
    }
  };

  // Edit Everything CRUD Handlers
  const editDoctor = (doctorId: string, updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, ...updates } : d));
    addAuditLog({
      action: 'update_staff',
      actorName: currentUser?.name || 'مدير المنظومة',
      targetName: updates.name || doctorId,
      details: `تم تعديل وتحديث بيانات الطبيب (${updates.name || doctorId})`,
      ipAddress: '192.168.1.1',
      severity: 'info'
    });
  };

  const addDoctor = (doctorData: Doctor) => {
    setDoctors(prev => [doctorData, ...prev]);
    addAuditLog({
      action: 'update_staff',
      actorName: currentUser?.name || 'مدير المنظومة',
      targetName: doctorData.name,
      details: `إضافة طبيب جديد للمنظومة (${doctorData.name} - ${doctorData.specialty})`,
      ipAddress: '192.168.1.1',
      severity: 'info'
    });
  };

  const deleteDoctor = (doctorId: string) => {
    const doc = doctors.find(d => d.id === doctorId);
    setDoctors(prev => prev.filter(d => d.id !== doctorId));
    addAuditLog({
      action: 'update_staff',
      actorName: currentUser?.name || 'مدير المنظومة',
      targetName: doc?.name || doctorId,
      details: `حذف حساب الطبيب (${doc?.name || doctorId}) من المنظومة`,
      ipAddress: '192.168.1.1',
      severity: 'warning'
    });
  };

  const editPatient = (patientId: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, ...updates } : p));
    addAuditLog({
      action: 'update_staff',
      actorName: currentUser?.name || 'الكادر الطبي',
      targetName: updates.name || patientId,
      details: `تم تعديل وتحديث بيانات المريض (${updates.name || patientId})`,
      ipAddress: '192.168.1.1',
      severity: 'info'
    });
  };

  const editAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        const updated = { ...apt, ...updates };
        if (updates.status === 'confirmed' && apt.status !== 'confirmed') {
          setTimeout(() => sendAppointmentConfirmationEmail(appointmentId), 50);
        }
        return updated;
      }
      return apt;
    }));

    addAuditLog({
      action: 'update_staff',
      actorName: currentUser?.name || 'مشرف المواعيد',
      targetName: `موعد #${appointmentId}`,
      details: `تحديث وتعديل تفاصيل الموعد #${appointmentId}`,
      ipAddress: '192.168.1.1',
      severity: 'info'
    });
  };

  // 3. Reschedule Appointment
  const rescheduleAppointment = (
    appointmentId: string, 
    newDate: string, 
    newTimeSlot: string
  ) => {
    let updatedApt: Appointment | undefined;

    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        updatedApt = {
          ...apt,
          date: newDate,
          timeSlot: newTimeSlot,
          status: 'rescheduled'
        };
        return updatedApt;
      }
      return apt;
    }));

    if (updatedApt) {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #fed7aa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: #ffffff; padding: 24px; text-align: center;">
            <h2 style="margin: 0 0 6px 0; font-size: 22px;">تم تعديل موعدك الطبي بنجاح</h2>
            <p style="margin: 0; font-size: 14px; opacity: 0.95;">تحديث التوقيت - صِحّة كير</p>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <p style="font-size: 15px; margin: 0 0 14px 0;">مرحباً <strong>${updatedApt.patientName}</strong>،</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 16px 0;">
              تم تحديث موعدك الطبي مع <strong>${updatedApt.doctorName}</strong>. إليك تفاصيل الموعد الجديد:
            </p>
            <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>رقم الموعد:</strong> #${updatedApt.id}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #c2410c;"><strong>الموعد الجديد:</strong> ${newDate} - الساعة ${newTimeSlot}</p>
              <p style="margin: 0; font-size: 14px;"><strong>نوع الزيارة:</strong> ${updatedApt.consultationType === 'in_clinic' ? 'كشف حضوري بالعيادة' : 'استشارة مرئية'}</p>
            </div>
            <p style="font-size: 13px; color: #64748b; margin: 0;">نتطلع لاستقبالكم في الموعد الجديد ونتمنى لكم دوام الصحة والعافية.</p>
          </div>
        </div>
      `;

      const rescheduleEmail: EmailNotification = {
        id: generateEmailId(),
        recipientEmail: updatedApt.patientEmail,
        recipientName: updatedApt.patientName,
        recipientRole: 'patient',
        subject: `تحديث موعدك الطبي (#${updatedApt.id}) إلى ${newDate} الساعة ${newTimeSlot}`,
        type: 'appointment_rescheduled',
        sentAt: new Date().toISOString(),
        status: 'delivered',
        appointmentId: updatedApt.id,
        patientId: updatedApt.patientId,
        doctorName: updatedApt.doctorName,
        htmlContent: emailHtml
      };

      setEmailNotifications(prev => [rescheduleEmail, ...prev]);
    }
  };

  // 4. Add Medical Record / EMR Consultation
  const addMedicalRecord = (data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    chiefComplaint: string;
    diagnosis: string;
    clinicalNotes: string;
    vitals?: Vitals;
    prescriptions: PrescriptionItem[];
    labResults?: LabResult[];
    recommendedFollowUpDate?: string;
    sendEmailToPatient?: boolean;
  }): MedicalRecord => {
    const doctor = doctors.find(d => d.id === data.doctorId) || doctors[0];
    const patient = patients.find(p => p.id === data.patientId) || patients[0];
    const recordId = generateRecordId();

    const newRecord: MedicalRecord = {
      id: recordId,
      patientId: data.patientId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      appointmentId: data.appointmentId,
      date: new Date().toISOString().split('T')[0],
      visitType: 'in_clinic',
      chiefComplaint: data.chiefComplaint,
      diagnosis: data.diagnosis,
      clinicalNotes: data.clinicalNotes,
      vitals: data.vitals,
      prescriptions: data.prescriptions,
      labResults: data.labResults,
      recommendedFollowUpDate: data.recommendedFollowUpDate,
      attachments: [
        {
          name: `Medical_Consultation_${recordId}.pdf`,
          size: '1.2 ميجابايت',
          type: 'application/pdf'
        }
      ]
    };

    setMedicalRecords(prev => [newRecord, ...prev]);

    // If appointment ID was provided, mark appointment completed and link record
    if (data.appointmentId) {
      setAppointments(prev => prev.map(apt => {
        if (apt.id === data.appointmentId) {
          return {
            ...apt,
            status: 'completed',
            medicalRecordId: recordId
          };
        }
        return apt;
      }));
    }

    // Send email to patient with prescription & visit summary if requested
    if (data.sendEmailToPatient !== false) {
      const prescriptionRows = data.prescriptions.map((rx, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-weight: 600; color: #0f172a;">${idx + 1}. ${rx.medicationName}</td>
          <td style="padding: 10px; color: #475569;">${rx.dosage} (${rx.frequency})</td>
          <td style="padding: 10px; color: #475569;">${rx.duration}</td>
          <td style="padding: 10px; color: #64748b; font-size: 13px;">${rx.instructions}</td>
        </tr>
      `).join('');

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #115e59 100%); color: #ffffff; padding: 24px; text-align: center;">
            <h2 style="margin: 0 0 6px 0; font-size: 22px;">تقرير الزيارة الطبية والوصفة الإلكترونية</h2>
            <p style="margin: 0; font-size: 14px; opacity: 0.95;">رقم الملف الطبي: #${recordId} | صِحّة كير</p>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <p style="font-size: 15px; margin: 0 0 14px 0;">مرحباً <strong>${patient.name}</strong>،</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 18px 0;">
              نشكرك على زيارتك لعيادة <strong>${doctor.name}</strong> (${doctor.specialty}). تم إعداد ملخص الزيارة والوصفة الطبية المعتمدة بنجاح.
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>التشخيص الطبي المعتمد:</strong> <span style="color: #0f766e; font-weight: 600;">${data.diagnosis}</span></p>
              ${data.clinicalNotes ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;"><strong>تعليمات الطبيب:</strong> ${data.clinicalNotes}</p>` : ''}
              ${data.recommendedFollowUpDate ? `<p style="margin: 0; font-size: 14px; color: #c2410c;"><strong>المراجعة المقترحة:</strong> ${data.recommendedFollowUpDate}</p>` : ''}
            </div>

            ${data.prescriptions.length > 0 ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 16px; margin: 0 0 12px 0; color: #0f172a; border-bottom: 2px solid #0d9488; padding-bottom: 6px;">الوصفة الطبية المعتمدة (Rx):</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: right;">
                  <thead>
                    <tr style="background-color: #f1f5f9; color: #475569;">
                      <th style="padding: 8px 10px;">الدواء</th>
                      <th style="padding: 8px 10px;">الجرعة والتكرار</th>
                      <th style="padding: 8px 10px;">المدة</th>
                      <th style="padding: 8px 10px;">تعليمات الاستخدام</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${prescriptionRows}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">
              يمكنك استعراض التقرير الكامل وتنزيل نسخة PDF من سجل ملفاتك الطبية في منصة صِحّة كير في أي وقت.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">هذه الوصفة الطبية صادرة ومعتمدة إلكترونياً من الطبيب المرخص</p>
          </div>
        </div>
      `;

      const reportEmail: EmailNotification = {
        id: generateEmailId(),
        recipientEmail: patient.email,
        recipientName: patient.name,
        recipientRole: 'patient',
        subject: `تقرير الزيارة والوصفة الطبية المعتمدة من ${doctor.name} (#${recordId})`,
        type: 'prescription_ready',
        sentAt: new Date().toISOString(),
        status: 'delivered',
        patientId: patient.id,
        doctorName: doctor.name,
        htmlContent: emailHtml
      };

      setEmailNotifications(prev => [reportEmail, ...prev]);
    }

    return newRecord;
  };

  // 5. Send Custom Email
  const sendCustomEmail = (
    recipientEmail: string,
    recipientName: string,
    subject: string,
    bodyHtml: string,
    type: EmailType,
    doctorName: string = 'د. أحمد المنصوري',
    appointmentId?: string
  ) => {
    const emailNote: EmailNotification = {
      id: generateEmailId(),
      recipientEmail,
      recipientName,
      recipientRole: 'patient',
      subject,
      type,
      sentAt: new Date().toISOString(),
      status: 'delivered',
      doctorName,
      appointmentId,
      htmlContent: bodyHtml
    };

    setEmailNotifications(prev => [emailNote, ...prev]);
  };

  // 6. Send Appointment Reminder
  const sendAppointmentReminder = (appointmentId: string) => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return;

    const reminderHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #0369a1 100%); color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0 0 6px 0; font-size: 22px;">تذكير بموعدك الطبي القادم</h2>
          <p style="margin: 0; font-size: 14px; opacity: 0.95;">رقم الموعد #${apt.id} - صِحّة كير</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 15px; margin: 0 0 14px 0;">مرحباً <strong>${apt.patientName}</strong>،</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 20px 0;">
            نود تذكيرك بموعدك الطبي القادم مع <strong>${apt.doctorName}</strong> (${apt.doctorSpecialty}).
          </p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>التاريخ:</strong> ${apt.date}</p>
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #15803d; font-weight: 700;"><strong>الوقت المحدد:</strong> ${apt.timeSlot}</p>
            <p style="margin: 0; font-size: 14px;"><strong>النوع:</strong> ${apt.consultationType === 'in_clinic' ? 'حضور شخصي في العيادة' : 'استشارة مرئية عن بُعد'}</p>
          </div>
          <p style="font-size: 13px; color: #64748b; margin: 0;">يرجى الوصول قبل 10 دقائق لتجنب أي تأخير. نتمنى لكم وافر الصحة والعافية.</p>
        </div>
      </div>
    `;

    const reminderEmail: EmailNotification = {
      id: generateEmailId(),
      recipientEmail: apt.patientEmail,
      recipientName: apt.patientName,
      recipientRole: 'patient',
      subject: `تذكير بموعدك الطبي (#${apt.id}) غداً مع ${apt.doctorName}`,
      type: 'appointment_reminder',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      appointmentId: apt.id,
      patientId: apt.patientId,
      doctorName: apt.doctorName,
      htmlContent: reminderHtml
    };

    setEmailNotifications(prev => [reminderEmail, ...prev]);
  };

  // 7. Mark Email as Opened
  const markEmailAsOpened = (emailId: string) => {
    setEmailNotifications(prev => prev.map(em => {
      if (em.id === emailId) {
        return { ...em, status: 'opened' };
      }
      return em;
    }));
  };

  // 8. Delete Email
  const deleteEmailNotification = (emailId: string) => {
    setEmailNotifications(prev => prev.filter(em => em.id !== emailId));
  };

  // 9. Update Doctor Schedule
  const updateDoctorSchedule = (
    doctorId: string, 
    workingHours: { start: string; end: string }, 
    slotDurationMinutes: number,
    availableDays: string[]
  ) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        return {
          ...d,
          workingHours,
          slotDurationMinutes,
          availableDays
        };
      }
      return d;
    }));
  };

  // 10. Reset Data
  const resetToDefaultData = () => {
    localStorage.clear();
    setDoctors(INITIAL_DOCTORS);
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setMedicalRecords(INITIAL_MEDICAL_RECORDS);
    setEmailNotifications(INITIAL_EMAIL_NOTIFICATIONS);
    setRole('patient');
    setSelectedDoctorId('doc-1');
    setActivePatientId('pat-1');
    setStaffMembers(INITIAL_STAFF);
    setSecurityAuditLogs(INITIAL_AUDIT_LOGS);
    setIsAdminUnlocked(false);
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      role,
      setRole,
      doctors,
      patients,
      appointments,
      medicalRecords,
      emailNotifications,
      staffMembers,
      securityAuditLogs,
      clinicSettings,
      updateClinicSettings,
      selectedDoctorId,
      setSelectedDoctorId,
      activePatientId,
      setActivePatientId,
      unreadEmailCount,
      currentUser,
      isStaffAuthenticated,
      loginStaff,
      logoutStaff,
      quickLoginAsAdmin,
      quickLoginAsDoctor,
      isAdminUnlocked,
      unlockAdminPanel,
      lockAdminPanel,
      addAuditLog,
      addStaffMember,
      updateStaffMember,
      deleteStaffMember,
      toggleStaffTwoFactor,
      changeStaffStatus,
      editDoctor,
      addDoctor,
      deleteDoctor,
      editPatient,
      editAppointment,
      sendAppointmentConfirmationEmail,
      autoDispatchUpcomingReminders,
      bookAppointment,
      updateAppointmentStatus,
      rescheduleAppointment,
      addMedicalRecord,
      sendCustomEmail,
      sendAppointmentReminder,
      markEmailAsOpened,
      deleteEmailNotification,
      updateDoctorSchedule,
      resetToDefaultData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
