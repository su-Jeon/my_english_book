import React from 'react';

export type MinaMood = 'searching' | 'excited' | 'thinking' | 'proud';

interface MinaAvatarProps {
  mood?: MinaMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Animated, expressive vector avatar of Mina the young adventurer
 * with her yellow soccer jersey and brown ponytail!
 */
export const MinaAvatar: React.FC<MinaAvatarProps> = ({
  mood = 'searching',
  size = 'md',
  className = '',
}) => {
  const pixelSize = size === 'sm' ? 44 : size === 'lg' ? 84 : 62;

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`relative shrink-0 rounded-full bg-gradient-to-tr from-amber-200 via-yellow-100 to-amber-300 p-0.5 border-2 border-amber-400 shadow-md flex items-center justify-center overflow-hidden ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
        {/* Sky / Head Background */}
        <circle cx="50" cy="50" r="48" fill="#fef3c7" />

        {/* Brown Ponytail behind */}
        <path
          d="M 62 38 C 88 20 95 45 78 60 C 70 54 66 45 62 38 Z"
          fill="#5c2c16"
        />
        {/* Yellow hair tie */}
        <circle cx="68" cy="40" r="6" fill="#f59e0b" />

        {/* Mina Jersey Shoulders */}
        <path
          d="M 20 95 Q 50 80 80 95 L 85 105 L 15 105 Z"
          fill="#eab308"
        />
        {/* Jersey Collar */}
        <path d="M 40 85 Q 50 92 60 85" stroke="#1e293b" strokeWidth="3" fill="none" />
        {/* Number 8 on Jersey */}
        <text x="50" y="100" textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="900">8</text>

        {/* Neck */}
        <rect x="44" y="72" width="12" height="14" rx="3" fill="#fed7aa" />

        {/* Head */}
        <circle cx="50" cy="52" r="26" fill="#fed7aa" />

        {/* Rosy Cheeks */}
        <ellipse cx="36" cy="58" rx="5" ry="3" fill="#fca5a5" opacity="0.6" />
        <ellipse cx="64" cy="58" rx="5" ry="3" fill="#fca5a5" opacity="0.6" />

        {/* Hair Front / Bangs */}
        <path
          d="M 26 48 C 24 30 40 22 50 22 C 65 22 76 32 74 48 C 66 34 58 35 50 38 C 42 35 34 38 26 48 Z"
          fill="#5c2c16"
        />

        {/* Expression specifics */}
        {mood === 'searching' && (
          <g>
            {/* Curious wide eyes */}
            <ellipse cx="40" cy="50" rx="4.5" ry="5.5" fill="#1e293b" />
            <circle cx="41.5" cy="48.5" r="2" fill="#ffffff" />
            <ellipse cx="60" cy="50" rx="4.5" ry="5.5" fill="#1e293b" />
            <circle cx="61.5" cy="48.5" r="2" fill="#ffffff" />
            {/* Raised curious eyebrows */}
            <path d="M 35 42 Q 40 38 45 42" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 55 42 Q 60 38 65 42" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Open mouth */}
            <ellipse cx="50" cy="62" rx="3.5" ry="2.5" fill="#e11d48" />
          </g>
        )}

        {mood === 'excited' && (
          <g>
            {/* Happy starry/sparkling eyes */}
            <path d="M 36 50 Q 40 44 44 50" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 56 50 Q 60 44 64 50" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* High cheerful eyebrows */}
            <path d="M 34 40 Q 40 35 46 41" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 54 41 Q 60 35 66 40" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Big smiling mouth with teeth */}
            <path d="M 40 58 Q 50 72 60 58 Z" fill="#e11d48" />
            <path d="M 43 59 Q 50 63 57 59" fill="#ffffff" />
          </g>
        )}

        {mood === 'thinking' && (
          <g>
            {/* Thinking looking up-right */}
            <ellipse cx="40" cy="48" rx="4" ry="5" fill="#1e293b" />
            <circle cx="42" cy="46" r="1.8" fill="#ffffff" />
            <ellipse cx="60" cy="48" rx="4" ry="5" fill="#1e293b" />
            <circle cx="62" cy="46" r="1.8" fill="#ffffff" />
            {/* Inquisitive tilted eyebrows */}
            <path d="M 35 43 Q 40 40 45 42" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 55 40 Q 61 36 67 43" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Thinking finger on chin */}
            <ellipse cx="62" cy="65" rx="5" ry="4" fill="#fed7aa" stroke="#f59e0b" strokeWidth="1" />
            <path d="M 45 61 Q 50 63 55 60" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {mood === 'proud' && (
          <g>
            {/* Proud warm eyes */}
            <ellipse cx="40" cy="50" rx="4" ry="5" fill="#1e293b" />
            <circle cx="41" cy="48" r="1.8" fill="#ffffff" />
            <ellipse cx="60" cy="50" rx="4" ry="5" fill="#1e293b" />
            <circle cx="61" cy="48" r="1.8" fill="#ffffff" />
            {/* Confident smile */}
            <path d="M 42 60 Q 50 68 58 60" stroke="#e11d48" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
