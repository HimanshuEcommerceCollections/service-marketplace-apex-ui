'use client';

// Google / Apple sign-in from the design. OAuth is NOT implemented server-side
// yet (there are no /auth/oauth/* routes), so both buttons render disabled with a
// "Soon" badge rather than pretending to work. When OAuth lands, drop `disabled`
// and point each button at its provider.

export default function SocialRow() {
  return (
    <>
      <div className="div">OR</div>
      <div className="socials-col">
        <button type="button" className="btn btn-social" disabled aria-label="Continue with Google, coming soon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z" />
            <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.8H1.8v3A11.5 11.5 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.6 14.6a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3z" />
            <path fill="#EA4335" d="M12 4.7c1.7 0 3.2.6 4.4 1.7L19.7 3A11.5 11.5 0 0 0 1.8 7.2l3.8 3c.9-2.8 3.4-4.8 6.4-4.8z" />
          </svg>
          Continue with Google
          <span className="soon">Soon</span>
        </button>
        <button type="button" className="btn btn-social" disabled aria-label="Continue with Apple, coming soon">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.4 12.9c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.6-.2-3.2 1-4 1s-2.1-1-3.5-1c-1.8 0-3.4 1-4.3 2.7-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.5.8c1.4 0 2.3-1.3 3.2-2.6.7-1 1.2-2 1.5-3.1-.1 0-2.8-1.1-2.8-4zM13.7 4.6c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.7-1.3 2-1.1 3.2 1.1 0 2.3-.6 3-1.5z" />
          </svg>
          Continue with Apple
          <span className="soon">Soon</span>
        </button>
      </div>
    </>
  );
}
