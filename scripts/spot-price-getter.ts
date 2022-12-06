import { uniswapV2SpotPrice } from "../helper-functions/uniswap-helper"


const main = async function () {
    let price: number[] = await ETH
    console.log(price)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
