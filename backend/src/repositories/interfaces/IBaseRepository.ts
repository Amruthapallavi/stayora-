import { FilterQuery } from "mongoose";
import {  DeleteResult } from "mongoose";

export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(condition: FilterQuery<T>): Promise<T | null>;
    find(condition?: FilterQuery<T>): Promise<T[]>;
    update(id: string, updateData: Partial<T>): Promise<T | null>;

    delete(id: string): Promise<T | null>;
    deleteOne(condition: FilterQuery<T>): Promise<DeleteResult>;
    deleteMany(condition: FilterQuery<T>): Promise<DeleteResult>;
    countDocuments(filter?: FilterQuery<T>): Promise<number>;
  

};