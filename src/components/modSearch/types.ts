export interface ModrinthProject {
  slug: string;
  title: string;
  description: string;
  project_type: string;
  client_side: string;
  server_side: string;
  author: string;
  downloads: number;
  follows: number;
  project_id: string;
  icon_url?: string;
  color?: number;
  created: string;
  updated: string;
  published: string;
  categories: string[];
  versions: string[];
  loaders: string[];
  gallery?: ModrinthGalleryItem[];
  featured_gallery?: string;
  team: string;
  issues_url?: string;
  source_url?: string;
  wiki_url?: string;
  discord_url?: string;
  donation_urls?: ModrinthDonationUrl[];
  status: string;
  license?: ModrinthLicense;
  body?: string;
  moderator_message?: ModrinthModeratorMessage;
}

export interface ModrinthGalleryItem {
  url: string;
  featured: boolean;
  title?: string;
  description?: string;
  created: string;
  ordering: number;
}

export interface ModrinthDonationUrl {
  id: string;
  platform: string;
  url: string;
}

export interface ModrinthLicense {
  id: string;
  name: string;
  url?: string;
}

export interface ModrinthModeratorMessage {
  message: string;
  body?: string;
}

export interface ModrinthSearchResponse {
  hits: ModrinthProject[];
  offset: number;
  limit: number;
  total_hits: number;
}

// Playlist types
export interface Playlist {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  mods: PlaylistMod[];
  _count?: {
    mods: number;
  };
}

export interface PlaylistMod {
  id: number;
  playlistId: number;
  modSlug: string;
  modTitle: string;
  modIconUrl?: string;
  modAuthor: string;
  addedAt: string;
}

export interface CreatePlaylistData {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddModToPlaylistData {
  modSlug: string;
  modTitle: string;
  modIconUrl?: string;
  modAuthor: string;
} 