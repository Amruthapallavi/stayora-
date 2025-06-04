import { UserStatus } from "../models/status/status";

export interface PaginationQueryDTO {
  page: number;
  limit: number;
  search: string;
}
export interface UpdateStatusDTO {
  status: UserStatus; 
}

export interface RejectOwnerDTO {
  reason: string;
}

