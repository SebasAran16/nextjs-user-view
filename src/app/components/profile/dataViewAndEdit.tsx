import { IUser } from "@/types/user.interface";
import {
  UserDataVariables,
  userDataVariablesAndManagable,
} from "@/utils/arrays/userData";
import { fromSerpentToReadable } from "@/utils/fromSerpentToReadable";
import { toast } from "react-hot-toast";

interface DataViewAndEditProps {
  userData: IUser;
}

export default function DataViewAndEdit({ userData }: DataViewAndEditProps) {
  const userDataVariables = Object.keys(
    userDataVariablesAndManagable
  ) as UserDataVariables[];

  const handleSubmitChangeUserData = async () => {
    try {
      // Send API request
    } catch (err) {
      console.log(err);
      toast.error("There was an error");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitChangeUserData}>
        {userDataVariables.map((data: UserDataVariables, index: number) => {
          return (
            <div key={index}>
              <label>{fromSerpentToReadable(data)}:</label>
              <input
                type="text"
                placeholder={
                  userDataVariablesAndManagable[data]
                    ? `New ${data}`
                    : userData[data]?.toString()
                }
              />
            </div>
          );
        })}
        <button type="submit">Save</button>
      </form>
    </>
  );
}
