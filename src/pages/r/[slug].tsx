import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import Cookies from "universal-cookie";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { fetchSubredditByName } from "../api/subredditApi";

interface Dato {
  id: number;
  name: string;
  description: string;
  numberOfPosts: number;
}

const BannerInfo = ({ name, description }: Dato) => {
  return (
    <div>
      <div>
        <img src="" alt="Subreddit Banner" />
      </div>
      <div>
        <div className="flex space-x-4">
          <img src="" alt="Subreddit Icon" />
          <div>
            <div className="flex space-x-4">
              <h2>{name}</h2> <button>Subscribe</button>
            </div>
            <p>r/subreddit</p>
          </div>
        </div>
        <div>
          <a>Posts</a>
          <a>Rules</a>
        </div>
      </div>
    </div>
  );
};

interface PostType {
  id: number;
  postName: string;
  url: string;
  description: string;
  userName: string;
  subredditName: string;
  voteCount: null;
  commentCount: number;
  duration: string;
  upVote: boolean;
  downVote: boolean;
}
const PostCard = ({ postName, description }: PostType) => {
  return (
    <div className="flex w-full rounded-lg flex-1 bg-slate-100 border border-gray-400">
      <div className="bg-gray-500 rounded-l-md">
        <div className="max-w-[40px] flex flex-col items-center py-3 px-2 text-xs">
          <button>Up</button>
          <div>1</div>
          <button>Down</button>
        </div>
      </div>
      <div className="pt-3 px-2 flex flex-col justify-between">
        <div>
          <p>Posted By User TimeStamp</p>
          <h5 className="font-semibold text-lg">{postName}</h5>
          <p>{description}</p>
        </div>
        <div>
          <button className="flex hover:bg-gray-300 p-1 text-sm">
            <img src="" alt="Comment" />
            <span> Comments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = () => {
  return (
    <div className="border-1-white rounded max-w-[320px] border-white border bg-white">
      <div className="py-2 px-4 bg-yellow-700 text-white rounded-sm">
        <p>About Community</p>
      </div>
      <div className="py-2 px-4 space-y-3">
        <p>This is a subreddit devoted to the game League of Legends.</p>
        <div className="flex space-x-2">
          <img src="" alt="cake" /> <p>Created DATEOFCREATION</p>
        </div>
      </div>
      <hr />
      <div className="py-2 px-4 flex flex-col items-center">
        <div>50</div>
        <p>Members</p>
      </div>
      <hr />
      <div className="py-2 px-4 flex flex-col items-center">
        <button className="bg-yellow-600 text-white w-full rounded-2xl py-1">
          Create Post
        </button>
      </div>
    </div>
  );
};

export default function SubredditHome() {
  const dato = {
    id: 1,
    name: "league",
    description: "league desc",
    numberOfPosts: 0,
  };

  const posts = [
    {
      id: 4,
      postName: "first post pog u",
      url: "fdgdfg",
      description: "fdgdf",
      userName: "test3",
      subredditName: "league",
      voteCount: null,
      commentCount: 0,
      duration: "6 days ago",
      upVote: false,
      downVote: false,
    },
    {
      id: 5,
      postName: "first post pog u",
      url: "fdgdfg",
      description: "fdgdf",
      userName: "test3",
      subredditName: "league",
      voteCount: null,
      commentCount: 0,
      duration: "6 days ago",
      upVote: false,
      downVote: false,
    },
    {
      id: 6,
      postName: "first post pog u",
      url: "fdgdfg",
      description: "fdgdf",
      userName: "test3",
      subredditName: "league",
      voteCount: null,
      commentCount: 0,
      duration: "6 days ago",
      upVote: false,
      downVote: false,
    },
    {
      id: 7,
      postName: "first post pog u",
      url: "fdgdfg",
      description: "fdgdf",
      userName: "test3",
      subredditName: "league",
      voteCount: null,
      commentCount: 0,
      duration: "5 days ago",
      upVote: false,
      downVote: false,
    },
  ];
  const cookies = new Cookies();
  const router = useRouter();
  const { slug } = router.query;
  //   const { data, isLoading, error } = useQuery("subredditInfo", () => {
  //     if (slug && typeof slug === "string") {
  //       fetchSubredditByName(slug, cookies.get("jwt"));
  //     }
  //   });
  if (!slug) {
    return <div>Loading...</div>;
  }

  //   if (error) {
  //     return <div>error</div>;
  //   }

  return (
    <main className="max-w-[1280px] mx-auto">
      <BannerInfo {...dato} />
      <div className="flex justify-center space-x-6">
        <div className="flex flex-col w-[600px] space-y-2">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
        <div className=" space-y-4">
          <InfoCard />
          <InfoCard />
        </div>
      </div>
    </main>
  );
}
