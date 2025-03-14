export interface ProfileBlacklistGetResponseItemType {
  avata: string;
  full_name: string;
  year_of_birth: number;
  hometown: string;
  id_number: string;
  violation: string;
  data: string[];
}

export type ProfileBlacklistGetResponseType = {
  [key: string]: ProfileBlacklistGetResponseItemType;
};
