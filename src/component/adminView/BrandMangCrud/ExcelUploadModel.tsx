import React, { useState } from "react";

type ExcelUploadModelProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void; // Function to handle the file upload
};

const ExcelUploadModel: React.FC<ExcelUploadModelProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null); // Local state for the uploaded file
  const [error, setError] = useState<string>("");// State for error message
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle file input change and check file type
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;

      // Check if the file is an Excel file based on the MIME type
      if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          fileType === "application/vnd.ms-excel") {
        setFile(selectedFile); // Set file if valid
        setError(""); // Clear error message
      } else {
        setFile(null); // Clear file
        setError("Please upload a valid Excel file (.xlsx, .xls)"); // Set error message
      }
    }
  };

  // Handle the upload when user clicks the Upload button
  const handleUpload = () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }
    setIsLoading(true);
    try{
    if (file) {
      onUpload(file); // Call the parent function to handle the file upload
      setFile(null);
      setError(""); 
      onClose(); // Close the modal
    }
  } catch{
    console.error("Upload failed:", error);
    setError("Upload failed. Please try again.");
  }finally {
    setIsLoading(false); // Set loading back to false
  }
  };

  if (!isOpen) return null; // Do not render if the modal is closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 className="text-xl font-bold mb-4">Upload Excel File</h2>
        <input
          type="file"
          accept=".xlsx, .xls" // Restrict to Excel files only
          onChange={handleFileChange}
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>} 
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleUpload}
            // disabled={!file} 
            className={`font-bold py-2 px-4 rounded ${
              isLoading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-700 text-white"
            }`}
          >
            {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                "Upload"
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadModel;
