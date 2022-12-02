// import fs from "fs"
// import blackListJson from "../blacklist-lowbalance.json"
// import UniV2PairsInfo from "../UniV2PairsInfo.json"

// const main = async () => {
//     let jsonDataString
//     let blackListed: string[]

//     for (let i = 0 /* capture the swap */; i < UniV2PairsInfo.length; i++) {
//         for (
//             let ii = 0 /* capture pair in swap[i] */;
//             ii < UniV2PairsInfo[i].pairs.length;
//             ii++
//         ) {

//         }
//     }

//     /* __________ export to Json parts __________ */
//     jsonDataString = JSON.stringify(blackListed)
//     fs.writeFileSync("blacklist-lowbalance.json", jsonDataString, {
//         encoding: "utf8",
//     })
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })
