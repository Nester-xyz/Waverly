import React, { useState } from "react";
import "./Unlockable.css";
import { RiImageAddFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import SubmitPost from "./SubmitPost";
import Deso from "deso-protocol";
import { Puff } from "react-loading-icons";
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
  const [loading, setLoading] = useState(false);
  const [isUnlockable, setIsUnlockable] = useState(false);
  const [submitMintResponse, setSubmitMintResponse] = useState();
  if (submit === true) {
    return (
      <SubmitPost response={submitMintResponse} toggleSubmit={setSubmit} />
    );
  }
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
      const request = {
        UpdaterPublicKeyBase58Check: pub_key,
        BodyObj: {
          Body: data.title,
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
      setLoading(true);
      if (data.title.toString().length !== 0 || img.length !== 0) {
        postHash = await submitTransactionPost();
      } else {
        console.log("Submission not completed!");
      }
      const pub_key = localStorage.getItem("user_key");
      const deso = new Deso();
      const request = {
        UpdaterPublicKeyBase58Check: pub_key,
        NFTPostHashHex: postHash,
        NumCopies: parseInt(data.copies.toString()),
        NFTRoyaltyToCreatorBasisPoints:
          parseInt(data.creatorRoyalty.toString()) * 100,
        NFTRoyaltyToCoinBasisPoints: parseInt(data.coinHolder.toString()) * 100,
        HasUnlockable: isUnlockable,
        IsForSale: data.minimumBid !== "0" ? true : false,
        MinBidAmountNanos: parseInt(data.minimumBid.toString()) * 1000000000,
        IsBuyNow: data.buyNowPrice !== "0" ? true : false,
        BuyNowPriceNanos: parseInt(data.buyNowPrice.toString()) * 1000000000,
        MinFeeRateNanosPerKB: 1000,
      };
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
      setLoading(false);
      setSubmit(true);
    } catch (error) {
      console.log(error);
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

  return (
    <div className="flex relative mt-2 space-x-3 px-2 py-1">
      <div className="flex-col">
        {/* TextArea, Image Icon, No. Of Copies, Price */}
        <div className="border-2 rounded-lg px-3 border-[#efefef] ">
          {/* Text area, Number of copies, image starts here */}
          {/* textarea  */}
          <textarea
            id="textbox"
            className="placeholder rounded-xl textbox border-2 resize-none text-lg pt-2 bg-[#efefef] w-[17.4rem] h-[5rem] mt-4 px-5  focus:outline-none"
            rows="5"
            cols="1"
            placeholder="Your title here"
            name="title"
            onChange={onChange}
          ></textarea>
          {/* textarea ends here */}
          {/* Image upload and number of copies starts here */}
          <div className="flex items-center">
            {/* Image upload starts here */}
            <div className="img-upload">
              <button
                className="logout mr-5  scale-75"
                onClick={handleUploadImage}
              >
                <IconContext.Provider value={{ color: "#444", size: "27px" }}>
                  <RiImageAddFill style={{ size: "200px" }} />
                </IconContext.Provider>
              </button>
            </div>
            {/* Image upload over */}
            {/* Number of copies starts here */}
            <div className="flex text-lg">
              <label className="lato text-[1.1rem] " htmlFor="">
                Number of copies:
              </label>
              <input
                type="number"
                min="1"
                name="copies"
                id="copy"
                className="lato border w-14 h-8 ml-3"
                onChange={onChange}
                placeholder="1"
              />
            </div>
            {/* Number of copies ends here */}
          </div>
        </div>
        <div>
          {/* Pricing */}
          <div className="flex-col pl-3 mt-2 space-y-2 border-2 rounded-lg px-3 py-2 border-[#efefef]">
            <div>
              <div className="flex justify-between text-lg items-center gap-2">
                <label className="lato text-[18px]" htmlFor="minimumBid">
                  Minimum Bid:
                </label>
                <div className="mr-7 flex gap-3">
                  <input
                    type="number"
                    min="0"
                    name="minimumBid"
                    id="minimumBid"
                    className="lato border w-14 h-8"
                    onChange={onChange}
                    placeholder="0"
                  />
                  <label className="lato" htmlFor="minimumBid">
                    $DESO
                  </label>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-lg items-center gap-2">
                <label className="lato" htmlFor="buyNow">
                  Buy Now:
                </label>
                <div className="lato mr-7 flex gap-3">
                  <input
                    type="number"
                    min="0"
                    name="buyNowPrice"
                    id="buyNow"
                    className="border w-14 h-8"
                    onChange={onChange}
                    placeholder="0"
                  />
                  <label className="lato" htmlFor="buyNow">
                    $DESO
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col space-y-2">
        {/* Preview Image and Royalty */}
        <div className="border-2 py-1 border-[#efefef] rounded-lg pr-1 pl-3">
          <div className="flex items-center">
            <div className="flex">
              {/* Royalty */}
              {/* <div className="text-xl">Royalty:</div> */}
              <div className="flex-col space-y-3 text-lg w-fit">
                <div className="flex items-center gap-1">
                  <label
                    htmlFor="creator"
                    className="leading-[1rem] text-center lato"
                  >
                    Creator Royalty
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="creatorRoyalty"
                    id="creator"
                    className="lato border w-10 h-8"
                    onChange={onChange}
                    placeholder="10"
                  />
                  <label className="lato" htmlFor="minimumBid">
                    %
                  </label>
                </div>
                <div className="flex  items-center gap-1">
                  <label
                    htmlFor="creator"
                    className="leading-[1rem] text-center lato"
                  >
                    Coin Holder Royalty
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="coinHolder"
                    id="creator"
                    className="lato border w-10 h-8"
                    onChange={onChange}
                    placeholder="5"
                  />
                  <label className="lato" htmlFor="minimumBid">
                    %
                  </label>
                </div>
              </div>
            </div>
            <div>
              {/* Preview Image */}
              <div>
                <div
                  className={` ${
                    img === "" ? "border-2" : "border-none"
                  } w-[7rem] ml-2 rounded-lg h-[7rem]`}
                >
                  <div
                    className={`mt-7 ml-1 text-lg text-center text-[#a9a9b0]
                  ${img ? "hidden" : "block"}
                  placeholder`}
                  >
                    Preview Image Here
                  </div>
                  <img
                    src={img}
                    alt=""
                    className={`object-cover w-[11rem] h-[7rem] rounded-lg   ${
                      img ? "block" : "hidden"
                    }`}
                  />
                  {/* <img src={""} alt=""/> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Unlockable Content */}
          <div className={`border-2 p-1 border-[#efefef] rounded-lg`}>
            <div className=" flex justify-center items-center space-x-2">
              <div className="select-none flex text-lg space-x-2 lato mw -mt-0.5">
                Enable Unlockable Content
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  name="isUnlockable"
                  className="checkbox-switch"
                  onClick={() => setIsUnlockable(!isUnlockable)}
                />
                <div className="slider"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="right-button absolute top-48 mt-1 left-[29.5rem]">
        <button
          className="select-none btn focus:outline-none bg-[#efefef] bigbtn"
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
  );
};

export default MintOperation;
