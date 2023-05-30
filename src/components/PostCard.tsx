import { Post, cookies, deletePostById, cookies, deletePostById, votePost } from "@/api/subredditApi";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { BiCommentDots, BiDownvote, BiUpvote } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { getUsername } from "@/api/authApi";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { AiFillDelete } from "react-icons/ai";
import { getUsername } from "@/api/authApi";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

export interface PostParamsType {
  post: Post;
  postType: "subreddit" | "single" | "profile";
}

const PostCard = ({ post, postType }: PostParamsType) => {
  const {
    postName,
    description,
    userName,
    duration,
    id,
    voteCount,
    commentCount,
    subredditName,
  } = post;
  const queryClient = useQueryClient();

  const [deleteModal, setDeleteModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const { mutate, isLoading: mutateLoading } = useMutation(votePost, {
    onSuccess: (data) => {
      const message = "Success";
      toast(message, {
        style: {
          color: "green",
        },
      });
      switch (postType) {
        case "single":
          queryClient.invalidateQueries("postInfo");
          break;
        case "subreddit":
          queryClient.invalidateQueries("subredditPosts");
          break;
        case "profile":
          queryClient.invalidateQueries("userPosts");
      }
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
  });

  const { mutate: mutateDeletePost, isLoading: deletePostLoading } =
    useMutation(deletePostById, {
      onSuccess: (data) => {
        const message = "Success";
        toast(message, {
          style: {
            color: "green",
          },
        });
<<<<<<< HEAD
        singlePost
          ? queryClient.invalidateQueries("postInfo")
          : queryClient.invalidateQueries("subredditPosts");
=======
        switch (postType) {
          case "single":
            queryClient.invalidateQueries("postInfo");
            break;
          case "subreddit":
            queryClient.invalidateQueries("subredditPosts");
            break;
          case "profile":
            queryClient.invalidateQueries("userPosts");
        }
>>>>>>> be03c4330492ceef8d2a82c14379d2cf7347d259
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
    });

  const { mutate: mutateDeletePost, isLoading: deletePostLoading } =
    useMutation(deletePostById, {
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

  const toggleDeleteModal = () => {
    setDeleteModal((prev) => !prev);
  };

  const deletePost = () => {
    if (!cookies.get("jwt")) router.push("/login");
    mutateDeletePost({
      postId: id.toString(),
      jwt: cookies.get("jwt"),
    });
  };

  const toggleDeleteModal = () => {
    setDeleteModal((prev) => !prev);
  };

  const deletePost = () => {
    if (!cookies.get("jwt")) router.push("/login");
    mutateDeletePost({
      postId: id.toString(),
      jwt: cookies.get("jwt"),
    });
  };

  return (
    <>
      <Link
        href={
<<<<<<< HEAD
          singlePost
            ? "#"
            : `/r/${encodeURIComponent(
                typeof slug === "string" && !undefined && slug
              )}/comments/${id}`
        }
        className={`flex w-full  border border-gray-400 ${
          singlePost
=======
          postType === "single"
            ? "#"
            : `/r/${encodeURIComponent(subredditName)}/comments/${id}`
        }
        className={`flex w-full  border border-gray-400 ${
          postType === "single"
>>>>>>> be03c4330492ceef8d2a82c14379d2cf7347d259
            ? "min-h-[200px] rounded-lg rounded-b-none border-none bg-white cursor-default"
            : "rounded-lg bg-slate-100"
        }`}
      >
        <div
          className={` rounded-l-md ${
<<<<<<< HEAD
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
=======
            postType === "single" ? "rounded-b-none" : "bg-gray-200"
          }`}
        >
          <div
            className={` rounded-l-md ${
              postType === "single" ? "rounded-b-none" : "bg-gray-200"
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
        </div>

        <div className="pt-3 px-2 flex flex-col justify-between">
          <div>
            <p>
              <Link
                className="hover:text-blue-400 hover:underline"
                href={`/u/${userName}`}
              >
                {userName}{" "}
              </Link>
              · {duration}{" "}
              {postType === "profile" && (
                <Link
                  className="hover:text-blue-400 hover:underline"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </Link>
              )}
>>>>>>> be03c4330492ceef8d2a82c14379d2cf7347d259
            </p>
            <h5 className="font-semibold text-lg">{postName}</h5>
            <p>{description}</p>
          </div>
          <div className={"flex items-center"}>
            <button className="flex items-center space-x-1 hover:bg-gray-300 p-1 text-sm">
              <BiCommentDots className="text-gray-600" size={17} />
              <span>{commentCount} Comments</span>
            </button>
            {userName === getUsername() && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.preventDefault();
                  toggleDeleteModal();
                }}
                className="flex items-center space-x-1 hover:bg-gray-300 p-1 text-sm"
              >
                <AiFillDelete className="text-gray-600" size={17} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </Link>
      {deleteModal && (
        <DeleteModal
          toggleDeleteModal={toggleDeleteModal}
          deletePost={deletePost}
        />
      )}
    </>
      </Link>
      {deleteModal && (
        <DeleteModal
          toggleDeleteModal={toggleDeleteModal}
          deletePost={deletePost}
        />
      )}
    </>
  );
};

export default PostCard;
