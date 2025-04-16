export const formatPhoneNumber = (phoneNumber: string | number) => {
  if (!phoneNumber) return "";
  const phoneString = phoneNumber.toString().replace(/\D/g, "");
  return phoneString.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

export const COLOR_PALETTE = [
  "bg-blue-500 hover:bg-blue-600",
  "bg-green-500 hover:bg-green-600",
  "bg-purple-500 hover:bg-purple-600",
  "bg-pink-500 hover:bg-pink-600",
  "bg-orange-500 hover:bg-orange-600",
  "bg-teal-500 hover:bg-teal-600",
  "bg-indigo-500 hover:bg-indigo-600",
  "bg-rose-500 hover:bg-rose-600",
  "bg-yellow-500 hover:bg-yellow-600",
  "bg-red-500 hover:bg-red-600",
  "bg-gray-500 hover:bg-gray-600",
  "bg-lime-500 hover:bg-lime-600",
  "bg-cyan-500 hover:bg-cyan-600",
  "bg-fuchsia-500 hover:bg-fuchsia-600",
  "bg-violet-500 hover:bg-violet-600",
  "bg-amber-500 hover:bg-amber-600",
  "bg-emerald-500 hover:bg-emerald-600",
] as const;

export const ALL_SPECIALTIES = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

export function getSpecialtyInfo(specialty: string): { color: string; title: string; description: string } {
  const index = ALL_SPECIALTIES.indexOf(specialty);
  const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
  const [title, description] = specialty.split(/\s*\(([^)]+)\)/);
  
  return {
    color,
    title: title.trim(),
    description: description?.trim() || ""
  };
}

export const cleanSpecialtyTitle = (specialty: string) => {
  return specialty.replace(/([A-Z])/g, " $1").trim();
};
