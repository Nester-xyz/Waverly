import { signTransaction } from "deso-protocol/src/lib/utils/Utils";
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Waverly app has been installed successfully!");
});

let senderPublicKey;
let seedHex;
let derivedKey;
const sendDiamonds = async (
  postHexes,
  diamonds,
  public_key,
  admin_public_key,
  derived_pub_key,
  seed
) => {
  senderPublicKey = admin_public_key;
  seedHex = seed;
  for (let i = 0; i < postHexes.length; i++) {
    try {
      const diamondPayload = {
        ReceiverPublicKeyBase58Check: public_key,
        SenderPublicKeyBase58Check: senderPublicKey,
        DiamondPostHashHex: postHexes[i],
        DiamondLevel: parseInt(diamonds),
        MinFeeRateNanosPerKB: 1700,
        InTutorial: false,
      };
      const diamondResponse = await fetch(
        "https://node.deso.org/api/v0/send-diamonds",
        {
          method: "POST",
          body: JSON.stringify(diamondPayload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const diamondData = await diamondResponse.json();
      const TRANSACTION_HEX = diamondData.TransactionHex;
      derivedKey = derived_pub_key;
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
      const TRANSACTION_HEX_2 = appendPostData.TransactionHex;
      const signed_transaction_hex = signTransaction(
        seedHex,
        TRANSACTION_HEX_2
      );
      const submit_transaction_payload = {
        TransactionHex: signed_transaction_hex,
      };
      const submit_transaction_response = await fetch(
        "https://node.deso.org/api/v0/submit-transaction",
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

      // setTipLevel(`${i + 1}`);
      // chrome.runtime.sendMessage({ message: `change-state` }, function (response) {
      //   console.log(response);
      // });
    } catch (error) {
      // setTipLevel(`${i + 1}`);
      continue;
    }
  }
  // console.log(response);
  return response;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.getSendDiamondsFunction) {
    sendDiamonds(
      request.postHexes,
      request.diamonds,
      request.public_key,
      request.admin_public_key,
      request.derived_pub_key,
      request.seed
    )
      .then((result) => {
        sendResponse({ success: result });
      })
      .catch((e) => {
        sendResponse({ error: e });
      });
  }
  return true;
});
