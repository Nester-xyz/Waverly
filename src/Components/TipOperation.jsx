import React, { Component } from "react";
import Deso from "deso-protocol";
import { MagnifyingGlass } from "react-loader-spinner";
import { FaUserAltSlash } from "react-icons/fa";

export default class TipOperation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diamonds: "1",
      numberOfPost: 10,
      rate: "1",
      username: "",
      pub_key: "",
      loading: false,
      postHexes: [],
      tipLevel: "0",
      isUsername: false,
      isValid: true,
    };
    this.getProfile = this.getProfile.bind(this);
    this.fetchPosts = this.fetchPosts.bind(this);
    this.handleTipButton = this.handleTipButton.bind(this);
    this.sendDiamonds = this.sendDiamonds.bind(this);
  }
  async componentDidMount() {
    const deso = new Deso();
    const response = await deso.metaData.getExchangeRate();
    this.setState({ rate: response.USDCentsPerDeSoBlockchainDotCom });
  }

  diamondData = {
    1: 50000,
    2: 500000,
    3: 5000000,
    4: 50000000,
  };

  async getProfile() {
    const deso = new Deso();
    if (this.state.username.length !== 0) {
      const userName = this.state.username;
      const request = {
        Username: userName,
      };
      try {
        const response = await deso.user.getSingleProfile(request);
        const public_key = await response.Profile.PublicKeyBase58Check;
        this.setState({ pub_key: public_key });
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        await delay(2000);
        this.setState({ isUsername: true });
      } catch (error) {
        this.setState({ isUsername: false });
        this.setState({ loading: false });
        this.setState({ isValid: false });
        console.log(error);
      }
    }
  }

  async fetchPosts() {
    // fetch posthash hex of numberofpost to an array
    const deso = new Deso();
    const no_of_posts = Number(this.state.numberOfPost);
    const reader_pub_key = localStorage.getItem("user_key");
    const reading_pub_key = this.state.pub_key;
    const request = {
      PublicKeyBase58Check: reading_pub_key,
      ReaderPublicKeyBase58Check: reader_pub_key,
      NumToFetch: no_of_posts,
    };
    const response = await deso.posts.getPostsForPublicKey(request);
    let { postHexes } = this.state;
    for (let i = 0; i < response.Posts.length; i++) {
      postHexes.push(response.Posts[i].PostHashHex);
    }
    // cool got the hexes here
  }

  sendDiamonds = async () => {
    try {
      const { postHexes } = this.state;
      const deso = new Deso();
      console.log(postHexes.length);
      for (let i = 0; i < postHexes.length; i++) {
        try {
          const sender_pub_key = localStorage.getItem("user_key");
          const receiver_pub_key = this.state.pub_key;
          const diamond_level = Number(this.state.diamonds);
          const request = {
            ReceiverPublicKeyBase58Check: receiver_pub_key,
            SenderPublicKeyBase58Check: sender_pub_key,
            DiamondPostHashHex: postHexes[i],
            DiamondLevel: diamond_level,
            MinFeeRateNanosPerKB: 1001,
            InTutorial: false,
          };
          const response = await deso.social.sendDiamonds(request);
          console.log(response);
          this.setState({ tipLevel: `${i + 1}` });
        } catch (error) {
          this.setState({ tipLevel: `${i + 1}` });
          continue;
        }
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  handleTipButton = async () => {
    // get the profile publicKeyBase58Check using username
    if (this.state.username.length !== 0) {
      this.setState({ loading: true });
      await this.getProfile();
      // fetch post of user
      await this.fetchPosts();
      // send diamonds required data posthash hex collection array of no of Posts to fetch

      await this.sendDiamonds();
      this.setState({
        diamonds: "1",
        numberOfPost: 10,
        username: "",
        pub_key: "",
        loading: false,
        postHexes: [],
        tipLevel: "0",
        isUsername: false,
      });
    }
  };
  handleChange = (e) => {
    /* rejects the number value less than 10 and sets diamond level and numberOfPost*/
    this.setState({ ...this.state, [e.target.name]: e.target.value });
    this.setState({ loading: false });
    this.setState({ isUsername: false });
    this.setState({ isValid: true });
  };
  render() {
    return (
      <div className="relative  w-[40rem] px-5 text-xl">
        <div className="mt-10 ml-10  space-y-2">
          {/*  userName */}
          <div className="flex space-x-3">
            <label htmlFor="UserName" className="lato">
              Enter username:
            </label>
            <input
              type="text"
              name="username"
              id="userName"
              value={this.state.username}
              className="w-40 border-2 "
              onChange={this.handleChange}
            />
            {this.state.isValid ? (
              ""
            ) : (
              <div className="mt-[0.3rem] ml-4 text-lg flex items-center gap-2 lato text-red-600">
                <FaUserAltSlash style={{ color: "red", fontSize: "23px" }} />{" "}
                User not found.
              </div>
            )}
          </div>
          {/* no of post */}
          <div className="flex pt-2 space-x-2">
            <label className="lato" htmlFor="posts">
              Number of posts:
            </label>
            <input
              type="text"
              name="numberOfPost"
              id="posts"
              value={this.state.numberOfPost}
              placeholder="10"
              className="w-20 border-2 "
              onChange={this.handleChange}
            />
          </div>
          {/* diamonds */}
          <div className="lato flex space-x-1 items-center">
            <label className="lato" htmlFor="">
              Diamond Level:
            </label>
            <div className="flex">
              <button
                className={`logout lato scale-75 ${
                  this.state.diamonds === "1" &&
                  "logout-active border-blue-400 border-2"
                }`}
                onClick={() => this.setState({ diamonds: "1" })}
              >
                1💎
              </button>
              <button
                className={`logout lato scale-75 ${
                  this.state.diamonds === "2" &&
                  "logout-active border-blue-400 border-2"
                }`}
                onClick={() => this.setState({ diamonds: "2" })}
              >
                2💎
              </button>
              <button
                className={`logout lato scale-75 ${
                  this.state.diamonds === "3" &&
                  "logout-active border-blue-400 border-2"
                }`}
                onClick={() => this.setState({ diamonds: "3" })}
              >
                3💎
              </button>
            </div>
          </div>
        </div>
        {/* Submit Button & Calculations */}
        <div className="flex justify-between items-center mt-4">
          <div className="lato">
          </div>
          <div className="flex items-center space-x-5">
            <div className="lato">
              Calculation &nbsp;~$
              {parseFloat(
                ((Number(this.diamondData[Number(this.state.diamonds)]) / 1e9) *
                  Number(this.state.numberOfPost) *
                  Number(this.state.rate)) /
                  100
              ).toFixed(4)}
            </div>
            <button
              className="select-none btn focus:outline-none bg-[#efefef] bigbtn mt-2"
              onClick={this.handleTipButton}
              disabled={this.state.loading}
            >
              {this.state.loading === false && "SUBMIT"}
              {this.state.loading === true &&
                (this.state.isUsername ? (
                  `${this.state.tipLevel}/${this.state.numberOfPost} ✅`
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
  }
}
