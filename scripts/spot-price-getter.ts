import { spotPricePromise } from "../helper-functions/dev-tools/spot-price-promises"

const main = async function () {
    let price: Object = await spotPricePromise("weth", "usdc")
    for (const [key, value] of Object.entries(price)) {
        console.log(key, value.toString())
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
