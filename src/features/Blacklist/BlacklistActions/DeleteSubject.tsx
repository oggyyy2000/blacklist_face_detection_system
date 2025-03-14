import { toast } from "react-toastify";

import * as DeleteDataService from "../../../APIServices/DeleteDataService.api";
import * as UpdateModelService from "../../../APIServices/UpdateModel.api";

import { TransformProfileBlacklistGetResponseType } from "../../../types/global/Global.type";
import { GridRenderCellParams } from "@mui/x-data-grid";

import { Button } from "@mui/material";

import Icon from "@mdi/react";
import { mdiTrashCan } from "@mdi/js";

type DeleteSubjectProps = {
  setBlackList: React.Dispatch<
    React.SetStateAction<TransformProfileBlacklistGetResponseType[]>
  >;
  tableRowData: GridRenderCellParams<TransformProfileBlacklistGetResponseType>;
  setIsLoadingUpdateModel: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadingDeleteData: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteSubject = ({
  setBlackList,
  tableRowData,
  setIsLoadingUpdateModel,
  setIsLoadingDeleteData,
}: DeleteSubjectProps) => {
  const handleUpdateModel = async () => {
    setIsLoadingUpdateModel(true);
    const responsePostUpdateModel = await UpdateModelService.postData();
    if (responsePostUpdateModel) {
      toast.success(
        (responsePostUpdateModel as unknown as { message: string }).message,
        {
          onClose: () => {
            setIsLoadingUpdateModel(false);
            setBlackList([]);
          },
        }
      );
    }
  };

  const handleActionDeleteBlacklistData = async (
    data: GridRenderCellParams<TransformProfileBlacklistGetResponseType>
  ) => {
    setIsLoadingDeleteData(true);
    const formData = new FormData();
    formData.append("name", data.row.unsignedFirstName);
    const response = await DeleteDataService.deleteData({
      data: formData,
      options: { headers: { "Content-Type": "multipart/form-data" } },
    });

    if (response) {
      toast.warning((response as unknown as { message: string }).message, {
        onClose: () => {
          setIsLoadingDeleteData(false);
          handleUpdateModel();
        },
      });
    }
  };
  return (
    <Button
      className="!min-w-14 !w-10 !h-9"
      variant="contained"
      color="error"
      title="Xóa dữ liệu"
      onClick={() => handleActionDeleteBlacklistData(tableRowData)}
    >
      <Icon path={mdiTrashCan} size={1} />
    </Button>
  );
};

export default DeleteSubject;
