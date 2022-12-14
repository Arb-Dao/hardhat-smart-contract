import { spotPricePromise } from "./dev-tools/spot-price-promises"
import {
    tokenDecimals,
    tokenNameAddressConvertor,
} from "./dev-tools/token-name-address-conversion"
import uniswapV2CompatibleJSON from "./json-files/exchanges-uniswap-v2-compatible.json"

import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import fs from "fs"
import { uniswapV2Quoter } from "./uniswap-helper"

const runArb = async function () {
    while (true) {}
}

/**
 * @dev This function give the path and amounts
 * @param path String of token which you want to do swap
 * @notice the tokens list can be both token symbol or token address
 * @notice this function has 18 decimals precision
 * @return path for the base token to quote token and amounts
 */
export const routingPathMaker = async function (path: string[]) {
    let frontEndOutput: any = {},
        insidePath: any = {},
        amountLeft: ethers.BigNumber = ethers.BigNumber.from("0"),
        tokenLeft: ethers.BigNumber = ethers.BigNumber.from("0"),
        totalIn: ethers.BigNumber = ethers.BigNumber.from("0")

    let baseDecimal = ethers.BigNumber.from(tokenDecimals(path[0]))
    if (path[0].length === 42) {
        for (let ii = 0; ii < path.length; ii++) {
            path[ii] = tokenNameAddressConvertor(path[ii])
        }
    }
    let result = await firstPartOfPath(path[0], path[1])
    insidePath[`from`] = path[0]
    insidePath[`to`] = path[1]
    for (let j = 0; j < result.length; j += 4) {
        for (let jj = 0; jj < uniswapV2CompatibleJSON.length; jj++) {
            if (uniswapV2CompatibleJSON[jj].RouterV02 === result[j + 2]) {
                insidePath[`${uniswapV2CompatibleJSON[jj].name}`] =
                    ethers.BigNumber.from(result[j + 3])
                        .mul(ethers.BigNumber.from("10").pow(baseDecimal))
                        .div(
                            ethers.BigNumber.from("10").pow(
                                ethers.BigNumber.from("18")
                            )
                        )
                        .toString()
                const tokenOut = await uniswapV2Quoter(
                    ethers.BigNumber.from(result[j + 3])
                        .mul(ethers.BigNumber.from("10").pow(baseDecimal))
                        .div(
                            ethers.BigNumber.from("10").pow(
                                ethers.BigNumber.from("18")
                            )
                        ),
                    [path[0], path[1]],
                    [result[j + 2]]
                )
                totalIn = totalIn.add(
                    ethers.BigNumber.from(result[j + 3])
                        .mul(ethers.BigNumber.from("10").pow(baseDecimal))
                        .div(
                            ethers.BigNumber.from("10").pow(
                                ethers.BigNumber.from("18")
                            )
                        )
                )
                tokenLeft = tokenLeft.add(tokenOut[0][tokenOut[0].length - 1])
                insidePath["TotalIn"] = totalIn.toString()
                insidePath["TotalOut"] = tokenLeft.toString()
            }
        }
    }

    frontEndOutput[`path_${0}`] = insidePath
    // console.log(insidePath)

    /* __________ export to Json parts __________ */
    const jsonDataString = JSON.stringify(frontEndOutput)
    fs.writeFileSync(
        "./helper-functions/json-files/output-for-front-end.json",
        jsonDataString,
        {
            encoding: "utf8",
        }
    )

    for (let i = 1; i < path.length - 1; i++) {
        insidePath = {}
        amountLeft = tokenLeft
        tokenLeft = ethers.BigNumber.from("0")
        totalIn = ethers.BigNumber.from("0")
        const baseDecimal = ethers.BigNumber.from(tokenDecimals(path[i]))
        if (path[1].length === 42) {
            for (let ii = 0; ii < path.length; ii++) {
                path[ii] = tokenNameAddressConvertor(path[ii])
            }
        }
        const result = await firstPartOfPath(path[i], path[i + 1])
        insidePath[`from`] = path[i]
        insidePath[`to`] = path[i + 1]
        for (let j = 0; j < result.length; j += 4) {
            for (let jj = 0; jj < uniswapV2CompatibleJSON.length; jj++) {
                if (uniswapV2CompatibleJSON[jj].RouterV02 === result[j + 2]) {
                    if (
                        amountLeft.gte(
                            ethers.BigNumber.from(result[j + 3])
                                .mul(
                                    ethers.BigNumber.from("10").pow(baseDecimal)
                                )
                                .div(
                                    ethers.BigNumber.from("10").pow(
                                        ethers.BigNumber.from("18")
                                    )
                                )
                        )
                    ) {
                        insidePath[`${uniswapV2CompatibleJSON[jj].name}`] =
                            ethers.BigNumber.from(result[j + 3])
                                .mul(
                                    ethers.BigNumber.from("10").pow(baseDecimal)
                                )
                                .div(
                                    ethers.BigNumber.from("10").pow(
                                        ethers.BigNumber.from("18")
                                    )
                                )
                                .toString()
                        amountLeft = amountLeft.sub(
                            ethers.BigNumber.from(result[j + 3])
                                .mul(
                                    ethers.BigNumber.from("10").pow(baseDecimal)
                                )
                                .div(
                                    ethers.BigNumber.from("10").pow(
                                        ethers.BigNumber.from("18")
                                    )
                                )
                        )
                        const tokenOut = await uniswapV2Quoter(
                            ethers.BigNumber.from(result[j + 3])
                                .mul(
                                    ethers.BigNumber.from("10").pow(baseDecimal)
                                )
                                .div(
                                    ethers.BigNumber.from("10").pow(
                                        ethers.BigNumber.from("18")
                                    )
                                ),
                            [path[i], path[i + 1]],
                            [result[j + 2]]
                        )
                        totalIn = totalIn.add(
                            ethers.BigNumber.from(result[j + 3])
                                .mul(
                                    ethers.BigNumber.from("10").pow(baseDecimal)
                                )
                                .div(
                                    ethers.BigNumber.from("10").pow(
                                        ethers.BigNumber.from("18")
                                    )
                                )
                        )
                        tokenLeft = tokenLeft.add(
                            tokenOut[0][tokenOut[0].length - 1]
                        )
                    } else if (amountLeft.isZero()) {
                        break
                    } else {
                        insidePath[`${uniswapV2CompatibleJSON[jj].name}`] =
                            amountLeft.toString()

                        const tokenOut = await uniswapV2Quoter(
                            amountLeft,
                            [path[i], path[i + 1]],
                            [result[j + 2]]
                        )

                        amountLeft = ethers.BigNumber.from("0")
                        tokenLeft = tokenLeft.add(
                            tokenOut[0][tokenOut[0].length - 1]
                        )
                        totalIn = totalIn.add(
                            ethers.BigNumber.from(result[j + 3])
                                .mul(
                                    ethers.BigNumber.from("10").pow(baseDecimal)
                                )
                                .div(
                                    ethers.BigNumber.from("10").pow(
                                        ethers.BigNumber.from("18")
                                    )
                                )
                        )
                        tokenLeft = tokenLeft.add(
                            tokenOut[0][tokenOut[0].length - 1]
                        )
                        insidePath["TotalIn"] = totalIn.toString()
                        insidePath["TotalOut"] = tokenLeft.toString()
                    }
                }
            }
        }

        frontEndOutput[`path_${i}`] = insidePath
        // console.log(insidePath)
        console.log(frontEndOutput)

        /* __________ export to Json parts __________ */
        const jsonDataString = JSON.stringify(frontEndOutput)
        fs.writeFileSync(
            "./helper-functions/json-files/output-for-front-end.json",
            jsonDataString,
            {
                encoding: "utf8",
            }
        )
    }
}

