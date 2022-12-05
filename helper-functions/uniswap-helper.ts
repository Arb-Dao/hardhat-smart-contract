import UniswapV2Router02Json from "../node_modules/@uniswap/v2-periphery/build/IUniswapV2Router02.json"
import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"

import { BigNumber } from "ethers"
import { ethers, network } from "hardhat"
import { tokenNameAddressConvertor } from "./token-name-address-conversion"

/**
 * @dev This function will fetch the on chain price
 * @param amountIn The amount of the first token to swap
 * @param tokens List of tokens in direction of swap. Starting from token0 to token1. ex. USDT - USDC - WETH - WBTC
 * @param routerAddress The address of the desired router. ex. quickSwap, sushiSwap, etc.
 * @notice the tokens list can be both token symbol or token address
 * @return amountOut The amount of the last token that would be received
 */
export const uniswapV2Quoter = async function (
    amountIn: BigNumber,
    tokens: string[],
    routerAddress: string
) {
    if (tokens[0].length !== 42) {
        for (let i = 0; i < tokens.length; i++) {
            tokens[i] = tokenNameAddressConvertor(tokens[i])
        }
    }

    const quoterContract = await ethers.getContractAt(
        UniswapV2Router02Json.abi,
        routerAddress
    )

    const amountsOut: BigNumber[] = await quoterContract.getAmountsOut(
        amountIn,
        tokens
    )
    return amountsOut
}

/**
 * @dev This function will fetch the on chain price
 * @notice Returns the amount out received for a given exact input swap without executing the swap
 * @param amountIn The amount of the first token to swap
 * @param path The path of the swap, i.e. each token pair and the pool fee. ex. USDT - 100 - USDC - 5000 - WETH
 * @param quoterAddress The address of the desired quoter. ex. uniswapv3, etc.
 * @notice the tokens list can be both token symbol or token address
 * @return amountOut The amount of the last token that would be received
 */
export const uniswapV3Quoter = async function (
    amountIn: BigNumber,
    path: any[],
    quoterAddress: string
) {
    let pathType: string[] = []

    for (let i = 0; i < path.length; i++) {
        if (i % 2 === 0) {
            path[i] = tokenNameAddressConvertor(path[i])
            pathType.push("address")
        } else {
            pathType.push("uint24")
        }
    }

    const quoterContract = await ethers.getContractAt(QuoterABI, quoterAddress)

    const encodedPath = ethers.utils.solidityPack(pathType, path)

    const amountOut = await quoterContract.callStatic.quoteExactInput(
        encodedPath,
        amountIn
    )
    return amountOut
}
