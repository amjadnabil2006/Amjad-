import { Doctor, Patient, Appointment, MedicalRecord, EmailNotification, StaffMember, SecurityAuditLog, ClinicSettings } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'د. أحمد المنصوري',
    title: 'استشاري أمراض القلب والأوعية الدموية والقسطرة التداخلية',
    specialty: 'أمراض القلب',
    subSpecialty: 'القسطرة العلاجية واعتلال صمامات القلب',
    avatar: '/src/assets/images/doctor_ahmed_cardiologist_1790397170312.jpg',
    rating: 4.9,
    reviewsCount: 148,
    experienceYears: 16,
    clinicName: 'مركز صِحّة كير التخصصي - عيادة القلب (مبنى أ - الدور 3)',
    clinicAddress: 'شارع الملك فهد، حي الصحافة، الرياض',
    consultationFee: 350,
    availableDays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
    slotDurationMinutes: 30,
    bio: 'استشاري حاصل على البورد الألماني والزمالة الكندية في أمراض القلب وتصوير الشرايين التاجية، عضو الجمعية الأوروبية لأمراض القلب، خبير في علاج ارتفاع ضغط الدم وقصور الشرايين.',
    education: [
      'البورد الألماني في أمراض القلب والأوعية الدموية - ميونيخ',
      'زمالة القسطرة التداخلية - جامعة تورنتو، كندا',
      'بكالوريوس الطب والجراحة - جامعة الملك سعود'
    ],
    languages: ['العربية', 'الإنجليزية', 'الألمانية'],
    phone: '+966 11 482 9100',
    email: 'dr.ahmed.almansoori@sehacare.med'
  },
  {
    id: 'doc-2',
    name: 'د. سارة الهاشمي',
    title: 'استشارية طب الأطفال وحديثي الولادة والنمو والتغذية',
    specialty: 'طب الأطفال',
    subSpecialty: 'حساسية الصدر ومتابعة نمو الخدج وحديثي الولادة',
    avatar: '/src/assets/images/doctor_sara_pediatrician_1790397182774.jpg',
    rating: 4.95,
    reviewsCount: 215,
    experienceYears: 12,
    clinicName: 'مركز صِحّة كير - عيادة الطفولة والأمومة (مبنى ب - الدور 1)',
    clinicAddress: 'طريق التخصصي، حي المعذر، الرياض',
    consultationFee: 280,
    availableDays: ['السبت', 'الأحد', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    workingHours: {
      start: '10:00',
      end: '18:00',
    },
    slotDurationMinutes: 30,
    bio: 'استشارية رعاية صحة الطفل ومتابعة مراحل النمو والتطعيمات، حاصلة على الزمالة الملكية البريطانية لطب الأطفال، متخصصة في أمراض الجهاز التنفسي والربو وحساسية الطعام لدى الأطفال.',
    education: [
      'عضوية الكلية الملكية لطب الأطفال وصحة الطفل (MRCPCH) - لندن',
      'دبلوم متقدم في تغذية الرضع والنمو - جامعة هارفارد (تعليم مستمر)',
      'بكالوريوس الطب والجراحة - جامعة الملك عبد العزيز'
    ],
    languages: ['العربية', 'الإنجليزية'],
    phone: '+966 11 482 9102',
    email: 'dr.sara.alhashimi@sehacare.med'
  },
  {
    id: 'doc-3',
    name: 'د. خالد العمري',
    title: 'استشاري المخ والأعصاب وعلاج الصداع المزمن والاضطرابات الحركية',
    specialty: 'المخ والأعصاب',
    subSpecialty: 'التخطيط الكهربائي للدماغ وأمراض الأعصاب الطرفية',
    avatar: '/src/assets/images/doctor_khalid_neurologist_1790397196106.jpg',
    rating: 4.88,
    reviewsCount: 132,
    experienceYears: 18,
    clinicName: 'مركز صِحّة كير - قسم العلوم العصبية (مبنى أ - الدور 4)',
    clinicAddress: 'شارع الملك فهد، الرياض',
    consultationFee: 400,
    availableDays: ['الأحد', 'الإثنين', 'الأربعاء', 'الخميس'],
    workingHours: {
      start: '13:00',
      end: '20:00',
    },
    slotDurationMinutes: 40,
    bio: 'استشاري متخصص في تشخيص وعلاج الصداع النصفي المزمن، التصلب المتعدد، الصرع، والاعتلال العصبي السكري. رئيس وحدة تخطيط الدماغ والأعصاب سابقاً.',
    education: [
      'البورد الأمريكي في طب الأعصاب السريري',
      'زمالة التخطيط الكهربائي والصرع - مستشفى كليفلاند كلينك',
      'بكالوريوس الطب والجراحة مع مرتبة الشرف الأولى'
    ],
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    phone: '+966 11 482 9103',
    email: 'dr.khalid.alomari@sehacare.med'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'عبدالله محمد السالم',
    nationalId: '1098234120',
    phone: '0501234567',
    email: 'abdullah.salem@example.com',
    gender: 'male',
    dateOfBirth: '1984-06-15',
    bloodType: 'O+',
    allergies: ['البنسلين (Penicillin)', 'المكسرات'],
    chronicDiseases: ['ارتفاع ضغط الدم (Hypertension)'],
    emergencyContact: {
      name: 'فهد محمد السالم (أخ)',
      relationship: 'أخ',
      phone: '0507654321'
    }
  },
  {
    id: 'pat-2',
    name: 'نورة بنت عبدالعزيز التميمي',
    nationalId: '1087452391',
    phone: '0559876543',
    email: 'noura.tamimi@example.com',
    gender: 'female',
    dateOfBirth: '1992-11-04',
    bloodType: 'A+',
    allergies: ['لا توجد حساسية دوائية معروفة'],
    chronicDiseases: ['الصداع النصفي (Migraine)'],
    emergencyContact: {
      name: 'عبدالعزيز التميمي (والد)',
      relationship: 'أب',
      phone: '0551122334'
    }
  },
  {
    id: 'pat-3',
    name: 'ريان طارق الخالدي',
    nationalId: '1129038472',
    phone: '0543322110',
    email: 'tariq.khaldi@example.com',
    gender: 'male',
    dateOfBirth: '2019-03-22',
    bloodType: 'B+',
    allergies: ['حساسية ضد البيض والأسماك'],
    chronicDiseases: ['ربو أطفال خفيف'],
    emergencyContact: {
      name: 'طارق الخالدي (الأب)',
      relationship: 'أب',
      phone: '0543322110'
    }
  },
  {
    id: 'pat-4',
    name: 'مها سليمان العتيبي',
    nationalId: '1063948172',
    phone: '0562211998',
    email: 'maha.otaibi@example.com',
    gender: 'female',
    dateOfBirth: '1978-08-30',
    bloodType: 'AB+',
    allergies: ['الأسبرين (Aspirin)'],
    chronicDiseases: ['السكري من النوع الثاني', 'فرط دهون الدم'],
    emergencyContact: {
      name: 'سعود العتيبي (زوج)',
      relationship: 'زوج',
      phone: '0567788990'
    }
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1001',
    patientId: 'pat-1',
    patientName: 'عبدالله محمد السالم',
    patientPhone: '0501234567',
    patientEmail: 'abdullah.salem@example.com',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد المنصوري',
    doctorSpecialty: 'أمراض القلب',
    doctorAvatar: '/src/assets/images/doctor_ahmed_cardiologist_1790397170312.jpg',
    date: '2026-09-26',
    timeSlot: '09:30',
    consultationType: 'in_clinic',
    status: 'confirmed',
    reason: 'فحص دوري لضغط الدم ومراجعة نبضات القلب بعد مجهود خفيف',
    patientNotes: 'أشعر بضيق تنفس متقطع عند صعود الدرج في الأيام الأخيرة.',
    fee: 350,
    paid: true,
    createdAt: '2026-09-24T14:20:00Z',
    medicalRecordId: 'REC-201'
  },
  {
    id: 'APT-1002',
    patientId: 'pat-2',
    patientName: 'نورة بنت عبدالعزيز التميمي',
    patientPhone: '0559876543',
    patientEmail: 'noura.tamimi@example.com',
    doctorId: 'doc-3',
    doctorName: 'د. خالد العمري',
    doctorSpecialty: 'المخ والأعصاب',
    doctorAvatar: '/src/assets/images/doctor_khalid_neurologist_1790397196106.jpg',
    date: '2026-09-26',
    timeSlot: '14:00',
    consultationType: 'video_call',
    status: 'confirmed',
    reason: 'استشارة لمتابعة نوبات الصداع النصفي وتعديل جرعة الدواء الوقائي',
    patientNotes: 'نوبات الصداع تكررت 3 مرات هذا الأسبوع مصحوبة بحساسية للضوء.',
    fee: 400,
    paid: true,
    createdAt: '2026-09-23T11:15:00Z'
  },
  {
    id: 'APT-1003',
    patientId: 'pat-3',
    patientName: 'ريان طارق الخالدي',
    patientPhone: '0543322110',
    patientEmail: 'tariq.khaldi@example.com',
    doctorId: 'doc-2',
    doctorName: 'د. سارة الهاشمي',
    doctorSpecialty: 'طب الأطفال',
    doctorAvatar: '/src/assets/images/doctor_sara_pediatrician_1790397182774.jpg',
    date: '2026-09-26',
    timeSlot: '11:00',
    consultationType: 'in_clinic',
    status: 'in_progress',
    reason: 'سعال ليلي متكرر وصعوبة بالتنفس بعد نزلة برد',
    patientNotes: 'تم إعطاؤه بخاخ الفنتولين في المنزل ولكن التحسن طفيف.',
    fee: 280,
    paid: true,
    createdAt: '2026-09-25T08:00:00Z'
  },
  {
    id: 'APT-1004',
    patientId: 'pat-4',
    patientName: 'مها سليمان العتيبي',
    patientPhone: '0562211998',
    patientEmail: 'maha.otaibi@example.com',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد المنصوري',
    doctorSpecialty: 'أمراض القلب',
    doctorAvatar: '/src/assets/images/doctor_ahmed_cardiologist_1790397170312.jpg',
    date: '2026-09-27',
    timeSlot: '10:30',
    consultationType: 'in_clinic',
    status: 'pending',
    reason: 'تقييم تخطيط القلب ومستوى الدهون في الدم قبل إجراء جراحي بسيط',
    patientNotes: 'الرجاء الاطلاع على آخر فحص سكر تراكمي تم إجراؤه في المعمل.',
    fee: 350,
    paid: false,
    createdAt: '2026-09-25T19:40:00Z'
  },
  {
    id: 'APT-0995',
    patientId: 'pat-1',
    patientName: 'عبدالله محمد السالم',
    patientPhone: '0501234567',
    patientEmail: 'abdullah.salem@example.com',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد المنصوري',
    doctorSpecialty: 'أمراض القلب',
    doctorAvatar: '/src/assets/images/doctor_ahmed_cardiologist_1790397170312.jpg',
    date: '2026-09-12',
    timeSlot: '10:00',
    consultationType: 'in_clinic',
    status: 'completed',
    reason: 'فحص دوري وقراءة ضغط الدم',
    fee: 350,
    paid: true,
    createdAt: '2026-09-10T09:00:00Z',
    medicalRecordId: 'REC-195'
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'REC-201',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد المنصوري',
    doctorSpecialty: 'أمراض القلب',
    appointmentId: 'APT-0995',
    date: '2026-09-12',
    visitType: 'in_clinic',
    chiefComplaint: 'متابعة دورية لضغط الدم الشرياني ومراجعة فاعلية العلاج الحالي.',
    diagnosis: 'ارتفاع ضغط دم أولي مستقر تحت السيطرة الدوائية (Essential Hypertension)',
    clinicalNotes: 'المريض بحالة عامة جيدة، أصوات القلب طبيعية دون لغط، النبض منتظم. تم التأكيد على الاستمرار بنظام غذائي قليل الصوديوم وممارسة رياضة المشي المنتظم.',
    vitals: {
      bloodPressure: '128/82',
      heartRate: 74,
      temperature: 36.8,
      weight: 81.5,
      height: 177,
      oxygenSaturation: 99
    },
    prescriptions: [
      {
        id: 'rx-1',
        medicationName: 'كونكور (Concor 5mg - Bisoprolol)',
        dosage: '5 ملغ',
        frequency: 'حبة واحدة يومياً في الصباح',
        duration: 'شهر واحد (30 يوماً)',
        instructions: 'يؤخذ قبل الإفطار مع كوب ماء، لا تقم بقطع الدواء فجأة.'
      },
      {
        id: 'rx-2',
        medicationName: 'كوفيرسيل (Coversyl 5mg - Perindopril)',
        dosage: '5 ملغ',
        frequency: 'حبة واحدة يومياً بعد الغداء',
        duration: 'شهر واحد (30 يوماً)',
        instructions: 'مراقبة ضغط الدم مرتين أسبوعياً وتدوينه في السجل.'
      }
    ],
    labResults: [
      {
        id: 'lab-1',
        testName: 'فحص وظائف الكلى (Creatinine & Urea)',
        date: '2026-09-11',
        result: '0.9 mg/dL',
        normalRange: '0.7 - 1.3 mg/dL',
        status: 'normal',
        doctorNote: 'وظائف كلى ممتازة وطبيعية'
      },
      {
        id: 'lab-2',
        testName: 'فحص البوتاسيوم في الدم (Serum Potassium)',
        date: '2026-09-11',
        result: '4.4 mmol/L',
        normalRange: '3.5 - 5.1 mmol/L',
        status: 'normal',
        doctorNote: 'ضمن المعدل الطبيعي'
      }
    ],
    recommendedFollowUpDate: '2026-10-15',
    attachments: [
      { name: 'ECG_Report_12_09_2026.pdf', size: '1.4 ميجابايت', type: 'application/pdf' },
      { name: 'Blood_Test_Panel_092026.pdf', size: '840 كيلوبايت', type: 'application/pdf' }
    ]
  },
  {
    id: 'REC-195',
    patientId: 'pat-2',
    doctorId: 'doc-3',
    doctorName: 'د. خالد العمري',
    doctorSpecialty: 'المخ والأعصاب',
    appointmentId: 'APT-0980',
    date: '2026-08-20',
    visitType: 'in_clinic',
    chiefComplaint: 'صداع نصفي شقي حاد مصحوب بغثيان وعدم احتمال الأضواء الساطعة.',
    diagnosis: 'صداع نصفي متكرر مع هالة ضوئية (Migraine with aura)',
    clinicalNotes: 'الفحص العصبي السريري كامل وطبيعي بدون أي عجز بؤري. تم إعطاء خطة وقائية مع دواء إسعافي لبداية النوبة.',
    vitals: {
      bloodPressure: '115/75',
      heartRate: 68,
      temperature: 37.0,
      weight: 62.0,
      height: 164,
      oxygenSaturation: 98
    },
    prescriptions: [
      {
        id: 'rx-3',
        medicationName: 'زوميغ (Zomig 2.5mg - Zolmitriptan)',
        dosage: '2.5 ملغ',
        frequency: 'عند بداية نوبة الصداع فوراً',
        duration: 'عند اللزوم',
        instructions: 'لا تتجاوز حبتين في الـ 24 ساعة، مع شرب كميات وافرة من السوائل.'
      },
      {
        id: 'rx-4',
        medicationName: 'توباماكس (Topamax 25mg - Topiramate)',
        dosage: '25 ملغ',
        frequency: 'حبة واحدة قبل النوم كعلاج وقائي',
        duration: 'شهرين',
        instructions: 'يؤخذ مساءً بانتظام لتقليل تكرار النوبات.'
      }
    ],
    recommendedFollowUpDate: '2026-09-26'
  },
  {
    id: 'REC-190',
    patientId: 'pat-3',
    doctorId: 'doc-2',
    doctorName: 'د. سارة الهاشمي',
    doctorSpecialty: 'طب الأطفال',
    appointmentId: 'APT-0972',
    date: '2026-08-05',
    visitType: 'in_clinic',
    chiefComplaint: 'فحص نمو وتطعيمات سن 7 سنوات ومتابعة حساسية الصدر الموسمية.',
    diagnosis: 'التهاب قصبات تحسسي خفيف وحساسية أطعمة مراقبة',
    clinicalNotes: 'الوزن والطول ضمن المئينات الطبيعية لعمره (المئين 60). الرئتان صافيتان بدون وزيز أثناء الفحص. تم تجديد خطة العمل للربو.',
    vitals: {
      bloodPressure: '100/65',
      heartRate: 88,
      temperature: 36.9,
      weight: 23.4,
      height: 122,
      oxygenSaturation: 99
    },
    prescriptions: [
      {
        id: 'rx-5',
        medicationName: 'فينتولين بخاخ (Ventolin Evohaler)',
        dosage: 'بختان مع القمع المباعد (Spacer)',
        frequency: 'عند الشعور بالسعال أو ضيق التنفس',
        duration: 'عند اللزوم',
        instructions: 'غسل الفم بالماء بعد الاستخدام.'
      },
      {
        id: 'rx-6',
        medicationName: 'فليكسوتيد (Flixotide 50mcg)',
        dosage: 'بخة واحدة صباحاً ومساءً',
        frequency: 'مرتين يومياً بانتظام',
        duration: '4 أسابيع',
        instructions: 'العلاج الوقائي المنتظم لتحسين كفاءة التنفس.'
      }
    ]
  }
];

