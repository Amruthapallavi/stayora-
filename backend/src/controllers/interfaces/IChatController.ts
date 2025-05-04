import { Request, Response } from "express";

export interface IChatController {
//   sendMessage(req: Request, res: Response): Promise<void>;
  getConversation(req: Request, res: Response): Promise<void>;
//   getConversations(req: Request, res: Response): Promise<void>;
}