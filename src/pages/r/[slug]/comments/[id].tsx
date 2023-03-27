import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

import { useForm } from "react-hook-form";
import jwt from "jwt-decode";
import Cookies from "universal-cookie";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import PostCard from "@/components/PostCard";
import InfoCard from "@/components/InfoCard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "@/components/LoadingSpinner";

dayjs.extend(relativeTime);

const CommentSect = () => {
  return (
    <div>
      <div className="py-2 ">
        <form className="border-gray-100 border rounded-md">
          <textarea
            className="w-full py-2 px-4"
            placeholder="What are your thoughts?"
            name=""
            id=""
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

export default function Home() {
  const router = useRouter();
  const { slug, id } = router.query;
  const posts = [
    {
      id: 7,
      postName: "first post pog u",
      url: "fdgdfg",
      description: "fdgdf",
      userName: "test3",
      subredditName: "league",
      voteCount: null,
      commentCount: 0,
      duration: "5 days ago",
      upVote: false,
      downVote: false,
    },
  ];

  const comments = [
    {
      id: 1,
      postId: 1,
      createdDate: 1679397736.795451,
      text: "This is a comment",
      userName: "test3",
    },
    {
      id: 2,
      postId: 1,
      createdDate: 1679397736.795451,
      text: "This is another comment",
      userName: "test3",
    },
    {
      id: 5,
      postId: 2,
      createdDate: 1679920319.865503,
      text: "test",
      userName: "test3",
    },
  ];

  return (
    <>
      <main className="max-w-[1280px] mx-auto">
        <div className="flex justify-center space-x-6 ">
          <div className="bg-white rounded-lg">
            <div className="flex flex-col w-[600px]  min-h-[200px] space-y-2">
              {posts.map((post) => (
                <PostCard key={post.id} {...post} singlePost={true} />
              ))}
            </div>
            <div className="px-10 pt-5">
              <CommentSect />
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
            <InfoCard />
            <InfoCard />
          </div>
        </div>
      </main>
    </>
  );
}
