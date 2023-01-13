import React, { useContext } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import Deso from "deso-protocol";
import { MagnifyingGlass } from "react-loader-spinner";
import { FaUserAltSlash } from "react-icons/fa";
import { useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "./default";

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
  const { Dark, textBoxActive2 } = useContext(WaverlyContext);

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

  async function fetchUsers(query, callback) {
    console.log(query);
    if (!query) return;
    const deso = new Deso();
    const request = {
      UsernamePrefix: query,
      OrderBy: "influencer_coin_price",
      NumToFetch: 3,
    };
    await deso.user
      .getProfiles(request)
      .then((response) =>
        response.ProfilesFound.map((user) => ({
          display: user.Username,
          id: `@${user.Username}`,
          image: function () {
            const request = user.PublicKeyBase58Check;
            const response = deso.user.getSingleProfilePicture(request);
            return response;
          },
        }))
      )
      .then(callback);
  }

  return (
    <div className="relative w-[40rem] px-5 text-xl">
      <div className="mt-16 ml-10  space-y-2">
        <div className="flex space-x-3">
          <label htmlFor="UserName" className="lato select-none">
            Enter username:
          </label>
          {/*  userName */}
          <MentionsInput
            className="w-[17rem] -mt-1 h-10 border rounded-xl lato bg-white text-black"
            style={defaultStyle}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setLoading(false);
              setIsUsername(false);
              setIsValid(true);
            }}
            rows={`${textBoxActive2 ? "5" : "6"}`}
            cols="1"
          >
            <Mention
              className=""
              trigger=""
              data={fetchUsers}
              appendSpaceOnAdd={false}
              renderSuggestion={(
                suggestion,
                search,
                highlightedDisplay,
                index,
                focused
              ) => (
                <div
                  className={`user ${
                    focused ? "focused" : ""
                  } flex flex-row rounded-xl lato`}
                >
                  <div className=" flex  flex-row rounded-xl lato">
                    <img
                      className="select-none w-10 h-10 mt-1 rounded-full"
                      src={suggestion.image()}
                      alt="."
                    ></img>
                    <div className="p-2 lato">
                      {highlightedDisplay.length > 15
                        ? highlightedDisplay.slice(15, 20)
                        : highlightedDisplay}
                    </div>
                  </div>
                </div>
              )}
            />
          </MentionsInput>
          {isValid ? (
            ""
          ) : (
            <div className="-mt-1 text-lg flex items-center gap-2 lato text-red-600 select-none">
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
            type="number"
            name="numberOfPost"
            id="posts"
            value={numberOfPost}
            placeholder="10"
            className="w-20 h-9 -mt-0.5 border-2 rounded-lg pr-3 pl-3 lato text-black"
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
      <div className="flex justify-between items-center mt-[2.7rem] mr-1">
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
