export interface PestType {
  id: string;
  label: string;
  icon: string;
}

export const pestTypes: PestType[] = [
  { id: "general", label: "General prevention", icon: "bug" },
  { id: "indoor",  label: "Indoor issue",        icon: "bug" },
  { id: "outdoor", label: "Outdoor issue",       icon: "bug" },
  { id: "rodent",  label: "Rodents / wildlife",  icon: "bug" },
];
