export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is included in a standard clean?',
    answer: 'A standard clean covers kitchens, bathrooms, dusting, and floors across your selected home size. Add-ons are available for deep and move-in / move-out cleans. Independent professionals complete the service, coordinator-confirmed.',
  },
  {
    id: 'faq-2',
    question: 'How does pricing work?',
    answer: 'Pricing is based on your home size and cleaning type. You see the estimated price before requesting — a coordinator confirms the final price before service.',
  },
  {
    id: 'faq-3',
    question: 'Can I schedule recurring cleaning?',
    answer: 'Yes. You can set up weekly, bi-weekly, or monthly recurring service and keep the same professional arrangement each visit.',
  },
  {
    id: 'faq-4',
    question: 'Who completes the service?',
    answer: 'Services are completed by independent professionals matched and confirmed by an Apex coordinator.',
  },
];
