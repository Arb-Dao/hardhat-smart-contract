import { IUniswapV2Pair, IERC20, MyArb } from "../typechain-types/"
import { networkConfig } from "../helper-hardhat-config"
import { ethers, network } from "hardhat"
import {
    uniSwapV2GetAmountOut,
    uniSwapV2pairs_single,
} from "../uniswapv2-helper"
import UniV2PairsInfo from "../UniV2PairsInfo.json"
import arbJson from "../ArbsInfo.json"
import fs from "fs"

const main = async () => {
    let arbInfo: any[] = arbJson
    let abiCoder = new ethers.utils.AbiCoder()

    /* getting already deployed contract */
    // const deployer = (await ethers.getSigners())[0]
    // console.log(`Connected with ${deployer.address}`)

    // const myArb = await ethers.getContract("MyArb", deployer)

    // /*  Deployements */
    const address = "0x066e7a421Fdd36f2263938aB328D8b2F09d9fCE0"
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address],
    })
    await network.provider.send("hardhat_setBalance", [
        address,
        "0x3635C9ADC5DEAFFFFF",
    ])
    const deployer = await ethers.getSigner(address)
    const myArb = await ethers.getContractAt(
        "MyArb",
        "0xF122e47246a8A4E84f6AA11310163C2B7bc39699",
        deployer
    )

    // const MyArbContractFactory = await ethers.getContractFactory("MyArb", deployer)
    // const args: any = networkConfig[137].AaveV3.poolAddressesProvider
    // const myArb = (await MyArbContractFactory.deploy(args)) as MyArb
    // await myArb.deployed()
    // const txReceipt = await myArb.deployTransaction.wait()
    // const gasUsed = (await txReceipt).gasUsed
    // const gasPrice = (await txReceipt).effectiveGasPrice
    // const gasCost = gasUsed.mul(gasPrice)
    // console.log(`Deployment Gas cost cost ${gasCost} `)
    // const depToJson = {
    //     deployment: "deployed",
    //     gasUsed: gasUsed.toString(),
    //     gasPrice: gasPrice.toString(),
    //     gasCost: gasCost.toString(),
    // }
    // arbInfo.push(depToJson)

    /* Job */
    while (true) {
        for (let i = 0 /* capture the swap */; i < UniV2PairsInfo.length; i++) {
            const C3 = networkConfig[137].UniswapV2[i].Fee
            for (
                let ii = 0 /* capture pair in swap[i] */;
                ii < UniV2PairsInfo[i].pairs.length;
                ii++
            ) {
                console.log(`Checking for ${UniV2PairsInfo[i].pairs[ii].name}`)
                /* __________ getting pair interface __________ */
                const pair1 = (await ethers.getContractAt(
                    "IUniswapV2Pair",
                    UniV2PairsInfo[i].pairs[ii].address,
                    deployer
                )) as IUniswapV2Pair

                const token0 = (await ethers.getContractAt(
                    "IERC20",
                    UniV2PairsInfo[i].pairs[ii].token0,
                    deployer
                )) as IERC20

                const token1 = (await ethers.getContractAt(
                    "IERC20",
                    UniV2PairsInfo[i].pairs[ii].token1,
                    deployer
                )) as IERC20
                for (
                    let j = 0 /* capture the swap */;
                    j < UniV2PairsInfo.length;
                    j++
                ) {
                    if (j === i) continue /* skip the swap i, duplicate */
                    const C6 = networkConfig[137].UniswapV2[j].Fee
                    for (
                        let jj = 0 /* capture pair in swap[j] */;
                        jj < UniV2PairsInfo[j].pairs.length;
                        jj++
                    ) {
                        if (
                            (UniV2PairsInfo[i].pairs[ii].token0 ===
                                UniV2PairsInfo[j].pairs[jj].token0 &&
                                UniV2PairsInfo[i].pairs[ii].token1 ===
                                    UniV2PairsInfo[j].pairs[jj].token1) ||
                            (UniV2PairsInfo[i].pairs[ii].token0 ===
                                UniV2PairsInfo[j].pairs[jj].token1 &&
                                UniV2PairsInfo[i].pairs[ii].token1 ===
                                    UniV2PairsInfo[j].pairs[jj].token0)
                        ) {
                            console.log(
                                `Checking opportunity from ${UniV2PairsInfo[i].swapName} to ${UniV2PairsInfo[j].swapName}`
                            )

                            /* __________ getting pair interface __________ */
                            const pair2 = (await ethers.getContractAt(
                                "IUniswapV2Pair",
                                UniV2PairsInfo[j].pairs[jj].address,
                                deployer
                            )) as IUniswapV2Pair

                            const [C1, C2] = await pair1.getReserves()
                            const [C4, C5] = await pair2.getReserves()

                            let dx: ethers.BigNumber,
                                W: ethers.BigNumber,
                                B: ethers.BigNumber,
                                zeroToOne: boolean
                            if (
                                UniV2PairsInfo[i].pairs[ii].token0 ===
                                    UniV2PairsInfo[j].pairs[jj].token0 &&
                                UniV2PairsInfo[i].pairs[ii].token1 ===
                                    UniV2PairsInfo[j].pairs[jj].token1
                            ) {
                                ;[dx, W, B] = uniSwapV2pairs_single(
                                    C1,
                                    C2,
                                    C3,
                                    C4,
                                    C5,
                                    C6
                                )
                                zeroToOne = false
                                if (!W.lt(C4)) continue
                            } else if (
                                UniV2PairsInfo[i].pairs[ii].token0 ===
                                    UniV2PairsInfo[j].pairs[jj].token1 &&
                                UniV2PairsInfo[i].pairs[ii].token1 ===
                                    UniV2PairsInfo[j].pairs[jj].token0
                            ) {
                                ;[dx, W, B] = uniSwapV2pairs_single(
                                    C1,
                                    C2,
                                    C3,
                                    C5,
                                    C4,
                                    C6
                                )
                                zeroToOne = true
                                if (!W.lt(C5)) continue
                            } else {
                                continue
                            }

                            const amountOut1 = uniSwapV2GetAmountOut(
                                C1,
                                C2,
                                C3,
                                dx
                            )

                            if (
                                dx.gt(0) &&
                                // B.gte(ethers.BigNumber.from("1000000")) &&
                                B.gte(ethers.BigNumber.from("0")) &&
                                dx.lte(C1) &&
                                amountOut1.lt(C2) &&
                                amountOut1.lte(C5) &&
                                !amountOut1.isZero()
                            ) {
                                try {
                                    console.log(
                                        `Arbitrage opportunity found from ${UniV2PairsInfo[i].swapName} to ${UniV2PairsInfo[j].swapName}`
                                    )
                                    const arbInside1 = {
                                        fromExtoEx:
                                            UniV2PairsInfo[i].swapName +
                                            " - " +
                                            UniV2PairsInfo[j].swapName,
                                        fromPairToPair:
                                            UniV2PairsInfo[i].pairs[ii].name +
                                            " - " +
                                            UniV2PairsInfo[j].pairs[jj].name,
                                        input: dx.toString(),
                                    }
                                    console.log(arbInside1)

                                    /* Execution of swap */
                                    const swapInp1 = [
                                        dx,
                                        amountOut1,
                                        true,
                                        UniV2PairsInfo[i].pairs[ii].address,
                                    ]

                                    let amountOut2: ethers.BigNumber
                                    if (!zeroToOne) {
                                        amountOut2 = uniSwapV2GetAmountOut(
                                            C5,
                                            C4,
                                            C6,
                                            amountOut1
                                        )
                                    } else {
                                        amountOut2 = uniSwapV2GetAmountOut(
                                            C4,
                                            C5,
                                            C6,
                                            amountOut1
                                        )
                                    }

                                    const swapInp2 = [
                                        amountOut1,
                                        amountOut2,
                                        zeroToOne,
                                        UniV2PairsInfo[j].pairs[jj].address,
                                    ]

                                    const swapParam = abiCoder.encode(
                                        [
                                            "uint8",
                                            "tuple(uint256, uint256, bool, address)",
                                            "tuple(uint256, uint256, bool, address)",
                                        ],
                                        [2, swapInp1, swapInp2]
                                    )

                                    const txResponse =
                                        await myArb.aaveFlashLoanV3(
                                            token0.address,
                                            dx,
                                            swapParam
                                        )

                                    const txReceipt = txResponse.wait()
                                    const gasUsed = (await txReceipt).gasUsed
                                    const gasPrice = (await txReceipt)
                                        .effectiveGasPrice
                                    const gasCost = gasUsed.mul(gasPrice)
                                    const arbInside = {
                                        fromExtoEx:
                                            UniV2PairsInfo[i].swapName +
                                            " - " +
                                            UniV2PairsInfo[j].swapName,
                                        fromPairToPair:
                                            UniV2PairsInfo[i].pairs[ii].name +
                                            " - " +
                                            UniV2PairsInfo[j].pairs[jj].name,
                                        input: dx.toString(),
                                        output: amountOut2.toString(),
                                        calcBenefit: B.toString(),
                                        gasUsed: gasUsed.toString(),
                                        gasPrice: gasPrice.toString(),
                                        gasCost: gasCost.toString(),
                                    }
                                    console.log(arbInside)
                                    arbInfo.push(arbInside)
                                    /* __________ export to Json parts __________ */
                                    const jsonDataString =
                                        JSON.stringify(arbInfo)
                                    fs.writeFileSync(
                                        "ArbsInfo.json",
                                        jsonDataString,
                                        {
                                            encoding: "utf8",
                                        }
                                    )
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
