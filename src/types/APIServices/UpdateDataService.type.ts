export type PatchDataPatchRequestType = FormData;

export interface PatchDataPatchResponseType {
  message: string;
  data: {
    avata: string;
    full_name: string;
    year_of_birth: string;
    hometown: string;
    id_number: string;
    violation: string;
    data: string[];
  };
  status: number;
}
