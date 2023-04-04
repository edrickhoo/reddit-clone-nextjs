import { VoteDto, votePost } from "@/api/subredditApi";
import { AxiosResponse } from "axios";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { toast } from "react-hot-toast";
import { UseMutateFunction, useMutation, useQueryClient } from "react-query";
import LoadingSpinner from "./LoadingSpinner";

export interface PostParamsType {
  id: number;
  postName: string;
  url: string;
  description: string;
  userName: string;
  subredditName: string;
  voteCount: number;
  commentCount: number;
  duration: string;
  upVote: boolean;
  downVote: boolean;
  singlePost: boolean;
}

const PostCard = ({
  postName,
  description,
  singlePost,
  userName,
  duration,
  id,
  voteCount,
  commentCount,
}: PostParamsType) => {
  const { slug } = router.query;
  const queryClient = useQueryClient();

  const { mutate, isLoading: mutateLoading } = useMutation(votePost, {
    onSuccess: (data) => {
      const message = "success";
      toast(message);
      singlePost
        ? queryClient.invalidateQueries("postInfo")
        : queryClient.invalidateQueries("subredditPosts");
    },
    onError: (e) => {
      console.log(e);
      toast("there was an error");
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
          ? "rounded-lg rounded-b-none border-none bg-white cursor-default"
          : "rounded-lg bg-slate-100"
      }`}
    >
      <div
        className={` rounded-l-md ${
          singlePost ? "rounded-b-none" : "bg-gray-200"
        }`}
      >
        <div className="max-w-[40px] flex flex-col items-center py-3 px-2 text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.preventDefault();
              onVote("UPVOTE");
            }}
          >
            Up
          </button>

          <div>{voteCount}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.preventDefault();
              onVote("DOWNVOTE");
            }}
          >
            Down
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
          <button className="flex hover:bg-gray-300 p-1 text-sm">
            <Image src="" alt="Comment" />
            <span>{commentCount} Comments</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
