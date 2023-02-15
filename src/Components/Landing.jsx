import React from "react";
import Deso from "deso-protocol";

const Landing = ({ logIn }) => {
  const deso = new Deso();
  const loginToDeso = async () => {
    try {
      const request = 4;
      const response = await deso.identity.login(request);
      const { key, user } = response;
      const res = {};
      res[key] = user;
      localStorage.setItem("deso_user", JSON.stringify(response.user));
      localStorage.setItem("deso_user_key", JSON.stringify(response.key));
      localStorage.setItem("user_key", response.key);
      localStorage.setItem("users", JSON.stringify(res));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("seedHex", response.user.encryptedSeedHex);
      console.log(response)
      logIn(true);
    } catch (error) {
      console.error(error);
    }
  };
  // return jsx
  return (
    <div className="w-[40rem] h-[25rem] border ">
      <div className="w-full h-full flex justify-center items-center   text-center">
        <div>
          <div className="absolute top-40 left-14  text-3xl text-center welcomewaverly">
            <span id="welcometo">Welcome to </span>Waverly 🌊👋
          </div>
          <button
            onClick={loginToDeso}
            className="absolute top-60 left-52 btn focus:outline-none bg-[#efefef] bigbtn"
          >
            GET STARTED
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
