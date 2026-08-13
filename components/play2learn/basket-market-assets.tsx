import * as React from "react";

export function FruitApple(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="appleGrad" cx="30" cy="30" r="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9B85" />
          <stop offset="60%" stopColor="#FF5C5C" />
          <stop offset="100%" stopColor="#D93838" />
        </radialGradient>
        <linearGradient id="leafGrad" x1="30" y1="15" x2="50" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#89D990" />
          <stop offset="100%" stopColor="#55A65A" />
        </linearGradient>
        <filter id="appleShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3B2F5E" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#appleShadow)">
        {/* Apple Body */}
        <path
          d="M50 87C68 87 82 72 82 54C82 36 68 22 50 22C32 22 18 36 18 54C18 72 32 87 50 87Z"
          fill="url(#appleGrad)"
        />
        {/* Apple Inner Highlight */}
        <path
          d="M30 35C38 28 45 30 45 30C45 30 35 40 28 50C25 45 25 40 30 35Z"
          fill="#FFFFFF"
          opacity="0.4"
        />
        {/* Apple Outline */}
        <path
          d="M50 87C68 87 82 72 82 54C82 36 68 22 50 22C32 22 18 36 18 54C18 72 32 87 50 87Z"
          stroke="#3B2F5E"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Stem */}
        <path
          d="M50 22C49 15 54 8 58 5"
          fill="none"
          stroke="#5C4033"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Leaf */}
        <path
          d="M50 22C50 22 35 10 25 15C32 25 50 22 50 22Z"
          fill="url(#leafGrad)"
          stroke="#3B2F5E"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function FruitBanana(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="bananaGrad" x1="20" y1="80" x2="80" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#FFC94D" />
          <stop offset="100%" stopColor="#E6A817" />
        </linearGradient>
        <filter id="bananaShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3B2F5E" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#bananaShadow)">
        <path
          d="M18 78C30 92 72 90 82 48C88 25 76 12 76 12C76 12 60 25 54 48C48 70 28 75 18 75C12 75 18 78 18 78Z"
          fill="url(#bananaGrad)"
          stroke="#3B2F5E"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Highlight */}
        <path
          d="M30 75C45 80 65 70 72 50C75 40 72 25 72 25"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Stem Tip */}
        <path
          d="M76 12C76 12 80 8 84 12"
          stroke="#5C4033"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Bottom Tip */}
        <path d="M18 76C16 78 15 80 18 82" stroke="#5C4033" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function FruitOrange(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="orangeGrad" cx="35" cy="35" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB370" />
          <stop offset="60%" stopColor="#FF8B3D" />
          <stop offset="100%" stopColor="#D96A1C" />
        </radialGradient>
        <filter id="orangeShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3B2F5E" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#orangeShadow)">
        <circle cx="50" cy="55" r="32" fill="url(#orangeGrad)" />
        <circle cx="50" cy="55" r="32" stroke="#3B2F5E" strokeWidth="3.5" />
        {/* Highlight */}
        <path
          d="M30 40C35 30 45 28 55 30"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Texture dots */}
        <circle cx="40" cy="45" r="1.5" fill="#D35400" opacity="0.6" />
        <circle cx="62" cy="52" r="1.5" fill="#D35400" opacity="0.6" />
        <circle cx="35" cy="65" r="1.5" fill="#D35400" opacity="0.6" />
        <circle cx="55" cy="72" r="1.5" fill="#D35400" opacity="0.6" />
        <circle cx="70" cy="62" r="1.5" fill="#D35400" opacity="0.6" />
        <circle cx="48" cy="80" r="1.5" fill="#D35400" opacity="0.6" />
        {/* Leaf */}
        <path
          d="M50 23C50 23 58 8 72 15C60 27 50 23 50 23Z"
          fill="#6FBF73"
          stroke="#3B2F5E"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Tiny Stem */}
        <circle cx="50" cy="23" r="2" fill="#5C4033" />
      </g>
    </svg>
  );
}

