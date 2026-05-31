import { GeneratedSpec } from '@/types/spec';

type SpecSectionIconProps = {
  section: keyof GeneratedSpec;
};

export function SpecSectionIcon({ section }: SpecSectionIconProps) {
  switch (section) {
    case 'vision':
      return (
        <svg
          aria-hidden="true"
          className="result-icon"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 12c2.1-4 5.5-6 9.5-6s7.4 2 9.5 6c-2.1 4-5.5 6-9.5 6s-7.4-2-9.5-6Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case 'usuarios':
      return (
        <svg
          aria-hidden="true"
          className="result-icon"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="8.5" r="3.25" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M6.5 18c1.1-2.3 3.1-3.5 5.5-3.5s4.4 1.2 5.5 3.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
          <path
            d="M4.5 17.5c.5-1.3 1.4-2.2 2.7-2.8M16.8 14.7c1.3.6 2.2 1.5 2.7 2.8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      );
    case 'funcionalidades':
      return (
        <svg
          aria-hidden="true"
          className="result-icon"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M8 12h8M12 8v8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      );
    case 'flujos':
      return (
        <svg
          aria-hidden="true"
          className="result-icon"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 7h9m0 0-2.5-2.5M13 7 10.5 9.5M20 17h-9m0 0 2.5-2.5M11 17l2.5 2.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      );
    case 'arquitectura':
      return (
        <svg
          aria-hidden="true"
          className="result-icon"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m12 3.5 8 4.2-8 4.3-8-4.3 8-4.2ZM4 12.2l8 4.3 8-4.3M4 16.3l8 4.2 8-4.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      );
    case 'requisitos':
      return (
        <svg
          aria-hidden="true"
          className="result-icon"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="m8 12.5 2.6 2.6L16.5 9"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      );
  }
}
