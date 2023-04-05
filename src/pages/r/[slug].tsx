import { useQuery } from "react-query";
import {
  fetchSubredditByName,
  fetchSubredditPosts,
} from "../../api/subredditApi";
import InfoCard from "@/components/InfoCard";
import PostCard from "@/components/PostCard";
import { LoadingPage } from "@/components/LoadingSpinner";
import { useState } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import BannerInfo from "@/components/BannerInfo";

export default function SubredditHome({ slug }: { slug: string }) {
  console.log(slug, "brainslug");
  const [refresh, setRefresh] = useState(1);

  const {
    data: subredditData,
    isLoading,
    error,
  } = useQuery("subredditInfo", () => fetchSubredditByName(slug), {
    cacheTime: 0,
  });

  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery("subredditPosts", () => fetchSubredditPosts(slug), {
    cacheTime: 0,
  });

  if (!slug) {
    return <div>Loading...</div>;
  }

  if (isLoading || postsLoading || !subredditData || !postsData) {
    return <LoadingPage />;
  }

  if (error || postsError) {
    return <div>error</div>;
  }

  return (
    <>
      <Header />
      <main className=" pt-16">
        <BannerInfo {...subredditData} singlePost={false} />
        <div className="flex justify-center space-x-6 max-w-[1280px] mx-auto">
          <div className="flex flex-col w-[600px] space-y-2">
            {postsData.length === 0 || !postsData ? (
              <div className="text-white text-lg pt-4">
                There are currently no posts.
              </div>
            ) : (
              postsData.map((post) => (
                <PostCard key={post.id} singlePost={false} {...post} />
              ))
            )}
          </div>
          <div className=" space-y-4">
            <InfoCard {...subredditData} />
            <InfoCard {...subredditData} />
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  return {
    props: {
      slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
