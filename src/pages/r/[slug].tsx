import { useRouter } from "next/router";
import { useQuery } from "react-query";
import {
  fetchSubredditByName,
  fetchSubredditPosts,
  Subreddit,
} from "../../api/subredditApi";
import InfoCard from "@/components/InfoCard";
import PostCard from "@/components/PostCard";
import { LoadingPage } from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";

const BannerInfo = ({ name }: Subreddit) => {
  return (
    <div>
      <div>
        <Image src="" alt="Subreddit Banner" />
      </div>
      <div>
        <div className="flex space-x-4">
          <Image src="" alt="Subreddit Icon" />
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

export default function SubredditHome({ slug }: { slug: string }) {
  // const cookies = new Cookies();
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
