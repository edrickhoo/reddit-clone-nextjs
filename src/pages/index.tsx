import Head from "next/head";
import { useForm } from "react-hook-form";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import {
  cookies,
  createSubreddit,
  fetchSubreddits,
  SubredditDto,
} from "@/api/subredditApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingSpinner, { LoadingPage } from "@/components/LoadingSpinner";
import Link from "next/link";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

interface CreateSubredditModalProps {
  closeModal: () => void;
}

const CreateSubredditModal = ({ closeModal }: CreateSubredditModalProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubredditDto>();
  const router = useRouter();
  const { mutate, isLoading: postMutateLoading } = useMutation(
    createSubreddit,
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries("allSubreddits");
        const message = "Success";
        toast(message, {
          style: {
            color: "green",
          },
        });
        closeModal();
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

  const onCreatePostSubmit = (subredditDto: SubredditDto) => {
    mutate(subredditDto);
  };

  return (
    <>
      <div
        onClick={closeModal}
        className="fixed top-0 left-0 h-screen w-screen bg-black/50 z-10"
      ></div>
      <div className="max-w-[600px] bg-white rounded p-4 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20">
        <h2 className="font-semibold pl-4 text-xl mb-3">Create Subreddit</h2>
        <form
          onSubmit={handleSubmit(onCreatePostSubmit)}
          className="py-2 px-4 space-y-4"
          action=""
        >
          <div className="flex flex-col space-y-3">
            <input
              {...register("name", { required: true })}
              className="px-5 py-2 border"
              type="text"
              placeholder="Subreddit Name"
            />
            {errors.name?.type === "required" && (
              <p className="text-red-600" role="alert">
                Subreddit name is required
              </p>
            )}
            <input
              {...register("description", { required: true })}
              className="px-5 py-2 border"
              type="text"
              placeholder="Subreddit Description"
            />
            {errors.description?.type === "required" && (
              <p className="text-red-600" role="alert">
                Description is required
              </p>
            )}
            <input
              {...register("bgUrl")}
              className="px-5 py-2 border"
              type="text"
              placeholder="Background URL"
            />
            <input
              {...register("iconUrl")}
              className="px-5 py-2 border"
              type="text"
              placeholder="Icon URL"
            />
          </div>
          <hr />
          <div className="flex justify-end">
            <button
              disabled={postMutateLoading}
              className="py-1 px-5 rounded-2xl bg-gray-500"
            >
              {postMutateLoading ? <LoadingSpinner size={12} /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default function Home() {
  const [user, setUser] = useContext(UserContext);
  const [createModal, setCreateModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    console.log(user);
  }, [user]);

  const {
    data: subredditData,
    isLoading: subredditsLoading,
    error: subredditsError,
  } = useQuery("allSubreddits", () => fetchSubreddits());

  const closeModal = () => {
    setCreateModal(false);
  };

  const handleCreateButton = () => {
    if (!cookies.get("jwt")) {
      router.push("/login");
    }
    setCreateModal(true);
  };

  if (subredditsLoading) {
    return <LoadingPage />;
  }

  if (subredditsError) {
    return <div>error</div>;
  }

  return (
    <>
      <Head>
        <title>Reclone</title>
        <meta name="description" content="Share ideas with communities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Header />
      {createModal && <CreateSubredditModal closeModal={closeModal} />}
      <main className=" pt-16">
        <div className="flex justify-center items-center max-w-[1280px] mx-auto px-4 md:px-2">
          <div className="flex-1"></div>
          <h2 className="text-center font-semibold text-2xl my-5 text-black ">
            Subreddits
          </h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleCreateButton}
              className="bg-yellow-600 font-semibold hidden md:block hover:bg-yellow-500 text-white px-4 rounded-2xl py-1 text-center"
            >
              Create Subreddit
            </button>
            <button
              onClick={handleCreateButton}
              className="bg-yellow-600 font-semibold block md:hidden hover:bg-yellow-500 text-white px-4 rounded-2xl py-1 text-center"
            >
              Create
            </button>
          </div>
        </div>
        <hr className="mb-7" />
        <div className="flex justify-center space-x-6 max-w-[1280px] mx-auto">
          <div className=" w-[600px] px-4 md:px-2">
            {!subredditData || subredditData.length === 0 ? (
              <div className="text-white text-lg pt-4">
                There are currently no subreddits
              </div>
            ) : (
              subredditData.map((sub, idx) => {
                return (
                  <div
                    className={`w-full bg-slate-100 border-2 border-slate-400 min-h-[40px] ${
                      idx !== 0 && "border-t-0"
                    } ${idx === 0 && "rounded-t-md"} `}
                    key={sub.id}
                  >
                    <Link
                      className="px-4 py-2 w-full h-full flex justify-between items-center"
                      href={`/r/${sub.name}`}
                    >
                      <div className="flex space-x-1 items-center">
                        <div>
                          <Image
                            className="rounded-full p-[1px] bg-white mr-1 object-contain"
                            src={
                              sub.iconUrl === null
                                ? "/default-icon.png"
                                : sub.iconUrl
                            }
                            width={40}
                            height={40}
                            alt="Subreddit Icon"
                          />
                        </div>
                        <div>
                          <span className="hover:underline font-semibold">
                            r/{sub.name}
                          </span>
                          <p>{sub.description}</p>
                        </div>
                      </div>
                      <div>
                        <button className="rounded-full px-4 py-1 border-2 border-slate-500 bg-slate-300 hover:bg-slate-200">
                          Visit
                        </button>
                      </div>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </>
  );
}
