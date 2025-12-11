'use client';

import React from 'react';
import Link from 'next/link';

interface SMSOptInCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

/**
 * A2P 10DLC Compliant SMS Opt-In Checkbox Component
 *
 * This component displays the required opt-in language for SMS messaging
 * compliance with carrier requirements. It must be:
 * - Unchecked by default (explicit opt-in)
 * - Link to privacy policy
 * - Include message rates disclosure
 * - Include opt-out method
 *
 * Copy matches NEVERMISSLEAD_SMS_OPTIN_COPY.md Option A exactly.
 */
export function SMSOptInCheckbox({
  checked,
  onChange,
  error,
  disabled = false,
  id = 'sms-opt-in',
  name = 'smsOptedIn',
}: SMSOptInCheckboxProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5 pt-0.5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
        <label htmlFor={id} className="flex-1 text-sm leading-relaxed">
          <span className="font-medium text-gray-700">
            Yes, text me lead confirmations & appointment updates
          </span>
          <br />
          <span className="text-gray-600">
            Message and data rates may apply. Text STOP to opt-out.{' '}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
            >
              Read our Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 pl-7" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default SMSOptInCheckbox;
