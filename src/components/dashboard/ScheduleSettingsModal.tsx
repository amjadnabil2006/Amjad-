import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor } from '../../types';
import { X, Clock, Calendar, Check, Save } from 'lucide-react';

interface ScheduleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export const ScheduleSettingsModal: React.FC<ScheduleSettingsModalProps> = ({ isOpen, onClose }) => {
  const { doctors, selectedDoctorId, updateDoctorSchedule } = useApp();

  const currentDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const [startTime, setStartTime] = useState(currentDoctor?.workingHours?.start || '09:00');
  const [endTime, setEndTime] = useState(currentDoctor?.workingHours?.end || '17:00');
  const [slotDuration, setSlotDuration] = useState<number>(currentDoctor?.slotDurationMinutes || 30);
  const [availableDays, setAvailableDays] = useState<string[]>(currentDoctor?.availableDays || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !currentDoctor) return null;

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(prev => prev.filter(d => d !== day));
    } else {
      setAvailableDays(prev => [...prev, day]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctorSchedule(
      currentDoctor.id,
      { start: startTime, end: endTime },
      slotDuration,
      availableDays
    );
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">إعدادات الدوام والمواعيد</h3>
              <p className="text-xs text-slate-500">{currentDoctor.name} ({currentDoctor.specialty})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* Working Hours */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">ساعات العمل اليومية في العيادة:</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">بداية الدوام:</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">نهاية الدوام:</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Slot Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">مدة الكشف لكل مريض (Slot Duration):</label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 20, 30, 45].map(duration => (
                <button
                  type="button"
                  key={duration}
                  onClick={() => setSlotDuration(duration)}
                  className={`py-2 px-3 rounded-lg border text-xs font-mono tabular-nums transition-all ${
                    slotDuration === duration
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold ring-1 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {duration} دقيقة
                </button>
              ))}
            </div>
          </div>

          {/* Available Working Days */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">أيام العمل المتاحة للحجز:</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ALL_DAYS.map(day => {
                const isSelected = availableDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                تم حفظ التعديلات بنجاح!
              </span>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ الجدول</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
