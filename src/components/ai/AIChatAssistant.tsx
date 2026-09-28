import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Calendar, 
  FileText, 
  LogIn, 
  ChevronDown, 
  User, 
  Trash2, 
  HelpCircle, 
  MessageSquare,
  Stethoscope,
  Clock,
  MapPin,
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionKey: 'open_booking' | 'view_doctors' | 'view_appointments' | 'open_login' | 'view_about';
  }[];
}

interface AIChatAssistantProps {
  onOpenBooking: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenLogin: () => void;
}

const SYSTEM_INSTRUCTION = `
أنت "المساعد الذكي لمنظومة صِحّة كير (SehaCare)"، خبير تقني ودليل إرشادي للمنصة الطبية.
مهمتك الأساسية هي إرشاد أي مريض أو زائر أو موظف لا يعرف كيفية استخدام الموقع أو حجز المواعيد.
معلومات المنظومة التي تعرفها بالكامل:
1. كيفية حجز موعد: يمكن للمريض اختيار الطبيب من قائمة الأطباء في الصفحة الرئيسية، ثم النقر على "حجز موعد فوري"، واختيار نوع الكشف (حضوري في العيادة، استشارة مرئية عن بعد، أو زيارة منزلية)، وتحديد التاريخ والوقت المناسبين، وتعبئة الاسم ورقم الجوال والبريد.
2. مواعيد المريض: يستطيع المريض الاطلاع على مواعيده وتأكيداتها وتنبيهاتها المرئية من تبويب "مواعيدي المحجوزة" في الأعلى.
3. التنبيهات المرئية الذكية: تظهر تلقائياً للمريض عند وجود موعد مؤكد قادم، مع إمكانية عرض تفاصيل الموعد أو إغلاقه.
4. الأطباء المتاحون: 
   - د. أحمد المنصوري (استشاري أمراض القلب وقسطرة الشرايين، كشف 250 ر.س).
   - د. سارة العتيبي (استشارية طب الأطفال ورعاية حديثي الولادة، كشف 200 ر.س).
   - د. خالد الدوسري (استشاري المخ والأعصاب وجراحة العمود الفقري، كشف 300 ر.س).
5. لوحة التحكم ودخول الموظفين: منطقة مخصصة ومحمية للكادر الطبي والإداري. يتم الدخول بالضغط على زر "دخول الموظفين" الصغير في الشريط العلوي، وتوفر لوحة تحكم كاملة تشمل: إدارة المواعيد اليومية، سجل الملفات الطبية الإلكترونية (EMR)، إدارة الموظفين (إضافة، تعديل، حذف، وضبط الصلاحيات)، مركز الرسائل والبريد، وجدول مواعيد الأطباء.
6. ساعات العمل: يومياً من الأحد إلى الخميس من 9:00 صباحاً حتى 9:00 مساءً، والجمعة للحالات الطارئة.
7. أسلوبك: ودود، راقٍ، مهني، مباشر، مكتوب بلغة عربية فصحى مشجعة وواضحة جداً وبنقاط مرقمة سهلة الفهم لمن لا يعرف التقنية.
`;

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome-1',
    sender: 'assistant',
    text: 'أهلاً بك في **صِحّة كير**! 👋 أنا مرشدك الذكي لمساعدتك في استخدام الموقع، حجز المواعيد، أو توجيهك للطبيب المناسب. كيف يمكنني خدمتك اليوم؟',
    timestamp: 'الآن',
    actions: [
      { label: '📅 كيف أحجز موعداً؟', actionKey: 'open_booking' },
      { label: '👨‍⚕️ استعراض الأطباء', actionKey: 'view_doctors' },
      { label: '🔐 دخول الموظفين', actionKey: 'open_login' },
    ]
  }
];

