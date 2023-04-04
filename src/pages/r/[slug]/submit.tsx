import Head from "next/head";
import Image from "next/image";
import {
  FieldErrors,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import {
  cookies,
  fetchSubredditByName,
  PostDto,
  postSubredditPost,
} from "@/api/subredditApi";
import InfoCard from "@/components/InfoCard";
import router, { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingSpinner, { LoadingPage } from "@/components/LoadingSpinner";
import jwtDecode from "jwt-decode";
import Header from "@/components/Header";
import { toast } from "react-hot-toast";

interface CreatePostProps {
  register: UseFormRegister<PostDto>;
  handleSubmit: UseFormHandleSubmit<PostDto>;
  onPostSubmit: (data: PostDto) => Promise<void>;
  postMutateLoading: boolean;
  errors: FieldErrors<PostDto>;
}

export const CreatePost = ({
  register,
  handleSubmit,
  onPostSubmit,
  postMutateLoading,
  errors,
}: CreatePostProps) => {
  return (
    <div className="max-w-[600px] flex-1 py-4 space-y-3 ">
      <div className="py-2 font-semibold text-xl text-white">Create a post</div>
      <hr />

      <div className="w-full bg-white rounded">
        <div className="flex ">
          <button className="flex space-x-2 px-6 py-4 border rounded-tl border-b border-r">
            <Image src="" alt="Post" /> <span>Post</span>
          </button>
          <button className="flex space-x-2 px-6 py-4 border border-l-0">
            <Image src="" alt="Image" /> <span>Image</span>
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onPostSubmit)}
          className="py-2 px-4 space-y-3"
          action=""
        >
          <div className="flex flex-col space-y-2">
            <input
              {...register("postName", { required: true })}
              className="px-5 py-2 border"
              type="text"
              placeholder="Title"
            />
            {errors.postName?.type === "required" && (
              <p className="text-red-600" role="alert">
                Title is required
              </p>
            )}
            <textarea
              {...register("description")}
              className="px-5 py-2 border min-h-[120px]"
              placeholder="Text (optional)"
            ></textarea>
          </div>
          <hr />
          <div className="flex justify-end">
            <button
              disabled={postMutateLoading}
              className="py-1 px-5 rounded-2xl bg-gray-500 text-white"
            >
              {postMutateLoading ? <LoadingSpinner size={12} /> : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CreatePostPage() {
  const [user, setUser] = useContext(UserContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(user);
  }, [user]);
  const router = useRouter();
  const { slug } = router.query;

  const { data, isLoading, error } = useQuery("subredditInfo", () => {
    if (typeof slug === "string" && !undefined) {
      return fetchSubredditByName(slug);
    }
  });

  const { mutate, isLoading: postMutateLoading } = useMutation(
    postSubredditPost,
    {
      onSuccess: (data) => {
        reset();
        queryClient.invalidateQueries("subredditInfo");
        toast("success");
        router.push(`/r/${slug}`);
      },
      onError: () => {
        toast("there was an error");
      },
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostDto>();

  if (isLoading || !data) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>error</div>;
  }

  const onPostSubmit = async (data: PostDto) => {
    try {
      if (!cookies.get("jwt")) {
        router.push("/login");
      }
      data.subredditName = `${slug}`;

      const postParams = {
        postDto: data,
        jwt: cookies.get("jwt"),
      };
      console.log({ postParams });
      mutate(postParams);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="max-w-[1280px] mx-auto flex justify-center space-x-6 py-10 pt-16">
        <CreatePost
          postMutateLoading={postMutateLoading}
          register={register}
          handleSubmit={handleSubmit}
          onPostSubmit={onPostSubmit}
          errors={errors}
        />
        <div className=" space-y-4">
          <InfoCard {...data} />
          <InfoCard {...data} />
        </div>
      </main>
    </>
  );
}
