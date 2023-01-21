chrome.runtime.onInstalled.addListener(details => {
    console.log("Waverly app has been isntalled successfully!")
});
// return new Promise(async (resolve, reject) => {
//     try {
//         const deso = new Deso();
//         console.log(postHexes.length);
//         for (let i = 0; i < postHexes.length; i++) {
//             try {
//                 const sender_pub_key = localStorage.getItem("user_key");
//                 const receiver_pub_key = public_key;
//                 const diamond_level = Number(diamonds);
//                 const request = {
//                     ReceiverPublicKeyBase58Check: receiver_pub_key,
//                     SenderPublicKeyBase58Check: sender_pub_key,
//                     DiamondPostHashHex: postHexes[i],
//                     DiamondLevel: diamond_level,
//                     MinFeeRateNanosPerKB: 1001,
//                     InTutorial: false,
//                 };
//                 const response = await deso.social.sendDiamonds(request);
//                 console.log(response);
//                 setTipLevel(`${i + 1}`);
//             } catch (error) {
//                 setTipLevel(`${i + 1}`);
//                 continue;
//             }
//         }
//     } catch (error) {
//         setLoading(false);
//     }
// });

const testFunction = async () => {
  console.log('testFunction has been run successfully!')
  return Promise.resolve('ok')
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.getTestFunction) {
    testFunction()
      .then(result => {
        sendResponse({success: result})
      })
      .catch(e => {
        sendResponse({error: e})
      })

  }
  return true
})