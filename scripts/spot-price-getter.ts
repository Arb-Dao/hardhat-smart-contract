import { spotPricePromise } from "../helper-functions/dev-tools/spot-price-promises"
import { BigNumber } from "ethers"
import { tokenDecimals } from "../helper-functions/dev-tools/token-name-address-conversion"

const main = async function () {
    const baseToken = "weth",
        quoteToken = "usdt"
    let price: Object = await spotPricePromise(baseToken, quoteToken),
        averagePriceV2: BigNumber,
        resBase: BigNumber = BigNumber.from(0),
        resQuote: BigNumber = BigNumber.from(0)

    const baseDecimal = BigNumber.from(tokenDecimals(baseToken)),
        quoteDecimal = BigNumber.from(tokenDecimals(quoteToken)),
        ten = BigNumber.from(10)

    for (const [key, value] of Object.entries(price)) {
        console.log(key, value.toString())
        if (value.length > 1) {
            resBase = resBase.add(value[1])
            resQuote = resQuote.add(value[2])
        }
    }

    averagePriceV2 = resQuote
        .mul(ten.pow(BigNumber.from(18)))
        .mul(ten.pow(baseDecimal))
        .div(resBase)
        .div(ten.pow(quoteDecimal))

    console.log(`The average price is : ${averagePriceV2.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
