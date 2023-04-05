import axios from "axios";
import Cookies from "universal-cookie/cjs/Cookies";
import { BASE_URL, checkJwtValidation } from "./authApi";

export interface Subreddit {
  description: string;
  id: number;
  name: string;
  numberOfPosts: number;
  createdDate: number;
  bgUrl: string;
  iconUrl: string;
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

export const fetchSubreddits = async () => {
  const res = await axios.get<Subreddit[]>(BASE_URL + `subreddit`);
  console.log(res.data);
  return res.data;
};

export const fetchSubredditPosts = async (subredditName: string) => {
  console.log(subredditName, "subredditNameididid");
  const res = await axios.get<Post[]>(
    BASE_URL + `posts?subredditName=${subredditName}`
  );
  console.log(res.data);
  return res.data.reverse();
};

export const fetchSinglePost = async (postId: string) => {
  const res = await axios.get<Post>(BASE_URL + `posts/${postId}`);
  console.log(res.data);
  return [res.data];
};

export interface Comment {
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
  await checkJwtValidation();
  const res = await axios.post(BASE_URL + "posts", postDto, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  console.log(res, "postPost");
  return res;
};

export interface VoteDto {
  postId: number;
  voteType: string;
}

export const votePost = async (voteDto: VoteDto) => {
  await checkJwtValidation();
  const jwt = cookies.get("jwt");
  console.log(voteDto, jwt, "pizza");
  const res = await axios.post(BASE_URL + "votes", voteDto, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  console.log(res, "votePost");
  return res;
};

export interface SubredditDto {
  name: string;
  description: string;
  bgUrl: string;
  iconUrl: string;
}

export const createSubreddit = async (subredditDto: SubredditDto) => {
  await checkJwtValidation();

  const res = axios.post(BASE_URL + "subreddit", subredditDto, {
    headers: {
      Authorization: `Bearer ${cookies.get("jwt")}`,
    },
  });

  console.log(res, "subreddit post");
  return res;
};

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export const registerUser = async (registerDto: RegisterDto) => {
  console.log(registerDto);
  const res = await axios.post(BASE_URL + "auth/signup", registerDto);

  console.log(res, "register res");

  return res;
};
