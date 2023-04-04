import {
  FieldErrors,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { useRouter } from "next/router";
import PostCard from "@/components/PostCard";
import InfoCard from "@/components/InfoCard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingSpinner, { LoadingPage } from "@/components/LoadingSpinner";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  CommentDto,
  cookies,
  fetchCommentsByPost,
  fetchSinglePost,
  fetchSubredditByName,
  postCommentToPost,
} from "@/api/subredditApi";
import { parseJwt } from "@/api/authApi";
import { GetStaticProps } from "next";
import Header from "@/components/Header";
import BannerInfo from "@/components/BannerInfo";
import { toast } from "react-hot-toast";
import axios from "axios";

dayjs.extend(relativeTime);

interface CommentSectProps {
  register: UseFormRegister<CommentDto>;
  onCommentSubmit: (data: CommentDto) => void;
  handleSubmit: UseFormHandleSubmit<CommentDto>;
  commentMutateLoading: boolean;
  errors: FieldErrors<CommentDto>;
}
const CommentSect = ({
  register,
  onCommentSubmit,
  handleSubmit,
  commentMutateLoading,
  errors,
}: CommentSectProps) => {
  return (
    <div>
      <div className="py-2 ">
        <form
          onSubmit={handleSubmit(onCommentSubmit)}
          className="border-gray-100 border rounded-md"
        >
          <textarea
            {...register("text", { required: true })}
            className="w-full py-2 px-4"
            placeholder="What are your thoughts?"
            cols={15}
            rows={10}
          ></textarea>
          {errors.text?.type === "required" && (
            <p className="text-red-600" role="alert">
              Comment text is required
            </p>
          )}
          <div className="flex justify-end bg-slate-200 py-1 rounded-b">
            <button
              disabled={commentMutateLoading}
              className="mr-3 py-1 px-3 rounded-full text-sm text-white bg-gray-500"
            >
              {commentMutateLoading ? <LoadingSpinner size={12} /> : "Comment"}
            </button>
          </div>
        </form>
      </div>
      <div></div>
    </div>
  );
};

interface CommentPropsType {
  id: number;
  postId: number;
  createdDate: number;
  text: string;
  userName: string;
}

const Comment = (props: CommentPropsType) => {
  return (
    <div className="">
      <div className="flex space-x-1 mb-1">
        <span className="font-semibold">{props.userName} </span>
        <span className="text-gray-500">
          · {dayjs(props.createdDate * 1000).fromNow()}
        </span>
      </div>
      <div className="py-2 bg-blue-100 mb-5 p-2 rounded">
        <p>{props.text}</p>
      </div>
      <hr />
    </div>
  );
};

export default function SinglePost({ slug, id }: { slug: string; id: string }) {
  const queryClient = useQueryClient();

  const [user, setUser] = useContext(UserContext);
  const router = useRouter();
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery("postInfo", () => fetchSinglePost(id));
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery("postComments", () => fetchCommentsByPost(id), {
    cacheTime: 0,
  });

  const {
    data: subredditData,
    isLoading: subredditLoading,
    error: subredditError,
  } = useQuery("subredditInfo", () => fetchSubredditByName(slug), {
    cacheTime: 0,
  });

  const { mutate, isLoading: commentMutateLoading } = useMutation(
    postCommentToPost,
    {
      onSuccess: (data) => {
        reset();
        queryClient.invalidateQueries("postComments");
        const message = "success";
        toast(message, {
          style: {
            color: "green",
          },
        });
      },
      onError: (e) => {
        if (axios.isAxiosError(e)) {
          toast(e.response?.data?.error, {
            style: {
              color: "red",
            },
          });
        } else if (e instanceof Error) {
          toast(e.message);
        }
      },
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CommentDto>();

  const onCommentSubmit = async (data: CommentDto) => {
    try {
      if (!cookies.get("jwt")) {
        router.push("/login");
      }

      data.postId = Number(id);
      data.userName = parseJwt(cookies.get("jwt")).sub;
      const dto = {
        commentDto: data,
        jwt: cookies.get("jwt"),
        postId: Number(data.postId),
      };
      mutate(dto);
    } catch (e) {
      console.log(e);
    }
  };

  if (
    isLoading ||
    commentsLoading ||
    !comments ||
    !posts ||
    subredditLoading ||
    !subredditData
  ) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      <Header />

      <main className="max-w-[1280px] mx-auto py-16 pt-16">
        <BannerInfo {...subredditData} singlePost={true} />
        <div className="flex justify-center space-x-6 ">
          <div className="bg-white rounded-lg">
            <div className="flex flex-col w-[600px]  min-h-[200px] space-y-2">
              {posts?.map((post) => (
                <PostCard key={post.id} {...post} singlePost={true} />
              ))}
            </div>
            <div className="px-10 pt-5">
              <CommentSect
                commentMutateLoading={commentMutateLoading}
                onCommentSubmit={onCommentSubmit}
                handleSubmit={handleSubmit}
                register={register}
                errors={errors}
              />
              <div>
                <input type="text" placeholder="Search By User" />
              </div>
              <hr />
              {comments?.map((comment) => (
                <Comment {...comment} key={comment.id} />
              ))}
            </div>
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
  const id = context.params?.id;

  if (typeof slug !== "string" || typeof id !== "string")
    throw new Error("no slug");

  return {
    props: {
      slug,
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
