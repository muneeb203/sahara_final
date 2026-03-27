export type LawyerStatus = "pending" | "approved" | "rejected";
export type RequestStatus = "pending" | "accepted" | "rejected";

export interface LawyerProfile {
  id: string;
  full_name: string;
  specialization: string;
  city: string;
  experience_years: number;
  bio: string;
  phone?: string | null;
  status: LawyerStatus;
  created_at?: string;
}

export interface ServiceRequest {
  id: string;
  lawyer_id: string;
  user_id?: string | null;
  issue_description: string;
  phone?: string | null;
  email?: string | null;
  status: RequestStatus;
  created_at?: string;
}

export interface LawyerProfileInput {
  full_name: string;
  specialization: string;
  city: string;
  experience_years: number;
  bio: string;
  phone?: string;
}

export interface ServiceRequestInput {
  lawyer_id: string;
  issue_description: string;
  phone?: string;
  email?: string;
}
