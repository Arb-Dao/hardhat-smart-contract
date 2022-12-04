import UniswapV2Router02 from "../node_modules/@uniswap/v2-periphery/build/IUniswapV2Router02.json"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"
import { tokenNameAddressConvertor } from "./token-name-address-conversion"

/**
 * @dev This function will fetch the price on chain
 * @param amountIn The input amount to the router.
 * @param tokens List of tokens in direction of swap. Starting from token0 to token1. ex. USDT - USDC - WETH - WBTC
 * @param routerAddress The address of the desired router. ex. quickSwap, sushiSwap, etc.
 * @notice the tokens list can be both token symbol or token address
 * @return The array of expected output amount from the swap.
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
    console.log(tokens)

    const routerContract = await ethers.getContractAt(
        UniswapV2Router02.abi,
        routerAddress
    )

    const amountsOut: BigNumber[] = await routerContract.getAmountsOut(amountIn, tokens)
    return amountsOut
}
