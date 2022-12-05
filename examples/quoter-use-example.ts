import { tokenNameAddressConvertor } from "../helper-functions/token-name-address-conversion"
import {
    uniswapV2Quoter,
    uniswapV3Quoter,
} from "../helper-functions/uniswap-helper"
import { ethers } from "ethers"

const main = async function () {

    /* Quoter V2 example */
    const amountIn = ethers.BigNumber.from("100000000")
    const pathV2 = ["usdt", "usdc", "usdt"]
    const routerV2 = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
    const a = await uniswapV2Quoter(amountIn, pathV2, routerV2)
    console.log(`Amoutn calculated by quoter v2 is ${a}`)

    const fee: number = 100
    const pathV3 = ["usdt", fee, "usdc", fee, "usdt"]
    const quoterV3 = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
    const b = await uniswapV3Quoter(amountIn, pathV3, quoterV3)
    console.log(`Amoutn calculated by quoter v3 is ${b}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
