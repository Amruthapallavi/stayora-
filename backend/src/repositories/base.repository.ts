import { Model, Document, ObjectId, FilterQuery, DeleteResult } from "mongoose";
import { IBaseRepository } from "./interfaces/IBaseRepository";

class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private model: Model<T>;
  
  constructor(model: Model<T>) {
    this.model = model;
  }
  
  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }
  
  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }
  
  async findOne(condition: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(condition).exec();
  }
  
  async find(condition: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(condition).exec();
  }
  
  async update(id: string, updateData: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }
  
  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }
  
  async deleteOne(condition: FilterQuery<T>): Promise<DeleteResult> {
    return await this.model.deleteOne(condition).exec();
  }
  
  async deleteMany(condition: FilterQuery<T>): Promise<DeleteResult> {
    return await this.model.deleteMany(condition).exec();
  }
  
  async countDocuments(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }
}

export default BaseRepository;