export function FruitPear(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="pearGrad" cx="40" cy="40" r="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9E585" />
          <stop offset="50%" stopColor="#B5D56A" />
          <stop offset="100%" stopColor="#8EA84E" />
        </radialGradient>
        <filter id="pearShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3B2F5E" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#pearShadow)">
        <path
          d="M50 15C38 15 32 35 32 46C32 52 22 62 22 74C22 88.36 34.54 100 50 100C65.46 100 78 88.36 78 74C78 62 68 52 68 46C68 35 62 15 50 15Z"
          fill="url(#pearGrad)"
        />
        <path
          d="M50 15C38 15 32 35 32 46C32 52 22 62 22 74C22 88.36 34.54 100 50 100C65.46 100 78 88.36 78 74C78 62 68 52 68 46C68 35 62 15 50 15Z"
          stroke="#3B2F5E"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Highlight */}
        <path
          d="M32 65C30 75 35 88 45 92"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M38 28C36 35 36 42 35 48"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Stem */}
        <path
          d="M50 15C50 15 54 4 64 6"
          stroke="#5C4033"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function FruitGrapes(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="grape1" cx="30%" cy="30%" r="70%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C38DDC" />
          <stop offset="100%" stopColor="#9B59B6" />
        </radialGradient>
        <radialGradient id="grape2" cx="30%" cy="30%" r="70%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A862CA" />
          <stop offset="100%" stopColor="#8E44AD" />
        </radialGradient>
        <filter id="grapeShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3B2F5E" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter="url(#grapeShadow)">
        {/* Stems */}
        <path d="M50 18V5" stroke="#5C4033" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 15L72 5" stroke="#5C4033" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 12L32 5" stroke="#5C4033" strokeWidth="3" strokeLinecap="round" />

        {/* Back Row */}
        <g stroke="#3B2F5E" strokeWidth="2.5">
          <circle cx="36" cy="32" r="13" fill="url(#grape1)" />
          <circle cx="64" cy="32" r="13" fill="url(#grape1)" />
          <circle cx="50" cy="24" r="13" fill="url(#grape2)" />
        </g>
        
        {/* Highlights Back Row */}
        <circle cx="32" cy="28" r="3" fill="#FFF" opacity="0.4" />
        <circle cx="60" cy="28" r="3" fill="#FFF" opacity="0.4" />
        <circle cx="46" cy="20" r="3" fill="#FFF" opacity="0.4" />

        {/* Middle Row */}
        <g stroke="#3B2F5E" strokeWidth="2.5">
          <circle cx="28" cy="52" r="13" fill="url(#grape1)" />
          <circle cx="72" cy="52" r="13" fill="url(#grape1)" />
          <circle cx="50" cy="46" r="14" fill="url(#grape2)" />
        </g>

        {/* Highlights Middle Row */}
        <circle cx="24" cy="48" r="3" fill="#FFF" opacity="0.4" />
        <circle cx="68" cy="48" r="3" fill="#FFF" opacity="0.4" />
        <circle cx="45" cy="41" r="3" fill="#FFF" opacity="0.4" />

        {/* Front Row */}
        <g stroke="#3B2F5E" strokeWidth="2.5">
          <circle cx="38" cy="68" r="13" fill="url(#grape1)" />
          <circle cx="62" cy="68" r="13" fill="url(#grape1)" />
          <circle cx="50" cy="85" r="13" fill="url(#grape2)" />
        </g>

        {/* Highlights Front Row */}
        <circle cx="34" cy="64" r="3" fill="#FFF" opacity="0.4" />
        <circle cx="58" cy="64" r="3" fill="#FFF" opacity="0.4" />
        <circle cx="46" cy="81" r="3" fill="#FFF" opacity="0.4" />
      </g>
    </svg>
  );
}

