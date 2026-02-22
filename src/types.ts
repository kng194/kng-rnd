export type ProjectStatus = 'Concept' | 'Prototyping' | 'Testing' | 'Final' | 'Archived';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  category: string;
  designer: string;
  start_date: string;
  updated_at: string;
  thumbnail_url?: string;
}

export interface Material {
  id: string;
  name: string;
  type: string;
  origin: string;
  properties: string[];
  stock_status: 'Available' | 'Low' | 'Out of Stock';
  notes: string;
}

export interface PrototypeLog {
  id: string;
  project_id: string;
  date: string;
  version: string;
  notes: string;
  image_url?: string;
}

export type Position = 'Designer Produk' | 'Interior' | 'Motif' | 'Drafter';

export interface Crew {
  id: string;
  name: string;
  photo_url?: string;
  phone: string;
  birth_date: string;
  join_date: string;
  position: Position;
}
