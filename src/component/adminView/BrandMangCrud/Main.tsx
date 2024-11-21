import { useEffect, useState, useMemo } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import Tooltip from "@mui/material/Tooltip";
import CreateModel from "./CreateModel"; // Import the modal
// import ExcelUploadModel from "./ExcelModel";
// import { IoPencil } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import ExcelUploadModel from "./ExcelUploadModel";
import PdfUploadModel from "./PdfUploadModel";
type Words = {
  id: number;
  word: string;
};
type TrademarkData = {
  page_number: number;
  matched_words_in_both: Words[];
  "Trade Marks Journal No": string;
  "Journal Date": string;
  Class: string;
  "Company Name": string;
  "Trademark Number": string;
  "Application Date": string;
  "Trademark Holder Name": string;
  "Holder Address": string;
  "Entity Type": string;
  "Attorney Name": string;
  "Attorney Address": string;
  "Proposed Use": string;
  "Goods/Services Description": string;
};
// interface PdfUploadResponse {
//   id: number; // assuming `id` is a number based on your example
// }

const Main = () => {
  const [words, setWords] = useState<Words[]>([]);
  const [data, setData] = useState<TrademarkData[]>([]);
  const [uploadDate, setUploadDate] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [wordToEdit, setWordToEdit] = useState<Words | null>(null); // State to hold the word being edited
  const [loading, setLoading] = useState(false);
  const token = window.localStorage.getItem("token");
  const fetchData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_REST_API_URL + "/get-all-words",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWords(res?.data);
    } catch (error) {
      // console.log(error?.response?.data.detail);
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.detail
          : "An unexpected error occurred."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Words>[]>(
    () => [
      {
        header: "S.No.",
        accessorKey: "serialNumber",
        Cell: ({ row }) => <div className="ml-2">{row.index + 1}</div>, // Generate serial number based on row index
        size: 50,
      },
      {
        accessorKey: "word",
        header: "Word",
        size: 300,
      },
      {
        header: "Action",
        size: 50,
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
              onClick={() => handleEdit(row.original)}
            >
              {/* Edit */}
              <FaPen className="text-white " />
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-full"
              onClick={() => handleDelete(row.original.id)}
            >
              {/* Delete */} <FaRegTrashAlt />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleAddWord = () => {
    setWordToEdit(null); // Clear the edit state when adding a new word
    setIsModalOpen(true); // Open modal when Add Word is clicked
  };

  const handleEdit = (word: Words) => {
    setWordToEdit(word); // Set the word to be edited
    setIsModalOpen(true); // Open modal for editing
  };
  const handleExcelUpload = async (file: File) => {
    // console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        import.meta.env.VITE_REST_API_URL + "/addexcel",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("ExcelFile Uploaded Successfully")
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.detail
          : "An unexpected error occurred."
      );
    }
  };

  const handleSubmit = async (newWord: string[], id?: number) => {
    try {
      if (id) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to edit this word?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, edit it!",
          customClass: {
            popup: "max-w-md p-4", // Tailwind class to control width and padding
            title: "text-xl", // Tailwind class to control title size
            confirmButton:
              "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
            cancelButton:
              "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
          },
        });

        if (result.isConfirmed) {
          const wordToUpdate = Array.isArray(newWord) ? newWord[0] : newWord;
          // Edit existing word
          await axios.put(
            import.meta.env.VITE_REST_API_URL + `/update-word/${id}`,
            { new_word: wordToUpdate },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire("Edited!", "The word has been updated.", "success");
        }
      } else {
        // Add new word (no confirmation needed here)
        await axios.post(
          import.meta.env.VITE_REST_API_URL + "/add-words",
          newWord,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      Swal.fire("Added!", "Word has been Added Successfully.", "success");
      setIsModalOpen(false); // Close modal after adding or editing
      fetchData(); // Re-fetch data after adding or editing the word
    } catch (error) {
      console.log(error);
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.detail
          : Swal.fire(
              "Error!",
              "There was a problem updating the word.",
              "error"
            )
      );
    }
  };

  const handleDelete = async (id: number) => {
    // console.log("id", id);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This word will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "max-w-sm p-4", // Tailwind class to control the width and padding
        title: "text-xl", // Tailwind class to control title size
        // content: "text-sm", // Tailwind class to control content size
        confirmButton:
          "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
        cancelButton:
          "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          import.meta.env.VITE_REST_API_URL + `/delete-word/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWords(words.filter((word) => word.id !== id)); // Remove the deleted word from state
        fetchData(); // Re-fetch data after deleting the word
        Swal.fire("Deleted!", "The word has been deleted.", "success");
      } catch (error) {
        console.log(error);
        Swal.fire("Error!", "There was a problem deleting the word.", "error");
      }
    }
  };
  
  const handlePdfUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        import.meta.env.VITE_REST_API_URL + "/upload-pdf-excel/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      const newId = response?.data?.id;
      if (newId) {
        // Store the new id in localStorage as a string
        localStorage.setItem("pdfId", newId.toString());
        console.log("Stored new ID in localStorage:", newId);
      } else {
        console.log("No ID found in the response.");
      }
      getPdfDataByID()
    } catch (error) {
      console.log(error);
    }
  };
  const getPdfDataByID = async () => {
    // Retrieve the id from localStorage
    const id = localStorage.getItem("pdfId");
    if (!id) {
      toast.error("No PDF ID found. Please upload a PDF first.");
      return;
    }
    setLoading(true); // Start loading
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REST_API_URL}/get-pdf-data/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("responseinPDF", res?.data);
            setData(res?.data?.matched_data || []);
            setUploadDate(res?.data?.upload_date || "");
            setFilePath(res?.data?.file_path || "");
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.detail
          : "An unexpected error occurred."
      );
    }finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
    // Call getPdfDataByID only if there is an ID in localStorage
    const id = localStorage.getItem("pdfId");
    if (id) {
      getPdfDataByID();
    } else {
      console.log("No PDF ID found, skipping API call.");
    }
  }, []);
  // Define columns with TypeScript
  const datacolumns: MRT_ColumnDef<TrademarkData>[] = [
    {
      accessorKey: "page_number",
      header: "Page Number",
      size: 50,
      Cell: ({ cell }) => (
        <div className="ml-6">{String(cell.getValue() as number)}</div>
      ),
    },
    {
      accessorKey: "matched_words_in_both",
      header: "Matched Words",
      size: 150,
      Cell: ({ cell }) => {
        const wordsArray = cell.getValue<string[]>();
        return Array.isArray(wordsArray) ? wordsArray.join(", ") : "";
      },
    },
    { accessorKey: "Trade Marks Journal No", header: "Journal No",size: 50 },
    { accessorKey: "Journal Date", header: "Journal Date" ,size: 50},
    { accessorKey: "Class", header: "Class",size: 50 },
    { accessorKey: "Company Name", header: "Company Name" },
    { accessorKey: "Trademark Number", header: "Trademark Number",size: 50 },
    { accessorKey: "Application Date", header: "Application Date",size: 50 },
    { accessorKey: "Trademark Holder Name", header: "Holder Name", size: 300 },
    // { accessorKey: "Holder Address", header: "Holder Address" },
    {
      accessorKey: "Holder Address",
      header: "Holder Address",
      size: 200,
      Cell: ({ cell }) => {
        const address = cell.getValue<string>(); // Cast as string
        const maxLength = 50; // Set the maximum length for truncation
        const isLong = address.length > maxLength;

        return (
          <Tooltip
            title={<span style={{ fontSize: "14px" }}>{address}</span>}
            arrow
            placement="top"
          >
            <span className="block max-w-[300px] truncate cursor-pointer">
              {isLong ? `${address.substring(0, maxLength)}...` : address}
            </span>
          </Tooltip>
        );
      },
    },
    { accessorKey: "Entity Type", header: "Entity Type",size: 50, },
    { accessorKey: "Attorney Name", header: "Attorney Name" ,size: 50},
    {
      accessorKey: "Attorney Address",
      header: "Attorney Address",
      size: 150,
      Cell: ({ cell }) => {
        const description = cell.getValue() as string;
        const maxLength = 50; // Set the maximum length for truncation
        const isLong = description.length > maxLength;

        return (
          <Tooltip
            title={
              <span className="text-[14px]">
                {" "}
                {/* Change text size and color here */}
                {description}
              </span>
            }
            arrow
            placement="top"
          >
            <span className="block max-w-[300px] truncate  ">
              {isLong
                ? `${description.substring(0, maxLength)}...`
                : description}
            </span>
          </Tooltip>
        );
      },
    },
    { accessorKey: "Proposed Use", header: "Proposed Use" },
    // { accessorKey: "Goods/Services Description", header: "Goods/Services" },
    {
      accessorKey: "Goods/Services Description",
      header: "Goods/Services",
      size: 150,
      Cell: ({ cell }) => {
        const description = cell.getValue() as string;
        const maxLength = 50; // Set the maximum length for truncation
        const isLong = description.length > maxLength;

        return (
          <Tooltip
            title={
              <span className="text-[14px]">
                {" "}
                {/* Change text size and color here */}
                {description}
              </span>
            }
            arrow
            placement="top"
          >
            <span className="block max-w-[300px] truncate  ">
              {isLong
                ? `${description.substring(0, maxLength)}...`
                : description}
            </span>
          </Tooltip>
        );
      },
    },
  ];
  const cleanedFileName = filePath.replace(/^\.\/uploads\\+/, '');
  return (
    <Layout>
      <div>
        <div className="flex justify-end mb-4">
          {/* <p className="text-lg font-bold">Words Table</p> */}
          <div className="flex gap-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsPdfModalOpen(true)}
            >
              Upload PDF
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsExcelModalOpen(true)}
            >
              Upload Word Excel
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddWord}
            >
              Add Word
            </button>
          </div>
        </div>
        {/* {data.length>0 && 
        <div>
          <MaterialReactTable
            columns={datacolumns}
            data={data}
            // enableColumnOrdering
            // enablePagination
            // enableSorting
            renderTopToolbarCustomActions={() => (
              <div className="flex gap-4">
                <div style={{ textAlign: "left", fontWeight: "bold", padding: "0.5rem" }}>
                  Upload Date: <span className="font-normal text-gray-500">{new Date(uploadDate).toLocaleDateString()}</span>
                </div>
                <div style={{ textAlign: "left", fontWeight: "bold", padding: "0.5rem" }}>
                  PDF Path: <span className="font-normal text-gray-500">{cleanedFileName}</span>
                </div>
              </div>
            )}
          />
        </div>} */}
         <div>
      {loading ? (
        <p className="text-2xl">Loading...</p> // Display loading text
      ) : data.length > 0 ? (
        <div>
          <MaterialReactTable
            columns={datacolumns}
            data={data}
            renderTopToolbarCustomActions={() => (
              <div className="flex gap-4">
                <div style={{ textAlign: "left", fontWeight: "bold", padding: "0.5rem" }}>
                  Upload Date : <span className="font-normal text-gray-500">{new Date(uploadDate).toLocaleDateString()}</span>
                </div>
                <div style={{ textAlign: "left", fontWeight: "bold", padding: "0.5rem" }}>
                  PDF Path : <span className="font-normal text-gray-500">{cleanedFileName}</span>
                </div>
              </div>
            )}
          />
        </div>
      ) : (
        // <p>No data available.</p>
        ""
      )}
    </div>
        <div className="my-4">
        <p className="text-4xl  mt-6 mb-2">Excel Words</p>
          <MaterialReactTable
            columns={columns}
            data={words}
            renderTopToolbarCustomActions={() => (
              <div className="flex gap-4">
                <div
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    padding: "0.5rem",
                  }}
                >
                  Total words :{" "}
                  <span className="font-normal text-gray-500">
                    ({words?.length})
                  </span>
                </div>
              </div>
            )}
          />
        </div>
        <CreateModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          wordToEdit={wordToEdit || undefined} // Pass the word to edit if editing
        />
        {/* ExcelUploadModel modal for uploading Excel files */}
        <ExcelUploadModel
          isOpen={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
          onUpload={handleExcelUpload} // Handle file upload
        />
        {/* New PDF Upload Modal */}
        <PdfUploadModel
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          onUpload={handlePdfUpload}
        />
      </div>
    </Layout>
  );
};

