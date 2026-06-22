export type PriceBadge = 'green' | 'amber' | 'gray'
export type ServiceType = 'Recurring' | 'One-Time' | 'Quote-Based'

export interface Service {
  letter: string
  name: string
  description: string
  price: string
  badgeType: PriceBadge
  serviceType: ServiceType
}

export const SERVICES: Service[] = [
  { letter: 'H', name: 'House Cleaning',   description: 'Recurring and deep cleaning options with clear pricing.',       price: 'From $89',  badgeType: 'green', serviceType: 'Recurring'    },
  { letter: 'L', name: 'Lawn Care',        description: 'Routine lawn maintenance based on your property size.',         price: 'From $45',  badgeType: 'amber', serviceType: 'Recurring'    },
  { letter: 'P', name: 'Pool Service',     description: 'Keep your pool maintained with flexible service options.',      price: 'From $120', badgeType: 'amber', serviceType: 'Recurring'    },
  { letter: 'P', name: 'Pest Control',     description: 'Protect your home with straightforward treatment plans.',       price: 'From $79',  badgeType: 'green', serviceType: 'Recurring'    },
  { letter: 'J', name: 'Junk Removal',     description: 'From small loads to larger cleanouts.',                         price: 'From $99',  badgeType: 'amber', serviceType: 'One-Time'     },
  { letter: 'P', name: 'Painting',         description: 'Interior and exterior projects requiring custom planning.',     price: 'Quote',     badgeType: 'gray',  serviceType: 'Quote-Based'  },
  { letter: 'H', name: 'Handyman',         description: 'Everyday repairs and home improvement tasks.',                  price: 'From $65',  badgeType: 'amber', serviceType: 'One-Time'     },
  { letter: 'P', name: 'Pressure Washing', description: 'Refresh outdoor surfaces with transparent pricing.',            price: 'From $99',  badgeType: 'green', serviceType: 'One-Time'     },
  { letter: 'W', name: 'Window Cleaning',  description: 'Clear pricing based on window count.',                          price: 'From $75',  badgeType: 'green', serviceType: 'One-Time'     },
  { letter: 'S', name: 'Smart Home',       description: 'Install and configure connected home devices.',                 price: 'From $49',  badgeType: 'amber', serviceType: 'One-Time'     },
  { letter: 'M', name: 'Moving Help',      description: 'Flexible help for home transitions.',                           price: 'From $99',  badgeType: 'amber', serviceType: 'One-Time'     },
]
