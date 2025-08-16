export interface ModrinthProject {
  id: string;
  slug: string;
  author: string;
  title: string;
  description: string;
  downloads: number;
  followers: number;
  client_side: string;
  server_side: string;
  categories: string[];
  project_type: string;
  gallery: any[];
  icon_url: string | null;
  updated: string;
  loaders: string[];
} 