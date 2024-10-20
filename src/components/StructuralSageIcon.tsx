import React from 'react';

const StructuralSageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="currentColor">
      {/* Microphone */}
      <path d="M50 70c11 0 20-9 20-20V30c0-11-9-20-20-20S30 19 30 30v20c0 11 9 20 20 20z" />
      <path d="M70 50c0 11-9 20-20 20s-20-9-20-20H20c0 14.4 10.7 26.3 24.6 28.2V90h10.8V78.2C69.3 76.3 80 64.4 80 50H70z" />
      
      {/* Left sound wave */}
      <path d="M10 50c0 5.5 4.5 10 10 10V40c-5.5 0-10 4.5-10 10z" />
      <path d="M5 50c0 8.3 6.7 15 15 15V35c-8.3 0-15 6.7-15 15z" />
      
      {/* Right sound wave */}
      <path d="M80 50c0 5.5 4.5 10 10 10V40c-5.5 0-10 4.5-10 10z" />
      <path d="M85 50c0 8.3 6.7 15 15 15V35c-8.3 0-15 6.7-15 15z" />
    </g>
  </svg>
);

export default StructuralSageIcon;