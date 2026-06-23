export interface YardSize {
  id: string;
  label: string;
  sublabel: string;
  basePrice: number;
}

export const yardSizes: YardSize[] = [
  { id: "small",  label: "Small yard",       sublabel: "Up to ¼ acre",     basePrice: 45  },
  { id: "medium", label: "Medium yard",      sublabel: "¼ – ½ acre", basePrice: 65  },
  { id: "large",  label: "Large yard",       sublabel: "½ – 1 acre",   basePrice: 90  },
  { id: "xlarge", label: "Extra large yard", sublabel: "1+ acre",               basePrice: 130 },
];
