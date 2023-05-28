import { useQuery } from "react-query";
import { fetchUserPosts } from "../../api/subredditApi";
import PostCard from "@/components/PostCard";
import { LoadingPage } from "@/components/LoadingSpinner";
import { GetStaticProps } from "next";
import Header from "@/components/Header";
import Head from "next/head";

export default function ProfilePage({ slug }: { slug: string }) {
  const {
    data: userPosts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery("userPosts", () => fetchUserPosts(slug), {
    cacheTime: 0,
    onSuccess(data) {
      console.log(data);
    },
  });

  if (!slug) {
    return <div>Loading...</div>;
  }

  if (postsLoading || !userPosts) {
    return <LoadingPage />;
  }

  if (postsError) {
    return <div>error</div>;
  }

  return (
    <>
      <Head>
        <title className="capitalize">
          {slug} (u/{slug}) - Reclone
        </title>
        <meta name="description" content={`Profile for ${slug}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Header />
      <main className=" pt-16">
        <div className="mb-5 border bg-white ">
          <div className="max-w-[900px] mx-auto uppercase flex">
            <div className="shadow-[inset_0_-2px_0_0] py-2 ">Posts</div>
          </div>
        </div>
        <div className="flex justify-center space-x-6 max-w-[1280px] px-4 md:px-2 mx-auto ">
          <div className="flex flex-col w-full md:w-[600px] space-y-2">
            {userPosts.length === 0 || !userPosts ? (
              <div className="text-white text-lg pt-4">
                There are currently no posts.
              </div>
            ) : (
              userPosts.map((post) => (
                <PostCard key={post.id} postType={"profile"} post={post} />
              ))
            )}
          </div>
          <div className=" space-y-4 hidden md:block"></div>
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
