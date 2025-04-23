export interface ImageUploaderProps {
    label: string;
    onValidFileUpload: (file: File) => void;
    onError: (error: string) => void;
    maxSizeInMB?: number; 
    acceptedFormats?: string[]; 
  }
  