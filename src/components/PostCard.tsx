import { Post, votePost } from "@/api/subredditApi";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { BiCommentDots, BiDownvote, BiUpvote } from "react-icons/bi";

export interface PostParamsType {
  post: Post;
  singlePost: boolean;
}

const PostCard = ({ post, singlePost }: PostParamsType) => {
  const {
    postName,
    description,
    userName,
    duration,
    id,
    voteCount,
    commentCount,
  } = post;
  const { slug } = router.query;
  const queryClient = useQueryClient();

  const { mutate, isLoading: mutateLoading } = useMutation(votePost, {
    onSuccess: (data) => {
      const message = "Success";
      toast(message, {
        style: {
          color: "green",
        },
      });
      singlePost
        ? queryClient.invalidateQueries("postInfo")
        : queryClient.invalidateQueries("subredditPosts");
    },
    onError: (e) => {
      console.log(e);
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
  });

  const onVote = (voteType: string) => {
    const data = {
      postId: id,
      voteType: voteType,
    };
    mutate(data);
  };

  return (
    <Link
      href={
        singlePost
          ? "#"
          : `/r/${encodeURIComponent(
              typeof slug === "string" && !undefined && slug
            )}/comments/${id}`
      }
      className={`flex w-full  border border-gray-400 ${
        singlePost
          ? "min-h-[200px] rounded-lg rounded-b-none border-none bg-white cursor-default"
          : "rounded-lg bg-slate-100"
      }`}
    >
      <div
        className={` rounded-l-md ${
          singlePost ? "rounded-b-none" : "bg-gray-200"
        }`}
      >
        <div className="max-w-[40px] flex flex-col items-center justify-center py-3 px-2 text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.preventDefault();
              onVote("UPVOTE");
            }}
            className="flex items-center justify-center"
          >
            <BiUpvote size={15} />
          </button>

          <div className={`${voteCount >= 0 ? "mr-[1px]" : "mr-1"}`}>
            {voteCount}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.preventDefault();
              onVote("DOWNVOTE");
            }}
            className="flex items-center justify-center"
          >
            <BiDownvote size={15} />
          </button>
        </div>
      </div>
      <div className="pt-3 px-2 flex flex-col justify-between">
        <div>
          <p>
            {userName} · {duration}
          </p>
          <h5 className="font-semibold text-lg">{postName}</h5>
          <p>{description}</p>
        </div>
        <div>
          <button className="flex items-center space-x-1 hover:bg-gray-300 p-1 text-sm">
            <BiCommentDots className="text-gray-600" size={17} />
            <span>{commentCount} Comments</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
