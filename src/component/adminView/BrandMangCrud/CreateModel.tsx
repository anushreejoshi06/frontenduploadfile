import React, { useState, useEffect } from "react";

type CreateModelProps = {
  isOpen: boolean; // Prop to control modal visibility
  onClose: () => void; // Function to close the modal
  onSubmit: (words: string[], id?: number) => void; // Function to handle submit, with optional id for edit
  wordToEdit?: { id: number; word: string }; // Optional prop to pass the word being edited
};

const CreateModel: React.FC<CreateModelProps> = ({ isOpen, onClose, onSubmit, wordToEdit }) => {
  const [wordFields, setWordFields] = useState<string[]>([""]); // Manage multiple word inputs

  // Populate the input with the wordToEdit if editing
  useEffect(() => {
    if (wordToEdit) {
      setWordFields([wordToEdit.word]); // Set the existing word in the input
    } else {
      setWordFields([""]); // Initialize with one input field when adding a new word
    }
  }, [wordToEdit]);

  // Handle input change for dynamic fields
  const handleInputChange = (index: number, value: string) => {
    const updatedFields = [...wordFields];
    updatedFields[index] = value;
    setWordFields(updatedFields);
  };

  // Add a new input field
  const handleAddInput = (index: number) => {
    // Only add a new input field when the last "+" button is clicked
    if (index === wordFields.length - 1) {
      setWordFields([...wordFields, ""]); // Add a new empty input field
    }
  };

  // Handle submit inside the modal
  const handleSubmit = () => {
    const filteredWords = wordFields.filter((word) => word.trim() !== ""); // Prevent empty submissions
    onSubmit(filteredWords, wordToEdit?.id); // Call the parent function with words and optional id for edit
    setWordFields([""]); // Clear input fields after submission
  };

  if (!isOpen) return null; // Do not render if the modal is closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-4">
        <h2 className="text-xl font-bold mb-4">{wordToEdit ? "Edit Word" : "Add New Word"}</h2>
        
        {/* Render multiple input fields */}
        {wordFields.map((word, index) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter word"
              value={word}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            {/* Show "+" button only when creating a new word (not when editing) */}
            {!wordToEdit && (
              <button
                className="bg-blue-400 hover:bg-blue-600 rounded-full text-xl w-8 h-8 flex items-center justify-center"
                onClick={() => handleAddInput(index)}
              >
                +
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            {wordToEdit ? "Update Word" : "Add Words"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModel;

// ------------------------------------------------------------------------------
// import React, { useState, useEffect } from "react";

// type CreateModelProps = {
//   isOpen: boolean; // Prop to control modal visibility
//   onClose: () => void; // Function to close the modal
//   onSubmit: (newWord: string, id?: number) => void; // Function to handle submit, with optional id for edit
//   wordToEdit?: { id: number; word: string }; // Optional prop to pass the word being edited
// };

// const CreateModel: React.FC<CreateModelProps> = ({ isOpen, onClose, onSubmit, wordToEdit }) => {
//   const [newWord, setNewWord] = useState(""); // Local state for new word input

//   // Populate the input with the wordToEdit if editing
//   useEffect(() => {
//     if (wordToEdit) {
//       setNewWord(wordToEdit.word); // Set the existing word in the input
//     } else {
//       setNewWord(""); // Clear input when adding a new word
//     }
//   }, [wordToEdit]);

//   // Handle submit inside the modal
//   const handleSubmit = () => {
//     if (newWord.trim() === "") return; // Prevent empty submissions
//     onSubmit(newWord, wordToEdit?.id); // Call the parent function with word and optional id for edit
//     setNewWord(""); // Clear input after submission
//   };

//   if (!isOpen) return null; // Do not render if the modal is closed

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
//         <h2 className="text-xl font-bold mb-4">{wordToEdit ? "Edit Word" : "Add New Word"}</h2>
//         <input
//           type="text"
//           className="w-full px-3 py-2 mb-4 border rounded"
//           placeholder="Enter word"
//           value={newWord}
//           onChange={(e) => setNewWord(e.target.value)}
//         />
//         <div className="flex justify-end space-x-4">
//           <button
//             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             onClick={handleSubmit}
//           >
//             {wordToEdit ? "Update Word" : "Add Word"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateModel;

