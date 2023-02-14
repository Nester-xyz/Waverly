/*global chrome*/
import React, { useEffect, useContext } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import Deso from "deso-protocol";
import { MagnifyingGlass } from "react-loader-spinner";
import { FaUserAltSlash } from "react-icons/fa";
import { useState } from "react";
import defaultStyle from "./default";
import { MentionsInput, Mention } from "react-mentions";

const TipOperations = () => {
  const [diamonds, setDiamonds] = useState("1");
  const [numberOfPost, setNumberOfPost] = useState(10);
  const [rate, setRate] = useState("1");
  const [username, setUsername] = useState("");
  // eslint-disable-next-line
  const [pub_key, setPub_key] = useState("");
  const [loading, setLoading] = useState(false);
  const [postHexes, setPostHexes] = useState([]);
  const [tipLevel, setTipLevel] = useState("0");
  const [isUsername, setIsUsername] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const { Dark, textBoxActive2 } = useContext(WaverlyContext);

  useEffect(() => {
    let response;
    async function handleExchangeRate() {
      const deso = new Deso();
      response = await deso.metaData.getExchangeRate();
      setRate(response.USDCentsPerDeSoBlockchainDotCom);
    }
    handleExchangeRate();
  }, []);

  let diamondData = {
    1: 50000,
    2: 500000,
    3: 5000000,
    4: 50000000,
  };

  let public_key;

  async function getProfile() {
    const deso = new Deso();
    if (username.length !== 0) {
      const userName = username;
      let res = userName.replace(/{/g, "");
      let res1 = res.replaceAll("}", "");
      const request = {
        Username: res1,
      };
      try {
        const response = await deso.user.getSingleProfile(request);
        public_key = response.Profile.PublicKeyBase58Check;
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

  const handleKeyDown = (event) => {
    if (event.keyCode === 32) {
      event.preventDefault();
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
  // const handleClick = async () => {
  //   try {
  //     const response = await chrome.runtime.sendMessage({
  //       getSendDiamondsFunction: true,
  //     });
  //     console.log("handleClick: response", response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleTipButton = async () => {
    // get the profile publicKeyBase58Check using username
    if (username.length !== 0) {
      setLoading(true);
      await getProfile();
      // fetch post of user
      await fetchPosts();
      // send diamonds required data posthash hex collection array of no of Posts to fetch
      // send diamonds required data posthash hex collection array of no of Posts to fetch
      await chrome.runtime.sendMessage({
        getSendDiamondsFunction: true,
        postHexes,
        public_key,
        diamonds,
      });
      setDiamonds("1");
      setNumberOfPost(10);
      setUsername("");
      setPub_key("");
      setLoading(false);
      setPostHexes([]);
      setTipLevel("0");
      setIsUsername(false);
    }
  };

  return (
    <div className="relative  w-[40rem] px-5 text-xl">
      <div className="mt-10 ml-10  space-y-2">
        {/*  userName */}
        <div className="flex items-center">
          <label className="lato mb-1">Enter the username:</label>
          <MentionsInput
            className="heart w-[18rem] -mt-1 ml-2 h-10 border rounded-xl lato bg-white text-black"
            style={defaultStyle}
            value={username}
            id="heart_input_box"
            onChange={(e) => {
              setUsername(e.target.value);
              setLoading(false);
              setIsUsername(false);
              setIsValid(true);
            }}
            onKeyDown={handleKeyDown}
            rows={`${textBoxActive2 ? "5" : "6"}`}
            cols="1"
          >
            <Mention
              className=""
              trigger=""
              markup="{{__display__}}"
              data={fetchUsers}
              renderSuggestion={(
                suggestion,
                search,
                highlightedDisplay,
                index,
                focused
              ) => (
                <div
                  className={`user ${focused ? "focused" : ""
                    } flex flex-row rounded-xl lato`}
                >
                  <div className=" flex  flex-row rounded-xl lato">
                    <img
                      className="select-none w-10 h-10 mt-1 rounded-full"
                      src={suggestion.image()}
                      alt="."
                    ></img>
                    <div className="p-2 lato">{highlightedDisplay}</div>
                  </div>
                </div>
              )}
            />
          </MentionsInput>
        </div>
        {/* no of post */}
        <div className="flex pt-2 space-x-2">
          <label className="lato select-none" htmlFor="posts">
            Number of posts:
          </label>
          <div className="flex gap-28">
            <input
              type="text"
              name="numberOfPost"
              id="posts"
              value={numberOfPost}
              placeholder="10"
              className="w-20 border-2 rounded-lg pl-2 lato text-black"
              onChange={(e) => {
                setNumberOfPost(e.target.value);
                setLoading(false);
                setIsUsername(false);
                setIsValid(true);
              }}
            />
            {isValid ? (
              ""
            ) : (
              <div className="mb-1 text-lg flex items-center gap-2 lato text-red-600 select-none">
                <FaUserAltSlash style={{ color: "red", fontSize: "23px" }} />
                not found.
              </div>
            )}
          </div>
        </div>
        {/* diamonds */}
        <div className="lato flex space-x-1 items-center">
          <label className="lato select-none" htmlFor="">
            Diamond Level:
          </label>
          <div className="flex select-none text-black">
            <button
              className={`${Dark ? "darktheme" : "logout"
                } rounded-2xl lato scale-75 ${diamonds === "1"
                  ? `${Dark ? "darktheme-active" : "logout-active "
                  } border-blue-400 border-2`
                  : `hover:border-orange-300`
                }`}
              onClick={() => setDiamonds("1")}
            >
              1💎
            </button>
            <button
              className={`${Dark ? "darktheme" : "logout"
                } rounded-2xl lato scale-75 ${diamonds === "2"
                  ? `${Dark ? "darktheme-active" : "logout-active "
                  } border-blue-400 border-2`
                  : `hover:border-orange-300`
                }`}
              onClick={() => setDiamonds("2")}
            >
              2💎
            </button>
            <button
              className={`${Dark ? "darktheme" : "logout"
                } rounded-2xl lato scale-75 ${diamonds === "3"
                  ? `${Dark ? "darktheme-active" : "logout-active "
                  } border-blue-400 border-2`
                  : `hover:border-orange-300`
                }`}
              onClick={() => setDiamonds("3")}
            >
              3💎
            </button>
          </div>
        </div>
      </div>
      {/* Submit Button & Calculations */}
      <div className="flex justify-between items-center mt-3">
        <div className="lato"></div>
        <div className="flex items-center space-x-5">
          <div className="lato select-none">
            Calculation &nbsp;~$
            {parseFloat(
              ((Number(diamondData[Number(diamonds)]) / 1e9) *
                Number(numberOfPost) *
                Number(rate)) /
              100
            ).toFixed(4)}
          </div>
          <button
            className={`select-none focus:outline-none bg-[#efefef]  mt-2 ${Dark
              ? "bigbtn-dark hover:border-[#ff7521] "
              : "bigbtn bg-[#efefef]"
              }`}
            onClick={() => {
              handleTipButton();
              // handleClick();
            }}
            disabled={loading}
          >
            {loading === false && "SUBMIT"}
            {loading === true &&
              (isUsername ? (
                `${tipLevel}/${numberOfPost} ✅`
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

export default TipOperations;