/**
 * @dev This function give the path and amounts
 * @param baseToken The base token
 * @param quoteToken The quote token
 * @notice the tokens list can be both token symbol or token address
 * @notice this function has 18 decimals precision
 * @return path for the base token to quote token and amounts
 */
export const firstPartOfPath = async function (
    baseToken: string,
    quoteToken: string
) {
    if (baseToken.length !== 42) {
        baseToken = tokenNameAddressConvertor(baseToken)
        quoteToken = tokenNameAddressConvertor(quoteToken)
    }
    let price: Object = await spotPricePromise(baseToken, quoteToken),
        averagePriceV2: ethers.BigNumber,
        resBase: ethers.BigNumber = ethers.BigNumber.from(0),
        resQuote: ethers.BigNumber = ethers.BigNumber.from(0),
        pathV2: string[] = [],
        structV2: string[] = []

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

    // console.log(`average price is ${averagePriceV2.toString()}`)

    for (const [key, value] of Object.entries(price)) {
        if (value.length > 1) {
            if (averagePriceV2.gt(ethers.BigNumber.from(value[0]))) continue
            const targetPrice = ethers.BigNumber.from(value[0]).sub(
                averagePriceV2
            )
            // console.log(`price difference  of${key} is ${targetPrice}`)
            // console.log(`price of of${key} is ${value[0]}`)

            let router: string, fee: string
            for (let i = 0; i < uniswapV2CompatibleJSON.length; i++) {
                if (uniswapV2CompatibleJSON[i].name === key) {
                    router = uniswapV2CompatibleJSON[i].RouterV02
                    fee = uniswapV2CompatibleJSON[i].Fee.toString()
                    pathV2.push(baseToken, quoteToken)

                    structV2.push(
                        baseToken,
                        quoteToken,
                        router,
                        uniSwapV2GetAmountIn(
                            value[1].mul(
                                ten.pow(
                                    ethers.BigNumber.from("18").sub(baseDecimal)
                                )
                            ),
                            value[2].mul(
                                ten.pow(
                                    ethers.BigNumber.from("18").sub(
                                        quoteDecimal
                                    )
                                )
                            ),
                            averagePriceV2,
                            uniswapV2CompatibleJSON[i].Fee
                        ).toString()
                    )
                }
            }
        }
    }
    return structV2
}

/**
 * @dev This function will calculate the input amount from uniSwap v2 pool
 * @param resX The reserve of the pair for the input token
 * @param resY The reserve of the pair for the output token
 * @param targetPrice The target price for which looking for input amount
 * @param fee The fee need to be paid to the pool. ex. 3 (0.03%)
 * @return The input amount needed for the trade amount from the pool
 */
export function uniSwapV2GetAmountIn(
    resX: ethers.BigNumber,
    resY: ethers.BigNumber,
    targetPrice: ethers.BigNumber,
    fee: number
): ethers.BigNumber {
    const C: ethers.BigNumber = ethers.BigNumber.from(10000 + fee)
    const feeBase: ethers.BigNumber = ethers.BigNumber.from("10000")

    const resXInside = convertToBignumber(resX),
        resYInside = convertToBignumber(resY),
        targetPriceInside = convertToBignumber(targetPrice).div(10 ** 18)

    const dxInside = targetPriceInside
        .multipliedBy(resYInside.multipliedBy(resXInside))
        .sqrt()
        .minus(targetPriceInside.multipliedBy(resXInside))
        .div(targetPriceInside)

    const dx = convertToEther(dxInside)

    return dx.mul(C).div(feeBase)
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
