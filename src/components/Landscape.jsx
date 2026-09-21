// Decorative backdrop for the hero: hills and a Kalinga-style temple skyline (curved tower + stepped porch).
export default function Landscape() {
  return (
    <div className="scene-art" aria-hidden="true">
      <svg viewBox="0 0 1200 340" preserveAspectRatio="xMaxYMax slice">
        <defs>
          <g id="sr-temple">
            {/* stepped porch */}
            <path d="M830 250V182H846V170H862V158H878V146H894V134H918V250Z" />
            {/* curved tower */}
            <path d="M918 250V150C918 112 928 82 946 60L949 52H971L974 60C992 82 1002 112 1002 150V250Z" />
            <ellipse cx="960" cy="49" rx="17" ry="6" />
            <ellipse cx="960" cy="36" rx="7" ry="10" />
            <rect x="959" y="14" width="2" height="12" />
            <path d="M961 14L980 20L961 26Z" />
          </g>
        </defs>

        <path d="M0 214C120 174 220 194 330 204C470 216 560 152 700 162C840 172 960 218 1200 172V340H0Z" fill="#a9d2e6" />
        <g fill="#0a2a75" opacity=".26">
          <use href="#sr-temple" />
          <use href="#sr-temple" transform="translate(611 120) scale(.52)" />
        </g>
        <path d="M0 252C160 216 300 242 440 252C600 264 720 216 880 226C1020 236 1100 264 1200 242V340H0Z" fill="#8fcda0" />
        <path d="M0 298C200 278 420 302 640 292C860 282 1020 302 1200 288V340H0Z" fill="#66b07f" />
      </svg>
    </div>
  );
}
