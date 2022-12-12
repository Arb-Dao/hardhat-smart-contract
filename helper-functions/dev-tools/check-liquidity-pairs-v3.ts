import v3CompatibleExchangesJSON from "../json-files/exchanges-uniswap-v3-compatible.json"
import { abi as UniswapV3PairABI } from "../../node_modules/@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"
import { abi as UniswapV3FactoryABI } from "../../node_modules/@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"
import { abi as IERC20 } from "../../node_modules/@uniswap/v3-core/artifacts/contracts/interfaces/IERC20Minimal.sol/IERC20Minimal.json"

import tokenListJSON from "../json-files/token-list.json"

import { ethers } from "hardhat"
import { BigNumber } from "ethers"

import fs from "fs"

const feesV3 = [100, 500, 3000, 10000]
/**
 * @dev Fetch the pair data of the exchanges listed in the json file exchanges-uniswap-v3-compatible.json
 * @return Update the json file of uniswap-v2-pairs
 */
const main = async function () {
    let exchangeConstruct: Object[] = []
    for (let i = 0; i < v3CompatibleExchangesJSON.length; i++) {
        let pairs: any = {}
        const factoryContract = await ethers.getContractAt(
            UniswapV3FactoryABI,
            v3CompatibleExchangesJSON[i].Factory
        )
        for (const [key1, value1] of Object.entries(tokenListJSON)) {
            for (const [key2, value2] of Object.entries(tokenListJSON)) {
                if (key1 === key2) continue
                for (const fee of feesV3) {
                    const pairName: string = `${key1}-${key2}-${fee}`
                    const mirrorPairName: string = `${key2}-${key1}-${fee}`

                    // preventing double adding the same pair
                    if (
                        pairs[pairName] !== undefined ||
                        pairs[mirrorPairName] !== undefined
                    )
                        continue
                    const pairAddress: string = await factoryContract.getPool(
                        value1[0],
                        value2[0],
                        fee
                    )
                    if (
                        pairAddress !==
                        "0x0000000000000000000000000000000000000000"
                    ) {
                        const pairContract = await ethers.getContractAt(
                            UniswapV3PairABI,
                            pairAddress
                        )
                        const tokensContract = await ethers.getContractAt(
                            IERC20,
                            pairAddress
                        )
                        const token0 = await pairContract.token0(),
                            token1 = await pairContract.token1(),
                            resX = await tokensContract
                                .attach(token0)
                                .balanceOf(pairAddress),
                            resY = await tokensContract
                                .attach(token1)
                                .balanceOf(pairAddress)
                        if (
                            resX.lte(ethers.BigNumber.from("100000000")) ||
                            resY.lte(ethers.BigNumber.from("100000000"))
                        )
                            continue
                        pairs[pairName] = {
                            fee: fee,
                            pairAddress: pairAddress,
                            token0: token0,
                            token1: token1,
                            resX: resX.toString(),
                            resY: resY.toString(),
                        }
                    }
                }
            }
        }
        console.log(pairs)
        exchangeConstruct.push({
            exchange: v3CompatibleExchangesJSON[i].name,
            pairs: pairs,
        })
        console.log(exchangeConstruct)

        /* __________ export to Json parts __________ */
        const jsonDataString = JSON.stringify(exchangeConstruct)
        fs.writeFileSync(
            "./helper-functions/json-files/uniswap-v3-pairs.json",
            jsonDataString,
            {
                encoding: "utf8",
            }
        )
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
