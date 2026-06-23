export interface PestStep {
  stepNumber: string;
  icon: string;
  title: string;
  body: string;
}

export const steps: PestStep[] = [
  {
    stepNumber: "01",
    icon: "clipboard",
    title: "Describe your situation",
    body: "Choose a pest type or situation. We review treatment options based on your situation and property.",
  },
  {
    stepNumber: "02",
    icon: "list",
    title: "Review service options",
    body: "We review treatment options based on your situation and property.",
  },
  {
    stepNumber: "03",
    icon: "check",
    title: "Coordinator confirms",
    body: "A coordinator confirms next steps with an independent professional.",
  },
];
