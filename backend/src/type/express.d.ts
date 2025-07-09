import "express";

declare module "express" {
  export interface Request {
    userId?: string;
    userType?: "user" | "owner" | "admin";
  }
}
