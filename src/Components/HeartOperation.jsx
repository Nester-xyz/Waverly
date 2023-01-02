import React, { useContext } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import Deso from "deso-protocol";
import { MagnifyingGlass } from "react-loader-spinner";
import { FaUserAltSlash } from "react-icons/fa";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { useState } from "react";

const HeartOperation = () => {
  const [numberOfPost, setNumberOfPost] = useState(10);
  const [username, setUsername] = useState("");
  // eslint-disable-next-line
  const [pub_key, setPub_key] = useState("");
  const [loading, setLoading] = useState(false);
  const [postHexes, setPostHexes] = useState([]);
  const [heartPosts, setHeartPosts] = useState("0");
  const [isUsername, setIsUsername] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const { Dark, setSettingActive } = useContext(WaverlyContext);

  let public_key;

  async function getProfile() {
    const deso = new Deso();
    if (username.length !== 0) {
      const userName = username;
      const request = {
        Username: userName,
      };
      try {
        const response = await deso.user.getSingleProfile(request);
        public_key = await response.Profile.PublicKeyBase58Check;
        setPub_key(public_key);
        console.log(public_key);
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        await delay(2000);
        setIsUsername(true);
      } catch (error) {
        setIsUsername(false);
        setLoading(false);
        setIsValid(false);
        console.log(error);
      }
    }
  }

  async function fetchPosts() {
    // fetch posthash hex of numberofpost to an array
    const deso = new Deso();
    const no_of_posts = Number(numberOfPost);
    const reader_pub_key = localStorage.getItem("user_key");
    const reading_pub_key = public_key;
    const request = {
      PublicKeyBase58Check: reading_pub_key,
      ReaderPublicKeyBase58Check: reader_pub_key,
      NumToFetch: no_of_posts,
    };
    const response = await deso.posts.getPostsForPublicKey(request);
    for (let i = 0; i < response.Posts.length; i++) {
      postHexes.push(response.Posts[i].PostHashHex);
    }
    // cool got the hexes here
  }

  const sendHearts = async () => {
    console.log(numberOfPost);
    console.log(username);

    try {
      const deso = new Deso();
      console.log(postHexes.length);
      for (let i = 0; i < postHexes.length; i++) {
        try {
          const sender_pub_key = localStorage.getItem("user_key");
          const request = {
            ReaderPublicKeyBase58Check: sender_pub_key,
            LikedPostHashHex: postHexes[i],
            MinFeeRateNanosPerKB: 1000,
            IsUnlike: false,
          };
          const response = await deso.social.createLikeStateless(request);
          console.log(response);
          setHeartPosts(`${i + 1}`);
        } catch (error) {
          setHeartPosts(`${i + 1}`);
          continue;
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleHeartButton = async () => {
    // get the profile publicKeyBase58Check using username
    if (username.length !== 0) {
      setLoading(true);
      await getProfile();
      // fetch post of user
      await fetchPosts();
      // send diamonds required data posthash hex collection array of no of Posts to fetch
      await sendHearts();
      setNumberOfPost(10);
      setUsername("");
      setPub_key("");
      setLoading(false);
      setPostHexes([]);
      setIsUsername(false);
    }
  };

  return (
    <div className="relative  w-[40rem] px-5 text-xl">
      <div className="mt-16 ml-10  space-y-2">
        {/*  userName */}
        <div className="flex space-x-3">
          <label htmlFor="UserName" className="lato select-none">
            Enter username:
          </label>
          <input
            type="text"
            name="username"
            id="userName"
            value={username}
            className="w-40 border-2 lato text-black"
            onChange={(e) => {
              setUsername(e.target.value);
              setLoading(false);
              setIsUsername(false);
              setIsValid(true);
            }}
          />
          {isValid ? (
            ""
          ) : (
            <div className="mt-[0.3rem] ml-4 text-lg flex items-center gap-2 lato text-red-600 select-none">
              <FaUserAltSlash style={{ color: "red", fontSize: "23px" }} /> User
              not found.
            </div>
          )}
        </div>
        {/* no of post */}
        <div className="flex pt-2 space-x-2">
          <label className="lato select-none" htmlFor="posts">
            Number of posts:
          </label>
          <input
            type="text"
            name="numberOfPost"
            id="posts"
            value={numberOfPost}
            placeholder="10"
            className="w-20 border-2 lato text-black"
            onChange={(e) => {
              setNumberOfPost(e.target.value);
              setLoading(false);
              setIsUsername(false);
              setIsValid(true);
            }}
          />
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-between items-center mt-[2.9rem] mr-2">
        <div className="lato ml-10"> Switch:</div>
        <div
          className={`scale-[0.9] ${
            Dark ? "darktheme hover:border-[#ff7521]" : "logout"
          } rounded-full mr-72`}
          onClick={(e) => {
            e.preventDefault();
            setSettingActive(true);
          }}
        >
          <HiOutlineSwitchVertical style={{ fontSize: "27px" }} />
        </div>
        <div className="lato"></div>
        <div className="flex items-center space-x-5">
          <button
            className={`select-none focus:outline-none bg-[#efefef]  mt-2 ${
              Dark
                ? "bigbtn-dark hover:border-[#ff7521] "
                : "bigbtn bg-[#efefef]"
            }`}
            onClick={handleHeartButton}
            disabled={loading}
          >
            {loading === false && "SUBMIT"}
            {loading === true &&
              (isUsername ? (
                `${heartPosts}/${numberOfPost} ✅`
              ) : (
                <MagnifyingGlass
                  visible={true}
                  height="26"
                  width="70"
                  ariaLabel="MagnifyingGlass-loading"
                  wrapperStyle={{}}
                  wrapperClass="MagnifyingGlass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              ))}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeartOperation;
