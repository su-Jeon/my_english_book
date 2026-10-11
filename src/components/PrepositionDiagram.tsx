import React from 'react';
import { Preposition } from '../types/story';

interface PrepositionDiagramProps {
  preposition: Preposition;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Visual pedagogical pictogram demonstrating spatial relationships (in, on, under, behind, next to)
 * with a friendly box and soccer ball!
 */
export const PrepositionDiagram: React.FC<PrepositionDiagramProps> = ({
  preposition,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const dimensions = size === 'sm' ? { w: 32, h: 32 } : size === 'lg' ? { w: 64, h: 64 } : { w: 44, h: 44 };

  const renderSvg = () => {
    switch (preposition) {
      case 'in':
        return (
          <svg viewBox="0 0 60 60" className="w-full h-full">
            {/* Box Back */}
            <polygon points="12,24 24,14 48,14 36,24" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            <polygon points="48,14 48,38 36,48 36,24" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
            {/* Soccer Ball IN the box */}
            <circle cx="30" cy="30" r="10" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="30,26 33,29 32,33 28,33 27,29" fill="#1e293b" />
            {/* Box Front (Transparent front) */}
            <polygon points="12,24 36,24 36,48 12,48" fill="#38bdf8" opacity="0.4" stroke="#0284c7" strokeWidth="2" />
            <polygon points="12,24 24,14 36,14 24,24" fill="#7dd3fc" opacity="0.3" />
          </svg>
        );

      case 'on':
        return (
          <svg viewBox="0 0 60 60" className="w-full h-full">
            {/* Box */}
            <rect x="14" y="28" width="32" height="24" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            <line x1="14" y1="36" x2="46" y2="36" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Ball resting ON TOP of box */}
            <circle cx="30" cy="18" r="9" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="30,15 33,17 32,21 28,21 27,17" fill="#1e293b" />
            {/* Arrow pointing down to show "on" */}
            <path d="M 30 5 L 30 8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'under':
        return (
          <svg viewBox="0 0 60 60" className="w-full h-full">
            {/* Table or Box Top */}
            <rect x="10" y="16" width="40" height="10" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <rect x="14" y="26" width="4" height="24" fill="#92400e" />
            <rect x="42" y="26" width="4" height="24" fill="#92400e" />
            {/* Ball UNDER the table */}
            <circle cx="30" cy="38" r="9" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="30,35 33,37 32,41 28,41 27,37" fill="#1e293b" />
            {/* Soft Shadow */}
            <ellipse cx="30" cy="48" rx="8" ry="2" fill="#1e293b" opacity="0.2" />
          </svg>
        );

      case 'behind':
        return (
          <svg viewBox="0 0 60 60" className="w-full h-full">
            {/* Ball BEHIND the box peeking */}
            <circle cx="38" cy="22" r="10" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="38,19 41,21 40,25 36,25 35,21" fill="#1e293b" />
            {/* Box in Front */}
            <rect x="12" y="24" width="30" height="26" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            {/* Peeking eyes on ball */}
            <circle cx="35" cy="20" r="1.5" fill="#1e293b" />
            <circle cx="41" cy="20" r="1.5" fill="#1e293b" />
          </svg>
        );

      case 'next to':
        return (
          <svg viewBox="0 0 60 60" className="w-full h-full">
            {/* Box */}
            <rect x="10" y="20" width="22" height="28" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            {/* Ball NEXT TO the box */}
            <circle cx="44" cy="34" r="9" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="44,31 47,33 46,37 42,37 41,33" fill="#1e293b" />
            {/* Double-sided arrow showing adjacency */}
            <line x1="33" y1="34" x2="35" y2="34" stroke="#0284c7" strokeWidth="2" strokeDasharray="1 1" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        style={{ width: dimensions.w, height: dimensions.h }}
        className="bg-amber-50 rounded-lg p-0.5 border border-amber-200/90 shadow-2xs shrink-0 flex items-center justify-center"
        title={`Spatial Diagram: ${preposition}`}
      >
        {renderSvg()}
      </div>
      {showLabel && (
        <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
          {preposition}
        </span>
      )}
    </div>
  );
};
