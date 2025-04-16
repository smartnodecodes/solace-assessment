export const COLOR_PALETTE = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-gray-500",
  "bg-lime-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-emerald-500",
] as const;

export const ALL_SPECIALTIES = [
  'Personal growth',
  'Substance use/abuse',
  'Pediatrics',
  "Women's issues (post-partum, infertility, family planning)",
  'Chronic pain',
  'Weight loss & nutrition',
  'Eating disorders',
  'Diabetic Diet and nutrition',
  'Coaching (leadership, career, academic and wellness)',
  'Life coaching',
  'Obsessive-compulsive disorders',
  'Neuropsychological evaluations & testing (ADHD testing)',
  'Attention and Hyperactivity (ADHD)',
  'Sleep issues',
  'Schizophrenia and psychotic disorders',
  "Men's issues",
  'Relationship Issues (family, friends, couple, etc)',
  'Trauma & PTSD',
  'Personality disorders',
  'Suicide History/Attempts',
  'General Mental Health (anxiety, depression, stress, grief, life transitions)',
  'Urology (Urinary and Male Reproductive Health)',
  'Allergy and Immunology (Allergy Treatment)',
  'Geriatrics (Elderly Health)',
  'Emergency Medicine (Emergency Care)'
];

export type Specialty = typeof ALL_SPECIALTIES[number];

export function getSpecialtyInfo(specialty: Specialty) {
  const index = ALL_SPECIALTIES.indexOf(specialty);
  const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
  const [title, description] = specialty.split(" (");
  return {
    color,
    title,
    description: description ? description.replace(")", "") : undefined,
  };
}

export function formatPhoneNumber(phoneNumber: string | number | null | undefined): string {
  if (!phoneNumber) return "";
  
  const phoneString = String(phoneNumber);
  const cleaned = phoneString.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return phoneString;
} 
