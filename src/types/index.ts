export type CrisisType = 'fire' | 'flood' | 'earthquake' | 'medical' | 'stampede';
export type IncidentStatus = 'active' | 'acknowledged' | 'resolved';
export type UserRole = 'guest' | 'staff' | 'admin';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  floor?: string;
  roomNumber?: string;
}

export interface AIResponse {
  immediateActions: string[];
  staffInstructions: string[];
  guestInstructions: string[];
  estimatedResponseTime: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  contactNumbers: string[];
}

export interface IncidentUpdate {
  id: string;
  message: string;
  createdAt: Date;
  createdBy: string;
}

export interface Incident {
  id: string;
  crisisType: CrisisType;
  status: IncidentStatus;
  location: Location;
  reportedBy: string;
  reportedAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
  description?: string;
  affectedCount?: number;
  aiResponse?: AIResponse;
  updates: IncidentUpdate[];
}
