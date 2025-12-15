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
  // ~15% larger than the previous heights:
  // - mobile: 2.0rem -> 2.3rem
  // - md and above: 2.5rem -> 2.875rem
  // Uses clamp to interpolate smoothly between breakpoints.
  const logoHeight = 'clamp(2.3rem, 1.889rem + 0.128vw, 2.875rem)';

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`.trim()}>
      <img
        src={logoLeft}
        alt="Organization logo"
        className="flex-shrink-0"
        style={{ height: logoHeight, width: 'auto', objectFit: 'contain' }}
        decoding="async"
      />
      <img
        src={logoRight}
        alt="Partner logo"
        className="flex-shrink-0"
        style={{ height: logoHeight, width: 'auto', objectFit: 'contain' }}
        decoding="async"
      />
    </div>
  );
}


