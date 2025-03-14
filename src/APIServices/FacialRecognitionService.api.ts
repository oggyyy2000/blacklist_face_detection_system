import customAxios from "../utils/customAxios";
import { RequestOptions } from "../types/global/Global.type";
import {
  FacialRecognitionPostRequestType,
  FacialRecognitionPostResponseType,
} from "../types/APIServices/FacialRecognitionService.type";

export const postData = async ({
  data,
  options,
}: {
  data: FacialRecognitionPostRequestType;
  options: RequestOptions;
}) => {
  try {
    const response = await customAxios.post<FacialRecognitionPostResponseType>(
      "facialrecognition/",
      data,
      options
    );
    return response.data;
  } catch (error) {
    console.error("FacialRecognitionServiceError: ", error);
  }
};
