import customAxios from "../utils/customAxios";
import { RequestOptions } from "../types/global/Global.type";
import {
  DeleteDataDeleteRequestType,
  DeleteDataDeleteResponseType,
} from "../types/APIServices/DeleteDataService.type";

export const deleteData = async ({
  data,
  options,
}: {
  data: DeleteDataDeleteRequestType;
  options: RequestOptions;
}) => {
  try {
    const response = await customAxios.delete<DeleteDataDeleteResponseType>(
      "delete_data/",
      {
        data,
        ...options,
      }
    );
    return response;
  } catch (error) {
    console.error("deleteDataError: ", error);
  }
};
