import { IUniswapV2Factory } from "../typechain-types/"
import IuniswapAbi from "../IuniswapAbi.json"
import { networkConfig } from "../helper-hardhat-config"
import UniV2Pairs from "../UniV2PairsInfo.json"

import fs from "fs"
import { ethers } from "hardhat"
import { BigNumber } from "ethers"
import uniswapPaitJson from "../UniV2PairsInfo.json"

// const provider = ethers.getDefaultProvider("matic", {
//     etherscan: process.env.ETHERSCAN_API_KEY,
//     infura: process.env.INFURA_API_KEY,
//     alchemy: process.env.ALCHEMY_API_KEY,
//     pocket: process.env.POCKET_API_KEY,
// })

const main = async () => {
    /* __________ get data from blockchain __________ */
    console.log("Trying to fetch the addresses !!!")
    let pairInfo: any[] = uniswapPaitJson

    // for (let i = 0; i < networkConfig[137].UniswapV2.length; i++) {
    //     pairInfo.push({
    //         swapName: networkConfig[137].UniswapV2[i].name,
    //         pairs: <object[]>[],
    //     })
    // }

    let jsonDataString

    for (
        let i = 17 /* swap number [i] */;
        i < networkConfig[137].UniswapV2.length;
        i++
    ) {
    // for (let i = 10 /* swap number [i] */; i < 6; i++) {
        /* __________ creating the factory interfaces __________ */
        let uniswapV2Factory = (await ethers.getContractAt(
            "IUniswapV2Factory",
            networkConfig[137].UniswapV2[i].Factory
        )) as IUniswapV2Factory

        const poolPairsNum = await uniswapV2Factory.allPairsLength()

        for (let j = 0; j < poolPairsNum.toNumber(); j++) {
            /* __________ getting pair addresses __________ */
            const pairAddress = await uniswapV2Factory.allPairs(j)

            /* __________ getting pair interface __________ */
            const uniswapV2Pair = new ethers.Contract(
                pairAddress,
                IuniswapAbi,
                ethers.provider
            )

            // const kLast: BigNumber = await uniswapV2Pair.kLast()
            // if (kLast.lt(ethers.utils.parseEther("1"))) continue

            const token0 = await uniswapV2Pair.token0()
            const token1 = await uniswapV2Pair.token1()

            const pairInfoInsideRest = {
                address: pairAddress,
                token0: token0,
                token1: token1,
            }

            pairInfo[i].pairs.push(pairInfoInsideRest)
            console.log(
                `For ${networkConfig[137].UniswapV2[i].name} added ${pairInfoInsideRest.address} pair`
            )
            /* __________ export to Json parts __________ */
            jsonDataString = JSON.stringify(pairInfo)
            fs.writeFileSync("UniV2PairsInfo.json", jsonDataString, {
                encoding: "utf8",
            })
        }
    }

    /* __________ export to Json parts __________ */
    jsonDataString = JSON.stringify(pairInfo)
    fs.writeFileSync("UniV2PairsInfo.json", jsonDataString, {
        encoding: "utf8",
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
