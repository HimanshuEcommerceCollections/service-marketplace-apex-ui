export const cleaningTypes = ['Standard', 'Deep Clean', 'Move In/Out'] as const;
export type CleaningType = typeof cleaningTypes[number];

export const bedroomOptions = [1, 2, 3, 4, 5] as const;
export const bathroomOptions = [1, 2, 3, 4] as const;

export const basePrices: Record<CleaningType, number> = {
  'Standard':    95,
  'Deep Clean':  145,
  'Move In/Out': 195,
};

export const bedroomMultiplier  = 25;
export const bathroomMultiplier = 15;
