import Head from "next/head";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { loginApi, LoginData } from "../api/authApi";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { cookies } from "@/api/subredditApi";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Link from "next/link";
import { useMutation } from "react-query";

const Login = () => {
  const [user, setUser] = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();
  const router = useRouter();

  const cookieExpire = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);

  const { mutate, isLoading, data } = useMutation(loginApi, {
    onSuccess: (newData) => {
      console.log(newData);
      cookies.set("jwt", newData.authenticationToken, {
        expires: cookieExpire,
      });
      cookies.set("jwt-refresh", newData.refreshToken, {
        expires: cookieExpire,
      });
      cookies.set("jwt-expire", newData.expiresAt, {
        expires: cookieExpire,
      });
      setUser({ ...user, user: newData.username });
      router.push("/");
    },
  });

  useEffect(() => {
    console.log(user);
  }, [user]);

  const onSubmit = async (loginDto: LoginData) => {
    try {
      mutate(loginDto);
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
            {...register("username", { required: true })}
            type="text"
            placeholder="Username"
            className="px-2 py-1 rounded-full bg-slate-100 focus:outline-1 outline-slate-500"
          />
          {errors.username?.type === "required" && (
            <p className="text-red-600" role="alert">
              Username is required
            </p>
          )}
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="px-2 py-1 rounded-full bg-slate-100 focus:outline-1 outline-slate-500"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-600" role="alert">
              Password is required
            </p>
          )}

          <button className="rounded-full text-white bg-orange-600 hover:bg-orange-500 py-2">
            Log In
          </button>
        </form>

        <div>
          <span>
            New?{" "}
            <Link
              className="text-blue-500 hover:text-blue-600"
              href={"/register"}
            >
              Sign Up
            </Link>
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
      <Header />
      <main>
        <Login />
      </main>
    </>
  );
}
