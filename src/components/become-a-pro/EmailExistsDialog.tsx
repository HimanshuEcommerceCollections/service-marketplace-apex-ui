'use client';

// The apply form's duplicate-email interruption.
//
// A rejected submit on this page is not an ordinary field error: the applicant
// has just filled in a long form and the reason it failed is invisible in the
// form itself (nothing they typed is malformed — we simply already know that
// email). A dialog states that plainly and offers the one action that helps,
// which differs by reason: an existing pro should sign in, a duplicate
// applicant should either wait or correct a typo.
//
// The caller also marks the email field, so dismissing this does not leave a
// form that looks like it should submit.

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export type EmailConflict = 'PRO_APPLICATION_EXISTS' | 'ALREADY_A_PRO';

const COPY: Record<EmailConflict, { title: string; body: string }> = {
  PRO_APPLICATION_EXISTS: {
    title: 'We already have your application',
    body: "An application with this email address is already in review. There's no need to apply again — our team will reach out about next steps. If you meant to use a different email, edit it and submit again.",
  },
  ALREADY_A_PRO: {
    title: "You're already an Apex pro",
    body: 'This email address belongs to an existing Apex pro account. Sign in to see your assigned jobs — or apply with a different email if you are applying on behalf of someone else.',
  },
};

export default function EmailExistsDialog({
  reason,
  email,
  onClose,
}: {
  reason: EmailConflict;
  email: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const copy = COPY[reason];

  // Escape closes, focus starts inside the dialog, and the page behind it stops
  // scrolling while it is open.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="dlg-scrim" onClick={onClose}>
      <div
        className="dlg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dlgTitle"
        aria-describedby="dlgBody"
        // The scrim closes on click; clicks on the panel itself must not bubble
        // up to it.
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="dlg-title" id="dlgTitle">
          {copy.title}
        </h3>
        <p className="dlg-email">{email}</p>
        <p className="dlg-body" id="dlgBody">
          {copy.body}
        </p>
        <div className="dlg-actions">
          {reason === 'ALREADY_A_PRO' && (
            <Link className="btn btn-primary" href="/login?next=%2Fpro">
              Sign in
            </Link>
          )}
          <button className="btn btn-line" type="button" onClick={onClose} ref={closeRef}>
            {reason === 'ALREADY_A_PRO' ? 'Use another email' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
}
