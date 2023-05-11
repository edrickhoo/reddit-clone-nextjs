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
import Head from "next/head";

export default function SubredditHome({ slug }: { slug: string }) {
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
      <Head>
        <title>{slug}</title>
        <meta name="description" content={`Subreddit for ${slug}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Header />
      <main className=" pt-16">
        <BannerInfo subredditData={subredditData} singlePost={false} />
        <div className="flex justify-center space-x-6 max-w-[1280px] px-4 md:px-2 mx-auto">
          <div className="flex flex-col w-full md:w-[600px] space-y-2">
            {postsData.length === 0 || !postsData ? (
              <div className="text-white text-lg pt-4">
                There are currently no posts.
              </div>
            ) : (
              postsData.map((post) => (
                <PostCard key={post.id} singlePost={false} post={post} />
              ))
            )}
          </div>
          <div className=" space-y-4 hidden md:block">
            <InfoCard subredditData={subredditData} />
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
