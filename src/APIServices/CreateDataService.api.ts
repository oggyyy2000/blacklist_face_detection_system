import customAxios from "../utils/customAxios";
import { RequestOptions } from "../types/global/Global.type";
import {
  CreateDataPostRequestType,
  CreateDataPostResponseType,
} from "../types/APIServices/CreateDataService.type";

export const postData = async ({
  data,
  options,
}: {
  data: CreateDataPostRequestType;
  options: RequestOptions;
}) => {
  try {
    const response = await customAxios.post<CreateDataPostResponseType>(
      "create_data/",
      data,
      options
    );
    return response;
  } catch (error) {
    console.error("postDataCreateDataError: ", error);
  }
};
