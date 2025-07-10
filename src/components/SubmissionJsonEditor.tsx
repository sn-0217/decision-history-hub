import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Code, 
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToastContext } from '@/contexts/ToastContext';
import { authenticatedFetch, publicFetch } from '@/utils/api';

interface SubmissionJsonEditorProps {
  onClose?: () => void;
}

const SubmissionJsonEditor: React.FC<SubmissionJsonEditorProps> = ({ onClose }) => {
  const { showSuccess, showError } = useToastContext();
  const [jsonContent, setJsonContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);

  useEffect(() => {
    fetchSubmissionJson();
  }, []);

  useEffect(() => {
    setHasChanges(jsonContent !== originalContent);
    validateJson(jsonContent);
  }, [jsonContent, originalContent]);

  const fetchSubmissionJson = async () => {
    try {
      setIsLoading(true);
      const response = await publicFetch('/api/get-apps');
      if (!response.ok) {
        throw new Error(`Failed to fetch submission data: ${response.status}`);
      }
      const data = await response.json();
      const formattedJson = JSON.stringify(data, null, 2);
      setJsonContent(formattedJson);
      setOriginalContent(formattedJson);
    } catch (error) {
      console.error('Failed to fetch submission JSON:', error);
      showError('Failed to Load', 'Could not load submission configuration.');
      setJsonContent('{}');
      setOriginalContent('{}');
    } finally {
      setIsLoading(false);
    }
  };

  const validateJson = (content: string) => {
    try {
      JSON.parse(content);
      setIsValid(true);
      setValidationError('');
    } catch (error) {
      setIsValid(false);
      setValidationError(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  const handleSave = async () => {
    if (!isValid) {
      showError('Invalid JSON', 'Please fix the JSON syntax errors before saving.');
      return;
    }

    try {
      setIsSaving(true);
      
      // Parse the JSON to ensure it's valid
      const parsedJson = JSON.parse(jsonContent);
      
      // Use admin endpoint with authentication for config updates
      const response = await authenticatedFetch('/admin/update-submission-config', {
        method: 'POST',
        body: JSON.stringify(parsedJson),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      setOriginalContent(jsonContent);
      showSuccess('Configuration Saved', 'Submission configuration has been updated successfully.');
    } catch (error) {
      console.error('Failed to save submission JSON:', error);
      showError('Save Failed', 'Could not save the submission configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setJsonContent(originalContent);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonContent(formatted);
      setIsFormatted(true);
    } catch (error) {
      showError('Format Failed', 'Cannot format invalid JSON. Please fix syntax errors first.');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      const minified = JSON.stringify(parsed);
      setJsonContent(minified);
      setIsFormatted(false);
    } catch (error) {
      showError('Minify Failed', 'Cannot minify invalid JSON. Please fix syntax errors first.');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submission-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSuccess('Downloaded', 'Configuration file has been downloaded.');
    } catch (error) {
      showError('Download Failed', 'Could not download the configuration file.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Validate the uploaded JSON
        JSON.parse(content);
        setJsonContent(content);
        showSuccess('File Loaded', 'Configuration file has been loaded successfully.');
      } catch (error) {
        showError('Invalid File', 'The uploaded file contains invalid JSON.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600">Loading submission configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Submission Configuration Editor
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Edit the submission.json configuration that powers the application data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isValid ? "default" : "destructive"} 
              className={`gap-2 ${isValid ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}`}
            >
              {isValid ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {isValid ? 'Valid JSON' : 'Invalid JSON'}
            </Badge>
            {hasChanges && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!isValid && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>JSON Syntax Error:</strong> {validationError}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isFormatted ? handleMinify : handleFormat}
                className="gap-2"
              >
                {isFormatted ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {isFormatted ? 'Minify' : 'Format'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="w-3 h-3" />
                Download
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-3 h-3" />
                    Upload
                  </label>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!hasChanges}
                className="gap-2"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isValid || !hasChanges || isSaving}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* JSON Editor */}
          <div className="relative">
            <Textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className={`font-mono text-sm min-h-[500px] resize-none ${
                !isValid ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-300'
              }`}
              placeholder="Enter JSON configuration..."
            />
            <div className="absolute bottom-2 right-2 text-xs text-slate-500 bg-white/80 px-2 py-1 rounded">
              Lines: {jsonContent.split('\n').length} | Characters: {jsonContent.length}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Tips:</strong> This editor allows you to modify the submission configuration JSON. 
            Make sure to maintain the correct structure and data types. Use the Format button to make the JSON more readable, 
            or Minify to compress it. Always validate your changes before saving.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionJsonEditor;