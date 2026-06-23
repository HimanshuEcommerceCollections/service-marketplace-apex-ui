export interface HowItWorksStep {
  stepNumber: string;
  icon: string;
  title: string;
  body: string;
}

export const steps: HowItWorksStep[] = [
  {
    stepNumber: "01",
    icon: "search",
    title: "Choose your service",
    body: "Pick a property size, select your preferred frequency, and see your starting price instantly.",
  },
  {
    stepNumber: "02",
    icon: "calendar",
    title: "Request is confirmed",
    body: "A coordinator confirms the request with an independent professional.",
  },
  {
    stepNumber: "03",
    icon: "check",
    title: "Coordinator confirms",
    body: "A coordinator confirms the request with an independent professional.",
  },
];
