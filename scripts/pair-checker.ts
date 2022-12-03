import fs from "fs"
import UniV2PairsInfoJson from "../UniV2PairsInfo.json"
import noPairFoundJson from "../no-pair-found.json"

const main = async () => {
    let jsonDataString
    let noPairFound: string[] = noPairFoundJson
    let foundPairs: number
    const UniV2PairsInfo: any[] = UniV2PairsInfoJson

    for (let i = 0 /* capture the swap */; i < UniV2PairsInfo.length; i++) {
        for (
            let ii = 0 /* capture pair in swap[i] */;
            ii < UniV2PairsInfo[i].pairs.length;
            ii++
        ) {
            if (noPairFound.includes(UniV2PairsInfo[i].pairs[ii].address)) {
                continue
            }
            foundPairs = 0
            for (
                let j = 0 /* capture the swap */;
                j < UniV2PairsInfo.length;
                j++
            ) {
                if (j === i) continue /* skip the swap i, duplicate */
                for (
                    let jj = 0 /* capture pair in swap[j] */;
                    jj < UniV2PairsInfo[j].pairs.length;
                    jj++
                ) {
                    if (
                        (UniV2PairsInfo[i].pairs[ii].token0 ===
                            UniV2PairsInfo[j].pairs[jj].token0 &&
                            UniV2PairsInfo[i].pairs[ii].token1 ===
                                UniV2PairsInfo[j].pairs[jj].token1) ||
                        (UniV2PairsInfo[i].pairs[ii].token0 ===
                            UniV2PairsInfo[j].pairs[jj].token1 &&
                            UniV2PairsInfo[i].pairs[ii].token1 ===
                                UniV2PairsInfo[j].pairs[jj].token0)
                    ) {
                        foundPairs += 1
                    }
                }
            }
            if (foundPairs === 0) {
                noPairFound.push(UniV2PairsInfo[i].pairs[ii].address)
                console.log(
                    `${UniV2PairsInfo[i].pairs[ii].address} added to no pair in other swap list`
                )
                /* __________ export to Json parts __________ */
                jsonDataString = JSON.stringify(noPairFound)
                fs.writeFileSync("no-pair-found.json", jsonDataString, {
                    encoding: "utf8",
                })
            }
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
