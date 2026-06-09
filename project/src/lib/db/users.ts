import usersData from "@/../data/users/user.json";
import { Users } from "../../interfaces/auth/user";

export const getUsers = async (): Promise<Users> => {
  return usersData as Users;
};
