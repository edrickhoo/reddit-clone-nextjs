import Head from "next/head";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { loginApi, loginData } from "../api/authApi";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { cookies } from "@/api/subredditApi";

const Login = () => {
  const [user, setUser] = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginData>();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const onSubmit = async (data: loginData) => {
    try {
      const res = await loginApi(data);
      console.log(res);
      cookies.set("jwt", res.authenticationToken);
      cookies.set("jwt-refresh", res.refreshToken);
      cookies.set("jwt-expire", res.expiresAt);
      setUser({ ...user, user: res.username });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] relative">
      <div className="bg-white rounded-md p-8 space-y-4">
        <div>
          <span className="text-lg">Log In</span>
        </div>
        <form
          className="flex flex-col space-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            className="px-2 py-1 rounded-full bg-slate-100 focus:outline-1 outline-slate-500"
          />
          <input
            {...register("password")}
            type="text"
            placeholder="Password"
            className="px-2 py-1 rounded-full bg-slate-100 focus:outline-1 outline-slate-500"
          />

          <button className="rounded-full text-white bg-orange-600 hover:bg-orange-500 py-2">
            Log In
          </button>
        </form>

        <div>
          <span>
            New? <span>Sign Up</span>
          </span>
        </div>
      </div>
      <div className="absolute h-full w-full bg-black/30 z-[-1]"></div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Login />
      </main>
    </>
  );
}