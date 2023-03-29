import { useForm, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { useRouter } from "next/router";
import PostCard from "@/components/PostCard";
import InfoCard from "@/components/InfoCard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "@/components/LoadingSpinner";
import { useMutation, useQuery } from "react-query";
import {
  CommentDto,
  cookies,
  fetchCommentsByPost,
  fetchSinglePost,
  fetchSubredditByName,
  postCommentToPost,
} from "@/api/subredditApi";
import { checkJwtValidation, parseJwt } from "@/api/authApi";
import Jwt from "jwt-decode";
import jwtDecode from "jwt-decode";

dayjs.extend(relativeTime);

const CommentSect = ({
  register,
  onCommentSubmit,
  handleSubmit,
}: {
  register: UseFormRegister<CommentDto>;
  onCommentSubmit: (data: CommentDto) => void;
  handleSubmit: UseFormHandleSubmit<CommentDto>;
}) => {
  return (
    <div>
      <div className="py-2 ">
        <form
          onSubmit={handleSubmit(onCommentSubmit)}
          className="border-gray-100 border rounded-md"
        >
          <textarea
            {...register("text")}
            className="w-full py-2 px-4"
            placeholder="What are your thoughts?"
            cols={15}
            rows={10}
          ></textarea>
          <div className="flex justify-end bg-slate-200 py-1 rounded-b">
            <button className="mr-3 py-1 px-3 rounded-full text-sm text-white bg-gray-500">
              Comment
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

export default function SinglePost() {
  const [user, setUser] = useContext(UserContext);

  const router = useRouter();
  const { slug, id } = router.query;
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery("postInfo", () => {
    if (id && typeof id === "string") {
      return fetchSinglePost(id);
    }
  });
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery("postComments", () => {
    if (id && typeof id === "string") {
      return fetchCommentsByPost(id);
    }
  });

  const {
    data: subredditData,
    isLoading: subredditLoading,
    error: subredditError,
  } = useQuery("subredditInfo", () => {
    if (slug && typeof slug === "string") {
      return fetchSubredditByName(slug);
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CommentDto>();

  const { mutate, isLoading: mutateLoading } = useMutation(postCommentToPost, {
    onSuccess: (data) => {
      const message = "success";
      alert(message);
    },
    onError: () => {
      alert("there was an error");
    },
  });

  const onCommentSubmit = (data: CommentDto) => {
    checkJwtValidation();
    data.postId = Number(id);
    data.userName = parseJwt(cookies.get("jwt")).sub;
    const dto = {
      commentDto: data,
      jwt: cookies.get("jwt"),
      postId: Number(data.postId),
    };
    mutate(dto);
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
      <main className="max-w-[1280px] mx-auto py-16">
        <div className="flex justify-center space-x-6 ">
          <div className="bg-white rounded-lg">
            <div className="flex flex-col w-[600px]  min-h-[200px] space-y-2">
              {posts?.map((post) => (
                <PostCard key={post.id} {...post} singlePost={true} />
              ))}
            </div>
            <div className="px-10 pt-5">
              <CommentSect
                onCommentSubmit={onCommentSubmit}
                handleSubmit={handleSubmit}
                register={register}
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
