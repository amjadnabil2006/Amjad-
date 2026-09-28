export type Role = 'patient' | 'doctor' | 'admin';

export type StaffRole = 'super_admin' | 'doctor' | 'receptionist' | 'nurse' | 'pharmacist' | 'lab_tech';

export type StaffStatus = 'active' | 'inactive' | 'on_leave' | 'suspended';

export interface StaffPermissions {
  canManageAppointments: boolean;
  canAccessMedicalRecords: boolean;
  canManageStaff: boolean;
  canIssuePrescriptions: boolean;
  canViewAuditLogs: boolean;
  canManageClinicSettings: boolean;
  canAccessMessages?: boolean;
}

export interface ClinicSettings {
  clinicName: string;
  emergencyPhone: string;
  allowOnlineBooking: boolean;
  autoConfirmAppointments: boolean;
  appointmentLeadHours: number;
  maxDailyAppointmentsPerDoctor: number;
  enableEmailAlerts: boolean;
  enablePatientSmsAlerts: boolean;
  sessionTimeoutMinutes: number;
  enforceTwoFactorForDoctors: boolean;
  emergencyLockdown: boolean;
}

export interface StaffMember {
  id: string;
  employeeCode: string;
  name: string;
  nationalId: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: string;
  jobTitle: string;
  status: StaffStatus;
  avatar?: string;
  joinedDate: string;
  twoFactorEnabled: boolean;
  securityLevel: 1 | 2 | 3 | 4; // 4 = Super Admin, 1 = Reception
  permissions: StaffPermissions;
  lastLogin?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: 'create_staff' | 'update_staff' | 'delete_staff' | 'change_role' | 'auth_success' | 'auth_fail' | 'toggle_2fa' | 'security_breach_prevented';
  actorName: string;
  targetName?: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

export type ConsultationType = 'in_clinic' | 'video_call' | 'home_visit';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  subSpecialty?: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  clinicName: string;
  clinicAddress: string;
  consultationFee: number;
  availableDays: string[]; // e.g. ['Sunday', 'Monday', ...]
  workingHours: {
    start: string; // e.g. '09:00'
    end: string;   // e.g. '17:00'
  };
  slotDurationMinutes: number; // e.g. 30
  bio: string;
  education: string[];
  languages: string[];
  phone: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  nationalId?: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  chronicDiseases: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string; // e.g. "500 ملغ"
  frequency: string; // e.g. "3 مرات يومياً بعد الأكل"
  duration: string; // e.g. "7 أيام"
  instructions: string;
}

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  doctorNote?: string;
}

export interface Vitals {
  bloodPressure?: string; // e.g. "120/80"
  heartRate?: number; // e.g. 72
  temperature?: number; // e.g. 37.0
  weight?: number; // kg
  height?: number; // cm
  oxygenSaturation?: number; // %
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentId?: string;
  date: string;
  visitType: ConsultationType;
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes: string;
  vitals?: Vitals;
  prescriptions: PrescriptionItem[];
  labResults?: LabResult[];
  recommendedFollowUpDate?: string;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  consultationType: ConsultationType;
  status: AppointmentStatus;
  reason: string;
  patientNotes?: string;
  cancellationReason?: string;
  fee: number;
  paid: boolean;
  createdAt: string;
  medicalRecordId?: string;
}

export type EmailType = 
  | 'appointment_booked'
  | 'appointment_confirmed'
  | 'appointment_reminder'
  | 'appointment_rescheduled'
  | 'appointment_cancelled'
  | 'prescription_ready'
  | 'medical_report_ready';

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  recipientRole: 'patient' | 'doctor';
  subject: string;
  type: EmailType;
  sentAt: string;
  status: 'delivered' | 'opened' | 'pending';
  appointmentId?: string;
  patientId?: string;
  doctorName: string;
  htmlContent: string;
}