export default Main;


// -----------------------------------------------------------------------------------------------------------------------------
// import { useEffect, useState, useMemo } from "react";
// import Layout from "../layout/Layout";
// import axios from "axios";
// import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
// import Tooltip from "@mui/material/Tooltip";
// import CreateModel from "./CreateModel"; // Import the modal
// // import ExcelUploadModel from "./ExcelModel";
// // import { IoPencil } from "react-icons/io5";
// import { FaPen } from "react-icons/fa";
// import { FaRegTrashAlt } from "react-icons/fa";
// import Swal from "sweetalert2";
// import { toast } from "react-toastify";
// import ExcelUploadModel from "./ExcelUploadModel";
// import PdfUploadModel from "./PdfUploadModel";
// type Words = {
//   id: number;
//   word: string;
// };
// type TrademarkData = {
//   page_number: number;
//   matched_words_in_both: Words[];
//   "Trade Marks Journal No": string;
//   "Journal Date": string;
//   Class: string;
//   "Company Name": string;
//   "Trademark Number": string;
//   "Application Date": string;
//   "Trademark Holder Name": string;
//   "Holder Address": string;
//   "Entity Type": string;
//   "Attorney Name": string;
//   "Attorney Address": string;
//   "Proposed Use": string;
//   "Goods/Services Description": string;
// };

