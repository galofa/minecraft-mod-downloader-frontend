import React, { useState, useEffect } from 'react';
import { ModList, CreateModListData } from './types';
import modListService from '../../services/modListService';
import { Button, Modal, Input, Alert, Card } from '../ui';
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiEyeOff, FiMusic, FiUpload, FiDownload } from 'react-icons/fi';
import { useNotification } from '../../contexts/NotificationContext';

const MinecraftBlock = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="16" width="48" height="32" rx="6" fill="#8B5C2A" stroke="#3E2723" strokeWidth="3"/>
    <rect x="12" y="20" width="40" height="24" rx="3" fill="#C2B280" stroke="#3E2723" strokeWidth="2"/>
    <rect x="20" y="28" width="24" height="8" rx="2" fill="#A1887F" stroke="#3E2723" strokeWidth="1.5"/>
    <rect x="28" y="36" width="8" height="4" rx="1" fill="#6D4C1B" stroke="#3E2723" strokeWidth="1"/>
  </svg>
);

export default function ModListsPage() {
  const [modlists, setModLists] = useState<ModList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModList, setSelectedModList] = useState<ModList | null>(null);
  const [newModListData, setNewModListData] = useState<CreateModListData>({
    name: '',
    description: '',
    isPublic: false,
  });
  const { showNotification } = useNotification();

  useEffect(() => {
    loadModLists();
  }, []);

  const loadModLists = async () => {
    try {
      setLoading(true);
      const userModLists = await modListService.getUserModLists();
      setModLists(userModLists);
    } catch (err) {
      setError('Failed to load mod lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModList = async () => {
    if (!newModListData.name.trim()) {
      setError('Mod List name is required');
      return;
    }
    try {
      setLoading(true);
      const newModList = await modListService.createModList(newModListData);
      setModLists([newModList, ...modlists]);
      setShowCreateModal(false);
      setNewModListData({ name: '', description: '', isPublic: false });
      setError(null);
    } catch (err) {
      setError('Failed to create mod list');
    } finally {
      setLoading(false);
    }
  };

  const handleEditModList = async () => {
    if (!selectedModList || !newModListData.name.trim()) {
      setError('Mod List name is required');
      return;
    }
    try {
      setLoading(true);
      await modListService.updateModList(selectedModList.id, newModListData);
      setModLists(modlists.map(m =>
        m.id === selectedModList.id
          ? { ...m, ...newModListData }
          : m
      ));
      setShowEditModal(false);
      setSelectedModList(null);
      setNewModListData({ name: '', description: '', isPublic: false });
      setError(null);
    } catch (err) {
      setError('Failed to update mod list');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModList = async (modListId: number) => {
    if (!confirm('Are you sure you want to delete this mod list? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await modListService.deleteModList(modListId);
      setModLists(modlists.filter(m => m.id !== modListId));
      setError(null);
    } catch (err) {
      setError('Failed to delete mod list');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (modlist: ModList) => {
    setSelectedModList(modlist);
    setNewModListData({
      name: modlist.name,
      description: modlist.description || '',
      isPublic: modlist.isPublic,
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setNewModListData({ name: '', description: '', isPublic: false });
    setShowCreateModal(true);
  };

  // Export mod list as .modlist (base64 encoded)
  const handleExport = (modList: ModList) => {
    try {
      const content = modList.mods.map(mod => mod.modSlug.startsWith('http') ? mod.modSlug : `https://modrinth.com/mod/${mod.modSlug}`).join('\n');
      const encoded = btoa(unescape(encodeURIComponent(content)));
      const blob = new Blob([encoded], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${modList.name.replace(/\s+/g, '_')}.modlist`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showNotification('Mod list exported successfully!', 'success');
    } catch (err) {
      showNotification('Failed to export mod list', 'error');
    }
  };

  // Import mod list from .modlist (base64 encoded)
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const encoded = event.target?.result as string;
        const text = decodeURIComponent(escape(atob(encoded)));
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) throw new Error('No mods found in file');
        // Create a new mod list with imported mods
        const name = prompt('Name for imported mod list?') || 'Imported Mod List';
        const mods = lines.map(url => {
          const slug = url.replace('https://modrinth.com/mod/', '').replace(/\/$/, '');
          return { modSlug: slug, modTitle: slug, modAuthor: 'Imported' };
        });
        setLoading(true);
        const newModList = await modListService.createModList({ name, description: 'Imported from file', isPublic: false });
        for (const mod of mods) {
          await modListService.addModToModList(newModList.id, mod);
        }
        await loadModLists();
        showNotification('Mod list imported successfully!', 'success');
      } catch (err) {
        showNotification('Failed to import mod list', 'error');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  if (loading && modlists.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Loading mod lists...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-300 mb-2">My Mod Lists</h1>
          <p className="text-slate-400">Organize your favorite mods into custom collections</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <FiPlus />
            Create Mod List
          </Button>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="file" accept=".modlist" onChange={handleImport} className="hidden" />
            <span className="flex items-center gap-1 px-3 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">
              <FiUpload /> Import
            </span>
          </label>
        </div>
      </div>
      {error && (
        <Alert variant="error" onClose={() => setError(null)} className="mb-6">
          {error}
        </Alert>
      )}
      {modlists.length === 0 ? (
        <Card className="text-center py-12">
          <MinecraftBlock />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No mod lists yet</h3>
          <p className="text-slate-400 mb-6">
            Create your first mod list to start organizing your favorite mods
          </p>
          <Button onClick={openCreateModal} className="flex items-center gap-2 mx-auto">
            <FiPlus />
            Create Your First Mod List
          </Button>
          <label className="flex items-center gap-2 cursor-pointer mt-4 justify-center">
            <input type="file" accept=".modlist" onChange={handleImport} className="hidden" />
            <span className="flex items-center gap-1 px-3 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">
              <FiUpload /> Import
            </span>
          </label>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modlists.map((modlist) => (
            <Card key={modlist.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-300 mb-2">
                    {modlist.name}
                  </h3>
                  {modlist.description && (
                    <p className="text-slate-400 text-sm mb-3">
                      {modlist.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiMusic />
                      {modlist._count?.mods || modlist.mods.length} mods
                    </span>
                    <span className="flex items-center gap-1">
                      {modlist.isPublic ? <FiEye /> : <FiEyeOff />}
                      {modlist.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(modlist)}
                    className="flex-1"
                  >
                    <FiEdit3 className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteModList(modlist.id)}
                    className="flex-1"
                  >
                    <FiTrash2 className="mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleExport(modlist)}
                    className="flex-1"
                  >
                    <FiDownload className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              {modlist.mods.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Recent mods:</h4>
                  <div className="space-y-2">
                    {modlist.mods.slice(0, 3).map((mod) => (
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
                    {modlist.mods.length > 3 && (
                      <p className="text-xs text-slate-500 text-center">
                        +{modlist.mods.length - 3} more mods
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(modlist)}
                  className="flex-1"
                >
                  <FiEdit3 className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteModList(modlist.id)}
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
      {/* Create Mod List Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Mod List"
      >
        <div className="space-y-4">
          <Input
            label="Mod List Name"
            value={newModListData.name}
            onChange={(e) =>
              setNewModListData({ ...newModListData, name: e.target.value })
            }
            placeholder="My Awesome Modpack"
            required
          />
          <Input
            label="Description (optional)"
            value={newModListData.description || ''}
            onChange={(e) =>
              setNewModListData({ ...newModListData, description: e.target.value })
            }
            placeholder="A collection of my favorite mods"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newModListData.isPublic}
              onChange={(e) =>
                setNewModListData({ ...newModListData, isPublic: e.target.checked })
              }
              className="rounded border-slate-600 bg-slate-700 text-green-400 focus:ring-green-400"
            />
            <span className="text-sm">Make mod list public</span>
          </label>
          <div className="flex gap-2">
            <Button
              onClick={handleCreateModList}
              disabled={loading || !newModListData.name.trim()}
              className="flex-1"
            >
              Create Mod List
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
      {/* Edit Mod List Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Mod List"
      >
        <div className="space-y-4">
          <Input
            label="Mod List Name"
            value={newModListData.name}
            onChange={(e) =>
              setNewModListData({ ...newModListData, name: e.target.value })
            }
            placeholder="My Awesome Modpack"
            required
          />
          <Input
            label="Description (optional)"
            value={newModListData.description || ''}
            onChange={(e) =>
              setNewModListData({ ...newModListData, description: e.target.value })
            }
            placeholder="A collection of my favorite mods"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newModListData.isPublic}
              onChange={(e) =>
                setNewModListData({ ...newModListData, isPublic: e.target.checked })
              }
              className="rounded border-slate-600 bg-slate-700 text-green-400 focus:ring-green-400"
            />
            <span className="text-sm">Make mod list public</span>
          </label>
          <div className="flex gap-2">
            <Button
              onClick={handleEditModList}
              disabled={loading || !newModListData.name.trim()}
              className="flex-1"
            >
              Update Mod List
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
