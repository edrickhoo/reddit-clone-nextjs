import { parseJwt } from "@/api/authApi";
import { cookies } from "@/api/subredditApi";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    cookies.remove("jwt");
    cookies.remove("jwt-refresh");
    cookies.remove("jwt-expire");
  };

  return (
    <header className="flex justify-between px-8 py-5 bg-white fixed w-full z-30">
      <Link href="/">
        <img src="" alt="Reddit Icon" />
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
