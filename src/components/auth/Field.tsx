'use client';

// Floating-label field from the auth design, with the same validation choreography
// as the original (validate on blur once non-empty, live-correct afterwards, shake
// + message on a failed submit) — expressed in React state instead of class
// toggling from a vanilla script.

import { useState } from 'react';

export interface FieldModel {
  value: string;
  setValue: (v: string) => void;
  touched: boolean;
  setTouched: (v: boolean) => void;
  valid: boolean;
  shake: boolean;
  /** Mark touched + shake if invalid. Returns validity — call from submit. */
  force: () => boolean;
  reset: () => void;
}

export function useField(validate: (v: string) => boolean): FieldModel {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [shake, setShake] = useState(false);
  const valid = validate(value);

  return {
    value,
    setValue,
    touched,
    setTouched,
    valid,
    shake,
    force() {
      setTouched(true);
      if (!valid) {
        setShake(true);
        setTimeout(() => setShake(false), 450);
      }
      return valid;
    },
    reset() {
      setValue('');
      setTouched(false);
    },
  };
}

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

interface FieldProps {
  field: FieldModel;
  id: string;
  label: string;
  message: string;
  type?: string;
  autoComplete?: string;
  /** Password field: renders the show/hide eye and forces the input type. */
  toggle?: boolean;
  /** Green tick on a valid value (the design omits it on the sign-in password). */
  tick?: boolean;
  /** Strength meter and similar extras, rendered inside the field wrapper. */
  children?: React.ReactNode;
}

export default function Field({
  field,
  id,
  label,
  message,
  type = 'text',
  autoComplete,
  toggle = false,
  tick = true,
  children,
}: FieldProps) {
  const [show, setShow] = useState(false);
  const invalid = field.touched && !field.valid;
  const ok = field.touched && field.valid;

  return (
    <div
      className={[
        'ffld',
        toggle ? 'has-toggle' : '',
        invalid ? 'err' : '',
        ok ? 'ok' : '',
        invalid && field.shake ? 'shake' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        id={id}
        type={toggle ? (show ? 'text' : 'password') : type}
        placeholder=" "
        autoComplete={autoComplete}
        value={field.value}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-msg` : undefined}
        onChange={(e) => field.setValue(e.target.value)}
        onBlur={() => {
          if (field.value.length > 0) field.setTouched(true);
        }}
      />
      <label htmlFor={id}>{label}</label>

      {toggle && (
        <button
          type="button"
          className="eye"
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          onClick={() => setShow((v) => !v)}
        >
          {show ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7c2 0 3.8.7 5.3 1.6M22 12s-3.5 7-10 7c-2 0-3.8-.7-5.3-1.6" />
              <path d="M3 3l18 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}

      {tick && (
        <span className="tick" aria-hidden="true">
          <Check />
        </span>
      )}

      <span className="msg" id={`${id}-msg`}>
        {message}
      </span>
      {children}
    </div>
  );
}
