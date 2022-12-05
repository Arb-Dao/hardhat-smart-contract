import {
    uniswapV2Quoter,
    uniswapV3Quoter,
} from "../helper-functions/uniswap-helper"
import { ethers } from "ethers"

const main = async function () {
    /* Quoter V2 example */
    const amountIn = ethers.BigNumber.from("100000000")
    const pathV2 = ["usdt", "weth", "usdt"]
    const routerV2 = [
        "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
        "0x5C6EC38fb0e2609672BDf628B1fD605A523E5923",
    ]
    const a = await uniswapV2Quoter(amountIn, pathV2, routerV2)
    console.log(`Amount calculated by quoter v2 is ${a}`)

    /* Quoter V3 example */
    const fee: number = 3000
    const pathV3 = [["usdt", fee, "weth", fee, "usdt"]]
    const quoterV3 = ["0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"]
    const b = await uniswapV3Quoter(amountIn, pathV3, quoterV3)
    console.log(`Amount calculated by quoter v3 is ${b}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
