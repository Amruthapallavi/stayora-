import { IAdminRepository } from "./interfaces/IAdminRepository";
import BaseRepository from "./base.repository";
import Admin, { IUser } from "../models/user.model";
import user from "../models/user.model"
class AdminRepository
  extends BaseRepository<IUser>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await Admin.findOne({ email: email, role: 'admin' });
  }

  async findAllUsers(): Promise<IUser[]> {
    return await user.find({ role: 'user' });
  }


}

export default new AdminRepository();
