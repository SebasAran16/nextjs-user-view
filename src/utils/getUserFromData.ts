import axios from "axios";

export default async function getUserFromData(identifier: string) {
  try {
    const userResponse = await axios.post("/api/user/get-user", {
      identifier,
    });

    if (userResponse.status !== 200) throw new Error(userResponse.data.message);

    return userResponse.data.user;
  } catch (err) {
    console.log(err);
    return "Could not get user data";
  }
}
