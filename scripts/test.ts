import { tokenNameAddressConvertor } from "../helper-functions/token-name-address-conversion"
import {
    uniswapV2Quoter,
    uniswapV3Quoter,
} from "../helper-functions/uniswap-helper"
import { ethers } from "ethers"

const main = async function () {
    // const a = await uniswapV2Quoter(
    //     ethers.BigNumber.from("100000000"),
    //     ["usdt", "usdc", "usdt"],
    //     "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
    // )

    const fee: number = 3000
    const a = await uniswapV3Quoter(
        ethers.BigNumber.from("100000000"),
        ["usdt", fee, "weth"],
        "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
    )
    console.log(a)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
