import { useEffect, useState } from "react";
import * as ProfileBlacklistService from "../../APIServices/ProfileBlacklistService.api";
import { ProfileBlacklistGetResponseType } from "../../types/APIServices/ProfileBlacklistService.type";
import { TransformProfileBlacklistGetResponseType } from "../../types/global/Global.type";

import DataTable from "../../components/DataTable/DataTable";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import AddNewSubjects from "./BlacklistActions/AddNewSubjects";
import EditSubjects from "./BlacklistActions/EditSubjects";
import DeleteSubject from "./BlacklistActions/DeleteSubject";
import Loading from "../../components/LoadingPage/LoadingPage";

const Blacklist = () => {
  const [openAddBlacklistData, setOpenAddBlacklistData] = useState(false);
  const [openEditBlacklistData, setOpenEditBlacklistData] = useState<
    number | null
  >(null);

  const [blackList, setBlackList] = useState<
    TransformProfileBlacklistGetResponseType[]
  >([]);
  console.log("blackList", blackList);
  const blackListColumns: GridColDef<(typeof blackList)[number]>[] = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "avatar",
      headerName: "Ảnh nhận dạng",
      renderCell: (params) => (
        <div className="flex justify-center items-center">
          <img className="w-12" src={params.row.avatar} alt="avatar" />,
        </div>
      ),
      width: 150,
    },
    { field: "fullName", headerName: "Họ và tên", width: 200 },
    { field: "yearOfBirth", headerName: "Năm sinh", width: 150 },
    { field: "hometown", headerName: "Quê quán", width: 150 },
    { field: "IdNumber", headerName: "Căn cước/CMND", width: 200 },
    // { field: "violation", headerName: "Vi phạm", width: 200 },
    {
      field: "action",
      headerName: "Hành động",
      renderCell: (
        params: GridRenderCellParams<TransformProfileBlacklistGetResponseType>
      ) => (
        <div className="w-full h-full flex justify-evenly items-center">
          <EditSubjects
            openEditBlacklistData={openEditBlacklistData}
            setOpenEditBlacklistData={setOpenEditBlacklistData}
            setBlackList={setBlackList}
            setIsLoadingUpdateModel={setIsLoadingUpdateModel}
            setIsLoadingEditData={setIsLoadingEditData}
            tableRowData={params}
          />

          <DeleteSubject
            setBlackList={setBlackList}
            tableRowData={params}
            setIsLoadingUpdateModel={setIsLoadingUpdateModel}
            setIsLoadingDeleteData={setIsLoadingDeleteData}
          />
        </div>
      ),
      width: 240,
    },
  ];
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [isLoadingUpdateModel, setIsLoadingUpdateModel] = useState(false);
  const [isLoadingAddData, setIsLoadingAddData] = useState(false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [isLoadingDeleteData, setIsLoadingDeleteData] = useState(false);

  useEffect(() => {
    function transformBlacklistData(data: ProfileBlacklistGetResponseType) {
      const rows: TransformProfileBlacklistGetResponseType[] = [];
      Object.entries(data).forEach(([key, info], index) => {
        const {
          avata,
          full_name,
          year_of_birth,
          hometown,
          id_number,
          violation,
        } = info;

        rows.push({
          id: index + 1,
          avatar: import.meta.env.VITE_API_URL + avata,
          unsignedFirstName: key,
          fullName: full_name,
          yearOfBirth: year_of_birth,
          hometown: hometown,
          IdNumber: id_number,
          violation: violation,
        });
      });
      return rows;
    }

    const getBlacklist = async () => {
      const response = await ProfileBlacklistService.getAllData();

      if (response) {
        const transformedBlacklistData = transformBlacklistData(response);
        console.log("transformedBlacklistData: ", transformedBlacklistData);
        if (transformedBlacklistData) {
          setBlackList(transformedBlacklistData);
        }
      }
    };
    if (!blackList || blackList.length === 0) {
      getBlacklist();
    }
  }, [blackList]);

  return (
    <div className="relative z-0 w-screen h-[calc(100vh-64px)]">
      <AddNewSubjects
        openAddBlacklistData={openAddBlacklistData}
        setOpenAddBlacklistData={setOpenAddBlacklistData}
        setBlackList={setBlackList}
        setIsLoadingUpdateModel={setIsLoadingUpdateModel}
        setIsLoadingAddData={setIsLoadingAddData}
      />

      <DataTable
        columns={blackListColumns}
        rows={blackList}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        isLoadingDeleteData={isLoadingDeleteData}
        isLoadingAddData={isLoadingAddData}
        isLoadingEditData={isLoadingEditData}
      />

      {isLoadingUpdateModel && <Loading />}
    </div>
  );
};

export default Blacklist;
