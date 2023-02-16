import React, { useState, useContext } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import SubmitPost from "./SubmitPost";
import Deso from "deso-protocol";
import { RiImageAddFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { ImEmbed } from "react-icons/im";
import EmbeddBtn from "./EmbeddBtn";
import { Puff } from "react-loading-icons";
import { MdOutlineCancel } from "react-icons/md";
import { MentionsInput, Mention } from "react-mentions";
import { signTransaction } from "deso-protocol/src/lib/utils/Utils";
import defaultStyle from "./default.js";
const PostOperation = ({ submit, setSubmit }) => {
  const [imgURLs, setImgURLs] = useState([]);
  const [bodyText, setBodyText] = useState("");
  const [textBoxActive2, setTextBoxActive2] = useState(false);
  const [divImg, setDivImg] = useState("");
  // const [image, setImage] = useState(null);
  const [setLoading, setSetLoading] = useState(false);
  const [submitResponse, setSubmitResponse] = useState();
  const [embedText, setEmbedText] = useState("");
  const { Dark } = useContext(WaverlyContext);
  if (submit === true) {
    return <SubmitPost response={submitResponse} toggleSubmit={setSubmit} />;
  }

  // const handleUploadImage = async () => {
  //   const JWT = localStorage.getItem("JWT_KEY");
  //   const pub_key = localStorage.getItem("user_key");
  //   const formData = new FormData();
  //   formData.append("file", image);
  //   formData.append("UserPublicBase58Check", pub_key);
  //   formData.append("JWT", JWT);
  //   const uploadImageResponse = await fetch(
  //     `https://node.deso.org/api/v0/upload-image`,
  //     {
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //   const uploadImageData = await uploadImageResponse.json();
  //   console.log(uploadImageData);
  // };

  // const response = await deso.media.uploadImage(request);
  // setDivImg("https://images.deso.org/a5306f0faf3e77360a11f4ea79a9a2fd449eca16f4e708e70bd88d8da1e08430.gif");
  // setImgURLs([
  //   ...imgURLs,
  //   { id: imgURLs.length, name: uploadImagePayload.ImageURL },
  // ]);
  // setDivImg(uploadImageData.ImageURL.toString());
  // console.log(uploadImagePayload.ImageURL);
  const handleSubmitPost = async () => {
    setSetLoading(true);
    const pub_key = localStorage.getItem("user_key");
    let imgURLar = [];
    if (Object.keys(imgURLs).length !== 0) {
      imgURLar = [imgURLs[imgURLs.length - 1].name];
    }
    // for mention manip
    let res1 = bodyText.replace(/{{@/g, "@");
    let res2 = res1.replace(/}}/g, "");
    const submitPostPayload = {
      UpdaterPublicKeyBase58Check: pub_key,
      BodyObj: {
        Body: `${res2} \n\n Posted via @waverlyapp`,
        VideoURLs: [],
        ImageURLs: imgURLar,
      },
      PostExtraData: {
        EmbedVideoURL: embedText,
      },
      IsHidden: false,
      MinFeeRateNanosPerKB: 1700,
      InTutorial: false,
    };
    if (bodyText.length !== 0 || Object.keys(imgURLs).length !== 0) {
      const submitPostResponse = await fetch(
        `https://node.deso.org/api/v0/submit-post`,
        {
          method: "POST",
          body: JSON.stringify(submitPostPayload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const submitPostData = await submitPostResponse.json();
      // console.log(submitPostData);
      const TRANSACTION_HEX = submitPostData.TransactionHex;
      // console.log(TRANSACTION_HEX);

      let derivedKey = localStorage.getItem("derived_pub_key");

      const appendExtraDataPayload = {
        TransactionHex: TRANSACTION_HEX,
        ExtraData: {
          DerivedPublicKey: derivedKey,
        },
      };

      const appendPostResponse = await fetch(
        `https://node.deso.org/api/v0/append-extra-data`,
        {
          method: "POST",
          body: JSON.stringify(appendExtraDataPayload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const appendPostData = await appendPostResponse.json();
      // console.log(appendPostData);

      // console.log(appendPostData.TransactionHex);
      const Transaction_Hex_2 = appendPostData.TransactionHex;
      let derived_seed_hex = localStorage.getItem("derived_seed_hex");
      const signed_transaction_hex = signTransaction(
        derived_seed_hex,
        Transaction_Hex_2
      );

      const submit_transaction_payload = {
        TransactionHex: signed_transaction_hex,
      };

      const submit_transaction_response = await fetch(
        `https://node.deso.org/api/v0/submit-transaction
      `,
        {
          method: "POST",
          body: JSON.stringify(submit_transaction_payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const submit_transaction_data = await submit_transaction_response.json();
      console.log(submit_transaction_data);

      setSubmitResponse(submit_transaction_data);
      setSetLoading(false);
      setBodyText("");
      setImgURLs([]);
      setDivImg("");
      setSubmit(true);
      setEmbedText("");
    }
  };
  async function fetchUsers(query, callback) {
    console.log(query);
    if (!query) return;
    const deso = new Deso();
    const request = {
      UsernamePrefix: query,
      OrderBy: "influencer_coin_price",
      NumToFetch: 4,
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
    <div>
      <div>
        {/* text area */}
        <div
          className={`flex w-full ${textBoxActive2 ? "h-[9.6rem]" : "h-[12rem]"
            }`}
        >
          <MentionsInput
            className="rounded-xl resize-none text-black border text-lg pt-2 bg-[#efefef] w-[25rem] mt-4 px-5 mx-5 focus:outline-none"
            style={defaultStyle}
            rows={`${textBoxActive2 ? "5" : "6"}`}
            cols="1"
            placeholder="Enter your post"
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
          >
            <Mention
              className="focus:outline-none lato"
              trigger="@"
              markup="{{__id__}}"
              displayTransform={(id) => `${id + ""}`}
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
                  <div className=" flex flex-row rounded-xl lato">
                    <img
                      className="select-none w-10 h-10 mt-1 rounded-full"
                      src={suggestion.image()}
                      alt="."
                    ></img>
                    <div className="p-2 lato">{highlightedDisplay}</div>
                  </div>
                </div>
              )}
              appendSpaceOnAdd
            />
          </MentionsInput>
          <div
            className={`mt-7 mb-3 w-[11rem] rounded-lg ${divImg === "" ? "border-2" : "border-none"
              }`}
          >
            <div
              className={`${divImg ? "hidden" : "block"
                } mt-16 ml-1 text-center text-[#a9a9b0] text-lg placeholder`}
            >
              Preview Image Here
            </div>
            <img
              src={divImg}
              alt=""
              className={`object-cover ${textBoxActive2 ? "h-[8rem]" : "h-[10rem]"
                } w-[11rem] rounded-lg  -mt-1 ${divImg === "" && "hidden"}`}
            />
          </div>
        </div>
        <div className="mt-3">
          <EmbeddBtn
            visibility={textBoxActive2}
            changeData={setEmbedText}
            tab="post"
            embedText={embedText}
          />
        </div>
        {/* btn start here */}
        <div className="buttons mt-2 px-5 flex justify-between">
          {/* left buttons start here */}
          <div className="left-buttons -space-x-5 flex">
            {/* img upload btn start here */}
            <div className="img-upload">
              <button
                className={`${Dark ? "darktheme hover:border-orange-300" : "logout"
                  } mr-5 scale-75 rounded-full`}
              >
                \
                <IconContext.Provider value={{ size: "27px" }}>
                  <RiImageAddFill style={{ size: "200px" }} />
                </IconContext.Provider>
              </button>
            </div>
            {/* <input type="file" /> */}
            {/* img upload btn ends here */}
            <div className="embedbtn">
              <button
                className={`${Dark ? "darktheme hover:border-orange-300" : "logout"
                  } mr-5 rounded-full scale-75`}
                onClick={() => {
                  setTextBoxActive2(!textBoxActive2);
                }}
              >
                <IconContext.Provider value={{ size: "27px" }}>
                  <ImEmbed style={{ size: "200px" }} />
                </IconContext.Provider>
              </button>
            </div>
            <div className="pl-4">
              <div className="relative w-80">
                {embedText.length >= 20 ? (
                  <div>
                    <iframe
                      title="myFrame"
                      width="320"
                      height="60"
                      src={
                        embedText.includes(".be")
                          ? embedText.replace(".be", "be.com/embed")
                          : embedText.replace("/watch?v=", "/embed/")
                      }
                      aria-labelledby="l"
                    ></iframe>
                    <div
                      onClick={() => {
                        setEmbedText("");
                        setTextBoxActive2(false);
                      }}
                      className="text-2xl absolute top-0 right-0 -mr-6 -mt-1 cursor-pointer"
                    >
                      {" "}
                      <MdOutlineCancel />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* right buttons start here */}
          <div className="right-button">
            <button
              onClick={handleSubmitPost}
              className={`select-none btn focus:outline-none  ${Dark
                ? "bigbtn-dark hover:border-[#ff7521] "
                : "bigbtn bg-[#efefef]"
                }`}
              disabled={setLoading}
            >
              {setLoading ? (
                <Puff
                  stroke="#ff7521"
                  strokeOpacity={1}
                  speed={0.75}
                  width={73}
                  height={25}
                  strokeWidth={5}
                  fillOpacity={0.5}
                />
              ) : (
                "SUBMIT"
              )}
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default PostOperation;
