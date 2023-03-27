const InfoCard = () => {
  return (
    <div className="border-1-white rounded max-w-[320px] border-white border bg-white">
      <div className="py-2 px-4 bg-yellow-700 text-white rounded-sm">
        <p>About Community</p>
      </div>
      <div className="py-2 px-4 space-y-3">
        <p>This is a subreddit devoted to the game League of Legends.</p>
        <div className="flex space-x-2">
          <img src="" alt="cake" /> <p>Created DATEOFCREATION</p>
        </div>
      </div>
      <hr />
      <div className="py-2 px-4 flex flex-col items-center">
        <div>50</div>
        <p>Members</p>
      </div>
      <hr />
      <div className="py-2 px-4 flex flex-col items-center">
        <button className="bg-yellow-600 text-white w-full rounded-2xl py-1">
          Create Post
        </button>
      </div>
    </div>
  );
};

export default InfoCard;
