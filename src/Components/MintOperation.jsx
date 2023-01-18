import React, { useState, useContext } from "react";
import { WaverlyContext } from "../Contexts/WaverlyContext";
import Switch from "react-switch";
import { RiImageAddFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import SubmitPost from "./SubmitPost";
import Deso from "deso-protocol";
import { Puff } from "react-loading-icons";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "./default";
const MintOperation = ({ submit, setSubmit }) => {
  const [data, setData] = useState({
    title: "",
    copies: "1",
    minimumBid: "0",
    buyNowPrice: "0",
    creatorRoyalty: "10",
    coinHolder: "5",
  });
  const [img, setImg] = useState("");
  const [NOC, setNOC] = useState(1);
  const [loading, setLoading] = useState(false);
  const [desoRoyalty, setDesoRoyalty] = useState(false);
  const [plusSign, setPlusSign] = useState(true);
  const [putSale, setPutSale] = useState(false);
  const [buyNow, setBuyNow] = useState(false);
  const [unlockableBtn, setUnlockableBtn] = useState(false);
  const [bodyText, setBodyText] = useState("");
  const { Dark, textBoxActive2 } = useContext(WaverlyContext);
  const [isUnlockable, setIsUnlockable] = useState(false);
  const [isForSale, setIsForSale] = useState(false);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [additionalDESORoyalties, setAdditionalDesoRoyalty] = useState({
    PublicKeyBase58Check: "",
    RoyaltyPercent: 1,
  });
  const [submitMintResponse, setSubmitMintResponse] = useState();
  if (submit === true) {
    return (
      <SubmitPost response={submitMintResponse} toggleSubmit={setSubmit} />
    );
  }

  const handlePutSale = (nextChecked) => {
    setPutSale(nextChecked);
    setIsForSale(nextChecked);
  };

  const handleBuyNow = (nextChecked) => {
    setBuyNow(nextChecked);
    setIsBuyNow(nextChecked);
    setIsUnlockable(false);
    setUnlockableBtn(false);
  };

  const handleUnlockableBtn = (nextChecked) => {
    setUnlockableBtn(nextChecked);
    setIsUnlockable(nextChecked);
  };

  const handleUploadImage = async () => {
    try {
      const pub_key = localStorage.getItem("user_key");
      const deso = new Deso();
      const request = {
        UserPublicKeyBase58Check: pub_key,
      };
      const response = await deso.media.uploadImage(request);
      setImg(response.ImageURL.toString());
    } catch (error) {
      console.error(error);
    }
  };

  async function submitTransactionPost() {
    try {
      const pub_key = localStorage.getItem("user_key");
      const deso = new Deso();
      let imgURLar = [img];
      let res = bodyText.replace(/{/g, "");
      let res1 = res.replaceAll("}", "");
      const request = {
        UpdaterPublicKeyBase58Check: pub_key,
        BodyObj: {
          Body: res1,
          VideoURLs: [],
          ImageURLs: imgURLar,
        },
      };
      const response = await deso.posts.submitPost(request);
      console.log("submission completed");
      setSubmitMintResponse(response);
      return response.submittedTransactionResponse.PostEntryResponse
        .PostHashHex;
    } catch (e) {
      console.log(e);
    }
  }
  // handle Submit Button
  const handleMintBtn = async () => {
    let postHash;
    try {
      if (bodyText.length !== 0 || img.length !== 0) {
        setLoading(true);
        postHash = await submitTransactionPost();
      } else {
        console.log("Submission not completed!");
      }
      const pub_key = localStorage.getItem("user_key");
      const deso = new Deso();
      let royaltyMap = [];
<<<<<<< HEAD
      royaltyMap[`${additionalDESORoyalties.PublicKeyBase58Check}`] = additionalDESORoyalties.RoyaltyPercent * 100;
      console.log(royaltyMap)
=======
      royaltyMap[`${additionalDESORoyalties.PublicKeyBase58Check}`] =
        additionalDESORoyalties.RoyaltyPercent * 100;
      console.log(royaltyMap);
>>>>>>> 73bf9575c803afedcb6ed4c1c27eaca87dc3fcdb
      const request = {
        UpdaterPublicKeyBase58Check: pub_key,
        NFTPostHashHex: postHash,
        NumCopies: NOC.length !== 0 ? parseInt(NOC) : 1,
        NFTRoyaltyToCreatorBasisPoints:
          parseInt(data.creatorRoyalty.toString()) * 100,
        NFTRoyaltyToCoinBasisPoints: parseInt(data.coinHolder.toString()) * 100,
        HasUnlockable: isUnlockable,
        IsForSale: isForSale,
        MinBidAmountNanos: parseInt(data.minimumBid.toString()) * 1000000000,
        IsBuyNow: isBuyNow,
        BuyNowPriceNanos: parseInt(data.buyNowPrice.toString()) * 1000000000,
        MinFeeRateNanosPerKB: 1000,
        AdditionalDESORoyaltiesMap: royaltyMap,
      };
      console.log(request);
      const response = await deso.nft.createNft(request);
      console.log(response);
      setData({
        title: "",
        copies: "1",
        minimumBid: "0",
        buyNowPrice: "0",
        creatorRoyalty: "10",
        coinHolder: "5",
      });
      setNOC("1");
      setLoading(false);
      setSubmit(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // const delay = ms => new Promise(res => setTimeout(res, ms));
    // setLoading(true);
    // await delay(2000);
    // setLoading(false);
    // setSubmit(true)
  };

  const onChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
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
    <div className="flex relative mt-2 px-5">
      <div>
        <div
          className={`flex-col divide-y ${Dark ? "divide-[#a9a9a9]" : ""}  `}
        >
          {/* TextArea, Image Icon, No. Of Copies, Price */}
          <div className="w-[37rem] rounded px-3 border-[#efefef] flex justify-between">
            {/* Text area, Number of copies, image starts here */}
            {/* Top Left  */}
            <div className="">
              <MentionsInput
                className="placeholder text-black rounded-xl  border resize-none text-lg pt-2 mb-2 bg-[#efefef] w-[24rem] h-[5rem] mt-4 px-5  focus:outline-none"
                style={defaultStyle}
                rows={`${textBoxActive2 ? "5" : "6"}`}
                cols="1"
                placeholder="Your title here"
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
                      className={`user ${
                        focused ? "focused" : ""
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

              {/* textarea ends here */}
              {/* Image upload and number of copies starts here */}
              <div className="flex items-center">
                {/* Image upload starts here */}
                <div className={`img-upload`}>
                  <button
                    className={`${
                      Dark ? "darktheme hover:border-orange-300" : "logout"
                    } mr-5 scale-75 rounded-full`}
                    onClick={handleUploadImage}
                  >
                    <IconContext.Provider value={{ size: "27px" }}>
                      <RiImageAddFill style={{ size: "200px" }} />
                    </IconContext.Provider>
                  </button>
                </div>
                {/* Image upload over */}
                {/* Number of copies starts here */}
                <div className="flex text-lg items-center -mt-1 p-1.5">
                  <label className="lato text-[1.1rem] select-none" htmlFor="">
                    Number of copies:
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="copies"
                    id="copy"
                    className="lato p-1 border w-14 h-8 ml-3 rounded-lg pl-2 pr-3 text-black"
                    onChange={(e) => {
                      setNOC(e.target.value);
                    }}
                    value={NOC}
                  />
                  <div className="flex ml-2">
                    {/* btn */}{" "}
                    <div className={`img-upload select-none`}>
                      <button
                        className={`${
                          Dark ? "darktheme hover:border-orange-300" : "logout"
                        }  scale-75 rounded-full lato text-xl`}
                        onClick={() => {
                          setNOC(parseInt(NOC + 0) + 1);
                        }}
                      >
                        +1
                      </button>
                    </div>
                    <div className={`img-upload select-none`}>
                      <button
                        className={`${
                          Dark ? "darktheme hover:border-orange-300" : "logout"
                        }  scale-75 rounded-full lato text-xl`}
                        onClick={() => {
                          setNOC(parseInt(NOC + 0) + 5);
                        }}
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Top Right */}
            <div>
              <div>
                <div
                  className={` ${
                    img === "" ? "border-2" : "border-none"
                  } w-[10rem] ml- rounded-lg h-[9rem] mt-1`}
                >
                  <div
                    className={`mt-11 select-none ml-1 text-xl text-center text-[#a9a9b0]
                  ${img ? "hidden" : "block"}
                  placeholder`}
                  >
                    Preview <br />
                    Image Here
                  </div>
                  <img
                    src={img}
                    alt=""
                    className={`object-cover w-[11rem] h-[9rem] rounded-lg   ${
                      img ? "block" : "hidden"
                    }`}
                  />
                </div>
              </div>

              {/* Number of copies ends here */}
            </div>
          </div>
          <div>
            {/* Pricing */}
            <div
              className={`${
                Dark ? "border-[#a9a9a9]" : ""
              } border-b flex-col py-1 px-3`}
            >
              <label className="flex select-none justify-between mt-1 items-center pr-[6rem] ">
                <span className="text-lg lato -pl-5">Put it on sale:</span>
                <Switch
                  onChange={handlePutSale}
                  checked={putSale}
                  onColor={`${Dark ? "#f69552" : "#86d3ff"}`}
                  onHandleColor={`${Dark ? "#ff7521" : "#2693e6"}`}
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={15}
                  width={35}
                  className="react-switch -mr-6"
                  id="material-switch"
                />
              </label>
              {isForSale ? (
                <div>
                  <div className="flex mt-4 mb-1 justify-between text-lg items-center gap-2">
                    <label
                      className="lato text-[18px] select-none"
                      htmlFor="minimumBid"
                    >
                      Minimum Bid:
                    </label>
                    <div className="mr-7 flex gap-3">
                      <input
                        type="number"
                        min="0"
                        name="minimumBid"
                        id="minimumBid"
                        className="lato border rounded-lg pl-3 pr-3 p-1 w-14 h-8 text-black"
                        onChange={onChange}
                        placeholder="0"
                      />
                      <label className="lato select-none" htmlFor="minimumBid">
                        $DESO
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            {isForSale ? (
              <div
                className={`flex-col border-b pl-3 space-y-2 px-3 py-2 ${
                  Dark ? "border-[#a9a9a9]" : ""
                }`}
              >
                <div>
                  <label className="flex select-none justify-between text-lg items-center pr-[6rem] ">
                    <span className="lato -pl-5">Set Buy Now:</span>
                    <Switch
                      onChange={handleBuyNow}
                      checked={buyNow}
                      onColor={`${Dark ? "#f69552" : "#86d3ff"}`}
                      onHandleColor={`${Dark ? "#ff7521" : "#2693e6"}`}
                      handleDiameter={20}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={15}
                      width={35}
                      className="react-switch -mr-6"
                      id="material-switch"
                    />
                  </label>
                  {buyNow ? (
                    <div className="flex justify-between text-lg items-center gap-2 mt-4">
                      <label className="lato select-none" htmlFor="buyNow">
                        Buy Now Price:
                      </label>
                      {data.minimumBid === "0" ? (
                        <label className="lato mr-28 mt-0.5 text-sm text-red-600">
                          (Must be greater than 0)
                        </label>
                      ) : (
                        ""
                      )}
                      <div className="lato mr-7 flex gap-3">
                        <input
                          type="number"
                          min="1"
                          name="buyNowPrice"
                          id="buyNow"
                          className="border w-14 rounded-lg pl-3 pr-3 h-8 p-1 text-black"
                          onChange={onChange}
                          placeholder="1"
                        />
                        <label className="lato select-none" htmlFor="buyNow">
                          $DESO
                        </label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="flex-col space-y-2 mt-2">
          {/* Preview Image and Royalty */}
          <div
            className={`border-b py-1 ${
              Dark ? "border-[#a9a9a9]" : ""
            } pb-2 pr-1 pl-3`}
          >
            {/* <div className="text-xl">Royalty:</div> */}
            <div className="flex-col space-y-3 text-lg">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="creator"
                  className="leading-[1rem] text-center lato select-none"
                >
                  Creator Royalty:
                </label>
                <div className="flex gap-3 items-center mr-20">
                  <input
                    type="number"
                    min="1"
                    name="creatorRoyalty"
                    id="creator"
                    className="lato border rounded-lg pl-3 pr-3 p-1 w-14 h-8 text-black"
                    onChange={onChange}
                    placeholder="10"
                  />
                  <label className="lato select-none" htmlFor="minimumBid">
                    %
                  </label>
                </div>
              </div>
              <div className="flex  items-center justify-between">
                <label
                  htmlFor="creator"
                  className="leading-[1rem] text-center lato select-none"
                >
                  Coin Holder Royalty:
                </label>
                <div className="flex items-center gap-3 mr-20">
                  <input
                    type="number"
                    min="0"
                    name="coinHolder"
                    id="creator"
                    className="lato border rounded-lg pl-3 pr-3 p-1 w-14 h-8 text-black "
                    onChange={onChange}
                    placeholder="5"
                  />
                  <label className="lato select-none" htmlFor="minimumBid">
                    %
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex text-lg flex-col gap-2 justify-center ${
              buyNow ? "" : "border-b"
            } p-1 ${Dark ? "border-[#a9a9a9]" : ""} pb-2 pr-1 pl-2`}
          >
            <div className="flex gap-2 items-center select-none">
              <div className="lato">Additional DeSo Royalty</div>
              <div
                className={`${
                  plusSign ? "block" : "hidden"
                } cursor-pointer text-2xl mt-0.5 ml-[16.7rem]`}
                onClick={() => {
                  setDesoRoyalty(true);
                  setPlusSign(!plusSign);
                }}
              >
                <AiOutlinePlusCircle />
              </div>
              <div
                className={`cursor-pointer scale-150 mt-0.5 ml-[17rem] ${
                  plusSign ? "hidden" : "block"
                }`}
                onClick={() => {
                  setDesoRoyalty(false);
                  setPlusSign(true);
                }}
              >
                <CrossCircledIcon style={{ size: "100px" }} />
              </div>
            </div>

            <div
              className={`flex items-center p-2 gap-[0.40rem] border border-[#a9a9a9] rounded-lg py-1 ${
                desoRoyalty ? "block" : "hidden"
              }`}
            >
              <div className={`flex flex-col gap-1`}>
                <div className="flex items-center justify-between w-[34rem]">
                  <label
                    htmlFor="desoPerson"
                    className=" text-center lato select-none mb-3"
                  >
                    Select the creator:
                  </label>
                  <input
                    type="text"
                    name="coinHolder"
                    id="desoPerson"
                    value={additionalDESORoyalties.PublicKeyBase58Check}
                    onChange={(e) =>
                      setAdditionalDesoRoyalty({
                        ...additionalDESORoyalties,
                        PublicKeyBase58Check: e.target.value,
                      })
                    }
                    className="lato p-1 rounded-lg border h-8 w-36  mr-4 text-black "
                    placeholder="Username Here"
                    data={fetchUsers}
                  />
                </div>
                <div className="flex items-center justify-between w-[34rem]">
                  <label
                    htmlFor="desoRoyaltyPercentage"
                    className="leading-[1rem]  text-center lato select-none"
                  >
                    DeSo Royalty:
                  </label>
                  <div className="flex items-center gap-3 mr-[4.8rem]">
                    {/* <div className="flex bg-blue-300 -mr-[11.5rem] "> */}
                    <input
                      type="number"
                      name="coinHolder"
                      id="desoRoyaltyPercentage"
                      onChange={(e) => {
                        setAdditionalDesoRoyalty({
                          ...additionalDESORoyalties,
                          RoyaltyPercent: e.target.value,
                        });
                      }}
                      className="lato h-8 w-14 rounded-lg pl-2 border text-black "
                      placeholder=" 10"
                      value={additionalDESORoyalties.RoyaltyPercent}
                    />
                    <div className="lato select-none">%</div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
          {/* Unlockable Content */}
          {buyNow ? (
            ""
          ) : (
            <div className={`text-lg flex-col gap-2 py-1 pr-1 pl-2`}>
              <label className="flex select-none justify-between items-center pr-[6.6rem] ">
                <span className="lato">Unlockable Content:</span>
                <Switch
                  onChange={handleUnlockableBtn}
                  checked={buyNow ? "" : unlockableBtn}
                  onColor={`${Dark ? "#f69552" : "#86d3ff"}`}
                  onHandleColor={`${Dark ? "#ff7521" : "#2693e6"}`}
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={15}
                  width={35}
                  className="react-switch -mr-7"
                  id="material-switch"
                />
              </label>
            </div>
          )}
        </div>
        <div className="right-button flex justify-end mt-3 mb-3">
          <button
            className={`select-none btn focus:outline-none ${
              Dark
                ? "bigbtn-dark hover:border-[#ff7521] "
                : "bigbtn bg-[#efefef]"
            }`}
            onClick={handleMintBtn}
            disabled={loading}
          >
            {loading ? (
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
  );
};

export default MintOperation;
