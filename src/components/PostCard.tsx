export interface PostType {
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

const PostCard = ({ postName, description, singlePost }: PostType) => {
  return (
    <div
      className={`flex w-full   flex-1  border border-gray-400 ${
        singlePost
          ? "rounded-lg rounded-b-none border-none bg-white"
          : "rounded-lg bg-slate-100"
      }`}
    >
      <div
        className={` rounded-l-md ${
          singlePost ? "rounded-b-none" : "bg-gray-500"
        }`}
      >
        <div className="max-w-[40px] flex flex-col items-center py-3 px-2 text-xs">
          <button>Up</button>
          <div>1</div>
          <button>Down</button>
        </div>
      </div>
      <div className="pt-3 px-2 flex flex-col justify-between">
        <div>
          <p>Posted By User TimeStamp</p>
          <h5 className="font-semibold text-lg">{postName}</h5>
          <p>{description}</p>
        </div>
        <div>
          <button className="flex hover:bg-gray-300 p-1 text-sm">
            <img src="" alt="Comment" />
            <span> Comments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
