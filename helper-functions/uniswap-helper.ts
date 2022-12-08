import { abi as UniswapV2RouterABI } from "../node_modules/@uniswap/v2-periphery/build/UniswapV2Router02.json"
import { abi as UniswapV2PairABI } from "../node_modules/@uniswap/v2-core/build/UniswapV2Pair.json"
import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"
import { abi as UniswapV3PairABI } from "../node_modules/@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"
import uniswapV2PairsJSON from "./json-files/uniswap-v2-pairs.json"
import uniswapV2CompatibleJSON from "./json-files/exchanges-uniswap-v2-compatible.json"
import uniswapV3PairsJSON from "./json-files/uniswap-v3-pairs.json"
import uniswapV3CompatibleJSON from "./json-files/exchanges-uniswap-v3-compatible.json"

import { BigNumber } from "ethers"
import { ethers } from "hardhat"
import {
    tokenDecimals,
    tokenNameAddressConvertor,
} from "./dev-tools/token-name-address-conversion"

/**
 * @dev This function will fetch the on chain price
 * @param amountIn The amount of the first token to swap
 * @param tokens List of tokens in direction of swap. Starting from token0 to token1. ex. USDT - USDC - WETH - WBTC
 * @param routerAddresses The address of the desired routers. ex. quickSwap, sushiSwap, etc.
 * @notice the tokens list can be both token symbol or token address
 * @return amountOut The amount of the last token that would be received
 */
export const uniswapV2Quoter = async function (
    amountIn: BigNumber,
    tokens: string[],
    routerAddresses: string[]
) {
    if (tokens[0].length !== 42) {
        for (let i = 0; i < tokens.length; i++) {
            tokens[i] = tokenNameAddressConvertor(tokens[i])
        }
    }
    let amountsOut: BigNumber[][] = []
    let amountInLocal = amountIn
    for (let i = 0; i < routerAddresses.length; i++) {
        const quoterContract = await ethers.getContractAt(
            UniswapV2RouterABI,
            routerAddresses[i]
        )

        amountsOut.push(
            await quoterContract.getAmountsOut(amountInLocal, [
                tokens[0],
                tokens[1],
            ])
        )

        amountInLocal = amountsOut[i][amountsOut[i].length - 1]
        tokens.shift()
    }
    return amountsOut
}

/**
 * @dev This function give the spot price
 * @param baseToken The base token
 * @param quoteToken The quote token
 * @param factoryAddress The address of the desired factory. ex. quickSwap, sushiSwap, etc.
 * @notice the tokens list can be both token symbol or token address
 * @notice this function has 8 decimals precision
 * @return price The price of quote token in terms of base token, resX and resY
 */
export const uniswapV2SpotPrice = async function (
    baseToken: string,
    quoteToken: string,
    factoryAddress: string
) {
    if (baseToken.length !== 42) {
        baseToken = tokenNameAddressConvertor(baseToken)
        quoteToken = tokenNameAddressConvertor(quoteToken)
    }

    let exchangeName: string
    for (let i = 0; i < uniswapV2CompatibleJSON.length; i++) {
        if (uniswapV2CompatibleJSON[i].Factory === factoryAddress) {
            exchangeName = uniswapV2CompatibleJSON[i].name
            break
        }
    }
    if (exchangeName! === undefined) {
        console.log(`Entered exchange doesn't exist in exchanges json file`)
    }

    let pairAddress: string
    let token0: string
    for (let i = 0; i < uniswapV2PairsJSON.length; i++) {
        if (uniswapV2PairsJSON[i].exchange === exchangeName!) {
            for (const pair of Object.values(uniswapV2PairsJSON[i].pairs)) {
                if (baseToken === pair.token0 || baseToken === pair.token1) {
                    if (
                        quoteToken === pair.token0 ||
                        quoteToken === pair.token1
                    ) {
                        pairAddress = pair.pairAddress
                        token0 = pair.token0
                        break
                    }
                }
            }
        }
    }

    const pairContract = await ethers.getContractAt(
        UniswapV2PairABI,
        pairAddress!
    )

    const baseDecimal = BigNumber.from(tokenDecimals(baseToken)),
        quoteDecimal = BigNumber.from(tokenDecimals(quoteToken)),
        ten = BigNumber.from(10)

    const [resX, resY]: BigNumber[] = await pairContract.getReserves()
    const [resBase, resQuote] =
        token0! === baseToken ? [resX, resY] : [resY, resX]

    return [
        resQuote
            .mul(ten.pow(BigNumber.from(18)))
            .mul(ten.pow(baseDecimal))
            .div(resBase)
            .div(ten.pow(quoteDecimal)),
        resBase,
        resQuote,
    ]
}

