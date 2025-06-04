import { IProperty } from "./property";


export interface ICart{
    _id: string;
    userId: string;
    properties: IProperty[];
    totalCost: number;
    createdAt: Date;
    updatedAt: Date;
}