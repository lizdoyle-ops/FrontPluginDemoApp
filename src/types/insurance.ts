/** Pet insurance–style native objects (camelCase; maps from API JSON snake_case at boundaries if needed). */

export interface Policy {
  id: string;
  policyNumber: string;
  product: string;
  status: string;
  startDate: string;
  renewalDate: string;
  annualPremium: number;
  paymentFrequency: string;
  monthlyDirectDebit: number;
  paymentStatus: string;
}

export interface Policyholder {
  name: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  authorisedContacts: string[];
}

export interface PetPreExistingCondition {
  condition: string;
  notedDate: string;
  status: string;
  excludedFromCover: boolean;
}

export type PetGender = "male" | "female" | "unknown";

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dob?: string;
  age?: number;
  gender?: PetGender;
  neutered?: boolean;
  microchip?: string;
  preExistingConditions: PetPreExistingCondition[];
  /** Legacy / optional free-text (policyholder also has authorisedContacts array). */
  authorisedContacts?: string;
  notes?: string;
}

export interface CoverExcess {
  fixed: number;
  coInsurance: string;
}

export interface Cover {
  vetFeeLimit: number;
  vetFeeLimitType: string;
  remainingLimitThisYear: number;
  excess: CoverExcess;
  complementaryTreatment: number;
  dental: number;
  thirdPartyLiability: number;
  exclusions: string[];
}

export interface ClaimHistoryItem {
  /** Stable id for CRUD paths; usually same as claimId. */
  id: string;
  claimId: string;
  dateSubmitted: string;
  condition: string;
  vet: string;
  amountClaimed: number;
  amountPaid: number;
  excessApplied: number;
  coInsuranceApplied: number;
  status: string;
}

export function emptyPolicyholder(): Policyholder {
  return {
    name: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    authorisedContacts: [],
  };
}

export function emptyCover(): Cover {
  return {
    vetFeeLimit: 0,
    vetFeeLimitType: "",
    remainingLimitThisYear: 0,
    excess: { fixed: 0, coInsurance: "" },
    complementaryTreatment: 0,
    dental: 0,
    thirdPartyLiability: 0,
    exclusions: [],
  };
}