// const Main = () => {
//   const [words, setWords] = useState<Words[]>([]);
//   const [data, setData] = useState<TrademarkData[]>([]);
//   const [uploadDate, setUploadDate] = useState<string>("");
//   const [filePath, setFilePath] = useState<string>("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
//   const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
//   const [wordToEdit, setWordToEdit] = useState<Words | null>(null); // State to hold the word being edited
//   const token = window.localStorage.getItem("token");
//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         import.meta.env.VITE_REST_API_URL + "/get-all-words",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setWords(res?.data);
//     } catch (error) {
//       // console.log(error?.response?.data.detail);
//       toast.error(
//         axios.isAxiosError(error) && error.response
//           ? error.response.data.detail
//           : "An unexpected error occurred."
//       );
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const columns = useMemo<MRT_ColumnDef<Words>[]>(
//     () => [
//       {
//         header: "S.No.",
//         accessorKey: "serialNumber",
//         Cell: ({ row }) => <div className="ml-2">{row.index + 1}</div>, // Generate serial number based on row index
//         size: 50,
//       },
//       {
//         accessorKey: "word",
//         header: "Word",
//         size: 300,
//       },
//       {
//         header: "Action",
//         size: 50,
//         Cell: ({ row }) => (
//           <div className="flex space-x-2">
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
//               onClick={() => handleEdit(row.original)}
//             >
//               {/* Edit */}
//               <FaPen className="text-white " />
//             </button>
//             <button
//               className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-full"
//               onClick={() => handleDelete(row.original.id)}
//             >
//               {/* Delete */} <FaRegTrashAlt />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const handleAddWord = () => {
//     setWordToEdit(null); // Clear the edit state when adding a new word
//     setIsModalOpen(true); // Open modal when Add Word is clicked
//   };

//   const handleEdit = (word: Words) => {
//     setWordToEdit(word); // Set the word to be edited
//     setIsModalOpen(true); // Open modal for editing
//   };
//   const handleExcelUpload = async (file: File) => {
//     // console.log("Uploading file:", file);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await axios.post(
//         import.meta.env.VITE_REST_API_URL + "/addexcel",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       fetchData();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleSubmit = async (newWord: string[], id?: number) => {
//     try {
//       if (id) {
//         const result = await Swal.fire({
//           title: "Are you sure?",
//           text: "Do you want to edit this word?",
//           icon: "warning",
//           showCancelButton: true,
//           confirmButtonColor: "#3085d6",
//           cancelButtonColor: "#d33",
//           confirmButtonText: "Yes, edit it!",
//           customClass: {
//             popup: "max-w-md p-4", // Tailwind class to control width and padding
//             title: "text-xl", // Tailwind class to control title size
//             confirmButton:
//               "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
//             cancelButton:
//               "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
//           },
//         });

//         if (result.isConfirmed) {
//           const wordToUpdate = Array.isArray(newWord) ? newWord[0] : newWord;
//           // Edit existing word
//           await axios.put(
//             import.meta.env.VITE_REST_API_URL + `/update-word/${id}`,
//             { new_word: wordToUpdate },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           Swal.fire("Edited!", "The word has been updated.", "success");
//         }
//       } else {
//         // Add new word (no confirmation needed here)
//         await axios.post(
//           import.meta.env.VITE_REST_API_URL + "/add-words",
//           newWord,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       }
//       Swal.fire("Added!", "Word has been Added Successfully.", "success");
//       setIsModalOpen(false); // Close modal after adding or editing
//       fetchData(); // Re-fetch data after adding or editing the word
//     } catch (error) {
//       console.log(error);
//       toast.error(
//         axios.isAxiosError(error) && error.response
//           ? error.response.data.detail
//           : Swal.fire(
//               "Error!",
//               "There was a problem updating the word.",
//               "error"
//             )
//       );
//     }
//   };

//   const handleDelete = async (id: number) => {
//     // console.log("id", id);
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This word will be permanently deleted!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       customClass: {
//         popup: "max-w-sm p-4", // Tailwind class to control the width and padding
//         title: "text-xl", // Tailwind class to control title size
//         // content: "text-sm", // Tailwind class to control content size
//         confirmButton:
//           "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
//         cancelButton:
//           "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
//       },
//     });

//     if (result.isConfirmed) {
//       try {
//         await axios.delete(
//           import.meta.env.VITE_REST_API_URL + `/delete-word/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setWords(words.filter((word) => word.id !== id)); // Remove the deleted word from state
//         fetchData(); // Re-fetch data after deleting the word
//         Swal.fire("Deleted!", "The word has been deleted.", "success");
//       } catch (error) {
//         console.log(error);
//         Swal.fire("Error!", "There was a problem deleting the word.", "error");
//       }
//     }
//   };
//   const handlePdfUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const response = await axios.post(
//         import.meta.env.VITE_REST_API_URL + "/upload-pdf-excel/",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log("responseinPDF", response?.data);
//       setData(response?.data?.matched_data || []);
//       setUploadDate(response?.data?.upload_date || "");
//       setFilePath(response?.data?.file_path || "");

//       // fetchData(); // Refresh data after uploading the PDF
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   // Define columns with TypeScript
//   const datacolumns: MRT_ColumnDef<TrademarkData>[] = [
//     {
//       accessorKey: "page_number",
//       header: "Page Number",
//       size: 50,
//       Cell: ({ cell }) => (
//         <div className="ml-6">{String(cell.getValue() as number)}</div>
//       ),
//     },
//     {
//       accessorKey: "matched_words_in_both",
//       header: "Matched Words",
//       size: 150,
//       Cell: ({ cell }) => {
//         const wordsArray = cell.getValue<string[]>();
//         return Array.isArray(wordsArray) ? wordsArray.join(", ") : "";
//       },
//     },
//     { accessorKey: "Trade Marks Journal No", header: "Journal No",size: 50 },
//     { accessorKey: "Journal Date", header: "Journal Date" ,size: 50},
//     { accessorKey: "Class", header: "Class",size: 50 },
//     { accessorKey: "Company Name", header: "Company Name" },
//     { accessorKey: "Trademark Number", header: "Trademark Number",size: 50 },
//     { accessorKey: "Application Date", header: "Application Date",size: 50 },
//     { accessorKey: "Trademark Holder Name", header: "Holder Name", size: 300 },
//     // { accessorKey: "Holder Address", header: "Holder Address" },
//     {
//       accessorKey: "Holder Address",
//       header: "Holder Address",
//       size: 200,
//       Cell: ({ cell }) => {
//         const address = cell.getValue<string>(); // Cast as string
//         const maxLength = 50; // Set the maximum length for truncation
//         const isLong = address.length > maxLength;

//         return (
//           <Tooltip
//             title={<span style={{ fontSize: "14px" }}>{address}</span>}
//             arrow
//             placement="top"
//           >
//             <span className="block max-w-[300px] truncate cursor-pointer">
//               {isLong ? `${address.substring(0, maxLength)}...` : address}
//             </span>
//           </Tooltip>
//         );
//       },
//     },
//     { accessorKey: "Entity Type", header: "Entity Type",size: 50, },
//     { accessorKey: "Attorney Name", header: "Attorney Name" ,size: 50},
//     {
//       accessorKey: "Attorney Address",
//       header: "Attorney Address",
//       size: 150,
//       Cell: ({ cell }) => {
//         const description = cell.getValue() as string;
//         const maxLength = 50; // Set the maximum length for truncation
//         const isLong = description.length > maxLength;

//         return (
//           <Tooltip
//             title={
//               <span className="text-[14px]">
//                 {" "}
//                 {/* Change text size and color here */}
//                 {description}
//               </span>
//             }
//             arrow
//             placement="top"
//           >
//             <span className="block max-w-[300px] truncate  ">
//               {isLong
//                 ? `${description.substring(0, maxLength)}...`
//                 : description}
//             </span>
//           </Tooltip>
//         );
//       },
//     },
//     { accessorKey: "Proposed Use", header: "Proposed Use" },
//     // { accessorKey: "Goods/Services Description", header: "Goods/Services" },
//     {
//       accessorKey: "Goods/Services Description",
//       header: "Goods/Services",
//       size: 150,
//       Cell: ({ cell }) => {
//         const description = cell.getValue() as string;
//         const maxLength = 50; // Set the maximum length for truncation
//         const isLong = description.length > maxLength;

//         return (
//           <Tooltip
//             title={
//               <span className="text-[14px]">
//                 {" "}
//                 {/* Change text size and color here */}
//                 {description}
//               </span>
//             }
//             arrow
//             placement="top"
//           >
//             <span className="block max-w-[300px] truncate  ">
//               {isLong
//                 ? `${description.substring(0, maxLength)}...`
//                 : description}
//             </span>
//           </Tooltip>
//         );
//       },
//     },
//   ];
//   const cleanedFileName = filePath.replace(/^\.\/uploads\\+/, '');
//   return (
//     <Layout>
//       <div>
//         <div className="flex justify-end mb-4">
//           {/* <p className="text-lg font-bold">Words Table</p> */}
//           <div className="flex gap-4">
//             <button
//               className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//               onClick={() => setIsPdfModalOpen(true)}
//             >
//               Upload PDF
//             </button>
//             <button
//               className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//               onClick={() => setIsExcelModalOpen(true)}
//             >
//               Upload Word Excel
//             </button>
//             <button
//               className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//               onClick={handleAddWord}
//             >
//               Add Word
//             </button>
//           </div>
//         </div>
//         {data.length>0 && 
//         <div>
//           <MaterialReactTable
//             columns={datacolumns}
//             data={data}
//             // enableColumnOrdering
//             // enablePagination
//             // enableSorting
//             renderTopToolbarCustomActions={() => (
//               <div className="flex gap-4">
//                 <div style={{ textAlign: "left", fontWeight: "bold", padding: "0.5rem" }}>
//                   Upload Date: <span className="font-normal text-gray-500">{new Date(uploadDate).toLocaleDateString()}</span>
//                 </div>
//                 <div style={{ textAlign: "left", fontWeight: "bold", padding: "0.5rem" }}>
//                   PDF Path: <span className="font-normal text-gray-500">{cleanedFileName}</span>
//                 </div>
//               </div>
//             )}
//           />
//         </div>}
//         <div className="my-4">
//           <MaterialReactTable
//             columns={columns}
//             data={words}
//             renderTopToolbarCustomActions={() => (
//               <div className="flex gap-4">
//                 <div
//                   style={{
//                     textAlign: "left",
//                     fontWeight: "bold",
//                     padding: "0.5rem",
//                   }}
//                 >
//                   Total words :{" "}
//                   <span className="font-normal text-gray-500">
//                     ({words?.length})
//                   </span>
//                 </div>
//               </div>
//             )}
//           />
//         </div>
//         <CreateModel
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSubmit={handleSubmit}
//           wordToEdit={wordToEdit || undefined} // Pass the word to edit if editing
//         />
//         {/* ExcelUploadModel modal for uploading Excel files */}
//         <ExcelUploadModel
//           isOpen={isExcelModalOpen}
//           onClose={() => setIsExcelModalOpen(false)}
//           onUpload={handleExcelUpload} // Handle file upload
//         />
//         {/* New PDF Upload Modal */}
//         <PdfUploadModel
//           isOpen={isPdfModalOpen}
//           onClose={() => setIsPdfModalOpen(false)}
//           onUpload={handlePdfUpload}
//         />
//       </div>
//     </Layout>
//   );
// };

// export default Main;
