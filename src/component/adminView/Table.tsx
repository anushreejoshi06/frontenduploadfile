// import { useMemo } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
//   type MRT_ColumnDef,
// } from "material-react-table";

// // Example data type based on your tableData structure
// type TableData = {
//   application_date: string;
//   attorney_address: string;
//   attorney_name: string;
//   class_type: string;
//   company_name: string;
//   entity_type: string;
//   goods_services_description: string;
//   holder_address: string;
//   holder_name: string;
//   id: number;
//   journal_date: string;
//   journal_number: string;
//   page_number: number;
//   proposed_use: string;
//   trademark_number: string;

// };

// const Table = ({ tableData }: { tableData: TableData[] }) => {
//   console.log("tableData", tableData);

//   // Memoized column definitions based on the structure of tableData
//   const columns = useMemo<MRT_ColumnDef<TableData>[]>(
//     () => [
//       // {
//       //   accessorKey: "id",
//       //   header: "ID",
//       //   size: 100,
//       // },
//       {
//         accessorKey: "page_number",
//         header: "Page Number",
//         size: 150,
//       },
//       {
//         accessorKey: "application_date", // Normal accessorKey
//         header: "Application Date",
//         size: 150,
//       },
//       {
//         accessorKey: "trademark_number",
//         header: "Trademark Number",
//         size: 100,
//       },
//       {
//         accessorKey: "attorney_name",
//         header: "Attorney Name",
//         size: 250,

//         // Cell: ({ cell }) => (cell.getValue() as string[]).join(", "),
//       },
//       {
//         accessorKey: "class_type",
//         header: "Class Type",
//         size: 150,
//       },
//       {
//         accessorKey: "attorney_address",
//         header: "Attorney Address",
//         size: 150,
//       },
//       {
//         accessorKey: "company_name",
//         header: "Company Name",
//         size: 150,
//       },
//       {
//         accessorKey: "entity_type",
//         header: "Entity Type",
//         size: 150,
//       },
//       {
//         accessorKey: "goods_services_description",
//         header: "Goods/Services Description",
//         size: 150,
//       },
//       {
//         accessorKey: "holder_address",
//         header: "Holder Address",
//         size: 150,
//       },
//       {
//         accessorKey: "journal_date",
//         header: "Journal Date",
//         size: 150,
//       },
//       {
//         accessorKey: "journal_number",
//         header: "Journal Number",
//         size: 150,
//       },
//       {
//         accessorKey: "proposed_use",
//         header: "Proposed Use",
//         size: 150,
//       },
//       {
//         accessorKey: "trademark_number",
//         header: "Trademark Number",
//         size: 150,
//       },
//       {
//         accessorKey: "holder_name",
//         header: " Holder Name",
//         size: 150,
//       },
//     ],
//     []
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: tableData, // Use the passed tableData prop
//   });

//   return <MaterialReactTable table={table} />;
// };

// export default Table;
// ------------------------------------ main upper wala hai ----------------------------------
import  { useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import Tooltip from "@mui/material/Tooltip";


type TableData = {
  application_date: string;
  attorney_address: string;
  attorney_name: string;
  class_type: string;
  company_name: string;
  entity_type: string;
  goods_services_description: string;
  holder_address: string;
  holder_name: string;
  id: number;
  journal_date: string;
  journal_number: string;
  page_number: number;
  proposed_use: string;
  trademark_number: string;
};

const Table = ({ tableData }: any) => {
  if (!tableData || !tableData.extracted_data) {
    return <div>Loading...</div>; // Display a loading message while data loads
  }

  const uploadDate = new Date(tableData.upload_date).toLocaleDateString();
  const pdfFileName = tableData.pdf_name
  const cleanedFileName = pdfFileName.replace(/^\.\/uploads\\+/, '');
  

  const columns = useMemo<MRT_ColumnDef<TableData>[]>(
    () => [
      // { accessorKey: "page_number", header: "Page Number", size: 150 },
      {
        accessorKey: "page_number",
        header: "Page Number",
        size: 150,
        Cell: ({ cell }) => (
          <div className="ml-6">{String(cell.getValue() as number)}</div>
        ),
      },
      
      
      
      {
        accessorKey: "application_date",
        header: "Application Date",
        size: 150,
      },
      {
        accessorKey: "trademark_number",
        header: "Trademark Number",
        size: 100,
      },
      { accessorKey: "attorney_name", header: "Attorney Name", size: 200 },
      { accessorKey: "class_type", header: "Class Type", size: 100 },
      {
        accessorKey: "attorney_address",
        header: "Attorney Address",
        size: 350,
      },
      { accessorKey: "company_name", header: "Company Name", size: 150 },
      { accessorKey: "entity_type", header: "Entity Type", size: 150 },
      // { accessorKey: "goods_services_description", header: "Goods/Services Description", size: 150 },
      {
        accessorKey: "goods_services_description",
        header: "Goods/Services Description",
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
      { accessorKey: "holder_address", header: "Holder Address", size: 400 },
      { accessorKey: "journal_date", header: "Journal Date", size: 150 },
      { accessorKey: "journal_number", header: "Journal Number", size: 150 },
      { accessorKey: "proposed_use", header: "Proposed Use", size: 150 },
      { accessorKey: "holder_name", header: "Holder Name", size: 300 },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={tableData.extracted_data}
      renderTopToolbarCustomActions={() => (
        <div className="flex gap-4"><div
          style={{ textAlign: "left", fontWeight: "bold", padding: "0.5rem" }}
        >
          Upload Date : <span className="font-normal text-gray-500">{uploadDate}</span> 
        </div><div
          style={{ textAlign: "left", fontWeight: "bold", padding: "0.5rem" }}
        >
            PDF Name : <span className="font-normal text-gray-500">{cleanedFileName}</span>
          </div></div>
      )}
    />
  );
};

export default Table;
