import exchangesV2CompatibleJSON from "../json-files/exchanges-uniswap-v2-compatible.json"
import uniswapV2PairsJSON from "../json-files/uniswap-v2-pairs.json"

import { uniswapV2SpotPrice } from "../uniswap-helper"
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

        const pairName: string = `${baseTokenSymbol.toUpperCase()}-${quoteTokenSymbol.toUpperCase()}`,
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

        resolve(pricesObj)
    })
}