export function FruitCarrot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="carrotGrad" x1="15" y1="35" x2="60" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5A047" />
          <stop offset="60%" stopColor="#E67E22" />
          <stop offset="100%" stopColor="#BA5D0D" />
        </linearGradient>
        <filter id="carrotShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#3B2F5E" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter="url(#carrotShadow)">
        {/* Carrot Body */}
        <path
          d="M32 38L22 92C20 100 32 102 34 92L26 40C20 22 48 20 32 38Z"
          fill="url(#carrotGrad)"
          stroke="#3B2F5E"
          strokeWidth="3.5"
          strokeLinejoin="round"
          transform="rotate(-40 50 50) translate(15, -10)"
        />
        
        {/* Carrot Texture Lines */}
        <g stroke="#3B2F5E" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" transform="rotate(-40 50 50) translate(15, -10)">
          <path d="M42 48L55 45" />
          <path d="M48 64L62 60" />
          <path d="M30 58L40 55" />
          <path d="M35 75L45 72" />
        </g>
        
        {/* Carrot Highlights */}
        <path
          d="M36 30C40 40 45 60 40 85"
          stroke="#FFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
          transform="rotate(-40 50 50) translate(15, -10)"
        />

        {/* Leaves */}
        <g stroke="#3B2F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-30 50 50) translate(0, 0)">
          <path d="M30 25C25 15 12 12 12 12C12 12 20 20 25 25Z" fill="#89D990" />
          <path d="M33 22C30 10 25 2 25 2C25 2 34 12 33 22Z" fill="#6FBF73" />
          <path d="M37 25C44 15 55 13 55 13C55 13 45 20 37 25Z" fill="#55A65A" />
        </g>
      </g>
    </svg>
  );
}

export function WovenBasket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="basketBody" x1="0" y1="40" x2="0" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E6B981" />
          <stop offset="100%" stopColor="#C48E4D" />
        </linearGradient>
        <linearGradient id="basketRim" x1="0" y1="30" x2="200" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5D0A1" />
          <stop offset="50%" stopColor="#D4A373" />
          <stop offset="100%" stopColor="#B37D45" />
        </linearGradient>
        <filter id="basketShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#3B2F5E" floodOpacity="0.25" />
        </filter>
        <filter id="innerShadow">
          <feOffset dx="0" dy="8"/>
          <feGaussianBlur stdDeviation="4" result="offset-blur"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
          <feFlood floodColor="black" floodOpacity="0.3" result="color"/>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
      </defs>
      
      <g filter="url(#basketShadow)">
        {/* Back inside lip */}
        <path d="M25 40C40 25 160 25 175 40L145 40H55L25 40Z" fill="#A46B31" />
        
        {/* Main Basket Body */}
        <path
          d="M20 40L40 132C42 142 50 148 60 148H140C150 148 158 142 160 132L180 40"
          fill="url(#basketBody)"
          stroke="#3B2F5E"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        
        {/* Inner Shadow for Depth */}
        <path
          d="M22 42L41 130C43 140 51 146 60 146H140C149 146 157 140 159 130L178 42"
          fill="none"
          stroke="#000000"
          strokeWidth="8"
          opacity="0.1"
          strokeLinecap="round"
        />

        {/* Woven Textures - Vertical */}
        <path d="M45 42V140" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
        <path d="M70 42V147" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
        <path d="M95 42V148" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
        <path d="M120 42V147" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
        <path d="M145 42V140" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
        
        {/* Woven Textures - Horizontal */}
        <path d="M28 65H172" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
        <path d="M33 90H167" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
        <path d="M38 115H162" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />
        <path d="M45 135H155" stroke="#8E5E29" strokeWidth="4" opacity="0.6" strokeLinecap="round" />

        {/* Rim */}
        <path
          d="M10 40H190"
          stroke="url(#basketRim)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M10 40H190"
          stroke="#3B2F5E"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M15 36H185"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

