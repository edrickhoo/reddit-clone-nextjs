import { parseJwt } from "@/api/authApi";
import { cookies } from "@/api/subredditApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import logo from "../assets/logo.png";

const Header = () => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (cookies.get("jwt")) {
      const jwt = parseJwt(cookies.get("jwt"));
      setUsername(jwt.sub);
    }
  }, []);

  const logout = () => {
    setUsername("");
    cookies.remove("jwt", { path: "/" });
    cookies.remove("jwt-refresh", { path: "/" });
    cookies.remove("jwt-expire", { path: "/" });
    toast("Successfully logged out", {
      duration: 1000,
    });
  };

  return (
    <header className="flex justify-between items-center px-8 py-2 bg-white fixed w-full z-30">
      <Link className="flex items-center space-x-2" href="/">
        <Image
          className="h-12 w-12 rounded-full"
          src={logo}
          alt="Reddit Icon"
        />
        <span>
          recl<span className="text-red-700 font-semibold">o</span>ne
        </span>
      </Link>
      <div className=" text-gray-500 px-2">
        <span className="border-r border-gray-600 pr-2 mr-2 text-blue-800">
          {username || (
            <Link
              className=" text-gray-500 hover:text-red-600"
              href="/register"
            >
              Register
            </Link>
          )}
        </span>
        {!username ? (
          <Link className="hover:text-red-600" href={"/login"}>
            Login
          </Link>
        ) : (
          <button className="hover:text-red-600" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
