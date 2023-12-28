export type UserDataVariables =
  | "username"
  | "firstname"
  | "lastname"
  | "email"
  | "rol"
  | "created_date"
  | "image"
  | "is_verified";

export const userDataVariablesAndManagable = {
  username: false,
  firstname: true,
  lastname: true,
  email: false,
  rol: false,
  created_date: false,
  image: true,
  is_verified: false,
};
