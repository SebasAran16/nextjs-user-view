import { createGlobalState } from "react-hooks-global-state";
import { IUser } from "@/types/user.interface";
import { Schema } from "mongoose";

interface GlobalState {
  userData: IUser | null;
}

const { useGlobalState } = createGlobalState<GlobalState>({
  userData: null,
});

export { createGlobalState, useGlobalState };
