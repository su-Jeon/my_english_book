import React from 'react';

interface SpriteProps {
  isFound: boolean;
  className?: string;
}

/**
 * 12 Adorable, high-fidelity SVG sprites for the hidden objects
 * Perfectly styled for a children's picture book
 */

// Scene 1: Cat under the bench
export const CatUnderBenchSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
      {/* Soft ground shadow */}
      <ellipse cx="50" cy="70" rx="42" ry="8" fill="#1e293b" opacity="0.25" />
      {/* Curled cat body */}
      <ellipse cx="50" cy="46" rx="36" ry="24" fill="#f97316" />
      {/* Stripes on back */}
      <path d="M 40 28 Q 45 36 43 45" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 52 26 Q 56 36 55 46" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 64 28 Q 67 36 66 45" stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Curled tail */}
      <path d="M 16 52 Q 10 40 18 32 Q 24 30 22 38" stroke="#f97316" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Cat head */}
      <circle cx="75" cy="42" r="18" fill="#f97316" />
      {/* Ears */}
      <polygon points="68,26 73,14 80,24" fill="#ea580c" />
      <polygon points="71,24 74,17 78,24" fill="#fecdd3" />
      <polygon points="78,25 86,15 89,28" fill="#ea580c" />
      <polygon points="80,24 85,18 87,27" fill="#fecdd3" />
      {/* White chest & muzzle */}
      <ellipse cx="76" cy="49" rx="10" ry="8" fill="#fff7ed" />
      {/* Sleeping closed eyes */}
      <path d="M 70 42 Q 74 46 78 42" stroke="#431407" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 80 42 Q 84 46 88 42" stroke="#431407" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Pink nose & mouth */}
      <polygon points="78,47 80,45 82,47" fill="#f43f5e" />
      {/* Whiskers */}
      <line x1="68" y1="46" x2="60" y2="44" stroke="#fed7aa" strokeWidth="1.5" />
      <line x1="68" y1="49" x2="59" y2="50" stroke="#fed7aa" strokeWidth="1.5" />
      <line x1="88" y1="46" x2="96" y2="44" stroke="#fed7aa" strokeWidth="1.5" />
      <line x1="88" y1="49" x2="97" y2="50" stroke="#fed7aa" strokeWidth="1.5" />
      {/* Paws tucked */}
      <ellipse cx="65" cy="62" rx="7" ry="5" fill="#fff7ed" />
      <ellipse cx="48" cy="63" rx="7" ry="5" fill="#fff7ed" />
    </svg>
    {/* Animated Zzz when resting */}
    {!isFound && (
      <span className="absolute -top-3 right-0 text-[10px] font-black text-amber-900 bg-white/90 px-1 rounded-full shadow-xs animate-bounce">
        zZ
      </span>
    )}
  </div>
);

// Scene 2: Blue bird on branch
export const BlueBirdSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
      {/* Small branch */}
      <path d="M 5 65 Q 40 58 75 62" stroke="#78350f" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Bird body */}
      <ellipse cx="42" cy="42" rx="20" ry="16" fill="#0284c7" />
      {/* Bird belly */}
      <ellipse cx="40" cy="46" rx="14" ry="12" fill="#7dd3fc" />
      {/* Wing */}
      <path d="M 32 36 Q 48 34 52 48 Q 38 52 32 36 Z" fill="#0369a1" />
      {/* Head */}
      <circle cx="56" cy="30" r="13" fill="#0284c7" />
      {/* Eye */}
      <circle cx="61" cy="28" r="3" fill="#ffffff" />
      <circle cx="62" cy="28" r="1.8" fill="#0f172a" />
      {/* Beak */}
      <polygon points="68,29 77,32 68,36" fill="#f59e0b" />
      {/* Tail feathers */}
      <path d="M 23 48 L 8 52 L 20 42 Z" fill="#0369a1" />
      {/* Feet gripping branch */}
      <line x1="38" y1="56" x2="38" y2="62" stroke="#d97706" strokeWidth="2.5" />
      <line x1="46" y1="56" x2="46" y2="62" stroke="#d97706" strokeWidth="2.5" />
    </svg>
    {!isFound && (
      <span className="absolute -top-1 right-1 text-xs animate-pulse">🎵</span>
    )}
  </div>
);

