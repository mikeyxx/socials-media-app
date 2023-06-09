import { BiComment } from "react-icons/bi";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { MdOutlineShare } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../app/store";
import { useNavigate } from "react-router-dom";
import { Post, setSinglePost } from "../feature/state";
import axios from "axios";
import { setFriends, setUpdatedPost } from "../feature/state";

interface Props {
  post: Post;
}

const Posts = ({ post }: Props) => {
  const { token, userProfileData } = useAppSelector((state) => state.users);
  const _id = useAppSelector((state) => state.users.userProfileData?._id);

  const isFriend = userProfileData?.friends.find(
    (friend) => friend._id === post.userId
  );

  const checkIsLiked = () => {
    let isLiked = false;
    if (post.likes) {
      isLiked = Boolean(post.likes[String(_id)]);
    }
    return isLiked;
  };

  const checkLikeCount = () => {
    let likeCount;
    if (post.likes) {
      likeCount = Object.keys(post.likes).length;
    }
    return likeCount;
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const val = "true";

  const handleSelectedFriend = (userId: string, item: Post) => {
    dispatch(setSinglePost(item));
    navigate(`/${userId}/post`);
  };

  const addOrRemoveNewFriends = async (friendId: string) => {
    try {
      const { data } = await axios.patch(`/users/${_id}/${friendId}`, val, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setFriends({ friends: data }));
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const setLikes = async () => {
    try {
      const { data } = await axios.patch(
        `/posts/${post._id}/like`,
        {
          body: JSON.stringify({ userId: userProfileData?._id }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUpdatedPost({ post: data }));
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <main className="comps mt-4 flex flex-col w-full rounded-xl p-4">
      <section className="flex w-full items-center justify-between">
        <div className="flex sm-gap">
          <img
            src={post.userPicturePath}
            alt=""
            className="w-[50px] h-[50px] object-cover rounded-[50%] "
          />

          <div className="flex flex-col">
            <span
              onClick={() => handleSelectedFriend(post.userId, post)}
              className="font-bold cursor-pointer hover:text-gray-500"
            >
              {post.firstName} {post.lastName}
            </span>

            <small>{post?.location}</small>
          </div>
        </div>
        <small
          onClick={() => addOrRemoveNewFriends(post.userId)}
          className="text-primary cursor-pointer hover:bg-slate-100 px-3 rounded-xl"
        >
          {userProfileData?._id != post.userId
            ? isFriend
              ? "Following"
              : "Follow"
            : ""}
        </small>
      </section>
      <p className="my-4">{post.description}</p>
      <img src={post.picturePath} alt="" className="rounded-xl" />
      <section className="flex items-center justify-between w-full">
        <div className="flex items-center lg-gap mt-2">
          <div className="flex items-center sm-gap">
            <div onClick={setLikes}>
              {checkIsLiked() ? (
                <IoMdHeart className="cursor-pointer text-green-400" />
              ) : (
                <IoMdHeartEmpty className="cursor-pointer" />
              )}
            </div>
            <span>{checkLikeCount()}</span>
          </div>
          <div className="flex items-center sm-gap">
            <BiComment className="cursor-pointer" />
            <span>0</span>
          </div>
        </div>
        <MdOutlineShare className="cursor-pointer" />
      </section>
    </main>
  );
};

export default Posts;
