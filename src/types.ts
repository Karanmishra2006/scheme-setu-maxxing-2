export type Language = 'en' | 'hi';

export type AppView = 'landing' | 'flow' | 'results' | 'schemes' | 'transparency';

export interface UserProfile {
  supportGoal: 'New Business' | 'Expand Business' | 'Education' | 'Agriculture' | 'Skill Training';
  projectCost: number;
  familyIncome: number;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  priorityCategory: 'Yes' | 'No'; // Women, SC/ST, Divyangjan/PwD, Minority, Ex-Servicemen
  state: string;
  district: string;
  locationType: 'Rural' | 'Urban' | 'Semi-Urban';
  socialCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'Other';
  occupation: 'Aspiring Entrepreneur' | 'Business Owner' | 'Student' | 'Farmer / Other';
  businessType: 'Manufacturing' | 'Service' | 'Trading' | 'Agro-allied';
  businessStage: 'New' | 'Existing';
  turnover: number;
}

export interface Scheme {
  id: string;
  title: string;
  shortName: string;
  ministry: string;
  category: 'MSME' | 'Agriculture' | 'Social' | 'Education';
  sectorType: 'Central Sector' | 'Centrally Sponsored' | 'Priority Banking' | 'Credit Guarantee';
  benefitHeadline: string;
  maxCeilingText: string;
  description: string;
  statutoryClause: string;
  officialPortalUrl: string;
  objectives: string;
  eligibilityParameters: string[];
  requiredDocuments: string[];
  // Rule verification parameters
  minAge?: number;
  maxAge?: number;
  allowedOccupations?: string[];
  allowedCategories?: string[];
  allowedGenders?: string[];
  maxIncome?: number;
  maxProjectCost?: number;
}

export interface SchemeMatch {
  scheme: Scheme;
  fitPercentage: number;
  statutoryJustification: string;
  matchedCriteria: string[];
  prerequisites: string[];
  subsidyEstimate: string;
}
