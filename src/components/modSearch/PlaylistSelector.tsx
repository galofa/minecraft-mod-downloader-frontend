import React, { useState, useEffect } from 'react';
import { Playlist, CreatePlaylistData } from './types';
import playlistService from '../../services/playlistService';
import { Button, Modal, Input, Alert } from '../ui';

interface PlaylistSelectorProps {
  modSlug: string;
  modTitle: string;
  modIconUrl?: string;
  modAuthor: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function PlaylistSelector({
  modSlug,
  modTitle,
  modIconUrl,
  modAuthor,
  onClose,
  isOpen,
}: PlaylistSelectorProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistData, setNewPlaylistData] = useState<CreatePlaylistData>({
    name: '',
    description: '',
    isPublic: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadPlaylists();
    }
  }, [isOpen]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const userPlaylists = await playlistService.getUserPlaylists();
      setPlaylists(userPlaylists);
    } catch (err) {
      setError('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      setLoading(true);
      await playlistService.addModToPlaylist(playlistId, {
        modSlug,
        modTitle,
        modIconUrl,
        modAuthor,
      });
      onClose();
      // You could add a success notification here
    } catch (err) {
      setError('Failed to add mod to playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistData.name.trim()) {
      setError('Playlist name is required');
      return;
    }

    try {
      setLoading(true);
      const newPlaylist = await playlistService.createPlaylist(newPlaylistData);
      setPlaylists([newPlaylist, ...playlists]);
      setShowCreateForm(false);
      setNewPlaylistData({ name: '', description: '', isPublic: false });
    } catch (err) {
      setError('Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromPlaylist = async (playlistId: number) => {
    try {
      setLoading(true);
      await playlistService.removeModFromPlaylist(playlistId, modSlug);
      // Refresh playlists to update the UI
      await loadPlaylists();
    } catch (err) {
      setError('Failed to remove mod from playlist');
    } finally {
      setLoading(false);
    }
  };

  const isModInPlaylist = (playlist: Playlist) => {
    return playlist.mods.some(mod => mod.modSlug === modSlug);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
      <div className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="bg-slate-800 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={modIconUrl || "/favicon.png"}
              alt={modTitle}
              className="w-12 h-12 rounded bg-slate-700 object-cover"
              onError={(e) => ((e.target as HTMLImageElement).src = "/favicon.png")}
            />
            <div>
              <h4 className="font-semibold text-green-300">{modTitle}</h4>
              <p className="text-sm text-slate-400">by {modAuthor}</p>
            </div>
          </div>
        </div>

        {!showCreateForm ? (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Playlists</h3>
              <Button
                onClick={() => setShowCreateForm(true)}
                variant="outline"
                size="sm"
              >
                Create New
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-4">Loading playlists...</div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-4 text-slate-400">
                No playlists yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {playlists.map((playlist) => {
                  const isInPlaylist = isModInPlaylist(playlist);
                  return (
                    <div
                      key={playlist.id}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-green-300">{playlist.name}</h4>
                        {playlist.description && (
                          <p className="text-sm text-slate-400">{playlist.description}</p>
                        )}
                        <p className="text-xs text-slate-500">
                          {playlist._count?.mods || playlist.mods.length} mods
                        </p>
                      </div>
                                             <Button
                         onClick={() =>
                           isInPlaylist
                             ? handleRemoveFromPlaylist(playlist.id)
                             : handleAddToPlaylist(playlist.id)
                         }
                         variant={isInPlaylist ? "danger" : "primary"}
                         size="sm"
                         disabled={loading}
                       >
                         {isInPlaylist ? "Remove" : "Add"}
                       </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create New Playlist</h3>
            <div className="space-y-3">
              <Input
                label="Playlist Name"
                value={newPlaylistData.name}
                onChange={(e) =>
                  setNewPlaylistData({ ...newPlaylistData, name: e.target.value })
                }
                placeholder="My Awesome Modpack"
                required
              />
              <Input
                label="Description (optional)"
                value={newPlaylistData.description || ''}
                onChange={(e) =>
                  setNewPlaylistData({ ...newPlaylistData, description: e.target.value })
                }
                placeholder="A collection of my favorite mods"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newPlaylistData.isPublic}
                  onChange={(e) =>
                    setNewPlaylistData({ ...newPlaylistData, isPublic: e.target.checked })
                  }
                  className="rounded border-slate-600 bg-slate-700 text-green-400 focus:ring-green-400"
                />
                <span className="text-sm">Make playlist public</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreatePlaylist}
                disabled={loading || !newPlaylistData.name.trim()}
                className="flex-1"
              >
                Create Playlist
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
