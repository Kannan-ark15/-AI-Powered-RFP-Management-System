export interface Vendor {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  specialties?: string[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}