export function CharacterAvatar({ seed, className, ...props }: { seed: number } & React.SVGProps<SVGSVGElement>) {
  const isGirl = seed % 2 === 0;
  // Softer, richer skin tones and vibrant hair
  const skinColors = ['#F9D3B6', '#E2AD86', '#BE8463', '#855943'];
  const skinShadows = ['#DCA683', '#C1885E', '#9E6543', '#683F2B'];
  const hairColors = ['#3B2F5E', '#5C4033', '#2C1E16', '#F5A623', '#D35400'];
  const hairHighlights = ['#544482', '#7A5B4C', '#4A3427', '#F8C156', '#E67E22'];
  
  const skinIndex = seed % skinColors.length;
  const hairIndex = (seed * 3) % hairColors.length;
  
  const skin = skinColors[skinIndex];
  const skinShadow = skinShadows[skinIndex];
  const hair = hairColors[hairIndex];
  const hairHighlight = hairHighlights[hairIndex];
  
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`group ${className}`} {...props}>
      <defs>
        <radialGradient id={`skinGrad-${seed}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={skin} />
          <stop offset="100%" stopColor={skinShadow} />
        </radialGradient>
        <linearGradient id={`hairGrad-${seed}`} x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor={hairHighlight} />
          <stop offset="100%" stopColor={hair} />
        </linearGradient>
      </defs>

      {/* Breathing/Idle Animation Wrapper */}
      <g className="origin-bottom animate-[breathe_3s_ease-in-out_infinite]">
        
        {/* Back Hair */}
        {isGirl && (
          <path d="M15 40C15 40 5 85 25 95C25 95 20 60 30 50C30 50 5 60 15 40Z" fill={`url(#hairGrad-${seed})`} stroke="#3B2F5E" strokeWidth="3" strokeLinejoin="round" />
        )}
        {isGirl && (
          <path d="M85 40C85 40 95 85 75 95C75 95 80 60 70 50C70 50 95 60 85 40Z" fill={`url(#hairGrad-${seed})`} stroke="#3B2F5E" strokeWidth="3" strokeLinejoin="round" />
        )}

        {/* Head Base */}
        <circle cx="50" cy="50" r="35" fill={`url(#skinGrad-${seed})`} stroke="#3B2F5E" strokeWidth="4" />
        
        {/* Cheeks */}
        <circle cx="28" cy="55" r="5" fill="#FF7A5C" opacity="0.3" className="transition-opacity group-hover:opacity-50" />
        <circle cx="72" cy="55" r="5" fill="#FF7A5C" opacity="0.3" className="transition-opacity group-hover:opacity-50" />

        {/* Eyes (Blinking animation) */}
        <g className="animate-[blink_4s_infinite]">
          <g className="normal-eyes">
            <circle cx="35" cy="46" r="4.5" fill="#3B2F5E" />
            <circle cx="65" cy="46" r="4.5" fill="#3B2F5E" />
            {/* Eye Highlights */}
            <circle cx="33" cy="44" r="1.5" fill="#FFF" />
            <circle cx="63" cy="44" r="1.5" fill="#FFF" />
          </g>
        </g>
        
        {/* Happy Eyes (Shown via CSS class) */}
        <g className="happy-eyes hidden">
          <path d="M28 46C28 46 35 38 42 46" stroke="#3B2F5E" strokeWidth="4" strokeLinecap="round" />
          <path d="M58 46C58 46 65 38 72 46" stroke="#3B2F5E" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Mouth */}
        <path className="normal-mouth transition-all duration-300" d="M42 62C42 62 50 66 58 62" stroke="#3B2F5E" strokeWidth="3.5" strokeLinecap="round" />
        <path className="happy-mouth hidden" d="M38 60C38 60 50 72 62 60" stroke="#3B2F5E" strokeWidth="4" strokeLinecap="round" />

        {/* Front Hair */}
        {isGirl ? (
          <path d="M12 50C12 15 40 5 50 12C60 5 88 15 88 50C88 50 75 22 50 28C25 22 12 50 12 50Z" fill={`url(#hairGrad-${seed})`} stroke="#3B2F5E" strokeWidth="4" strokeLinejoin="round" />
        ) : (
          <path d="M12 50C12 15 40 2 50 12C60 2 88 15 88 50C88 50 75 22 50 24C25 22 12 50 12 50Z" fill={`url(#hairGrad-${seed})`} stroke="#3B2F5E" strokeWidth="4" strokeLinejoin="round" />
        )}
      </g>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.97) translateY(2px); }
        }
        @keyframes blink {
          0%, 96%, 98% { transform: scaleY(1); }
          97% { transform: scaleY(0.1); }
        }
      `}} />
    </svg>
  );
}

export function StallBackground(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" {...props}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="600">
          <stop offset="0%" stopColor="#C4E8F0" />
          <stop offset="100%" stopColor="#FDFBF7" />
        </linearGradient>
        <linearGradient id="awningGrad" x1="0" y1="0" x2="0" y2="100">
          <stop offset="0%" stopColor="#4FB6C9" />
          <stop offset="100%" stopColor="#3A9CAB" />
        </linearGradient>
        <linearGradient id="woodGrad" x1="0" y1="400" x2="0" y2="600">
          <stop offset="0%" stopColor="#8A5A33" />
          <stop offset="100%" stopColor="#5E3A1F" />
        </linearGradient>
      </defs>
      
      {/* Sky Background */}
      <rect width="1000" height="600" fill="url(#skyGrad)" />
      
      {/* Sun/Glow */}
      <circle cx="800" cy="150" r="120" fill="#FFC94D" opacity="0.2" filter="blur(20px)" />
      
      {/* Clouds */}
      <path d="M100 150Q130 120 160 150Q190 140 210 160Q240 160 230 190H90Q80 160 100 150" fill="#FFF" opacity="0.6" className="animate-[drift_40s_linear_infinite]" />
      <path d="M700 250Q720 230 740 250Q760 245 770 255Q790 255 785 270H695Q690 255 700 250" fill="#FFF" opacity="0.5" className="animate-[drift_30s_linear_infinite_reverse]" />

      {/* Background Stalls/Tents (Depth) */}
      <path d="M200 450L300 250L400 450" fill="#FF7A5C" opacity="0.3" />
      <path d="M600 450L750 200L900 450" fill="#6FBF73" opacity="0.3" />

      {/* Main Stall Back Wall */}
      <rect x="50" y="100" width="900" height="500" fill="#EAD9C4" stroke="#3B2F5E" strokeWidth="4" />
      <rect x="50" y="100" width="900" height="500" fill="url(#woodGrad)" opacity="0.1" />

      {/* Hanging Lights */}
      <path d="M50 120 Q250 180 500 120 T950 120" stroke="#3B2F5E" strokeWidth="2" fill="none" opacity="0.5" />
      <circle cx="200" cy="155" r="8" fill="#FFC94D" className="animate-[pulse_2s_ease-in-out_infinite]" />
      <circle cx="350" cy="165" r="8" fill="#FFC94D" className="animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
      <circle cx="500" cy="120" r="8" fill="#FFC94D" className="animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
      <circle cx="650" cy="165" r="8" fill="#FFC94D" className="animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
      <circle cx="800" cy="155" r="8" fill="#FFC94D" className="animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }} />

      {/* Awning */}
      <path d="M0 0H1000V60C1000 60 950 110 900 60C850 110 800 60 750 60C700 110 650 60 600 60C550 110 500 60 450 60C400 110 350 60 300 60C250 110 200 60 150 60C100 110 50 60 0 60V0Z" fill="url(#awningGrad)" stroke="#3B2F5E" strokeWidth="5" />
      
      {/* Awning Stripes */}
      <path d="M100 0V60" stroke="#3B2F5E" strokeWidth="4" opacity="0.4" />
      <path d="M300 0V60" stroke="#3B2F5E" strokeWidth="4" opacity="0.4" />
      <path d="M500 0V60" stroke="#3B2F5E" strokeWidth="4" opacity="0.4" />
      <path d="M700 0V60" stroke="#3B2F5E" strokeWidth="4" opacity="0.4" />
      <path d="M900 0V60" stroke="#3B2F5E" strokeWidth="4" opacity="0.4" />
      <rect x="0" y="0" width="100" height="60" fill="#FDFBF7" opacity="0.2" />
      <rect x="200" y="0" width="100" height="60" fill="#FDFBF7" opacity="0.2" />
      <rect x="400" y="0" width="100" height="60" fill="#FDFBF7" opacity="0.2" />
      <rect x="600" y="0" width="100" height="60" fill="#FDFBF7" opacity="0.2" />
      <rect x="800" y="0" width="100" height="60" fill="#FDFBF7" opacity="0.2" />

      {/* Front Counter */}
      <rect x="0" y="440" width="1000" height="160" fill="url(#woodGrad)" stroke="#3B2F5E" strokeWidth="6" />
      <rect x="0" y="440" width="1000" height="15" fill="#D4A373" stroke="#3B2F5E" strokeWidth="4" />
      
      {/* Counter Planks */}
      <path d="M0 480H1000" stroke="#3B2F5E" strokeWidth="3" opacity="0.4" />
      <path d="M0 520H1000" stroke="#3B2F5E" strokeWidth="3" opacity="0.4" />
      <path d="M0 560H1000" stroke="#3B2F5E" strokeWidth="3" opacity="0.4" />
      
      {/* Vertical wood grain details */}
      <path d="M200 480V520" stroke="#3B2F5E" strokeWidth="2" opacity="0.3" />
      <path d="M500 520V560" stroke="#3B2F5E" strokeWidth="2" opacity="0.3" />
      <path d="M800 455V480" stroke="#3B2F5E" strokeWidth="2" opacity="0.3" />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drift {
          from { transform: translateX(-200px); }
          to { transform: translateX(1100px); }
        }
      `}} />
    </svg>
  );
}