// Scene 3: Squirrel behind tree
export const SquirrelSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 80 90" className="w-full h-full drop-shadow-md">
      {/* Bushy tail */}
      <path d="M 25 70 C 10 50 10 20 28 15 C 42 12 40 32 30 45" stroke="#b45309" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 26 68 C 14 50 14 24 28 20" stroke="#d97706" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Squirrel Body */}
      <ellipse cx="44" cy="56" rx="16" ry="22" fill="#d97706" />
      <ellipse cx="46" cy="58" rx="10" ry="16" fill="#fef3c7" />
      {/* Head */}
      <circle cx="48" cy="32" r="14" fill="#d97706" />
      {/* Ears */}
      <polygon points="40,24 43,14 48,22" fill="#b45309" />
      <polygon points="50,22 55,14 58,24" fill="#b45309" />
      {/* Eye */}
      <circle cx="53" cy="30" r="3" fill="#1e293b" />
      <circle cx="54" cy="29" r="1" fill="#ffffff" />
      {/* Nose */}
      <circle cx="61" cy="34" r="2.5" fill="#451a03" />
      {/* Paws holding acorn */}
      <ellipse cx="52" cy="48" rx="5" ry="4" fill="#b45309" />
      {/* Acorn */}
      <ellipse cx="56" cy="52" rx="4" ry="5" fill="#78350f" />
      <path d="M 52 48 Q 56 46 60 48" stroke="#451a03" strokeWidth="2" fill="none" />
    </svg>
  </div>
);

// Scene 4: Backpack on chair
export const BackpackSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 80 90" className="w-full h-full drop-shadow-md">
      {/* Shadow */}
      <ellipse cx="40" cy="80" rx="26" ry="6" fill="#1e293b" opacity="0.3" />
      {/* Main Bag Body */}
      <rect x="20" y="24" width="40" height="52" rx="12" fill="#10b981" />
      {/* Top handle */}
      <path d="M 32 24 Q 40 12 48 24" stroke="#047857" strokeWidth="4" fill="none" />
      {/* Front pocket */}
      <rect x="25" y="46" width="30" height="24" rx="6" fill="#059669" />
      {/* Zipper lines */}
      <line x1="28" y1="46" x2="52" y2="46" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="3 2" />
      <line x1="26" y1="32" x2="54" y2="32" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="3 2" />
      {/* Side mesh pocket */}
      <rect x="16" y="44" width="6" height="20" rx="3" fill="#047857" />
      {/* Cute soccer keychain */}
      <circle cx="56" cy="48" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
      <circle cx="56" cy="48" r="2" fill="#1e293b" />
    </svg>
  </div>
);

// Scene 5: Puppy behind bicycle
export const PuppyBehindBikeSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
      {/* Puppy head peeking */}
      <ellipse cx="40" cy="38" rx="24" ry="20" fill="#d97706" />
      {/* Floppy Ears */}
      <ellipse cx="20" cy="32" rx="7" ry="16" fill="#b45309" transform="rotate(-15 20 32)" />
      <ellipse cx="60" cy="32" rx="7" ry="16" fill="#b45309" transform="rotate(15 60 32)" />
      {/* Cute white snout */}
      <ellipse cx="40" cy="44" rx="12" ry="9" fill="#fef3c7" />
      {/* Eyes */}
      <circle cx="32" cy="34" r="3.5" fill="#1e293b" />
      <circle cx="33" cy="33" r="1.2" fill="#ffffff" />
      <circle cx="48" cy="34" r="3.5" fill="#1e293b" />
      <circle cx="49" cy="33" r="1.2" fill="#ffffff" />
      {/* Nose */}
      <ellipse cx="40" cy="42" rx="4" ry="3" fill="#1e293b" />
      {/* Tongue peeking */}
      <path d="M 38 48 Q 40 55 42 48 Z" fill="#f43f5e" />
      {/* Paws resting on top */}
      <ellipse cx="30" cy="56" rx="6" ry="4" fill="#fef3c7" />
      <ellipse cx="50" cy="56" rx="6" ry="4" fill="#fef3c7" />
    </svg>
  </div>
);

// Scene 6: Tennis ball in bucket
export const TennisBallInBucketSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
      {/* Blue Bucket */}
      <polygon points="18,34 62,34 54,74 26,74" fill="#0284c7" />
      <ellipse cx="40" cy="34" rx="22" ry="7" fill="#0369a1" />
      {/* Bucket rim */}
      <ellipse cx="40" cy="34" rx="22" ry="5" fill="#38bdf8" />
      {/* Metal handle */}
      <path d="M 18 34 Q 40 10 62 34" stroke="#94a3b8" strokeWidth="3" fill="none" />
      {/* RED/YELLOW TENNIS BALL IN THE BUCKET */}
      <circle cx="40" cy="30" r="12" fill="#ef4444" />
      {/* Tennis seams */}
      <path d="M 33 22 Q 41 30 33 38" stroke="#ffffff" strokeWidth="1.5" fill="none" />
      <path d="M 47 22 Q 39 30 47 38" stroke="#ffffff" strokeWidth="1.5" fill="none" />
    </svg>
  </div>
);

