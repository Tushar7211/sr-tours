import { safeUrl } from '../lib/content.js';

// A simple recolourable car. If the admin adds a photo URL for the vehicle, the photo is used instead.
export default function CarArt({ color = '#ffffff', image, name = 'Car' }) {
  if (image) return <img className="car-photo" src={safeUrl(image)} alt={name} loading="lazy" />;
  return (
    <svg className="car-art" viewBox="0 0 240 110" role="img" aria-label={name}>
      <ellipse cx="120" cy="97" rx="100" ry="6" fill="rgba(10,42,117,.22)" />
      <path
        d="M12 80V64Q12 56 22 54L46 48Q54 28 80 24H152Q176 26 190 48L216 54Q230 57 230 68V80Z"
        fill={color}
        stroke="#0a2a75"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M58 47Q64 34 82 31H110V47Z" fill="#cfe3ff" stroke="#0a2a75" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M118 31H150Q164 33 174 47H118Z" fill="#cfe3ff" stroke="#0a2a75" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M114 31V78" stroke="#0a2a75" strokeWidth="2" opacity=".45" />
      <rect x="12" y="60" width="7" height="10" rx="2" fill="#e53935" />
      <path d="M224 60q6 0 6 6v4h-10z" fill="#ffe082" stroke="#0a2a75" strokeWidth="1.5" />
      <circle cx="62" cy="80" r="16" fill="#14213d" />
      <circle cx="62" cy="80" r="7" fill="#cdd7ee" />
      <circle cx="182" cy="80" r="16" fill="#14213d" />
      <circle cx="182" cy="80" r="7" fill="#cdd7ee" />
    </svg>
  );
}
