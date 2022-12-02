import { BigNumber } from "ethers"
import { ethers } from "hardhat"
import { IUniswapV2Pair } from "../typechain-types"
import {
    uniSwapV2pairs_single,
    uniSwapV2GetAmountOut,
} from "../uniswapv2-helper"

import UniV2PairsInfo from "../UniV2PairsInfo.json"
import { priceConvertor } from "../chainlink-price"
import { networkConfig } from "../helper-hardhat-config"

const main = async function () {
    // const pairContract = (await ethers.getContractAt(
    //     "IUniswapV2Pair",
    //     "0xedE04e0cD393A076C49DEB95D3686A52ccc49C71"
    // )) as IUniswapV2Pair
    // let [resX, resY] = await pairContract.getReserves()

    // const fee: number = 2,
    //     dx: BigNumber = ethers.BigNumber.from("100000000000000000000")

    // const result = uniSwapV2GetAmountOut(resX, resY, fee, dx)
    // console.log(resX.toString())
    // console.log(resY.toString())
    // console.log(dx.toString())
    // console.log(result.toString())

    /* _______________________________________________________ */

    // const pair1= (await ethers.getContractAt(
    //     "IUniswapV2Pair",
    //     "0xE8661Fd61A7154899545dC02B52E15d12377a764"
    // )) as IUniswapV2Pair
    // const pair2= (await ethers.getContractAt(
    //     "IUniswapV2Pair",
    //     "0xD20fC1D61CBae8332167a7346aB20360cf91763f"
    // )) as IUniswapV2Pair

    // let [resX1, resY1] = await pair1.getReserves()
    // let [resX2, resY2] = await pair2.getReserves()
    // const c1: number = 3
    // const c2: number = 1

    // const resX1: BigNumber = ethers.BigNumber.from("10000"),
    //     resY1: BigNumber = ethers.BigNumber.from("50000"),
    // c1: number = 3
    //     resX2: BigNumber = ethers.BigNumber.from("10000"),
    //     resY2: BigNumber = ethers.BigNumber.from("45000"),
    // c2: number = 1
    // const [dxIn, dxOut, benefit] = uniSwapV2pairs_single(
    //     resX1,
    //     resY1,
    //     c1,
    //     resX2,
    //     resY2,
    //     c2
    // )
    // console.log(`Amount in = ${dxIn.toString()}`);
    // console.log(`Amount out = ${dxOut.toString()}`);
    // console.log(`Benefit = ${benefit.toString()}`);
    // console.log(networkConfig[137].UniswapV2[17])
    // console.log(UniV2PairsInfo[17].pairs.length)
    console.log(
        (await priceConvertor("AAVE", ethers.utils.parseEther("1"))).toString()
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
