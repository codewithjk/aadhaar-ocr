export interface ImageUploaderProps {
    label: string;
    onSuccessFullParse: (data:extractedData) => void;
    maxSizeInMB?: number; 
  acceptedFormats?: string[]; 
  type: string;
  }
  

export interface extractedData{
  name?: string;
  address?: string;
  pincode?: string;
  aadhaarNumber?: string;
  dob?: string;
  gender?: string;

  }