export interface Step {
  number: string
  title: string
  description: string
}

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number:      '01',
    title:       'Choose a service',
    description: 'Browse 11 categories. See transparent pricing before you commit.',
  },
  {
    number:      '02',
    title:       'Configure your job',
    description: 'Options update pricing in real time. Submit when ready.',
  },
  {
    number:      '03',
    title:       'A coordinator confirms',
    description: 'Matched with a vetted independent professional.',
  },
]
