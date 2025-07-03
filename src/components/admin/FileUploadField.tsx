
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, CheckCircle, FileImage, Video } from 'lucide-react';

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  uploading?: boolean;
  uploadProgress?: number;
  placeholder?: string;
  showPreview?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  value,
  onChange,
  onFileSelect,
  acceptedTypes,
  uploading = false,
  uploadProgress = 0,
  placeholder,
  showPreview = true
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
      
      if (showPreview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview('');
    onChange('');
  };

  const isVideo = acceptedTypes.includes('video');
  const isImage = acceptedTypes.includes('image');

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* URL Input */}
      <Input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `URL ${label.toLowerCase()}`}
      />
      
      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="text-center">
          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                {isVideo ? (
                  <Video className="h-8 w-8 text-blue-500" />
                ) : (
                  <FileImage className="h-8 w-8 text-green-500" />
                )}
              </div>
              
              <p className="text-sm font-medium">{selectedFile.name}</p>
              
              {uploading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload en cours...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Fichier sélectionné</span>
                </div>
              )}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFile}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <div>
                <Label htmlFor={`file-${label}`} className="cursor-pointer">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Cliquer pour sélectionner
                  </span>
                  <span className="text-sm text-gray-500"> ou glisser-déposer</span>
                </Label>
                <Input
                  id={`file-${label}`}
                  type="file"
                  accept={acceptedTypes}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <p className="text-xs text-gray-500">
                {isVideo ? 'Formats supportés: MP4, AVI, MOV' : 'Formats supportés: JPG, PNG, WEBP'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Preview */}
      {showPreview && preview && (
        <div className="mt-3">
          <img 
            src={preview} 
            alt="Aperçu" 
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}
      
      {/* Current Image Preview */}
      {showPreview && value && !preview && isImage && (
        <div className="mt-3">
          <img 
            src={value} 
            alt="Image actuelle" 
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
