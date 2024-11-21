import  { useState, useEffect } from "react";

const PdfUploadModel = ({ isOpen, onClose, onUpload }:any) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // To hold error message if no file selected

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
    setError(""); // Clear error message if a new file is selected
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    setIsLoading(true); // Set loading to true when starting upload
    try {
      await onUpload(file); // Call the upload function passed from parent
      setFile(null);
      setError(""); // Clear error message after successful upload
      onClose(); // Close modal after successful upload
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again."); // Show upload failure message
    } finally {
      setIsLoading(false); // Set loading back to false
    }
  };

  // Reset the error message when the modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setError(""); // Clear error when modal opens
    }
  }, [isOpen]);

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-md max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Upload PDF</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 mb-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>} {/* Display error if exists */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
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
    )
  );
};

export default PdfUploadModel;
