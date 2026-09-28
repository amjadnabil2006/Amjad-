import React, { useState } from 'react';
import { Doctor } from '../../types';
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Video, 
  Building2, 
  Calendar, 
  Check, 
  Languages,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-teal-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="p-6">
        
        {/* Top Doctor Profile */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {imageError ? (
              <div className="w-20 h-20 rounded-2xl bg-teal-100 text-teal-800 font-bold text-2xl flex items-center justify-center border border-teal-200">
                {doctor.name.slice(3, 5)}
              </div>
            ) : (
              <img
                src={doctor.avatar}
                alt={doctor.name}
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
            )}
            <div className="absolute -bottom-1 -left-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white" title="متاح للحجز اليوم">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-semibold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span className="font-mono tabular-nums">{doctor.rating}</span>
                <span className="text-[10px] text-slate-500 font-normal">({doctor.reviewsCount})</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-teal-700 mb-1">
              {doctor.specialty} {doctor.subSpecialty ? `· ${doctor.subSpecialty}` : ''}
            </p>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {doctor.title}
            </p>
          </div>
        </div>

        {/* Key Attributes list */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.clinicName}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-slate-500">{doctor.clinicAddress}</span>
          </div>

          <div className="flex items-center justify-between text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>خبرة {doctor.experienceYears} عاماً</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>وقت الكشف: {doctor.slotDurationMinutes} دقيقة</span>
            </div>
          </div>
        </div>

        {/* Expandable bio & education */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-3 animate-in fade-in duration-150">
            <div>
              <p className="font-semibold text-slate-800 mb-1">نبذة عن الطبيب:</p>
              <p className="text-slate-600 leading-relaxed text-[11px]">{doctor.bio}</p>
            </div>
            
            <div>
              <p className="font-semibold text-slate-800 mb-1">المؤهلات والشهادات:</p>
              <ul className="list-disc list-inside text-slate-500 space-y-0.5 text-[11px]">
                {doctor.education.map((edu, idx) => (
                  <li key={idx}>{edu}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <span>اللغات: {doctor.languages.join('، ')}</span>
            </div>
          </div>
        )}

      </div>

      {/* Footer bar */}
      <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 block">قيمة الكشف:</span>
          <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
            {doctor.consultationFee} <span className="text-xs font-normal text-slate-500">ر.س</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>{showDetails ? 'أقل' : 'التفاصيل'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onBook(doctor)}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>احجز الآن</span>
          </button>
        </div>
      </div>

    </div>
  );
};
