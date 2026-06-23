export type PoolSize = {
  id: string;
  label: string;
  subLabel: string;
  basePrice: number;
};

export type Frequency = {
  id: string;
  label: string;
  multiplier: number;
};

export type ProcessItem = {
  id: number;
  heading: string;
  body: string;
  icon: string;
};

export type TrustStat = {
  heading: string;
  body: string;
};

export type PlanInclusion = {
  text: string;
};

export type CrossSellService = {
  heading: string;
  body: string;
  cta: string;
  href: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  label: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export const poolSizes: PoolSize[] = [
  { id: 'small',  label: 'Small pool',  subLabel: 'Up to 15,000 gal',     basePrice: 89  },
  { id: 'medium', label: 'Medium pool', subLabel: '15,000–25,000 gal', basePrice: 120 },
  { id: 'large',  label: 'Large pool',  subLabel: '25,000–40,000 gal', basePrice: 159 },
  { id: 'custom', label: 'Custom pool', subLabel: 'Over 40,000 gal',       basePrice: 199 },
];

export const frequencies: Frequency[] = [
  { id: 'weekly',    label: 'Weekly',           multiplier: 1.0  },
  { id: 'biweekly',  label: 'Every two weeks',  multiplier: 1.0  },
  { id: 'monthly',   label: 'Monthly',          multiplier: 0.85 },
];

export const processItems: ProcessItem[] = [
  { id: 1, heading: 'Water chemistry testing',    body: 'We test and balance pH, chlorine, alkalinity, and stabilizer levels on every visit.',                            icon: 'flask'    },
  { id: 2, heading: 'Surface skimming & vacuuming', body: 'Leaves, debris, and algae are removed from the surface, walls, and floor.',                                   icon: 'waves'    },
  { id: 3, heading: 'Filter & equipment check',   body: 'We inspect your pump, filter, and skimmer basket — and backwash when needed.',                              icon: 'filter'   },
  { id: 4, heading: 'Chemical treatment',         body: 'Shock treatments and algaecide applied as needed to keep water safe.',                                           icon: 'chemical' },
  { id: 5, heading: 'Visit summary report',       body: 'After each visit, you receive a written summary of what was done and water readings.',                           icon: 'report'   },
  { id: 6, heading: 'Coordinator follow-up',      body: 'Any issues found are flagged to your coordinator before the next scheduled visit.',                              icon: 'phone'    },
];

export const trustStats: TrustStat[] = [
  { heading: 'No contracts',         body: 'Cancel or pause anytime with 48 hours notice'         },
  { heading: 'Vetted pros only',     body: 'All pool techs are background-checked and insured'    },
  { heading: 'Transparent pricing',  body: 'You see the starting price before you request'        },
  { heading: 'Raleigh-based team',   body: 'Local coordinators available Mon–Fri'            },
];

export const planInclusions: PlanInclusion[] = [
  { text: 'Water chemistry analysis'       },
  { text: 'Skimming and vacuuming'         },
  { text: 'Filter and equipment inspection'},
  { text: 'Chemical balancing'             },
  { text: 'Written visit summary'          },
  { text: 'Coordinator flag if issue found'},
];

export const crossSellServices: CrossSellService[] = [
  { heading: 'House Cleaning', body: 'Professional cleaning for every room, on your schedule.',  cta: 'View Cleaning',   href: '/services/house-cleaning' },
  { heading: 'HVAC Service',   body: 'Filter changes, tune-ups, and system checks.',             cta: 'View HVAC',       href: '/services/hvac'           },
  { heading: 'Lawn Care',      body: 'Mowing, edging, and seasonal cleanup.',                   cta: 'View Lawn Care',  href: '/services/lawncare'       },
];

export const testimonials: Testimonial[] = [
  { quote: 'The tech shows up on time every week and leaves a written note of what he did. That alone is worth it.',         name: 'Marcus T.', label: 'Pool owner, North Raleigh' },
  { quote: "I've tried two other pool services. This was the first one where I didn't have to chase anyone down.",           name: 'Priya S.',  label: 'Pool owner, Cary'          },
  { quote: 'Pricing was clear upfront. No surprises. My coordinator called me back the same day.',                          name: 'Derek W.',  label: 'Pool owner, Wake Forest'   },
];

export const faqItems: FAQItem[] = [
  { question: 'How does pool care pricing work?',      answer: 'You select your pool size and service frequency to see a starting price. A coordinator confirms the final price before your first visit — no payment is collected until then.'                                           },
  { question: 'Do I need to be home during service?',  answer: 'No. As long as the tech has access to the pool gate, service can be completed without you present. You’ll receive a written summary after each visit.'                                                                    },
  { question: 'Can I pause or cancel my plan?',        answer: 'Yes. Cancel or pause anytime with 48 hours notice. There are no contracts or cancellation fees.'                                                                                                                               },
  { question: 'What if my pool needs a repair?',       answer: 'If the tech identifies a repair need during a routine visit, your coordinator will reach out with options before any work is done. Repairs are quoted separately.'                                                              },
  { question: 'What chemicals are used?',              answer: 'Standard pool chemicals: chlorine, pH adjusters, alkalinity balancers, algaecide, and shock as needed. All chemicals are handled and disposed of safely by the tech.'                                                          },
  { question: 'Is this available in my area?',         answer: 'Pool service is currently available across Wake County, including Raleigh, Cary, Apex, Morrisville, Garner, and Wake Forest.'                                                                                                  },
];
