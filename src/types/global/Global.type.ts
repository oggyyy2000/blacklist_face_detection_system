// API
export type RequestOptions = {
  headers: {
    "Content-Type": string;
  };
};

// in multiple files
export interface TransformProfileBlacklistGetResponseType {
  id: number;
  avatar: string;
  unsignedFirstName: string;
  fullName: string;
  yearOfBirth: number | string;
  hometown: string;
  IdNumber: string;
  violation: string;
}