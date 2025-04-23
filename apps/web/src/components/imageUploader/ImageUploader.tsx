import React from "react";
import { ImageUploaderProps } from "./types";

import { BiUpload } from "react-icons/bi";
import { baseValidation } from "../../utils/validators";

const ImageUploader: React.FC<ImageUploaderProps> = ({onValidFileUpload}) => {


  const changeFile = async(event: any) => {
    try {
      let image = event.target.files[0]
      baseValidation(image);
      onValidFileUpload(image)
         // Prepare FormData
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('http://localhost:8000/api/vision/extract-text', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Extracted Text:', result);
    } catch (error) {
      console.log("Error form catch =====> ",error)
    }
      
    }
  return (
    <>
      <input id="image" type="file" hidden onChange={(e)=>changeFile(e)} />
      <label htmlFor="image">
        <div className="flex items-center justify-center max-w-2xl  mx-auto  border border-dashed bg-white  border-neutral-200 dark:border-neutral-800 rounded-lg">
          <BiUpload className="text-4xl" />
          <div>Drop here</div>
        </div>
      </label>
    </>
  );
};

export default ImageUploader;
