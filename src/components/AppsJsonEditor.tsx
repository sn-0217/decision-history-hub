import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Layers,
  Edit3,
  X,
  Server,
  User,
  Calendar,
  FileText,
  Database
} from 'lucide-react';
import { useToastContext } from '@/contexts/ToastContext';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface AppData {
  appName: string;
  changeNumber: string;
  applicationOwner: string;
  maintenanceWindow: string;
  changeDescription: string;
  infrastructureImpact: string;
  hosts: string[];
}

interface AppsJsonEditorProps {
  onClose?: () => void;
}

const AppsJsonEditor: React.FC<AppsJsonEditorProps> = ({ onClose }) => {
  const { showSuccess, showError } = useToastContext();
  const [apps, setApps] = useState<AppData[]>([]);
  const [originalApps, setOriginalApps] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingApp, setEditingApp] = useState<AppData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    appIndex: number;
    appName: string;
  }>({
    isOpen: false,
    appIndex: -1,
    appName: ''
  });

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(apps) !== JSON.stringify(originalApps));
  }, [apps, originalApps]);

  const fetchApps = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/get-apps');
      if (!response.ok) {
        throw new Error(`Failed to fetch apps data: ${response.status}`);
      }
      const data = await response.json();
      setApps(data);
      setOriginalApps(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      console.error('Failed to fetch apps JSON:', error);
      showError('Failed to Load', 'Could not load applications configuration.');
      setApps([]);
      setOriginalApps([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/update-apps-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apps),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      setOriginalApps(JSON.parse(JSON.stringify(apps)));
      showSuccess('Configuration Saved', 'Applications configuration has been updated successfully.');
    } catch (error) {
      console.error('Failed to save apps JSON:', error);
      showError('Save Failed', 'Could not save the applications configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setApps(JSON.parse(JSON.stringify(originalApps)));
    setEditingApp(null);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    const newApp: AppData = {
      appName: '',
      changeNumber: '',
      applicationOwner: '',
      maintenanceWindow: '',
      changeDescription: '',
      infrastructureImpact: '',
      hosts: []
    };
    setEditingApp(newApp);
    setIsAddingNew(true);
  };

  const handleEdit = (app: AppData) => {
    setEditingApp({ ...app });
    setIsAddingNew(false);
  };

  const handleSaveApp = () => {
    if (!editingApp) return;

    // Validation
    if (!editingApp.appName.trim()) {
      showError('Validation Error', 'Application name is required.');
      return;
    }

    if (isAddingNew) {
      // Check for duplicate app names
      if (apps.some(app => app.appName.toLowerCase() === editingApp.appName.toLowerCase())) {
        showError('Validation Error', 'An application with this name already exists.');
        return;
      }
      setApps([...apps, editingApp]);
    } else {
      const index = apps.findIndex(app => app.appName === editingApp.appName);
      if (index !== -1) {
        const updatedApps = [...apps];
        updatedApps[index] = editingApp;
        setApps(updatedApps);
      }
    }

    setEditingApp(null);
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingApp(null);
    setIsAddingNew(false);
  };

  const handleDeleteClick = (index: number) => {
    const app = apps[index];
    setDeleteDialog({
      isOpen: true,
      appIndex: index,
      appName: app.appName
    });
  };

  const handleDeleteConfirm = () => {
    const updatedApps = apps.filter((_, index) => index !== deleteDialog.appIndex);
    setApps(updatedApps);
    setDeleteDialog({ isOpen: false, appIndex: -1, appName: '' });
    showSuccess('Application Deleted', 'The application has been removed successfully.');
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, appIndex: -1, appName: '' });
  };

  const addHost = () => {
    if (!editingApp) return;
    setEditingApp({
      ...editingApp,
      hosts: [...editingApp.hosts, '']
    });
  };

  const removeHost = (index: number) => {
    if (!editingApp) return;
    const updatedHosts = editingApp.hosts.filter((_, i) => i !== index);
    setEditingApp({
      ...editingApp,
      hosts: updatedHosts
    });
  };

  const updateHost = (index: number, value: string) => {
    if (!editingApp) return;
    const updatedHosts = [...editingApp.hosts];
    updatedHosts[index] = value;
    setEditingApp({
      ...editingApp,
      hosts: updatedHosts
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Layers className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600">Loading applications configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Applications Management
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Manage application configurations and infrastructure details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="default" 
                className={`gap-2 ${hasChanges ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}
              >
                {hasChanges ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                {hasChanges ? 'Unsaved Changes' : 'All Saved'}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {apps.length} Applications
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddNew}
                className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4" />
                Add Application
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {apps.map((app, index) => (
              <Card key={index} className="border border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Server className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{app.appName}</h3>
                          <p className="text-sm text-slate-600">{app.changeNumber}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">{app.applicationOwner}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">{app.maintenanceWindow}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Database className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">{app.hosts.length} hosts</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(app)}
                        className="gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(index)}
                        className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {apps.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Applications Found</h3>
                <p className="text-slate-500 mb-4">Get started by adding your first application.</p>
                <Button onClick={handleAddNew} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Application
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Modal */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{isAddingNew ? 'Add New Application' : 'Edit Application'}</span>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Application Name *
                  </label>
                  <Input
                    value={editingApp.appName}
                    onChange={(e) => setEditingApp({ ...editingApp, appName: e.target.value })}
                    placeholder="Enter application name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Change Number
                  </label>
                  <Input
                    value={editingApp.changeNumber}
                    onChange={(e) => setEditingApp({ ...editingApp, changeNumber: e.target.value })}
                    placeholder="e.g., CRQ1000010"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Application Owner
                  </label>
                  <Input
                    value={editingApp.applicationOwner}
                    onChange={(e) => setEditingApp({ ...editingApp, applicationOwner: e.target.value })}
                    placeholder="Enter owner name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Maintenance Window
                  </label>
                  <Input
                    value={editingApp.maintenanceWindow}
                    onChange={(e) => setEditingApp({ ...editingApp, maintenanceWindow: e.target.value })}
                    placeholder="e.g., Sat, 1:00 AM – 5:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Change Description
                </label>
                <Textarea
                  value={editingApp.changeDescription}
                  onChange={(e) => setEditingApp({ ...editingApp, changeDescription: e.target.value })}
                  placeholder="Describe the change being made"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Infrastructure Impact
                </label>
                <Input
                  value={editingApp.infrastructureImpact}
                  onChange={(e) => setEditingApp({ ...editingApp, infrastructureImpact: e.target.value })}
                  placeholder="e.g., 15 servers affected"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">
                    Affected Hosts ({editingApp.hosts.length})
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHost}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Host
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {editingApp.hosts.map((host, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={host}
                        onChange={(e) => updateHost(index, e.target.value)}
                        placeholder="hostname.company.com"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeHost(index)}
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {editingApp.hosts.length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm">
                      No hosts added yet. Click "Add Host" to get started.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleSaveApp} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isAddingNew ? 'Add Application' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone and will permanently remove all associated configuration data."
        itemName={deleteDialog.appName}
      />
    </>
  );
};

export default AppsJsonEditor;