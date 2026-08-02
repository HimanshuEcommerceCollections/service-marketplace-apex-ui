// Browser-side client for the public property-manager enquiry endpoint
// (POST /api/v1/pm-requests). The server creates a PMRequest plus its parent
// QuoteRequest (source PM_FORM) in one atomic write and returns both ids.

import { api } from '../app/lib/api-client';

export type PmBundle = 'TURNOVER' | 'LISTING_PREP';

/** What the form collects — a superset of what the endpoint's schema accepts. */
export interface PmRequestForm {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  unitsLabel: string; // e.g. "11–50 units"
  unitsValue: number; // integer the endpoint stores as units_est
  bundle: PmBundle;
  address: string;
  timeline?: string;
  scope?: string;
}

export interface PmRequestResult {
  pm_request_id: string;
  quote_request_id: string;
}

/**
 * PMRequest has no column for the property address, the preferred timeline, or
 * the unit RANGE the form offers (only an integer `unitsEst`). Rather than drop
 * them, they are appended to `scope_notes` — which the server copies verbatim
 * into QuoteRequest.description, the field a coordinator actually reads. If those
 * ever need to be queryable, they should become real columns; until then nothing
 * the user typed is lost.
 */
function composeScopeNotes(f: PmRequestForm): string {
  const lines: string[] = [];
  if (f.scope?.trim()) lines.push(f.scope.trim(), '');
  lines.push(`Property address: ${f.address.trim()}`);
  lines.push(`Estimated units: ${f.unitsLabel}`);
  if (f.timeline) lines.push(`Preferred timeline: ${f.timeline}`);
  return lines.join('\n');
}

export function submitPmRequest(f: PmRequestForm): Promise<PmRequestResult> {
  return api<PmRequestResult>('/pm-requests', {
    method: 'POST',
    body: {
      company: f.company.trim(),
      contact: {
        name: f.contactName.trim(),
        email: f.email.trim(),
        phone: f.phone.trim(),
      },
      units_est: f.unitsValue,
      bundle: f.bundle,
      scope_notes: composeScopeNotes(f),
    },
  });
}
