import React from "react";
import Deso from "deso-protocol";
import { signTransaction } from "deso-protocol/src/lib/utils/Utils";

const Landing = ({ logIn }) => {
  const deso = new Deso();
  const handleLogin = async () => {
    const derivePayload = {
      transactionSpendingLimitResponse: {
        GlobalDESOLimit: 20 * 1e9,
        TransactionCountLimitMap: {
          BASIC_TRANSFER: 50,
          AUTHORIZE_DERIVED_KEY: 2,
          SUBMIT_POST: 1000,
          CREATE_NFT: 100,
        },
      },
    };
    const user = await deso.identity.derive(derivePayload);
    //need to be used later

    //  let sender_pub_key = user.publicKeyBase58Check;
    //  let derived_pub_key = user.derivedPublicKeyBase58Check;
    //  let derived_seed_hex = user.derivedSeedHex;
    //  chrome.runtime.sendMessage({
    //    getLandingFunction: true,
    //    sender_pub_key,
    //    derived_pub_key,
    //    derived_seed_hex,
    //  });
    console.log(user);
    // user[]
    let SEED_HEX = user.derivedSeedHex;
    // console.log(SEED_HEX);


    const authorizePayload = {
      OwnerPublicKeyBase58Check: user.publicKeyBase58Check,
      DerivedPublicKeyBase58Check: user.derivedPublicKeyBase58Check,
      ExpirationBlock: user.expirationBlock,
      AccessSignature: user.accessSignature,
      DeleteKey: false,
      DerivedKeySignature: true,
      transactionSpendingLimitHex: user.transactionSpendingLimitHex,
      MinFeeRateNanosPerKB: 1000,
    };

    const authorizeResponse = await fetch(
      `https://node.deso.org/api/v0/authorize-derived-key`,
      {
        method: "POST",
        body: JSON.stringify(authorizePayload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const authorizeData = await authorizeResponse.json();
    // console.log(authorizeData);
    const txHex = authorizeData["TransactionHex"];
    // console.log(txHex);

    const signedTransactionHex = signTransaction(SEED_HEX, txHex);

    const submitPayload = {
      TransactionHex: signedTransactionHex,
    };
    // console.log(payload3.TransactionHex);
    const submitResponse = await fetch(
      `https://node.deso.org/api/v0/submit-transaction`,
      {
        method: "POST",
        body: JSON.stringify(submitPayload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const submitData = await submitResponse.json();
    console.log(submitData);
    localStorage.setItem("derived_pub_key", user.derivedPublicKeyBase58Check);
    localStorage.setItem("derived_seed_hex", user.derivedSeedHex);
    localStorage.setItem("user_key", user.publicKeyBase58Check);
    localStorage.setItem("JWT_KEY", user.jwt);
    localStorage.setItem("isLoggedIn", "true");
    logIn(true);
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
            onClick={async () => {
              handleLogin();
            }}
            className="absolute top-60 left-52 btn focus:outline-none
            bg-[#efefef] bigbtn"
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
