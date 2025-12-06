import { Vendor } from './vendor.model';

export interface Proposal {
  _id?: string;
  rfpId: string;
  vendorId: string | Vendor;
  vendorEmail: string;
  subject: string;
  body: string;
  parsedData: {
    proposedCost: number;
    timeline: string;
    keyFeatures: string[];
    experience: string;
    teamSize: number;
  };
  score?: number;
  recommendation?: string;
  receivedAt: Date;
  createdAt?: Date;
}