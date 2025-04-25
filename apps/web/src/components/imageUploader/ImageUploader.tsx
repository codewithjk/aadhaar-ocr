import React, { useState, ChangeEvent } from "react";
import { BiSolidCloudUpload } from "react-icons/bi";
import { ImageUploaderProps } from "./types";
import { baseValidation } from "../../utils/validators";

const API_URL = import.meta.env.VITE_API_URL;

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onSuccessFullParse,
  type,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setLoading(true);

      // Validate image
      baseValidation(file);
      // onValidFileUpload(file);

      // Prepare and send form data
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        // Extract error message from backend
        const message = result?.error || "Upload failed";
        const details = result?.details || "";
        throw new Error(`${message}${details ? `: ${details}` : ""}`);
      }

      console.log("Extracted Text:", result);
      setImage(file);
      console.log(image);
      onSuccessFullParse(result.text);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {image ? (
        <img height={400} width={600} src={URL.createObjectURL(image)} />
      ) : (
        <>
          <input
            id={type}
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor={type}>
            <div
              className={`flex flex-col items-center justify-center max-w-2xl mx-auto p-6 border border-dashed bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer transition-all ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {loading ? (
                <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">
                  Uploading...
                </div>
              ) : (
                <>
                  <BiSolidCloudUpload className="text-4xl text-indigo-400" />
                  <div className="ml-4 text-sm text-indigo-400">
                    Click here to Upload
                  </div>
                </>
              )}
            </div>
          </label>
        </>
      )}

      {error && (
        <div className="text-red-500 text-center mt-2 text-sm">{error}</div>
      )}
    </>
  );
};

export default ImageUploader;
