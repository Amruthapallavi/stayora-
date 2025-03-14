import User, { IUser } from "../models/user.model";
import { IUserRepository } from "./interfaces/IUserRepository";
import BaseRepository from "./base.repository";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email });
  }
  
}

export default new UserRepository();