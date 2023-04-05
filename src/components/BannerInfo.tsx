import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import defaultBg from "../assets/default-bg.jpg";
import defaultIcon from "../assets/default-icon.png";

interface BannerInfoProps {
  singlePost: Boolean;
  name: string;
  bgUrl: string;
  iconUrl: string;
}

const BannerInfo = ({ name, singlePost, bgUrl, iconUrl }: BannerInfoProps) => {
  const [error, setError] = useState({
    bg: false,
    icon: false,
  });
  return (
    <div className=" mb-4">
      <Link
        className={`${!singlePost && "cursor-default"} `}
        href={singlePost ? `/r/${name}` : "#"}
      >
        <div>
          <Image
            className="h-[200px] object-none md:object-cover"
            src={error.bg || bgUrl === null ? defaultBg : bgUrl}
            onError={() => setError({ ...error, bg: true })}
            width={1920}
            height={200}
            alt="Subreddit Banner"
          />
        </div>
        <div className="bg-white">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex space-x-4 relative">
              <Image
                className="rounded-full p-1 -translate-y-3 bg-white mr-1 object-contain"
                src={error.icon || iconUrl === null ? defaultIcon : iconUrl}
                width={70}
                height={70}
                onError={() => setError({ ...error, icon: true })}
                alt="Subreddit Icon"
              />
              <div className="mt-1 space-y-2">
                <div className="flex space-x-4 items-center">
                  <h2 className="text-xl font-semibold">{name}</h2>
                  <button className="rounded-full px-3 py-1 border text-sm">
                    Subscribe
                  </button>
                </div>
                <p className="text-gray-500 text-sm">r/{name}</p>
              </div>
            </div>
            <div>
              <a className="text-sm ml-4">Posts</a>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BannerInfo;
