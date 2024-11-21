import React, { useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import Tooltip from "@mui/material/Tooltip";

type found_pdfs = {
  page_number: number;
  search_word: string;
  journal_number: string;
  journal_date: string;
  class_type: string;
  company_name: string;
  trademark_number: string;
  application_date: string;
  holder_name: string;
  holder_address: string;
  entity_type: string;
  attorney_name: string;
  attorney_address: string;
  proposed_use: string;
  goods_services_description: string;
};

type SearchResultsProps = {
  data: {
    found_pdfs: found_pdfs[];
    found_words: { id: number; word: string }[];
    not_found_words: string[];
    not_found_pdfs: string[];
  };
};

const SearchResults: React.FC<SearchResultsProps> = ({ data }) => {
  // Define columns for the `found_pdfs` table
  const foundWordsColumns = useMemo<MRT_ColumnDef<found_pdfs>[]>(
    () => [
      { accessorKey: "page_number", header: "Page No", size: 50 },
      // { accessorKey: "search_word", header: "Search Word", size: 100 },
      {
        accessorKey: "search_word",
        header: "Search Word",
        size: 100,
        Cell: ({ cell }) => (
          // <span style={{ color: "green" }}>{cell.getValue()}</span>
          // <span style={{ color: "green" }}>{String(cell.getValue())}</span>
          <span className="text-yellow-500">{String(cell.getValue())}</span>

        ),
      }
      ,
      { accessorKey: "journal_number", header: "Journal No", size: 150 },
      { accessorKey: "journal_date", header: "Journal Date", size: 150 },
      { accessorKey: "class_type", header: "Class Type", size: 150 },
      { accessorKey: "company_name", header: "Company Name", size: 150 },
      {
        accessorKey: "trademark_number",
        header: "Trademark No",
        size: 150,
      },
      {
        accessorKey: "application_date",
        header: "Application Date",
        size: 150,
      },
      { accessorKey: "holder_name", header: "Holder Name", size: 150 },
      //   { accessorKey: "holder_address", header: "Holder Address", size: 150 },
      {
        accessorKey: "holder_address",
        header: "Holder Address",
        size: 150,
        Cell: ({ cell }) => {
          const address = cell.getValue() as string;
          const maxLength = 50;
          const isLong = address.length > maxLength;

          return (
            <Tooltip
              title={<span className="text-[16px]">{address}</span>}
              arrow
              placement="top"
            >
              <span className="block max-w-[150px] truncate">
                {isLong ? `${address.substring(0, maxLength)}...` : address}
              </span>
            </Tooltip>
          );
        },
      },
      { accessorKey: "entity_type", header: "Entity Type", size: 150 },
      { accessorKey: "attorney_name", header: "Attorney Name", size: 150 },
      //   {
      //     accessorKey: "attorney_address",
      //     header: "Attorney Address",
      //     size: 150,
      //   },
      {
        accessorKey: "attorney_address",
        header: "Attorney Address",
        size: 150,
        Cell: ({ cell }) => {
          const address = cell.getValue() as string;
          const maxLength = 50;
          const isLong = address.length > maxLength;

          return (
            <Tooltip
              title={<span className="text-[16px]">{address}</span>}
              arrow
              placement="top"
            >
              <span className="block max-w-[150px] truncate">
                {isLong ? `${address.substring(0, maxLength)}...` : address}
              </span>
            </Tooltip>
          );
        },
      },
      { accessorKey: "proposed_use", header: "Proposed Use", size: 150 },
      //   { accessorKey: 'goods_services_description', header: 'Goods/Services', size: 150 },
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
                <span className="text-[16px]">
                  {" "}
                  {/* Change text size and color here */}
                  {description}
                </span>
              }
              arrow
              placement="top"
            >
              <span className="block max-w-[150px] truncate  ">
                {isLong
                  ? `${description.substring(0, maxLength)}...`
                  : description}
              </span>
            </Tooltip>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between space-x-4">
        <div className="w-[800px]">
          <h2 className="text-lg font-bold mb-4">Words Found in Govt. Dashboard</h2>
          <MaterialReactTable
            columns={foundWordsColumns}
            data={data?.found_pdfs}
            initialState={{
              columnVisibility: {
                class_type: false,
                company_name: false,
                goods_services_description: false,
                proposed_use: false,
                application_date: false,
                attorney_address: false,
                entity_type: false,
                holder_address: false,
                attorney_name:false,
                holder_name:false
              },
            }}
          />
        </div>

        {/* <div className="w-1/3">
          <h2 className="text-lg font-bold mb-4">Found Words</h2>
          <MaterialReactTable
            columns={[
              { accessorKey: "id", header: "Id",size: 100 },
              { accessorKey: "word", header: "Word",size: 150 },
            ]}
            data={data.found_words}
            enableColumnResizing={false}
            columnResizeMode="onEnd"
            initialState={{
              columnVisibility: {
                id: true, // ensures 'id' column is visible if hidden by default
              },
            }}
          />
        </div> */}
        <div className="w-[500px]">
          <h2 className="text-lg font-bold mb-4"> Words Found in Trademark Management</h2>
          <MaterialReactTable
            columns={[
              {
                header: "S.No.",
                accessorKey: "serialNumber",
                Cell: ({ row }) => row.index + 1, 
                size: 50,
              },
              { accessorKey: "word", header: "Word", 
                Cell: ({ cell }) => (
                <span className="text-yellow-500">{String(cell.getValue())}</span>
              )
            },
            ]}
            data={data?.found_words}
            enableColumnResizing={false}
            columnResizeMode="onEnd"
          />
        </div>
      </div>
      {/* <div className="flex justify-between space-x-4">
        <div className="w-1/2">
          <h2 className="text-lg font-bold mb-4">Not Found PDFs Words</h2>
          <MaterialReactTable
            columns={[{ accessorKey: "pdf", header: "PDF" }]}
            data={data.not_found_pdfs.map((pdf) => ({ pdf }))}
          />
        </div>

        <div className="w-1/2">
          <h2 className="text-lg font-bold mb-4">Not Found Excel Words</h2>
          <MaterialReactTable
            columns={[{ accessorKey: "word", header: "Word" }]}
            data={data.not_found_words.map((word) => ({ word }))}
          />
        </div>
      </div> */}
    </div>
  );
};

export default SearchResults;
