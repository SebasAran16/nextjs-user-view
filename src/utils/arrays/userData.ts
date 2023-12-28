export type UserDataVariables = "username" | "firstname" | "lastname" | "email";
export type UserDataEditableVariables =
  | "firstname"
  | "lastname"
  | "password"
  | "image";

export const userDataVariablesAndManagable = {
  username: false,
  email: false,
  firstname: true,
  lastname: true,
};

export interface IUserEdit {
  firstname?: string;
  lastname?: string;
  password?: string;
  image?: string;
}
