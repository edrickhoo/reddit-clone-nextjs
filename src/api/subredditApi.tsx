import axios from "axios";
import { BASE_URL } from "./authApi";

export interface Subreddit {
  description: string;
  id: number;
  name: string;
  numberOfPosts: number;
}

export interface Post {
  commentCount: number;
  description: string;
  downVote: boolean;
  duration: string;
  id: number;
  postName: string;
  subredditName: string;
  upVote: boolean;
  url: string;
  userName: string;
  voteCount: number;
}

export const fetchSubredditByName = async (name: string, jwt: string) => {
  const res = await axios.get<Subreddit>(
    BASE_URL + `subreddit?subredditName=${name}`
    // {
    //   headers: {
    //     Authorization: `Bearer ${jwt}`,
    //   },
    //   withCredentials: true,
    // }
  );
  console.log(res.data);
  return res.data;
};

export const fetchSubredditPosts = async (subredditId: number, jwt: string) => {
  const res = await axios.get<Post[]>(
    BASE_URL + `posts?subredditId${subredditId}`
    // {
    //   headers: {
    //     Authorization: `Bearer ${jwt}`,
    //   },
    //   withCredentials: true,
    // }
  );
  console.log(res.data);
  return res.data;
};

export const fetchSinglePost = async (postId: string, jwt: string) => {
  const res = await axios.get<Post>(
    BASE_URL + `posts/${postId}`
    // {
    //   headers: {
    //     Authorization: `Bearer ${jwt}`,
    //   },
    //   withCredentials: true,
    // }
  );
  console.log(res.data);
  return [res.data];
};

interface Comment {
  id: number;
  postId: number;
  createdDate: number;
  text: string;
  userName: string;
}

export const fetchCommentsByPost = async (postId: string, jwt: string) => {
  const res = await axios.get<Comment[]>(
    BASE_URL + `comments?postId=${postId}`
    // {
    //   headers: {
    //     Authorization: `Bearer ${jwt}`,
    //   },
    //   withCredentials: true,
    // }
  );
  console.log(res.data);
  return res.data;
};
