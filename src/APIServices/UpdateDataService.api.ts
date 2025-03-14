import customAxios from "../utils/customAxios";
import { RequestOptions } from "../types/global/Global.type";
import {
  PatchDataPatchRequestType,
  PatchDataPatchResponseType,
} from "../types/APIServices/UpdateDataService.type";

export const patchData = async ({
  data,
  options,
}: {
  data: PatchDataPatchRequestType;
  options: RequestOptions;
}) => {
  try {
    const response = await customAxios.patch<PatchDataPatchResponseType>(
      "update_data/",
      data,
      options
    );
    return response;
  } catch (error) {
    console.error("updateDataCreateDataServiceError: ", error);
  }
};
