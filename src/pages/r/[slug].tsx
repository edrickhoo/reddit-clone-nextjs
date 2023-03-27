import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import Cookies from "universal-cookie";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { fetchSubredditByName } from "../api/subredditApi";
import InfoCard from "@/components/InfoCard";
import PostCard from "@/components/PostCard";

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
