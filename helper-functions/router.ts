import { spotPricePromise } from "./dev-tools/spot-price-promises"
import { tokenDecimals } from "./dev-tools/token-name-address-conversion"

import BigNumber from "bignumber.js"
import { ethers } from "ethers"

export const routingPathMaker = function (
    baseToken: string,
    quoteToken: string
) {}

/**
 * @dev This function give the path and amounts
 * @param baseToken The base token
 * @param quoteToken The quote token
 * @notice the tokens list can be both token symbol or token address
 * @notice this function has 18 decimals precision
 * @return path for the base token to quote token and amounts
 */
const firstPartOfPath = async function (baseToken: string, quoteToken: string) {
    let price: Object = await spotPricePromise("weth", "usdc"),
        averagePriceV2: ethers.BigNumber,
        resBase: ethers.BigNumber = ethers.BigNumber.from(0),
        resQuote: ethers.BigNumber = ethers.BigNumber.from(0),
        path: string[]

    const baseDecimal = ethers.BigNumber.from(tokenDecimals(baseToken)),
        quoteDecimal = ethers.BigNumber.from(tokenDecimals(quoteToken)),
        ten = ethers.BigNumber.from(10)

    for (const value of Object.values(price)) {
        if (value.length > 1) {
            resBase = resBase.add(value[1])
            resQuote = resQuote.add(value[2])
        }
    }

    averagePriceV2 = resQuote
        .mul(ten.pow(ethers.BigNumber.from(18)))
        .mul(ten.pow(baseDecimal))
        .div(resBase)
        .div(ten.pow(quoteDecimal))

    for (const [key, value] of Object.entries(price)) {
        if (averagePriceV2.gt(value[0])) continue
        if (value.length > 1) {
        }
    }
}

/**
 * @dev This function will calculate the input amount from uniSwap v2 pool
 * @param resX The reserve of the pair for the input token
 * @param resY The reserve of the pair for the output token
 * @param targetPrice The target price for which looking for input amount
 * @param fee The fee need to be paid to the pool. ex. 3 (0.03%)
 * @return The input amount needed for the trade amount from the pool
 */
function uniSwapV2GetAmountIn(
    resX: ethers.BigNumber,
    resY: ethers.BigNumber,
    targetPrice: ethers.BigNumber,
    fee: number
): ethers.BigNumber {
    const C: ethers.BigNumber = ethers.BigNumber.from(10000 + fee)
    const feeBase: ethers.BigNumber = ethers.BigNumber.from("10000")

    const resXInside = convertToBignumber(resX),
        resYInside = convertToBignumber(resY),
        targetPriceInside = convertToBignumber(targetPrice)

    const dxInside = targetPriceInside
        .multipliedBy(resYInside.multipliedBy(resXInside))
        .sqrt()
        .minus(targetPriceInside.multipliedBy(resXInside))
        .div(targetPriceInside)

    const dx = convertToEther(dxInside)

    return dx
}

function convertToBignumber(etherBig: ethers.BigNumber): BigNumber {
    let str = etherBig.toString()
    return new BigNumber(str)
}

function convertToEther(bigNum: BigNumber): ethers.BigNumber {
    let str = bigNum.toString()
    str = str.split(".")[0]
    return ethers.BigNumber.from(str)
}
