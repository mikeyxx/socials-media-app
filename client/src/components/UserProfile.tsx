import { MdPersonAddAlt, MdOutlineLocationOn } from "react-icons/md";
import { IoBriefcaseOutline } from "react-icons/io5";
import Twitter from "../assets/twitter.png";
import LinkedIn from "../assets/linkedin.png";
import { useAppSelector, useAppDispatch } from "../app/store";
import { setUserProfile } from "../feature/state";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  userId: string | undefined;
}

const UserProfile = ({ userId }: Props) => {
  const { token, userProfileData } = useAppSelector((state) => state.users);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const dispatch = useAppDispatch();

  const checkNumOfFriends = () => {
    let numOfFriends;
    if (userProfileData?.friends) {
      numOfFriends = userProfileData?.friends.length > 1 ? "Friends" : "Friend";
    }

    return numOfFriends;
  };

  const getUserProfile = async () => {
    try {
      const { data } = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUserProfile(data));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [userId]);

  useEffect(() => {
    const handleScreenSize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleScreenSize);
    return () => {
      window.removeEventListener("resize", handleScreenSize);
    };
  }, [screenSize]);

  return (
    <>
      <main
        className={`comps flex flex-col ${
          screenSize > 920 && "max-w-[390px]"
        } w-full p-4 rounded-xl max-h-fit h-full`}
      >
        <section className="flex w-full items-center justify-between">
          <div className="flex sm-gap">
            <img
              src={userProfileData?.picturePath}
              alt=""
              className="w-[50px] h-[50px] object-cover rounded-[50%] "
            />

            <div className="flex flex-col">
              <span className="font-bold">
                {userProfileData?.firstName} {userProfileData?.lastName}
              </span>
              <small>
                {userProfileData?.friends.length} {checkNumOfFriends()}
              </small>
            </div>
          </div>
          <MdPersonAddAlt className="hover:bg-slate-100 rounded-xl cursor-pointer w-6 h-6 p-1" />
        </section>
        <hr className="inline-block w-full my-5" />

        <section className="flex items-center sm-gap">
          <MdOutlineLocationOn />
          <span>📍 {userProfileData?.location}</span>
        </section>
        <section className="flex items-center sm-gap">
          <IoBriefcaseOutline />
          <span>{userProfileData?.bio}</span>
        </section>
        <hr className="inline-block w-full my-5" />
        <section className="flex items-center justify-between">
          <small>Who's viewed your profile</small>
          <small>{userProfileData?.viewedProfile}</small>
        </section>
        <section className="flex items-center justify-between">
          <small>Impressions on your posts</small>
          <small>{userProfileData?.impressions}</small>
        </section>
        <hr className="inline-block w-full my-5" />
        <section>
          <h3 className="font-bold mb-3">Social Profiles</h3>
          <div className="flex items-center sm-gap">
            <img src={Twitter} alt="" />
            <div className="flex flex-col">
              <span className="font-bold">Twitter</span>
              <small>Social Network</small>
            </div>
          </div>
          <div className="flex items-center sm-gap mt-3">
            <img src={LinkedIn} alt="" />
            <div className="flex flex-col">
              <span className="font-bold">LinkedIn</span>
              <small>Networking Platform</small>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default UserProfile;
