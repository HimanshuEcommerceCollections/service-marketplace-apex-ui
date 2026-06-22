export interface TrustStat {
  stat: string
  label: string
  supporting: string
}

export const TRUST_STATS: TrustStat[] = [
  { stat: '100%',     label: 'Transparent pricing',       supporting: 'Every service shows pricing before you submit.' },
  { stat: 'Wake Co.', label: 'Wake County focus',          supporting: 'Serving Wake County, Raleigh NC.'              },
  { stat: 'Vetted',   label: 'Independent professionals',  supporting: 'Background-checked, coordinator-confirmed.'    },
  { stat: 'Always',   label: 'Coordinator confirmed',      supporting: 'Human coordinator reviews every booking.'      },
]
