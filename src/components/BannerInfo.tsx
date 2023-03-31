import { Subreddit } from "@/api/subredditApi";
import Image from "next/image";
import Link from "next/link";

interface BannerInfoProps {
  singlePost: Boolean;
  name: string;
}

const BannerInfo = ({ name, singlePost }: BannerInfoProps) => {
  return (
    <div className="border border-black border-1 mb-4">
      <Link
        className={`${!singlePost && "cursor-default"} `}
        href={singlePost ? `/r/${name}` : "#"}
      >
        <div>
          <Image src="" alt="Subreddit Banner" />
        </div>
        <div>
          <div className="flex space-x-4">
            <Image src="" alt="Subreddit Icon" />
            <div>
              <div className="flex space-x-4">
                <h2>{name}</h2> <button>Subscribe</button>
              </div>
              <p>r/subreddit</p>
            </div>
          </div>
          <div>
            <a>Posts</a>
            <a>Rules</a>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BannerInfo;
