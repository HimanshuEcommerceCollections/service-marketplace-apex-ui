export interface TrustStat {
  stat: string;
  title: string;
  body: string;
}

export const trustStats: TrustStat[] = [
  { stat: '100%', title: 'Transparent pricing', body: 'Every service shows its pricing model — before you submit anything.' },
  { stat: 'Wake Co.', title: 'Local service area', body: 'Serving Wake County, Raleigh NC. Not a national chain.' },
  { stat: 'Vetted', title: 'Independent professionals', body: 'Background-checked and coordinator-confirmed. [Sample]' },
  { stat: 'Always', title: 'Coordinator confirmed', body: "A real coordinator reviews every booking before it's accepted. [Sample]" },
];
