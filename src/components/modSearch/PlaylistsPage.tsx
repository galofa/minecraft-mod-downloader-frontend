import React, { useState, useEffect } from 'react';
import { Playlist, CreatePlaylistData } from './types';
import playlistService from '../../services/playlistService';
import { Button, Modal, Input, Alert, Card } from '../ui';
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiEyeOff, FiMusic } from 'react-icons/fi';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [newPlaylistData, setNewPlaylistData] = useState<CreatePlaylistData>({
    name: '',
    description: '',
    isPublic: false,
  });

  useEffect(() => {
    loadPlaylists();
  }, []);

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

  const handleCreatePlaylist = async () => {
    if (!newPlaylistData.name.trim()) {
      setError('Playlist name is required');
      return;
    }

    try {
      setLoading(true);
      const newPlaylist = await playlistService.createPlaylist(newPlaylistData);
      setPlaylists([newPlaylist, ...playlists]);
      setShowCreateModal(false);
      setNewPlaylistData({ name: '', description: '', isPublic: false });
      setError(null);
    } catch (err) {
      setError('Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlaylist = async () => {
    if (!selectedPlaylist || !newPlaylistData.name.trim()) {
      setError('Playlist name is required');
      return;
    }

    try {
      setLoading(true);
      await playlistService.updatePlaylist(selectedPlaylist.id, newPlaylistData);
      setPlaylists(playlists.map(p => 
        p.id === selectedPlaylist.id 
          ? { ...p, ...newPlaylistData }
          : p
      ));
      setShowEditModal(false);
      setSelectedPlaylist(null);
      setNewPlaylistData({ name: '', description: '', isPublic: false });
      setError(null);
    } catch (err) {
      setError('Failed to update playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    if (!confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await playlistService.deletePlaylist(playlistId);
      setPlaylists(playlists.filter(p => p.id !== playlistId));
      setError(null);
    } catch (err) {
      setError('Failed to delete playlist');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setNewPlaylistData({
      name: playlist.name,
      description: playlist.description || '',
      isPublic: playlist.isPublic,
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setNewPlaylistData({ name: '', description: '', isPublic: false });
    setShowCreateModal(true);
  };

  if (loading && playlists.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Loading playlists...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-300 mb-2">My Playlists</h1>
          <p className="text-slate-400">Organize your favorite mods into custom collections</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <FiPlus />
          Create Playlist
        </Button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)} className="mb-6">
          {error}
        </Alert>
      )}

      {playlists.length === 0 ? (
        <Card className="text-center py-12">
          <FiMusic className="text-6xl text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No playlists yet</h3>
          <p className="text-slate-400 mb-6">
            Create your first playlist to start organizing your favorite mods
          </p>
          <Button onClick={openCreateModal} className="flex items-center gap-2 mx-auto">
            <FiPlus />
            Create Your First Playlist
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-300 mb-2">
                    {playlist.name}
                  </h3>
                  {playlist.description && (
                    <p className="text-slate-400 text-sm mb-3">
                      {playlist.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiMusic />
                      {playlist._count?.mods || playlist.mods.length} mods
                    </span>
                    <span className="flex items-center gap-1">
                      {playlist.isPublic ? <FiEye /> : <FiEyeOff />}
                      {playlist.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>

              {playlist.mods.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Recent mods:</h4>
                  <div className="space-y-2">
                    {playlist.mods.slice(0, 3).map((mod) => (
                      <div key={mod.id} className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                        <img
                          src={mod.modIconUrl || "/favicon.png"}
                          alt={mod.modTitle}
                          className="w-6 h-6 rounded bg-slate-700 object-cover"
                          onError={(e) => ((e.target as HTMLImageElement).src = "/favicon.png")}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-300 truncate">
                            {mod.modTitle}
                          </p>
                          <p className="text-xs text-slate-400">by {mod.modAuthor}</p>
                        </div>
                      </div>
                    ))}
                    {playlist.mods.length > 3 && (
                      <p className="text-xs text-slate-500 text-center">
                        +{playlist.mods.length - 3} more mods
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(playlist)}
                  className="flex-1"
                >
                  <FiEdit3 className="mr-2" />
                  Edit
                </Button>
                                 <Button
                   variant="danger"
                   size="sm"
                   onClick={() => handleDeletePlaylist(playlist.id)}
                   className="flex-1"
                 >
                   <FiTrash2 className="mr-2" />
                   Delete
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Playlist"
      >
        <div className="space-y-4">
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
          <div className="flex gap-2">
            <Button
              onClick={handleCreatePlaylist}
              disabled={loading || !newPlaylistData.name.trim()}
              className="flex-1"
            >
              Create Playlist
            </Button>
            <Button
              onClick={() => setShowCreateModal(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Playlist Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Playlist"
      >
        <div className="space-y-4">
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
          <div className="flex gap-2">
            <Button
              onClick={handleEditPlaylist}
              disabled={loading || !newPlaylistData.name.trim()}
              className="flex-1"
            >
              Update Playlist
            </Button>
            <Button
              onClick={() => setShowEditModal(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
