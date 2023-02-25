import React from "react";
import Deso from "deso-protocol";

const Landing = ({ logIn }) => {
  const deso = new Deso();
  const handleLogin = async () => {
    const derivePayload = {
      transactionSpendingLimitResponse: {
        GlobalDESOLimit: 10 * 1e9,
        TransactionCountLimitMap: {
          BASIC_TRANSFER: 100000000000,
          AUTHORIZE_DERIVED_KEY: 2,
          SUBMIT_POST: 100000000000,
          CREATE_NFT: 100000000000,
          LIKE: 100000000000,
        },
      },
    };
    const user = await deso.identity.derive(derivePayload);
    console.log(user);
    let dervidedPubKey_bg = user.derivedPublicKeyBase58Check;
    let derivedSeedHex_bg = user.derivedSeedHex;
    let publickey_bg = user.publicKeyBase58Check;
    let transactionSpendingLimitHex_bg = user.transactionSpendingLimitHex;
    let expirationBlock_bg = user.expirationBlock;
    let accessSignature_bg = user.accessSignature;
    console.log(user);
    chrome.runtime.sendMessage({
      getLoginFunction: true,
      dervidedPubKey_bg,
      derivedSeedHex_bg,
      publickey_bg,
      expirationBlock_bg,
      transactionSpendingLimitHex_bg,
      accessSignature_bg,
    });
    localStorage.setItem("derived_pub_key", user.derivedPublicKeyBase58Check);
    localStorage.setItem("derived_seed_hex", user.derivedSeedHex);
    localStorage.setItem("user_key", user.publicKeyBase58Check);
    localStorage.setItem("JWT_KEY", user.jwt);
    localStorage.setItem("isLoggedIn", "true");
    logIn(true);
    // dervidedPubKey_bg = localStorage.getItem("derived_pub_key");
    // derivedSeedHex_bg = localStorage.getItem("derived_seed_hex");
    // publickey_bg = localStorage.getItem("user_key");
    // user[]
  };

  // return jsx
  return (
    <div className="w-[40rem] h-[25rem] border ">
      <div className="w-full h-full flex justify-center items-center text-center">
        <div>
          <div className="absolute top-40 left-14  text-3xl text-center welcomewaverly select-none">
            <span id="welcometo">Welcome to </span>Waverly 🌊👋
          </div>
          <button
            onClick={async () => {
              handleLogin();
            }}
            className="absolute top-60 left-52 btn focus:outline-none
            bg-[#efefef] bigbtn select-none"
          >
            {" "}
            GET STARTED
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
