import exchangesV2CompatibleJSON from "../json-files/exchanges-uniswap-v2-compatible.json"
import exchangesV3CompatibleJSON from "../json-files/exchanges-uniswap-v3-compatible.json"
import uniswapV2PairsJSON from "../json-files/uniswap-v2-pairs.json"
import uniswapV3PairsJSON from "../json-files/uniswap-v3-pairs.json"

import { uniswapV2SpotPrice, uniswapV3SpotPrice } from "../uniswap-helper"
import { tokenNameAddressConvertor } from "./token-name-address-conversion"

/**
 * @dev The promise to get spot price of exchanges at once.
 * @param baseToken The base token address to get the price for
 * @param quoteToken The quote token to get the price for
 * @return List of objects with the name of exchange and the prices
 */
export const spotPricePromise = function (
    baseToken: string,
    quoteToken: string
) {
    return new Promise<Object>(async (resolve) => {
        let pricesObj: any = {}
        let baseTokenSymbol = baseToken,
            quoteTokenSymbol = quoteToken
        if (baseToken.length === 42) {
            baseTokenSymbol = tokenNameAddressConvertor(baseToken)
            quoteTokenSymbol = tokenNameAddressConvertor(quoteToken)
        }

        let pairName: string = `${baseTokenSymbol.toUpperCase()}-${quoteTokenSymbol.toUpperCase()}`,
            mirrorPairName: string = `${quoteTokenSymbol.toUpperCase()}-${baseTokenSymbol.toUpperCase()}`

        for (let i = 0; i < exchangesV2CompatibleJSON.length; i++) {
            const factoryAddress = exchangesV2CompatibleJSON[i].Factory

            if (
                uniswapV2PairsJSON[i].pairs[pairName] !== undefined ||
                uniswapV2PairsJSON[i].pairs[mirrorPairName] !== undefined
            ) {
                pricesObj[exchangesV2CompatibleJSON[i].name] =
                    await uniswapV2SpotPrice(
                        baseToken,
                        quoteToken,
                        factoryAddress
                    )
            }
        }

        for (let i = 0; i < exchangesV3CompatibleJSON.length; i++) {
            const factoryAddress = exchangesV3CompatibleJSON[i].Factory
            const feesV3 = [100, 500, 3000, 10000]
            for (const fee of feesV3) {
                pairName = `${baseTokenSymbol.toUpperCase()}-${quoteTokenSymbol.toUpperCase()}-${fee}`
                mirrorPairName = `${quoteTokenSymbol.toUpperCase()}-${baseTokenSymbol.toUpperCase()}-${fee}`

                if (
                    uniswapV3PairsJSON[i].pairs[pairName] !== undefined ||
                    uniswapV3PairsJSON[i].pairs[mirrorPairName] !== undefined
                ) {
                    const priceV3 = await uniswapV3SpotPrice(
                        baseToken,
                        quoteToken,
                        factoryAddress
                    )
                    for (const [key, value] of Object.entries(priceV3)) {
                        pricesObj[
                            `${exchangesV3CompatibleJSON[i].name}-${key}`
                        ] = value
                    }
                    break
                }
            }
        }

        resolve(pricesObj)
    })
}
