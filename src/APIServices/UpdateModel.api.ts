import customAxios from "../utils/customAxios";
import { PostDataPostResponseType } from "../types/APIServices/UpdateModel.type";

export const postData = async () => {
  try {
    const response = await customAxios.post<PostDataPostResponseType>(
      "update_model/"
    );
    return response;
  } catch (error) {
    console.error("UpdateModelServiceError: ", error);
  }
};
