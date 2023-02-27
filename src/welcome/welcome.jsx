import Deso from "deso-protocol";
import { signTransaction } from "deso-protocol/src/lib/utils/Utils.js";

const handleLogin = async () => {
  const deso = new Deso();
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
  console.log(authorizeData);
  const txHex = authorizeData.TransactionHex;
  const seedHex = user.derivedSeedHex;
  const signedTransactionHex = signTransaction(seedHex, txHex);
  const submitPayload = {
    TransactionHex: signedTransactionHex,
  };
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
  chrome.storage.local.set({
    derived_pub_key: user.derivedPublicKeyBase58Check,
    derived_seed_hex: user.derivedSeedHex,
    user_key: user.publicKeyBase58Check,
    jwt_key: user.jwt,
  });

  if (chrome && chrome.action && chrome.action.setPopup) {
    chrome.action.setPopup({ popup: "popup.html" });
  } else {
    console.error("Error: browserAction API is not available");
  }
  window.close();
};

document.getElementById("login-button").addEventListener("click", handleLogin);
