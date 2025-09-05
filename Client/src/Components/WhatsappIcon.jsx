import React from "react";

const whatsappNumber = '9607781048'; // Maldives number

export default function WhatsappIcon() {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 1000,
        background: 'linear-gradient(135deg, #005E84 0%, #075375 50%, #0A435C 100%)',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0, 94, 132, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease-out',
        border: '2px solid rgba(231, 233, 229, 0.2)',
        backdropFilter: 'blur(8px)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = '0 6px 20px rgba(0, 94, 132, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 4px 16px rgba(0, 94, 132, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
      aria-label="Chat on WhatsApp"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="#E7E9E5">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.697 4.604 1.902 6.51L4 29l7.684-2.522A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.97 0-3.85-.574-5.43-1.563l-.386-.237-4.56 1.497 1.497-4.56-.237-.386A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.83-2.01-.22-.54-.44-.47-.61-.48-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.02 2.82 1.16 3.02c.14.2 2.01 3.08 4.88 4.19.68.27 1.21.43 1.62.55.68.22 1.3.19 1.79.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"/>
      </svg>
    </a>
  );
}
