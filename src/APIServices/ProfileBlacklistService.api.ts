import customAxios from "../utils/customAxios";
import { ProfileBlacklistGetResponseType } from "../types/APIServices/ProfileBlacklistService.type";

export const getAllData = async () => {
  try {
    const response = await customAxios.get<ProfileBlacklistGetResponseType>(
      "profileblacklist/"
    );
    return response.data;
  } catch (error) {
    console.log("getProfileBlacklistError: ", error);
  }
};