const SUGGESTIONS = [
  'كيف أحجز موعداً خطوة بخطوة؟',
  'أريد طبيب لألم الصدر والخفقان',
  'أين أجد مواعيدي المحجوزة؟',
  'كيف يدخل الموظف إلى لوحة التحكم؟',
  'ما هي أوقات دوام المركز الطبي؟',
  'أين توجد الملفات والتقارير الطبية؟'
];

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  onOpenBooking,
  onNavigateTab,
  onOpenLogin
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  const handleActionClick = (actionKey: 'open_booking' | 'view_doctors' | 'view_appointments' | 'open_login' | 'view_about') => {
    switch (actionKey) {
      case 'open_booking':
        onOpenBooking();
        break;
      case 'view_doctors':
        onNavigateTab('doctors');
        break;
      case 'view_appointments':
        onNavigateTab('patient-appointments');
        break;
      case 'open_login':
        onOpenLogin();
        break;
      case 'view_about':
        onNavigateTab('clinic-about');
        break;
    }
  };

  // Smart Local Fallback Response Engine
  const generateFallbackResponse = (query: string): { text: string; actions?: Message['actions'] } => {
    const q = query.toLowerCase();

    if (q.includes('حجز') || q.includes('احجز') || q.includes('موعد') || q.includes('خطوة')) {
      return {
        text: `لإتمام حجز موعد جديد بكل سهولة:\n\n1. اضغط على زر **«حجز موعد فوري»** أو اختر طبيباً من القائمة الرئيسية.\n2. حدد نوع الاستشارة (في العيادة، مرئية عن بعد، أو زيارة منزلية).\n3. اختر التاريخ والوقت المناسب لك.\n4. أدخل اسمك ورقم هاتفك وسيبعث لك النظام تأكيداً فورياً وإشعاراً بريدياً!`,
        actions: [
          { label: 'حجز موعد فوري الآن', actionKey: 'open_booking' },
          { label: 'عرض الأطباء', actionKey: 'view_doctors' }
        ]
      };
    }

    if (q.includes('قلب') || q.includes('صدر') || q.includes('ضغط') || q.includes('شرايين')) {
      return {
        text: `ننصحك بحجز استشارة لدى **د. أحمد المنصوري**، استشاري أمراض القلب وقسطرة الشرايين وضغط الدم (خبرة 15 عاماً). يمكنك الكشف في العيادة أو طلب استشارة عن بُعد.`,
        actions: [
          { label: 'حجز موعد مع د. أحمد', actionKey: 'open_booking' }
        ]
      };
    }

    if (q.includes('طفل') || q.includes('أطفال') || q.includes('حرارة') || q.includes('رضيع')) {
      return {
        text: `تخصص طب الأطفال متاح لدى **د. سارة العتيبي**، استشارية طب الأطفال ورعاية حديثي الولادة والمناعة السريرية (خبرة 11 عاماً). توفر العيادة بيئة مريحة للأطفال ومواعيد مرنة.`,
        actions: [
          { label: 'حجز موعد مع د. سارة', actionKey: 'open_booking' }
        ]
      };
    }

    if (q.includes('أعصاب') || q.includes('صداع') || q.includes('ظهر') || q.includes('عمود فقري') || q.includes('تنميل')) {
      return {
        text: `نوصي باستشارة **د. خالد الدوسري**، استشاري جراحة المخ والأعصاب والعمود الفقري والصداع النصفي المزمن (خبرة 18 عاماً).`,
        actions: [
          { label: 'حجز موعد مع د. خالد', actionKey: 'open_booking' }
        ]
      };
    }

    if (q.includes('دخول') || q.includes('موظف') || q.includes('لوحة التحكم') || q.includes('طبيب') || q.includes('ادارة')) {
      return {
        text: `لوحة التحكم مخصصة للأطباء والكوادر الإدارية:\n\n1. اضغط على زر **«دخول الموظفين»** في الشريط العلوي (تم تصغيره لسهولة التصفح).\n2. يمكنك تسجيل الدخول ببياناتك أو تجربة الحسابات السريعة (مدير النظام العام، طبيب استشاري، أو استقبال).\n3. بعد الدخول تفتح لك لوحة التحكم الكاملة لإضافة وحذف الموظفين، وضبط الصلاحيات، وإدارة المواعيد، والسجلات الطبية، والرسائل.`,
        actions: [
          { label: 'الانتقال إلى صفحة دخول الموظفين', actionKey: 'open_login' }
        ]
      };
    }

    if (q.includes('ملف') || q.includes('تقرير') || q.includes('وصفة') || q.includes('سجل')) {
      return {
        text: `حفاظاً على أقصى معايير الخصوصية والأمان الطبي، يتم حفظ وإدارة الملفات الطبية الإلكترونية (EMR) والوصفات الرسمية داخل **لوحة تحكم الكادر الطبي**، ويتم إرسال نسخة معتمدة إلى البريد الإلكتروني للمريض بعد انتهاء الكشف مباشرة.`,
        actions: [
          { label: 'دخول الكادر المصرح', actionKey: 'open_login' }
        ]
      };
    }

    if (q.includes('مواعيدي') || q.includes('الغاء') || q.includes('تعديل') || q.includes('تنبيه')) {
      return {
        text: `يمكنك استعراض كل مواعيدك المحجوزة السابقة والقادمة، وتأكيدها أو تعديلها من خلال تبويب **«مواعيدي المحجوزة»** في أعلى الصفحة. كما يُظهر لك النظام تنبيهاً ذكياً منبثقاً عند اقتراب موعدك القادم!`,
        actions: [
          { label: 'الانتقال إلى مواعيدي', actionKey: 'view_appointments' }
        ]
      };
    }

    if (q.includes('دوام') || q.includes('ساعات') || q.includes('وقت') || q.includes('موقع') || q.includes('عنوان')) {
      return {
        text: `مواعيد العمل في مجمع صِحّة كير الطبي:\n- **من الأحد إلى الخميس:** 9:00 صباحاً حتى 9:00 مساءً.\n- **الجمعة والسبت:** استشارات طارئة ومجدولة مسبقاً.\n- **الموقع:** حي العليا، طريق الملك فهد، الرياض.`,
        actions: [
          { label: 'عن المركز وساعات العمل', actionKey: 'view_about' }
        ]
      };
    }

    // Default general response
    return {
      text: `أنا هنا لإرشادك! يمكنك السؤال عن:\n- طريقة حجز موعد مع أي استشاري\n- الوصول إلى مواعيدك المحجوزة\n- التخصصات المتاحة وأسعار الكشف\n- دخول الموظفين وإدارة لوحة التحكم والملفات الطبية`,
      actions: [
        { label: 'حجز موعد فوري', actionKey: 'open_booking' },
        { label: 'دخول الموظفين', actionKey: 'open_login' }
      ]
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: query.trim(),
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          }
        });

        const replyText = response.text || '';
        if (replyText) {
          const assistantMessage: Message = {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: replyText,
            timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            actions: [
              { label: '📅 حجز موعد', actionKey: 'open_booking' },
              { label: '👨‍⚕️ الأطباء', actionKey: 'view_doctors' }
            ]
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }
      }

      // If no API key or empty response, use rich fallback
      setTimeout(() => {
        const fallback = generateFallbackResponse(query);
        const assistantMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: fallback.text,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          actions: fallback.actions
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 500);

    } catch (err) {
      console.warn('Gemini chat fallback engaged:', err);
      setTimeout(() => {
        const fallback = generateFallbackResponse(query);
        const assistantMessage: Message = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: fallback.text,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          actions: fallback.actions
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 400);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 start-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 border border-white/20 cursor-pointer"
            aria-label="فتح المرشد الذكي"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold block leading-tight">المرشد الذكي صِحّة كير</span>
              <span className="text-[10px] text-teal-100 block leading-tight">اسألني كيف تستخدم الموقع أو تحجز</span>
            </div>

            {unreadCount > 0 && (
              <span className="sm:hidden bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                1
              </span>
            )}
          </button>
        )}
      </div>

      {/* Expandable Chat Dialog */}
      {isOpen && (
        <div 
          className="fixed bottom-4 sm:bottom-6 start-4 sm:start-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/30 border border-teal-400/40 flex items-center justify-center shadow-inner">
                <Bot className="w-6 h-6 text-teal-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight">مرشد صِحّة كير الذكي</h3>
                  <span className="bg-teal-500/40 text-teal-100 text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-teal-400/30">
                    AI Guide
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-teal-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>متصل الآن لمساعدتك واستفساراتك</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages(INITIAL_MESSAGES)}
                title="مسح المحادثة والبدء من جديد"
                className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="تصغير النافذة"
                className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick FAQ Suggestion Bar */}
          <div className="bg-teal-50/70 dark:bg-slate-800/80 px-3 py-2 border-b border-teal-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-teal-800 dark:text-teal-300 font-bold shrink-0 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              مقترحات:
            </span>
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="shrink-0 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 px-2.5 py-1 rounded-full transition-colors font-medium whitespace-nowrap"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line font-normal">{msg.text}</p>
                  
                  {/* Action Buttons inside message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-1.5">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act.actionKey)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 rounded-lg text-[11px] font-bold transition-all active:scale-95 shadow-2xs"
                        >
                          <span>{act.label}</span>
                          <ExternalLink className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`text-[10px] block mt-1.5 ${
                    msg.sender === 'user' ? 'text-teal-200 text-left' : 'text-slate-400 text-left'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[11px] text-slate-500 mr-2">جاري صياغة الإجابة...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب استفسارك هنا (مثلاً: كيف أحجز مع طبيب القلب؟)..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-sm"
                aria-label="إرسال"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>مدعوم بتقنية الذكاء الاصطناعي لإرشاد الزوار والمرضى</span>
              <span className="font-mono">SehaCare AI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