export function CoinBurst(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="coinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC94D" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFC94D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE8A1" />
          <stop offset="50%" stopColor="#FFC94D" />
          <stop offset="100%" stopColor="#D99B1C" />
        </linearGradient>
      </defs>
      
      <circle cx="100" cy="100" r="90" fill="url(#coinGlow)" className="animate-[pulse_2s_ease-in-out_infinite]" />
      
      <g className="animate-[spin_4s_linear_infinite]">
        <circle cx="100" cy="100" r="85" stroke="#FFC94D" strokeWidth="3" strokeDasharray="8 16" opacity="0.8" />
        <circle cx="100" cy="100" r="70" stroke="#FFC94D" strokeWidth="2" strokeDasharray="4 12" opacity="0.5" />
      </g>
      
      {/* Coins */}
      <g stroke="#3B2F5E" strokeWidth="2.5" fill="url(#coinGrad)">
        <circle cx="100" cy="30" r="16" className="animate-[bounce_0.8s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.1s' }} />
        <circle cx="155" cy="55" r="12" className="animate-[bounce_0.9s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.3s' }} />
        <circle cx="170" cy="100" r="14" className="animate-[bounce_1.0s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.2s' }} />
        <circle cx="150" cy="155" r="10" className="animate-[bounce_0.7s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.4s' }} />
        <circle cx="100" cy="170" r="16" className="animate-[bounce_1.1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.1s' }} />
        <circle cx="45" cy="150" r="12" className="animate-[bounce_0.8s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.5s' }} />
        <circle cx="30" cy="100" r="14" className="animate-[bounce_0.9s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.2s' }} />
        <circle cx="45" cy="50" r="10" className="animate-[bounce_1.0s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.3s' }} />
      </g>
      
      {/* Coin Inner Details (Stars) */}
      <g fill="#FFF" opacity="0.6">
        <path d="M100 24l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
        <path d="M155 49l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" />
        <path d="M170 94l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
        <path d="M100 164l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
        <path d="M30 94l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
      </g>
    </svg>
  );
}
