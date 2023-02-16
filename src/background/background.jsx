import { signTransaction } from "deso-protocol/src/lib/utils/Utils";
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Waverly app has been installed successfully!");
});

let senderPublicKey;
let seedHex;
const sendDiamonds = async (
  postHexes,
  diamonds,
  public_key,
  admin_public_key,
  seed
) => {
  senderPublicKey = admin_public_key;
  seedHex = seed;
  console.log(public_key);
  console.log(senderPublicKey);
  for (let i = 0; i < postHexes.length; i++) {
    try {
      const diamondPayload = {
        ReceiverPublicKeyBase58Check: public_key,
        SenderPublicKeyBase58Check: senderPublicKey,
        DiamondPostHashHex: postHexes[i],
        DiamondLevel: parseInt(diamonds),
        MinFeeRateNanosPerKB: 1001,
        InTutorial: false,
      };
      // console.log(diamondPayload)
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
      // console.log("here 28")
      const diamondData = await diamondResponse.json();
      console.log(diamondData);
      const TRANSACTION_HEX = diamondData.TransactionHex;
      // console.log(diamondData);
      // console.log("here 33")
      // const appendPostData = await appendPostResponse.json();
      // // console.log(appendPostData);
      // const nextTransactionHex = appendPostData.TransactionHex;
      // console.log(nextTransactionHex);
      // console.log(seed);
      //no error till this
      const signed_transaction_hex = signTransaction(
        seedHex,
        TRANSACTION_HEX,
        false
      );

      // console.log(seedHex);
      // console.log(TRANSACTION_HEX);
      // console.log(signed_transaction_hex);
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
