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
import blackListJson from "../blacklist-lowbalance.json"
import noPairFoundJson from "../no-pair-found.json"
import ArbsInfoJson from "../ArbsInfo.json"

const main = async function () {
    // const pairContract = (await ethers.getContractAt(
    //     "IUniswapV2Pair",
    //     "0xA3F74a4D794be005C7D92Ef1739BfcC4C84eA5A7"
    // )) as IUniswapV2Pair
    // // let [resX, resY] = await pairContract.getReserves()
    // let [resY, resX] = await pairContract.getReserves()

    // const fee: number = 30,
    //     dx: BigNumber = ethers.BigNumber.from("54234")

    // const result = uniSwapV2GetAmountOut(resX, resY, fee, dx)
    // console.log({
    //     ReserveIn: resX.toString(),
    //     ReserveOut: resY.toString(),
    //     AmountIn: dx.toString(),
    //     AmountOut: result.toString(),
    // })

    // resX.toString()
    // resY.toString()
    // dx.toString()
    // result.toString()

    /* _______________________________________________________ */

    // const pair1 = (await ethers.getContractAt(
    //     "IUniswapV2Pair",
    //     "0xA3F74a4D794be005C7D92Ef1739BfcC4C84eA5A7"
    // )) as IUniswapV2Pair
    // const pair2 = (await ethers.getContractAt(
    //     "IUniswapV2Pair",
    //     "0xA2C85152AC8a19034cB93E2A0b4B847421c7F919"
    // )) as IUniswapV2Pair

    // // let [resX1, resY1] = await pair1.getReserves()
    // // let [resX2, resY2] = await pair2.getReserves()
    // let [resY1, resX1] = await pair1.getReserves()
    // let [resY2, resX2] = await pair2.getReserves()
    // const c1: number = 30
    // const c2: number = 30

    // // const resX1: BigNumber = ethers.BigNumber.from("10000"),
    // //     resY1: BigNumber = ethers.BigNumber.from("50000"),
    // // c1: number = 3
    // //     resX2: BigNumber = ethers.BigNumber.from("10000"),
    // //     resY2: BigNumber = ethers.BigNumber.from("45000"),
    // // c2: number = 1
    // const [dxIn, dxOut, benefit] = uniSwapV2pairs_single(
    //     resX1,
    //     resY1,
    //     c1,
    //     resX2,
    //     resY2,
    //     c2
    // )

    // const amountOut1 = uniSwapV2GetAmountOut(resX1, resY1, c1, dxIn)
    // const amountOut2 = uniSwapV2GetAmountOut(resY2, resX2, c2, amountOut1)

    // console.log({
    //     pair1: pair1.address,
    //     pair2: pair2.address,
    //     ReserveIn1: resX1.toString(),
    //     ReserveOut1: resY1.toString(),
    //     ReserveIn2: resY2.toString(),
    //     ReserveOut2: resX2.toString(),
    //     amountIn: dxIn.toString(),
    //     amountout1: amountOut1.toString(),
    //     amountout2: amountOut2.toString(),
    //     expectedAmountout: dxOut.toString(),
    //     expectedBenefit: benefit.toString(),
    // })

    // console.log(
    //     (await priceConvertor(networkConfig[137].AaveV3.addresses[4].name)).toString()
    // )
    // console.log(noPairFoundJson.length);
    // console.log(blackListJson.length);


    // let totalGas: number = 0
    // for (let i = 0; i < ArbsInfoJson.length; i++) {
    //     totalGas += Number(ArbsInfoJson[i].gasUsed)
    // }
    // let averageGasLimit = totalGas / ArbsInfoJson.length
    // console.log(averageGasLimit);
    
    // console.log(
    //     ((totalGas / ArbsInfoJson.length) * Number(ArbsInfoJson[1].gasPrice))
    // )
    // const averageGasLimit1 = ethers.BigNumber.from("317232")
    // const gasPrice = ethers.utils.parseUnits("34", "gwei")
    // const estimatedGasCost = averageGasLimit1.mul(gasPrice)
    // console.log(estimatedGasCost.toString())

    console.log(UniV2PairsInfo[11].swapName);
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })