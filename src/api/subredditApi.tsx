import axios from "axios";
import Cookies from "universal-cookie/cjs/Cookies";
import { BASE_URL } from "./authApi";

export interface Subreddit {
  description: string;
  id: number;
  name: string;
  numberOfPosts: number;
}

export const cookies = new Cookies();

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

export const fetchSubredditByName = async (name: string) => {
  const res = await axios.get<Subreddit>(
    BASE_URL + `subreddit?subredditName=${name}`
  );
  console.log(res.data);
  return res.data;
};

export const fetchSubredditPosts = async (subredditId: number) => {
  const res = await axios.get<Post[]>(
    BASE_URL + `posts?subredditId${subredditId}`
  );
  console.log(res.data);
  return res.data.reverse();
};

export const fetchSinglePost = async (postId: string) => {
  const res = await axios.get<Post>(BASE_URL + `posts/${postId}`);
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

export const fetchCommentsByPost = async (postId: string) => {
  const res = await axios.get<Comment[]>(
    BASE_URL + `comments?postId=${postId}`
  );
  console.log(res.data, "comment");
  res.data.sort((a, b) => {
    return b.createdDate - a.createdDate;
  });
  return res.data;
};

export interface CommentDto {
  postId: number;
  text: string;
  userName: string;
}
interface CommentParams {
  commentDto: CommentDto;
  jwt: string;
  postId: number;
}
export const postCommentToPost = async ({
  commentDto,
  jwt,
  postId,
}: CommentParams) => {
  console.log(commentDto, jwt, postId);
  const res = await axios.post(
    BASE_URL + `comments?postId=${postId}`,
    commentDto,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  console.log(res.data, "commentPost");
  return res;
};

export interface PostDto {
  subredditName: string;
  url: string;
  description: string;
  postName: string;
}
export interface PostParams {
  postDto: PostDto;
  jwt: string;
}

export const postSubredditPost = async ({ postDto, jwt }: PostParams) => {
  const res = await axios.post(BASE_URL + "posts", postDto, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  console.log(res, "postPost");
  return res;
};
