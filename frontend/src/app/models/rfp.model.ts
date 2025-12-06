export interface RFP {
  _id?: string;
  title: string;
  description: string;
  requirements: string[];
  deadline: Date | string;
  budget: number;
  contactEmail: string;
  status: 'draft' | 'sent' | 'closed';
  createdAt?: Date;
  updatedAt?: Date;
}