/**
 * @dev This function will fetch the on chain price
 * @notice Returns the amount out received for a given exact input swap without executing the swap
 * @param amountIn The amount of the first token to swap
 * @param path The array of paths of the swaps, i.e. each token pair and the pool fee. ex. USDT - 100 - USDC - 5000 - WETH
 * @param quoterAddress The array of desired quoter addresses. ex. uniswapv3, etc.
 * @notice the tokens list can be both token symbol or token address
 * @return amountOut The amount of the last token that would be received
 */
export const uniswapV3Quoter = async function (
    amountIn: BigNumber,
    path: any[][],
    quoterAddress: string[]
) {
    let pathType: string[][] = []

    for (let i = 0; i < path.length; i++) {
        let pathTypeInside: string[] = []
        for (let j = 0; j < path[i].length; j++) {
            if (j % 2 === 0) {
                if (path[i][j].length !== 42) {
                    path[i][j] = tokenNameAddressConvertor(path[i][j])
                }
                pathTypeInside.push("address")
            } else {
                pathTypeInside.push("uint24")
            }
        }
        pathType.push(pathTypeInside)
    }

    let amountsOut: BigNumber[] = []
    let amountInLocal = amountIn
    for (let i = 0; i < quoterAddress.length; i++) {
        const quoterContract = await ethers.getContractAt(
            QuoterABI,
            quoterAddress[i]
        )
        const encodedPath = ethers.utils.solidityPack(pathType[i], path[i])

        amountsOut.push(
            await quoterContract.callStatic.quoteExactInput(
                encodedPath,
                amountInLocal
            )
        )
        amountInLocal = amountsOut[amountsOut.length - 1]
    }
    return amountsOut
}

/**
 * @dev This function give the spot price
 * @param baseToken The base token
 * @param quoteToken The quote token
 * @param factoryAddress The address of the desired factory. ex. uniswap v3, sushiSwap, etc.
 * @notice the tokens list can be both token symbol or token address
 * @notice this function has 8 decimals precision
 * @return an array of array with the first number as the prices and the second number the swap fee
 */
export const uniswapV3SpotPrice = async function (
    baseToken: string,
    quoteToken: string,
    factoryAddress: string
) {
    if (baseToken.length !== 42) {
        baseToken = tokenNameAddressConvertor(baseToken)
        quoteToken = tokenNameAddressConvertor(quoteToken)
    }

    let exchangeName: string
    for (let i = 0; i < uniswapV3CompatibleJSON.length; i++) {
        if (uniswapV3CompatibleJSON[i].Factory === factoryAddress) {
            exchangeName = uniswapV3CompatibleJSON[i].name
            break
        }
    }
    if (exchangeName! === undefined) {
        console.log(`Entered exchange doesn't exist in exchanges json file`)
    }

    let pairAddresses: string[] = []
    let token0: string[] = []
    let fees: number[] = []
    for (let i = 0; i < uniswapV3PairsJSON.length; i++) {
        if (uniswapV3PairsJSON[i].exchange === exchangeName!) {
            for (const pair of Object.values(uniswapV3PairsJSON[i].pairs)) {
                if (baseToken === pair.token0 || baseToken === pair.token1) {
                    if (
                        quoteToken === pair.token0 ||
                        quoteToken === pair.token1
                    ) {
                        pairAddresses.push(pair.pairAddress)
                        token0.push(pair.token0)
                        fees.push(pair.fee)
                    }
                }
            }
        }
    }

    let retArray: any = {}
    for (let i in pairAddresses) {
        const pairContract = await ethers.getContractAt(
            UniswapV3PairABI,
            pairAddresses[i]
        )
        const baseDecimal = BigNumber.from(tokenDecimals(baseToken)),
            quoteDecimal = BigNumber.from(tokenDecimals(quoteToken)),
            ten = BigNumber.from(10),
            two = BigNumber.from(2),
            Q96 = two.pow(BigNumber.from(96))
        const [sqrtPricexX96] = await pairContract.slot0()

        let price = sqrtPricexX96.mul(ten.pow(9)).div(Q96).pow(two)
        if (token0[i] === baseToken) {
            // price = ten.pow(BigNumber.from(36)).div(price)
            price = price.mul(ten.pow(baseDecimal)).div(ten.pow(quoteDecimal))
            // price = ten.pow(BigNumber.from(36)).div(price)
        } else {
            price = ten
                .pow(BigNumber.from(54))
                .div(price)
                .mul(ten.pow(baseDecimal))
                .div(ten.pow(quoteDecimal))
                .div(ten.pow(BigNumber.from(18)))
        }

        retArray[fees[i]] = price
    }

    return retArray
}
