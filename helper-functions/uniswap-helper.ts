import { abi as UniswapV2RouterABI } from "../node_modules/@uniswap/v2-periphery/build/UniswapV2Router02.json"
import { abi as UniswapV2FactoryABI } from "../node_modules/@uniswap/v2-core/build/UniswapV2Factory.json"
import { abi as UniswapV2PairABI } from "../node_modules/@uniswap/v2-core/build/UniswapV2Pair.json"
import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"

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
 * @return price The price of quote token in terms of base token
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
    const factoryContract = await ethers.getContractAt(
        UniswapV2FactoryABI,
        factoryAddress
    )

    const pairAddress = await factoryContract.getPair(baseToken, quoteToken)

    const pairContract = await ethers.getContractAt(
        UniswapV2PairABI,
        pairAddress
    )

    const token0 = await pairContract.token0()
    const token1 = token0 === baseToken ? quoteToken : baseToken

    const baseDecimal = BigNumber.from(tokenDecimals(baseToken)),
        quoteDecimal = BigNumber.from(tokenDecimals(quoteToken)),
        ten = BigNumber.from(10)

    const [resX, resY]: BigNumber[] = await pairContract.getReserves()
    const [resBase, resQuote] =
        token0 === baseToken ? [resX, resY] : [resY, resX]

    return resQuote
        .div(ten.pow(quoteDecimal))
        .mul(ten.pow(BigNumber.from(8)))
        .div(resBase.div(ten.pow(baseDecimal)))
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
                path[i][j] = tokenNameAddressConvertor(path[i][j])
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
