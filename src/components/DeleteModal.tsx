interface DeleteModalProps {
  toggleDeleteModal: () => void;
  deletePost: () => void;
}

const DeleteModal = ({ toggleDeleteModal, deletePost }: DeleteModalProps) => {
  return (
    <>
      <div
        onClick={toggleDeleteModal}
        className="fixed top-[-8px] left-0 z-30 h-[100vh] w-[100vw] bg-black/25"
      ></div>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-6 rounded bg-white z-50 space-y-6">
        <p>Please confirm you want to delete this.</p>
        <div className="flex justify-end items-center space-x-4">
          <button
            onClick={deletePost}
            className="w-[60px] rounded text-white bg-orange-600 hover:bg-orange-500 py-1"
          >
            Ok
          </button>
          <button
            onClick={toggleDeleteModal}
            className="rounded text-white bg-orange-600 hover:bg-orange-500 py-1 w-[60px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
