export type AccentColor = 'green' | 'amber' | 'navy'

export interface PricingState {
  accentColor: AccentColor
  badgeLabel: string
  badgeType: 'green' | 'amber' | 'gray'
  price: string
  description: string
}

export const PRICING_STATES: PricingState[] = [
  {
    accentColor: 'green',
    badgeLabel:  'PRICED',
    badgeType:   'green',
    price:       'From $89',
    description: 'Exact price shown upfront. No surprises before you book.',
  },
  {
    accentColor: 'amber',
    badgeLabel:  'FROM',
    badgeType:   'amber',
    price:       'From $45',
    description: 'Starting price shown. Minimum cost listed clearly.',
  },
  {
    accentColor: 'navy',
    badgeLabel:  'QUOTE',
    badgeType:   'gray',
    price:       'Request Quote',
    description: 'Custom scope required. A coordinator will review and contact you.',
  },
]