// Scene 7: Pumpkin under table
export const PumpkinUnderTableSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 90 80" className="w-full h-full drop-shadow-md">
      {/* Shadow */}
      <ellipse cx="45" cy="70" rx="36" ry="8" fill="#1e293b" opacity="0.3" />
      {/* Pumpkin segments */}
      <ellipse cx="28" cy="46" rx="16" ry="22" fill="#ea580c" />
      <ellipse cx="62" cy="46" rx="16" ry="22" fill="#ea580c" />
      <ellipse cx="36" cy="46" rx="18" ry="24" fill="#f97316" />
      <ellipse cx="54" cy="46" rx="18" ry="24" fill="#f97316" />
      <ellipse cx="45" cy="46" rx="16" ry="25" fill="#fb923c" />
      {/* Green stem */}
      <path d="M 43 24 Q 45 10 52 14 Q 48 24 47 24 Z" fill="#15803d" />
    </svg>
  </div>
);

// Scene 8: Kitten in basket
export const KittenInBasketSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
      {/* White kitten peeking */}
      <ellipse cx="40" cy="30" rx="18" ry="15" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* Ears */}
      <polygon points="26,18 30,6 38,16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="29,16 31,10 36,15" fill="#fbcfe8" />
      <polygon points="42,16 50,6 54,18" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="44,15 49,10 51,16" fill="#fbcfe8" />
      {/* Eyes */}
      <circle cx="33" cy="28" r="3" fill="#0284c7" />
      <circle cx="34" cy="27" r="1" fill="#ffffff" />
      <circle cx="47" cy="28" r="3" fill="#0284c7" />
      <circle cx="48" cy="27" r="1" fill="#ffffff" />
      {/* Pink nose */}
      <polygon points="38,34 40,32 42,34" fill="#f43f5e" />
      {/* Whiskers */}
      <line x1="26" y1="32" x2="16" y2="30" stroke="#94a3b8" strokeWidth="1" />
      <line x1="26" y1="35" x2="17" y2="37" stroke="#94a3b8" strokeWidth="1" />
      <line x1="54" y1="32" x2="64" y2="30" stroke="#94a3b8" strokeWidth="1" />
      <line x1="54" y1="35" x2="63" y2="37" stroke="#94a3b8" strokeWidth="1" />

      {/* Wicker Basket Body */}
      <polygon points="16,36 64,36 56,72 24,72" fill="#d97706" />
      {/* Basket weave lines */}
      <ellipse cx="40" cy="36" rx="24" ry="6" fill="#b45309" />
      <line x1="20" y1="46" x2="60" y2="46" stroke="#92400e" strokeWidth="2" strokeDasharray="4 2" />
      <line x1="22" y1="56" x2="58" y2="56" stroke="#92400e" strokeWidth="2" strokeDasharray="4 2" />
      <line x1="24" y1="64" x2="56" y2="64" stroke="#92400e" strokeWidth="2" strokeDasharray="4 2" />
    </svg>
  </div>
);

// Scene 9: Boy behind market stall
export const BoyBehindStallSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
      {/* Boy Hair & Head */}
      <circle cx="40" cy="28" r="16" fill="#fed7aa" />
      <path d="M 24 24 Q 40 8 56 24 Q 48 18 40 20 Q 32 18 24 24 Z" fill="#451a03" />
      {/* Eyes */}
      <circle cx="34" cy="28" r="2.5" fill="#1e293b" />
      <circle cx="46" cy="28" r="2.5" fill="#1e293b" />
      {/* Happy Smile */}
      <path d="M 36 34 Q 40 40 44 34" stroke="#e11d48" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Shoulders in blue shirt */}
      <path d="M 20 48 Q 40 38 60 48 L 60 60 L 20 60 Z" fill="#2563eb" />
      {/* Ice cream cone in hand */}
      <polygon points="54,40 60,40 57,54" fill="#d97706" />
      <circle cx="57" cy="36" r="6" fill="#ec4899" />
      <circle cx="57" cy="32" r="4" fill="#f43f5e" />
    </svg>
  </div>
);

