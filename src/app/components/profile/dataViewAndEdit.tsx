import { IUser } from "@/types/user.interface";
import {
  UserDataVariables,
  userDataVariablesAndManagable,
} from "@/utils/arrays/userData";
import { fromSerpentToReadable } from "@/utils/fromSerpentToReadable";

interface DataViewAndEditProps {
  userData: IUser;
}

export default function DataViewAndEdit({ userData }: DataViewAndEditProps) {
  const userDataVariables = Object.keys(
    userDataVariablesAndManagable
  ) as UserDataVariables[];

  return (
    <>
      <form>
        {userDataVariables.map((data: UserDataVariables, index: number) => {
          return (
            <>
              <label>{fromSerpentToReadable(data)}:</label>
              <input
                type="text"
                placeholder={
                  userDataVariablesAndManagable[data]
                    ? `New ${data}`
                    : userData[data]?.toString()
                }
              />
            </>
          );
        })}
        <button>Save</button>
      </form>
    </>
  );
}
