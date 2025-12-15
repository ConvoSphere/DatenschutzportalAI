import React from 'react';

interface PortalLogosProps {
  className?: string;
}

// Note: Place your PNG files here:
// - frontend/src/assets/logos/logo-left.png
// - frontend/src/assets/logos/logo-right.png
import logoLeft from '../assets/logos/logo-left.png';
import logoRight from '../assets/logos/logo-right.png';

export function PortalLogos({ className }: PortalLogosProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`.trim()}>
      <img
        src={logoLeft}
        alt="Organization logo"
        className="h-8 w-auto object-contain md:h-10"
        decoding="async"
      />
      <img
        src={logoRight}
        alt="Partner logo"
        className="h-8 w-auto object-contain md:h-10"
        decoding="async"
      />
    </div>
  );
}


