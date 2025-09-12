import { Playlist, CreatePlaylistData, AddModToPlaylistData } from '../components/modSearch/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class PlaylistService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Create a new playlist
  async createPlaylist(data: CreatePlaylistData): Promise<Playlist> {
    const response = await fetch(`${API_BASE_URL}/playlists`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create playlist');
    }

    return response.json();
  }

  // Get all playlists for the current user
  async getUserPlaylists(): Promise<Playlist[]> {
    const response = await fetch(`${API_BASE_URL}/playlists`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    return response.json();
  }

  // Get a specific playlist
  async getPlaylist(playlistId: number): Promise<Playlist> {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlist');
    }

    return response.json();
  }

  // Update playlist details
  async updatePlaylist(playlistId: number, data: Partial<CreatePlaylistData>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update playlist');
    }
  }

  // Delete a playlist
  async deletePlaylist(playlistId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete playlist');
    }
  }

  // Add a mod to a playlist
  async addModToPlaylist(playlistId: number, modData: AddModToPlaylistData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/mods`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(modData),
    });

    if (!response.ok) {
      throw new Error('Failed to add mod to playlist');
    }
  }

  // Remove a mod from a playlist
  async removeModFromPlaylist(playlistId: number, modSlug: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/mods`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ modSlug }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove mod from playlist');
    }
  }

  // Check if a mod is in a specific playlist
  async isModInPlaylist(playlistId: number, modSlug: string): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/playlists/${playlistId}/mods/check?modSlug=${encodeURIComponent(modSlug)}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to check mod in playlist');
    }

    const data = await response.json();
    return data.isInPlaylist;
  }

  // Get all playlists containing a specific mod
  async getPlaylistsContainingMod(modSlug: string): Promise<Playlist[]> {
    const response = await fetch(
      `${API_BASE_URL}/playlists/mods/containing?modSlug=${encodeURIComponent(modSlug)}`,
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch playlists containing mod');
    }

    return response.json();
  }
}

export default new PlaylistService();
