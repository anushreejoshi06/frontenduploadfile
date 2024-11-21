import React, { useState } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import SearchResults from "./SearchResults";
import { toast } from "react-toastify";
import { FiDownload } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";

const SearchData = () => {
  const [query, setQuery] = useState("");
  const [responseData, setResponseData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false); // State to control SearchResults visibility
  const token = window.localStorage.getItem("token");

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      return; // Prevent search if query is empty
    }

    try {
      // const response = await axios.get(`http://localhost:8000/search`, {
      const response = await axios.get(
        import.meta.env.VITE_REST_API_URL + `/search`,
        {
          params: { query },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("response.data", response.data);
      setResponseData(response?.data);
      setError(null);
      setShowResults(false); // Reset showResults when a new search is performed
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.detail
          : "An unexpected error occurred."
      );
      console.error("Error during API call:", error);
      setError("Failed to load data");
      setResponseData(null);
    }
  };
  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_REST_API_URL +`/download-pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important for handling file downloads
      });

      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf"); // Set a default file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to download PDF.");
      console.error("Error during PDF download:", error);
    }
  };

  const handleReset = () => {
    setQuery(""); // Clear the query state
    setResponseData(null); // Optionally clear previous search results
    setError(null); // Optionally clear any error messages
  };
  return (
    <Layout>
      <form
        onSubmit={handleSearch}
        className="flex items-center justify-center space-x-4 px-4 pb-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search words"
          required
          className="w-2/4 px-4 py-2   border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!query.trim()} // Disable button if the query is empty
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
        {responseData &&
          (responseData.found_words.length > 0 ||
            responseData.not_found_words.length > 0 ||
            responseData.found_pdfs.length > 0 ||
            responseData.not_found_pdfs.length > 0) && (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 flex items-center gap-1 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
               <GrPowerReset /> <span>Reset</span> 
              </button>
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 flex items-center gap-1 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiDownload /> <span>Download PDF</span>
              </button>
            </>
          )}
      </form>

      {/* Display error if there is any */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Conditional rendering for PDF results */}
      <div className="flex justify-evenly items-start space-x-4 mb-6 mx-4">
        {/* Card for found_pdfs and not_found_pdfs */}
        <div className="w-1/2">
          {responseData?.found_pdfs && (
            <div className=" p-6 border rounded shadow-2xl bg-white flex flex-col justify-between overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Words Found in Govt. Dashboard
                </h2>
                <ul className="list-disc pl-5">
                  {(() => {
                    const wordCountMap = new Map();

                    responseData.found_pdfs.forEach((pdf: any) => {
                      const word = pdf.search_word;
                      wordCountMap.set(word, (wordCountMap.get(word) || 0) + 1);
                    });

                    return Array.from(wordCountMap.entries()).map(
                      ([word, count], index) => (
                        <li key={index}>
                          {word}
                          {count > 1 ? ` (${count} times)` : ""}
                        </li>
                      )
                    );
                  })()}
                </ul>
                {/* Display not_found_pdfs if they exist */}
                {responseData.not_found_pdfs &&
                  responseData.not_found_pdfs.length > 0 && (
                    <div>
                      <p className="text-red-500 mt-4 font-semibold">
                        Not Found Words :
                      </p>
                      <ul className="list-disc pl-5">
                        {responseData.not_found_pdfs.map(
                          (word: any, index: any) => (
                            <li key={index}>{word}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Card for found_words and not_found_words */}
        <div className="w-1/2">
          {responseData?.found_words && (
            <div className=" p-6 border rounded shadow-2xl bg-white flex flex-col justify-between overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Words Found in Trademark Management
                </h2>
                <ul className="list-disc pl-5">
                  {responseData.found_words.map((item: any, index: any) => (
                    <li key={index}>{item.word}</li>
                  ))}
                </ul>
                {/* Display not_found_words if they exist */}
                {responseData.not_found_words &&
                  responseData.not_found_words.length > 0 && (
                    <div>
                      <p className="text-red-500 mt-4 font-semibold">
                        Not Found Words :
                      </p>
                      <ul className="list-disc pl-5 ">
                        {responseData.not_found_words.map(
                          (word: any, index: any) => (
                            <li key={index}>{word}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {responseData && (
        <div className="flex justify-between mb-4 mx-6">
          <p
            onClick={() => setShowResults((prevState) => !prevState)} // Toggle showResults
            className="cursor-pointer text-blue-500 underline"
          >
            {showResults ? "Close Detail" : "More Detail"}
          </p>
        </div>
      )}

      {/* Conditionally render SearchResults based on showResults */}
      {showResults && <SearchResults data={responseData} />}
    </Layout>
  );
};

export default SearchData;
