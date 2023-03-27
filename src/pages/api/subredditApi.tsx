import axios from "axios";
import { BASE_URL } from "./authApi";

export const fetchSubredditByName = async (name: string, jwt: string) => {
  const res = await axios.get(BASE_URL + `subreddit/?subredditName=${name}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    withCredentials: true,
  });
  console.log(res);
  return res;
};

export const fetchPosts = async () => {
  const res = await axios.get(BASE_URL + "");
};
