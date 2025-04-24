import { useCallback, useState } from "react";

import ImageUploader from "./components/imageUploader/ImageUploader";
import { extractedData } from "./components/imageUploader/types";
import Navbar from "./components/Navbar";

function App() {
  const [result, setResult] = useState<extractedData | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleParsedData = useCallback((data: extractedData) => {
    setResult((prev) => ({ ...prev, ...data }));
  }, []);

  const handleShowResult = () => {
    setShowResult(true);
  };

  return (
    <>
      <Navbar />
      <div className="flex  items-center justify-center  gap-6">
        <div className=" w-full text-center max-w-xl space-y-6 bg-white rounded-2xl shadow-lg p-6">

          <div className="space-y-2">
            <label className="block text-start font-medium">Aadhaar Front</label>
            <ImageUploader
              key={1}
              type="front"
              label="Drop here"
              onSuccessFullParse={handleParsedData}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-start font-medium">Aadhaar Back</label>
            <ImageUploader
              key={2}
              type="back"
              label="Drop here"
              onSuccessFullParse={handleParsedData}
            />
          </div>

          <button
            onClick={handleShowResult}
            className="px-8 py-2 uppercase rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
          >
            parse Aadhaar
          </button>
        </div>

        {showResult && result && (
          <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Parsed Details
            </h3>
            <div className="space-y-2 text-sm text-gray-800">
              <p>
                <strong>Name:</strong> {result.name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {result.dob}
              </p>
              <p>
                <strong>Gender:</strong> {result.gender}
              </p>
              <p>
                <strong>Aadhaar Number:</strong> {result.aadhaarNumber}
              </p>
              <p>
                <strong>Address:</strong> {result.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
