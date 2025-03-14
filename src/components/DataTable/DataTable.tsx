import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TransformProfileBlacklistGetResponseType } from "../../types/global/Global.type";

type DataTableProps = {
  rows: TransformProfileBlacklistGetResponseType[];
  columns: GridColDef[];
  paginationModel: {
    page: number;
    pageSize: number;
  };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{
      page: number;
      pageSize: number;
    }>
  >;
  isLoadingDeleteData: boolean;
  isLoadingAddData: boolean;
  isLoadingEditData: boolean;
};

const DataTable = ({
  columns,
  rows,
  paginationModel,
  setPaginationModel,
  isLoadingDeleteData,
  isLoadingAddData,
  isLoadingEditData,
}: DataTableProps) => {
  return (
    <>
      {rows && (
        <div
          className="absolute z-1 w-[75%] h-[80%] top-1/2 left-1/2 
        transform -translate-x-1/2 -translate-y-1/2"
        >
          <DataGrid
            className="w-full h-full"
            columns={columns}
            rows={rows}
            rowCount={rows.length}
            pageSizeOptions={[5, 10]}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={(newPage) =>
              setPaginationModel((prev) => ({
                ...prev,
                page: newPage.page,
                pageSize: newPage.pageSize,
              }))
            }
            loading={
              isLoadingDeleteData || isLoadingAddData || isLoadingEditData
            }
          />
        </div>
      )}
    </>
  );
};

export default DataTable;