// Scene 10: Water bottle next to white line
export const WaterBottleSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 70 80" className="w-full h-full drop-shadow-md">
      {/* Ground shadow */}
      <ellipse cx="35" cy="74" rx="20" ry="5" fill="#1e293b" opacity="0.3" />
      {/* Water bottle body */}
      <rect x="22" y="24" width="26" height="48" rx="8" fill="#0284c7" />
      {/* Semi-transparent water level */}
      <rect x="24" y="36" width="22" height="34" rx="6" fill="#38bdf8" opacity="0.8" />
      {/* Sports cap */}
      <rect x="28" y="14" width="14" height="10" rx="3" fill="#0f172a" />
      <rect x="32" y="8" width="6" height="6" rx="2" fill="#38bdf8" />
      {/* Grip stripes */}
      <line x1="22" y1="42" x2="48" y2="42" stroke="#0369a1" strokeWidth="2" />
      <line x1="22" y1="52" x2="48" y2="52" stroke="#0369a1" strokeWidth="2" />
    </svg>
  </div>
);

// Scene 11: Team cap on corner flag
export const CapOnFlagSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-110' : 'hover:scale-105'}`}>
    <svg viewBox="0 0 70 80" className="w-full h-full drop-shadow-md">
      {/* Flag pole tip */}
      <line x1="35" y1="36" x2="35" y2="76" stroke="#fbbf24" strokeWidth="4" />
      {/* Triangular yellow flag */}
      <polygon points="35,40 65,48 35,58" fill="#f59e0b" />
      {/* Team Cap perched on top */}
      <ellipse cx="35" cy="30" rx="18" ry="12" fill="#ef4444" />
      {/* Cap Visor */}
      <path d="M 20 32 Q 35 42 56 34" stroke="#b91c1c" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Cap button */}
      <circle cx="35" cy="18" r="3" fill="#ffffff" />
    </svg>
  </div>
);

// Scene 12: Soccer ball in goal net
export const SoccerBallInNetSprite: React.FC<SpriteProps> = ({ isFound }) => (
  <div className={`w-full h-full relative transition-transform duration-300 ${isFound ? 'scale-125' : 'hover:scale-110'}`}>
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-xl animate-spin-slow">
      {/* Shadow */}
      <ellipse cx="40" cy="72" rx="22" ry="6" fill="#1e293b" opacity="0.4" />
      {/* White soccer ball body */}
      <circle cx="40" cy="40" r="28" fill="#ffffff" stroke="#334155" strokeWidth="2" />
      {/* Center Black Pentagon */}
      <polygon points="40,30 49,37 45,48 35,48 31,37" fill="#0f172a" />
      {/* Surrounding pentagons & lines */}
      <line x1="40" y1="30" x2="40" y2="16" stroke="#334155" strokeWidth="2" />
      <polygon points="36,12 44,12 40,16" fill="#0f172a" />

      <line x1="49" y1="37" x2="62" y2="33" stroke="#334155" strokeWidth="2" />
      <polygon points="62,33 66,42 66,30" fill="#0f172a" />

      <line x1="45" y1="48" x2="56" y2="58" stroke="#334155" strokeWidth="2" />
      <polygon points="56,58 64,52 58,64" fill="#0f172a" />

      <line x1="35" y1="48" x2="24" y2="58" stroke="#334155" strokeWidth="2" />
      <polygon points="24,58 16,52 22,64" fill="#0f172a" />

      <line x1="31" y1="37" x2="18" y2="33" stroke="#334155" strokeWidth="2" />
      <polygon points="18,33 14,42 14,30" fill="#0f172a" />

      {/* Gloss reflection */}
      <path d="M 24 24 Q 32 16 42 18" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.6" strokeLinecap="round" />
    </svg>
    <span className="absolute -top-3 -right-2 text-xl animate-bounce">✨</span>
  </div>
);

export const renderSpriteForScene = (sceneId: number, isFound: boolean) => {
  switch (sceneId) {
    case 1:
      return <CatUnderBenchSprite isFound={isFound} />;
    case 2:
      return <BlueBirdSprite isFound={isFound} />;
    case 3:
      return <SquirrelSprite isFound={isFound} />;
    case 4:
      return <BackpackSprite isFound={isFound} />;
    case 5:
      return <PuppyBehindBikeSprite isFound={isFound} />;
    case 6:
      return <TennisBallInBucketSprite isFound={isFound} />;
    case 7:
      return <PumpkinUnderTableSprite isFound={isFound} />;
    case 8:
      return <KittenInBasketSprite isFound={isFound} />;
    case 9:
      return <BoyBehindStallSprite isFound={isFound} />;
    case 10:
      return <WaterBottleSprite isFound={isFound} />;
    case 11:
      return <CapOnFlagSprite isFound={isFound} />;
    case 12:
      return <SoccerBallInNetSprite isFound={isFound} />;
    default:
      return null;
  }
};
