import v2CompatibleExchangesJSON from "../json-files/exchanges-uniswap-v2-compatible.json"
import { abi as UniswapV2PairABI } from "../../node_modules/@uniswap/v2-core/build/UniswapV2Pair.json"
import tokenListJSON from "../json-files/token-list.json"
import uniswapV2Pairs from "../json-files/uniswap-v2-pairs.json"

import { abi as UniswapV2FactoryABI } from "../../node_modules/@uniswap/v2-core/build/UniswapV2Factory.json"
import { ethers } from "hardhat"
import { BigNumber } from "ethers"

import fs from "fs"

/**
 * @dev Fetch the pair data of the exchanges listed in the json file exchanges-uniswap-v2-compatible.json
 * @return Update the json file of uniswap-v2-pairs
 */
const main = async function () {
    let exchangeConstruct: Object[] = []
    for (let i = 0; i < v2CompatibleExchangesJSON.length; i++) {
        let pairs: any = {}
        const factoryContract = await ethers.getContractAt(
            UniswapV2FactoryABI,
            v2CompatibleExchangesJSON[i].Factory
        )
        for (const [key1, value1] of Object.entries(tokenListJSON)) {
            for (const [key2, value2] of Object.entries(tokenListJSON)) {
                if (key1 === key2) continue
                const pairName: string = `${key1}-${key2}`
                const mirrorPairName: string = `${key2}-${key1}`

                // preventing double adding the same pair
                if (
                    pairs[pairName] !== undefined ||
                    pairs[mirrorPairName] !== undefined
                )
                    continue
                const pairAddress: string = await factoryContract.getPair(
                    value1[0],
                    value2[0]
                )
                if (
                    pairAddress !== "0x0000000000000000000000000000000000000000"
                ) {
                    const pairContract = await ethers.getContractAt(
                        UniswapV2PairABI,
                        pairAddress
                    )
                    const [resX, resY]: BigNumber[] =
                        await pairContract.getReserves()
                    pairs[pairName] = {
                        exist: true,
                        pairAddress: pairAddress,
                        token0: await pairContract.token0(),
                        token1: await pairContract.token1(),
                        resX: resX.toString(),
                        resY: resY.toString(),
                    }
                }
            }
        }
        console.log(pairs)
        exchangeConstruct.push({
            exchange: v2CompatibleExchangesJSON[i].name,
            pairs: pairs,
        })
        /* __________ export to Json parts __________ */
        const jsonDataString = JSON.stringify(exchangeConstruct)
        fs.writeFileSync(
            "./helper-functions/json-files/uniswap-v2-pairs.json",
            jsonDataString,
            {
                encoding: "utf8",
            }
        )
    }
    // /* __________ export to Json parts __________ */
    // const jsonDataString = JSON.stringify(exchangeConstruct)
    // fs.writeFileSync("uniswap-v2-pairs.json", jsonDataString, {
    //     encoding: "utf8",
    // })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
