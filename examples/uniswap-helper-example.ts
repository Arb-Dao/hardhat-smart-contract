import {
    uniswapV2Quoter,
    uniswapV2SpotPrice,
    uniswapV3Quoter,
    uniswapV3SpotPrice,
} from "../helper-functions/uniswap-helper"
import { ethers } from "ethers"

const main = async function () {
    /* Quoter V2 example */
    // const amountIn = ethers.BigNumber.from("1000000000000000000")
    // const pathV2 = ["weth", "usdt"]
    // const routerV2 = ["0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"]
    // const a = await uniswapV2Quoter(amountIn, pathV2, routerV2)
    // console.log(`Amount calculated by quoter v2 is ${a}`)
    // /* Spot price v2 example */
    // let baseToken = "weth",
    //     quoteToken = "usdt",
    //     factoryAddress = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"
    // let price = await uniswapV2SpotPrice(baseToken, quoteToken, factoryAddress)
    // console.log(
    //     `Te price calculated by Spot price for V2 compatible exchanges ${price}`
    // )
    /* Quoter V3 example */
    // const fee: number = 500
    // const pathV3 = [["weth", fee, "usdt"]]
    // const quoterV3 = ["0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"]
    // const b = await uniswapV3Quoter(amountIn, pathV3, quoterV3)
    // console.log(`Amount calculated by quoter v3 is ${b}`)
    // /* Spot price v3 example */
    // ;(baseToken = "weth"),
    //     (quoteToken = "usdt"),
    //     (factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984")
    // price = await uniswapV3SpotPrice(baseToken, quoteToken, factoryAddress)
    // console.log(
    //     `Te price calculated by Spot price for V3 compatible exchanges ${price[3000]}`
    // )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
