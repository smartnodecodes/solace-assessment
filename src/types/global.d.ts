export interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties?: string[];
  payload?: JSON;
  yearsOfExperience: number;
  phoneNumber: string;
}