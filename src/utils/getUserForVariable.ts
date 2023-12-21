import { IUser } from "@/types/user.interface";

export function getUserForVariables(user: any): IUser {
  return {
    _id: user._id,
    username: user.username,
    rol: user.rol,
    firstname: user.firstname,
    lastname: user.lastname,
    image: user.image,
    email: user.email,
    is_verified: user.is_verified,
    created_date: user.created_date,
  };
}
