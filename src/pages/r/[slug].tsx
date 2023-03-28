import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import Cookies from "universal-cookie";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import {
  fetchSubredditByName,
  fetchSubredditPosts,
  Subreddit,
} from "../../api/subredditApi";
import InfoCard from "@/components/InfoCard";
import PostCard, { PostType } from "@/components/PostCard";
import { LoadingPage } from "@/components/LoadingSpinner";

const BannerInfo = ({ name }: Subreddit) => {
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
  const cookies = new Cookies();
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: subredditData,
    isLoading,
    error,
  } = useQuery("subredditInfo", () => {
    if (slug && typeof slug === "string") {
      return fetchSubredditByName(slug, cookies.get("jwt"));
    }
  });

  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery("subredditPosts", () => {
    if (subredditData) {
      return fetchSubredditPosts(subredditData.id, "3425");
    }
  });

  if (!slug) {
    return <div>Loading...</div>;
  }

  if (isLoading || !subredditData || !slug || postsLoading) {
    return <LoadingPage />;
  }

  if (error || postsError) {
    return <div>error</div>;
  }

  return (
    <main className="max-w-[1280px] mx-auto">
      <BannerInfo {...subredditData} />
      <div className="flex justify-center space-x-6">
        <div className="flex flex-col w-[600px] space-y-2">
          {postsData?.map((post) => (
            <PostCard key={post.id} singlePost={false} {...post} />
          ))}
        </div>
        <div className=" space-y-4">
          <InfoCard {...subredditData} />
          <InfoCard {...subredditData} />
        </div>
      </div>
    </main>
  );
}
