import  { useEffect, useState } from "react";
import Table from "./Table";
import axios from "axios";
// import Layout from "./layout/Layout";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState<any>([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(false);
  // const [extractpdfId, setExtractPdfId] = useState();
  const handleFileChange = (e:any) => {
    setFile(e.target.files?.[0]); // Update file state
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

   
    const formData = new FormData();
    formData.append("file", file); // Attach file to form data

    const token = window.localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_REST_API_URL + "/upload-pdf",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if(response.status===200){
        try {
          await axios.get(
            import.meta.env.VITE_REST_API_URL + `/extract-pdf/${response?.data?.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
         
        } catch (error) {
          console.log(error);
        }
      }
      // fetchExtractpdf();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExtractpdfData = async () => {
    const token = window.localStorage.getItem("token");
    try {
      const res = await axios.get(
        import.meta.env.VITE_REST_API_URL + "/extracted-data",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("extract-pdf", res.data);
      // setTableData(res?.data?.extracted_data);
      setTableData(res?.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExtractpdfData();
  }, []);
  return (
    <div className="pb-4 ">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-2 border shadow-md px-4 py-1 bg-white rounded-lg ">
          <input
            type="file"
            name="file"
            id="file"
            onChange={handleFileChange}
            placeholder="Please select your file"
            required
            className=" md:w-[40%] w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />

          <button
            type="submit"
            className={`w-full md:w-[20%] my-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
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
                Processing...
              </div>
            ) : (
              "Upload File"
            )}
          </button>
        </div>
      </form>
      {/* {tableData.length > 0 && <Table tableData={tableData} />} */}
       <Table tableData={tableData} />

    </div>
  );
};

export default FileUpload;
