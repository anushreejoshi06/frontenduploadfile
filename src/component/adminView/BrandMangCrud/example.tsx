
// import  { useEffect, useState, useMemo } from "react";
// import Layout from "../layout/Layout";
// import axios from "axios";
// import {
//   MaterialReactTable,
//   type MRT_ColumnDef,
// } from "material-react-table";

// // Define the structure of the word data
// type Words = {
//   id: number;
//   word: string;
// };

// const Main = () => {
//   const [words, setWords] = useState<Words[]>([]); // State to hold words data
//   const [isModalOpen, setIsModalOpen] = useState(false); // State for modal open/close
//   const [newWord, setNewWord] = useState(""); // State for new word input

//   const fetchData = async () => {
//     const token = window.localStorage.getItem("token");
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/get-all-words", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setWords(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Define the columns using useMemo
//   const columns = useMemo<MRT_ColumnDef<Words>[]>(() => [
//     {
//       accessorKey: "id", // ID field
//       header: "ID",
//       size: 50, // Column width
//     },
//     {
//       accessorKey: "word", // Word field
//       header: "Word",
//       size: 150,
//     },
//     {
//       header: "Action", // Action column with Edit and Delete buttons
//       size: 150,
//       Cell: ({ row }) => (
//         <div className="flex space-x-2">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
//             onClick={() => handleEdit(row.original)}
//           >
//             Edit
//           </button>
//           <button
//             className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
//             onClick={() => handleDelete(row.original.id)}
//           >
//             Delete
//           </button>
//         </div>
//       ),
//     },
//   ], []);

//   // Handle add word (triggered by Add Word button)
//   const handleAddWord = () => {
//     setIsModalOpen(true); // Open modal when Add Word is clicked
//   };

//   // Handle submit inside the modal to add the new word
//   const handleSubmit = async () => {
//     const token = window.localStorage.getItem("token");
//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:8000/add-words", 
//         [newWord ], // The new word to be added
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setWords([...words, res.data]); // Add the new word to the table
//       setNewWord(""); // Clear input field
//       setIsModalOpen(false); // Close modal after adding
//     } catch (error) {
//       console.log(error);
//     }
//   };
// //   Handle edit button click
//   const handleEdit = (word: Words) => {
//     console.log("Editing word:", word.id);
//     // const token = window.localStorage.getItem("token");
//     // Here you can implement edit logic, e.g., open a modal with the word details
    
//   };

//   // Handle delete button click
//   const handleDelete = async (id: number) => {
//     const token = window.localStorage.getItem("token");
//     try {
//       await axios.delete(`http://127.0.0.1:8000/delete-word/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setWords(words.filter((word) => word.id !== id)); // Remove the deleted word from state
//     } catch (error) {
//       console.log(error);
//     }
//   };



//   // Handle close modal
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setNewWord(""); // Reset word input
//   };

//   return (
//     <Layout>
//       <div>
//         <div className="flex justify-between mb-4">
//           <p className="text-lg font-bold">Words Table</p>
//           {/* Add Word Button */}
//           <button
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//             onClick={handleAddWord}
//           >
//             Add Word
//           </button>
//         </div>

//         {/* Render Material React Table */}
//         <MaterialReactTable columns={columns} data={words} />

//         {/* Modal to Add Word */}
//         {isModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
//               <h2 className="text-xl font-bold mb-4">Add New Word</h2>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 mb-4 border rounded"
//                 placeholder="Enter word"
//                 value={newWord}
//                 onChange={(e) => setNewWord(e.target.value)}
//               />
//               <div className="flex justify-end space-x-4">
//                 <button
//                   className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
//                   onClick={handleCloseModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                   onClick={handleSubmit}
//                 >
//                   Add Word
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
        
//       </div>
//     </Layout>
//   );
// };

// export default Main;
