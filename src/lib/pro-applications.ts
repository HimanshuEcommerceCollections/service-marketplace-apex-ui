// Browser-side client for the public Become-an-Apex-Pro endpoint
// (POST /api/v1/pro-applications).

import { api } from '../app/lib/api-client';

export interface ProApplicationForm {
  name: string;
  email: string;
  phone: string;
  zip: string;
  /** SERVICE SLUGS, not display labels — the endpoint rejects unknown trades. */
  trades: string[];
  /** Record<tradeSlug, Record<ackKey, boolean>> — collected, never verified. */
  acknowledgements: Record<string, Record<string, boolean>>;
  experience: string;
  company?: string;
  availability: string;
  preferredStart?: string;
  intro?: string;
}

export interface ProApplicationResult {
  application_id: string;
}

export function submitProApplication(f: ProApplicationForm): Promise<ProApplicationResult> {
  return api<ProApplicationResult>('/pro-applications', {
    method: 'POST',
    body: {
      name: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      zip: f.zip.trim(),
      trades: f.trades,
      acknowledgements: f.acknowledgements,
      experience: f.experience,
      ...(f.company?.trim() ? { company: f.company.trim() } : {}),
      availability: f.availability,
      ...(f.preferredStart ? { preferred_start: f.preferredStart } : {}),
      ...(f.intro?.trim() ? { intro: f.intro.trim() } : {}),
    },
  });
}