export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: 'em-101',
    recipientEmail: 'abdullah.salem@example.com',
    recipientName: 'عبدالله محمد السالم',
    recipientRole: 'patient',
    subject: 'تأكيد حجز موعدك الطبي - رقم الموعد #APT-1001 في صِحّة كير',
    type: 'appointment_confirmed',
    sentAt: '2026-09-24T14:21:05Z',
    status: 'opened',
    appointmentId: 'APT-1001',
    doctorName: 'د. أحمد المنصوري',
    htmlContent: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: #ffffff; padding: 28px 24px; text-align: center;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">صِحّة كير | SehaCare</h1>
          <p style="margin: 0; font-size: 15px; opacity: 0.95;">تأكيد حجز الموعد الطبي بنجاح</p>
        </div>
        <div style="padding: 28px 24px; background-color: #ffffff;">
          <p style="font-size: 16px; margin: 0 0 16px 0;">مرحباً <strong>عبدالله محمد السالم</strong>،</p>
          <p style="font-size: 14px; line-height: 1.7; color: #475569; margin: 0 0 20px 0;">
            تم تأكيد موعدك الطبي مع <strong>د. أحمد المنصوري</strong> (استشاري أمراض القلب والأوعية الدموية). نرجو التواجد قبل الموعد بـ 10 دقائق لإنهاء إجراءات الدخول.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 0 0 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 35%;">رقم الموعد:</td>
                <td style="padding: 8px 0; font-weight: 700; color: #0f172a; font-family: monospace;">#APT-1001</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">التاريخ والوقت:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #0d9488;">السبت 26 سبتمبر 2026 - الساعة 09:30 صباحاً</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">نوع الكشف:</td>
                <td style="padding: 8px 0; font-weight: 500; color: #1e293b;">كشف حضوري في العيادة</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">موقع العيادة:</td>
                <td style="padding: 8px 0; font-weight: 500; color: #1e293b;">مبنى أ - الدور 3، عيادات القلب، طريق الملك فهد، الرياض</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">قيمة الاستشارة:</td>
                <td style="padding: 8px 0; font-weight: 700; color: #059669;">350 ر.س (مدفوع إلكترونياً)</td>
              </tr>
            </table>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 18px;">
            <p style="font-size: 13px; color: #64748b; margin: 0 0 10px 0;"><strong>تعليمات هامة قبل الزيارة:</strong></p>
            <ul style="font-size: 13px; color: #64748b; margin: 0; padding-right: 20px; line-height: 1.6;">
              <li>إحضار الهوية الوطنية أو الإقامة.</li>
              <li>إحضار تقارير الفحوصات والتحاليل السابقة إن وجدت.</li>
              <li>في حال الرغبة في تعديل الموعد أو الإلغاء، يرجى القيام بذلك قبل 4 ساعات من الموعد عبر منصة صِحّة كير.</li>
            </ul>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 4px 0;">مركز صِحّة كير الطبي التخصصي | هاتف: 966114829100+</p>
          <p style="margin: 0;">هذه الرسالة آلية من نظام إدارة المواعيد والملفات الطبية</p>
        </div>
      </div>
    `
  },
  {
    id: 'em-102',
    recipientEmail: 'dr.ahmed.almansoori@sehacare.med',
    recipientName: 'د. أحمد المنصوري',
    recipientRole: 'doctor',
    subject: 'تنبيه حجز جديد في جدولك الطبي - المريض عبدالله محمد السالم (#APT-1001)',
    type: 'appointment_booked',
    sentAt: '2026-09-24T14:21:06Z',
    status: 'opened',
    appointmentId: 'APT-1001',
    doctorName: 'د. أحمد المنصوري',
    htmlContent: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0 0 6px 0; font-size: 20px;">بوابة الأطباء | لوحة التحكم الطبية</h2>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">إشعار حجز موعد جديد في جدولك</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 15px; margin: 0 0 16px 0;">دكتورنا العزيز <strong>د. أحمد المنصوري</strong>،</p>
          <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">تم إدراج موعد كشف جديد في جدولك الطبي ليوم <strong>السبت 26 سبتمبر 2026</strong> في تمام الساعة <strong>09:30 صباحاً</strong>.</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>اسم المريض:</strong> عبدالله محمد السالم (42 سنة)</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>سبب الزيارة:</strong> فحص دوري لضغط الدم ومراجعة نبضات القلب بعد مجهود خفيف</p>
            <p style="margin: 0; font-size: 14px; color: #b91c1c;"><strong>ملاحظات الحساسية:</strong> البنسلين (Penicillin)</p>
          </div>
          <p style="font-size: 13px; color: #64748b; margin: 0;">يمكنك الاطلاع على التاريخ الطبي السابق للمريض وفتح ملف الزيارة مباشرة من لوحة التحكم.</p>
        </div>
      </div>
    `
  },
  {
    id: 'em-103',
    recipientEmail: 'noura.tamimi@example.com',
    recipientName: 'نورة بنت عبدالعزيز التميمي',
    recipientRole: 'patient',
    subject: 'رابط الاستشارة المرئية عن بُعد - موعدك مع د. خالد العمري (#APT-1002)',
    type: 'appointment_reminder',
    sentAt: '2026-09-25T16:00:00Z',
    status: 'delivered',
    appointmentId: 'APT-1002',
    doctorName: 'د. خالد العمري',
    htmlContent: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0 0 6px 0; font-size: 22px;">تذكير بالموعد الطبي المرئي</h2>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">عيادة المخ والأعصاب الافتراضية</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="font-size: 15px; margin: 0 0 16px 0;">الأستاذة <strong>نورة التميمي</strong>،</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 20px 0;">
            نذكرك بموعد استشارتك المرئية المجدولة مع <strong>د. خالد العمري</strong> غداً السبت في تمام الساعة <strong>02:00 ظهراً</strong>.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px;">
              دخول غرفة الاستشارة المرئية الآمنة
            </a>
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6;">يرجى التأكد من استقرار الاتصال بالإنترنت واستخدام بيئة هادئة أثناء الاستشارة.</p>
        </div>
      </div>
    `
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-1',
    employeeCode: 'EMP-1001',
    name: 'د. طارق بن فهد السبيعي',
    nationalId: '1019283746',
    email: 'admin.tareq@sehacare.med',
    phone: '0505544332',
    role: 'super_admin',
    department: 'الإدارة الطبية العليا والتنفيذية',
    jobTitle: 'المدير التنفيذي والمشرف الأمني للمنظومة',
    status: 'active',
    joinedDate: '2024-01-10',
    twoFactorEnabled: true,
    securityLevel: 4,
    permissions: {
      canManageAppointments: true,
      canAccessMedicalRecords: true,
      canManageStaff: true,
      canIssuePrescriptions: true,
      canViewAuditLogs: true,
      canManageClinicSettings: true
    },
    lastLogin: '2026-09-25T20:15:00Z'
  },
  {
    id: 'stf-2',
    employeeCode: 'EMP-1002',
    name: 'د. أحمد المنصوري',
    nationalId: '1028374651',
    email: 'dr.ahmed.almansoori@sehacare.med',
    phone: '0501122334',
    role: 'doctor',
    department: 'عيادات القلب والأوعية الدموية',
    jobTitle: 'رئيس وحدة القلب واستشاري أول',
    status: 'active',
    joinedDate: '2024-03-01',
    twoFactorEnabled: true,
    securityLevel: 3,
    permissions: {
      canManageAppointments: true,
      canAccessMedicalRecords: true,
      canManageStaff: false,
      canIssuePrescriptions: true,
      canViewAuditLogs: false,
      canManageClinicSettings: false
    },
    lastLogin: '2026-09-25T19:40:00Z'
  },
  {
    id: 'stf-3',
    employeeCode: 'EMP-1003',
    name: 'د. سارة الهاشمي',
    nationalId: '1039485762',
    email: 'dr.sara.alhashimi@sehacare.med',
    phone: '0502233445',
    role: 'doctor',
    department: 'عيادات طب الأطفال وحديثي الولادة',
    jobTitle: 'استشارية طب الأطفال ورئيسة القسم',
    status: 'active',
    joinedDate: '2024-04-15',
    twoFactorEnabled: true,
    securityLevel: 3,
    permissions: {
      canManageAppointments: true,
      canAccessMedicalRecords: true,
      canManageStaff: false,
      canIssuePrescriptions: true,
      canViewAuditLogs: false,
      canManageClinicSettings: false
    },
    lastLogin: '2026-09-25T18:10:00Z'
  },
  {
    id: 'stf-4',
    employeeCode: 'EMP-1004',
    name: 'سلمان بن عبدالعزيز الحربي',
    nationalId: '1047586930',
    email: 'salman.harbi@sehacare.med',
    phone: '0503344556',
    role: 'receptionist',
    department: 'الاستقبال وخدمة العملاء',
    jobTitle: 'مشرف قسم الاستقبال وجدولة المواعيد',
    status: 'active',
    joinedDate: '2024-06-01',
    twoFactorEnabled: true,
    securityLevel: 2,
    permissions: {
      canManageAppointments: true,
      canAccessMedicalRecords: false,
      canManageStaff: false,
      canIssuePrescriptions: false,
      canViewAuditLogs: false,
      canManageClinicSettings: false
    },
    lastLogin: '2026-09-25T21:00:00Z'
  },
  {
    id: 'stf-5',
    employeeCode: 'EMP-1005',
    name: 'د. أروى سليمان المطيري',
    nationalId: '1058694021',
    email: 'arwa.mutairi@sehacare.med',
    phone: '0504455667',
    role: 'pharmacist',
    department: 'الصيدلية السريرية',
    jobTitle: 'صيدلانية سريرية أولى ومسؤولة الأدوية',
    status: 'active',
    joinedDate: '2024-07-20',
    twoFactorEnabled: false,
    securityLevel: 2,
    permissions: {
      canManageAppointments: false,
      canAccessMedicalRecords: true,
      canManageStaff: false,
      canIssuePrescriptions: false,
      canViewAuditLogs: false,
      canManageClinicSettings: false
    },
    lastLogin: '2026-09-24T16:30:00Z'
  },
  {
    id: 'stf-6',
    employeeCode: 'EMP-1006',
    name: 'بدر خالد الدوسري',
    nationalId: '1069705132',
    email: 'bader.dossary@sehacare.med',
    phone: '0505566778',
    role: 'lab_tech',
    department: 'المختبرات والتحاليل الطبية',
    jobTitle: 'فني تحاليل ومطابقة النتائج',
    status: 'active',
    joinedDate: '2024-09-10',
    twoFactorEnabled: true,
    securityLevel: 2,
    permissions: {
      canManageAppointments: false,
      canAccessMedicalRecords: true,
      canManageStaff: false,
      canIssuePrescriptions: false,
      canViewAuditLogs: false,
      canManageClinicSettings: false
    },
    lastLogin: '2026-09-25T11:20:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'sec-log-101',
    timestamp: '2026-09-25T20:15:10Z',
    action: 'auth_success',
    actorName: 'د. طارق السبيعي (المدير العام)',
    details: 'تسجيل دخول ناجح للوحة الإدارة الآمنة عبر التحقق الثنائي (2FA OTP)',
    ipAddress: '192.168.1.10 (عيادة الرياض)',
    severity: 'info'
  },
  {
    id: 'sec-log-102',
    timestamp: '2026-09-25T19:30:00Z',
    action: 'security_breach_prevented',
    actorName: 'نظام الحماية الآلية WAF',
    targetName: 'بوابة الموظفين',
    details: 'تم حظر محاولة تسجيل دخول مشبوهة بعد 3 محاولات خاطئة لرمز المرور',
    ipAddress: '185.220.101.5 (خادم غير مصرح به)',
    severity: 'critical'
  },
  {
    id: 'sec-log-103',
    timestamp: '2026-09-24T14:10:00Z',
    action: 'create_staff',
    actorName: 'د. طارق السبيعي',
    targetName: 'بدر خالد الدوسري',
    details: 'إضافة حساب موظف جديد وتعيين صلاحيات فني مختبر ومستوى أمان 2',
    ipAddress: '192.168.1.10',
    severity: 'info'
  },
  {
    id: 'sec-log-104',
    timestamp: '2026-09-23T11:00:00Z',
    action: 'toggle_2fa',
    actorName: 'سلمان الحربي',
    targetName: 'حساب سلمان الحربي',
    details: 'تفعيل مفتاح الحماية الثنائي 2FA لحساب موظف الاستقبال',
    ipAddress: '192.168.1.15',
    severity: 'info'
  }
];

export const INITIAL_CLINIC_SETTINGS: ClinicSettings = {
  clinicName: 'مجمع صِحّة كير الطبي التخصصي الاستشاري',
  emergencyPhone: '+966 11 482 9100',
  allowOnlineBooking: true,
  autoConfirmAppointments: true,
  appointmentLeadHours: 2,
  maxDailyAppointmentsPerDoctor: 16,
  enableEmailAlerts: true,
  enablePatientSmsAlerts: true,
  sessionTimeoutMinutes: 30,
  enforceTwoFactorForDoctors: true,
  emergencyLockdown: false,
};

