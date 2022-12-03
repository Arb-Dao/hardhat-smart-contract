import { IUniswapV2Pair, MyArb } from "../typechain-types/"
import IERC20 from "../IERC20.json"
import { networkConfig } from "../helper-hardhat-config"
import { ethers, network } from "hardhat"
import { BigNumber } from "ethers"
import {
    uniSwapV2GetAmountOut,
    uniSwapV2pairs_single,
} from "../uniswapv2-helper"
import UniV2PairsInfoJson from "../UniV2PairsInfo.json"
import arbJson from "../ArbsInfo.json"
import blackListJson from "../blacklist-lowbalance.json"
import noPairFoundJson from "../no-pair-found.json"
import fs from "fs"
import { priceConvertor } from "../chainlink-price"

const minBalances = [
    ethers.utils.parseEther("5") /* WMATIC: */,
    ethers.utils.parseEther("5") /* DAI */,
    ethers.BigNumber.from("5000000") /* USDC */,
    ethers.BigNumber.from("5000000") /* USDT */,
    ethers.utils.parseEther("0.00392") /* WETH */,
    ethers.utils.parseUnits("0.00029", "8") /* WBTC */,
    ethers.utils.parseEther("3.62598") /* SUSHI */,
    ethers.utils.parseEther("0.66886") /* LINK */,
    ethers.utils.parseEther("4.93955") /* GHST */,
    ethers.utils.parseEther("0.06991") /* DPI */,
    ethers.utils.parseEther("7.78049") /* CRV */,
    ethers.utils.parseEther("0.80359") /* BAL */,
    ethers.utils.parseEther("5") /* miMATIC */,
    ethers.utils.parseEther("5") /* jEUR */,
    ethers.utils.parseEther("5") /* EURS */,
    ethers.utils.parseEther("5") /* agEUR */,
    ethers.utils.parseEther("0.07783") /* Aave */,
    ethers.utils.parseEther("5") /* MaticX */,
    ethers.utils.parseEther("5") /* stMATIC */,
]

const main = async () => {
    const UniV2PairsInfo: any[] = UniV2PairsInfoJson
    let arbInfo: any[] = arbJson
    let blackListed: string[] = blackListJson
    let noPairFound: string[] = noPairFoundJson
    let abiCoder = new ethers.utils.AbiCoder()

    /* getting already deployed contract */
    const deployer = (await ethers.getSigners())[0]
    console.log(`Connected with ${deployer.address}`)

    const myArb = await ethers.getContract("MyArb", deployer)

    // /*  Deployements */
    // const address = "0x066e7a421Fdd36f2263938aB328D8b2F09d9fCE0"
    // await network.provider.request({
    //     method: "hardhat_impersonateAccount",
    //     params: [address],
    // })
    // await network.provider.send("hardhat_setBalance", [
    //     address,
    //     "0x3635C9ADC5DEAFFFFF",
    // ])
    // const deployer = await ethers.getSigner(address)
    // const myArb = (await ethers.getContractAt(
    //     "MyArb",
    //     "0xF122e47246a8A4E84f6AA11310163C2B7bc39699",
    //     deployer
    // )) as MyArb
    // console.log(`Connected with ${deployer.address}`)

    // const MyArbContractFactory = await ethers.getContractFactory(
    //     "MyArb",
    //     deployer
    // )
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
            if (i == 11) continue
            let zeroToOne1: boolean, zeroToOne2: boolean
            const C3 = networkConfig[137].UniswapV2[i].Fee
            for (
                let ii = 0 /* capture first pairs with asset [i] */;
                ii < networkConfig[137].AaveV3.addresses.length;
                ii++
            ) {
                console.log(
                    `Checking for ${networkConfig[137].AaveV3.addresses[ii].name} pairs`
                )
                const token0Contract = await ethers.getContractAt(
                    IERC20,
                    networkConfig[137].AaveV3.addresses[ii].address,
                    deployer
                )
                const baseTokenDecimal = await token0Contract.decimals()
                for (let iii = 0; iii < UniV2PairsInfo[i].pairs.length; iii++) {
                    if (
                        noPairFound.includes(
                            UniV2PairsInfo[i].pairs[iii].address
                        )
                    ) {
                        continue
                    }
                    if (
                        blackListed.includes(
                            UniV2PairsInfo[i].pairs[iii].address
                        )
                    ) {
                        continue
                    }

                    if (
                        networkConfig[137].AaveV3.addresses[ii].address ===
                        UniV2PairsInfo[i].pairs[iii].token0
                    ) {
                        zeroToOne1 = true
                        console.log("true")
                    } else if (
                        networkConfig[137].AaveV3.addresses[ii].address ===
                        UniV2PairsInfo[i].pairs[iii].token1
                    ) {
                        zeroToOne1 = false
                        console.log("false")
                    } else {
                        continue
                    }

                    /* check pairs balance and throw to black list */
                    const baseTokenBalance = await token0Contract.balanceOf(
                        UniV2PairsInfo[i].pairs[iii].address
                    )

                    if (baseTokenBalance.lt(minBalances[ii])) {
                        /* Case of [ii] as base token */
                        blackListed.push(UniV2PairsInfo[i].pairs[iii].address)
                        console.log(
                            `${UniV2PairsInfo[i].pairs[iii].address} is now in blacklist !!!`
                        )
                        continue
                    }

                    /* __________ export to Json parts __________ */
                    const jsonDataString = JSON.stringify(blackListed)
                    fs.writeFileSync(
                        "blacklist-lowbalance.json",
                        jsonDataString,
                        {
                            encoding: "utf8",
                        }
                    )

                    /* __________ getting pair interface __________ */
                    const pair1 = (await ethers.getContractAt(
                        "IUniswapV2Pair",
                        UniV2PairsInfo[i].pairs[iii].address,
                        deployer
                    )) as IUniswapV2Pair

                    for (
                        let j = 0 /* capture the swap */;
                        j < UniV2PairsInfo.length;
                        j++
                    ) {
                        if (j === i) {
                            continue
                        } /* skip the swap i, duplicate */
                        if (j == 11) continue
                        const C6 = networkConfig[137].UniswapV2[j].Fee
                        for (
                            let jj = 0 /* capture pair in swap[j] */;
                            jj < UniV2PairsInfo[j].pairs.length;
                            jj++
                        ) {
                            if (
                                blackListed.includes(
                                    UniV2PairsInfo[j].pairs[jj].address
                                )
                            ) {
                                continue
                            }
                            if (
                                (UniV2PairsInfo[i].pairs[iii].token0 ===
                                    UniV2PairsInfo[j].pairs[jj].token0 &&
                                    UniV2PairsInfo[i].pairs[iii].token1 ===
                                        UniV2PairsInfo[j].pairs[jj].token1) ||
                                (UniV2PairsInfo[i].pairs[iii].token0 ===
                                    UniV2PairsInfo[j].pairs[jj].token1 &&
                                    UniV2PairsInfo[i].pairs[iii].token1 ===
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

                                /* check balances and throw zero balance to black list */
                                if (C1.isZero() || C2.isZero()) {
                                    /* Pair one zero balance */
                                    blackListed.push(pair1.address)
                                    console.log(
                                        `${pair1.address} is now in blacklist !!! (zero balance)`
                                    )
                                    continue
                                } else if (C4.isZero() || C5.isZero()) {
                                    blackListed.push(pair2.address)
                                    console.log(
                                        `${pair2.address} is now in blacklist !!! (zero balance)`
                                    )
                                    continue
                                }

                                /* __________ export to Json parts __________ */
                                const jsonDataString =
                                    JSON.stringify(blackListed)
                                fs.writeFileSync(
                                    "blacklist-lowbalance.json",
                                    jsonDataString,
                                    {
                                        encoding: "utf8",
                                    }
                                )

                                let dx: BigNumber, W: BigNumber, B: BigNumber
                                if (
                                    UniV2PairsInfo[i].pairs[iii].token0 ===
                                        UniV2PairsInfo[j].pairs[jj].token0 &&
                                    UniV2PairsInfo[i].pairs[iii].token1 ===
                                        UniV2PairsInfo[j].pairs[jj].token1 &&
                                    zeroToOne1 === true
                                ) {
                                    zeroToOne2 = false
                                    ;[dx, W, B] = uniSwapV2pairs_single(
                                        C1,
                                        C2,
                                        C3,
                                        C4,
                                        C5,
                                        C6
                                    )
                                    if (!W.lt(C4) || !dx.gt(0) || !dx.lte(C1)) {
                                        continue
                                    }
                                } else if (
                                    UniV2PairsInfo[i].pairs[iii].token0 ===
                                        UniV2PairsInfo[j].pairs[jj].token1 &&
                                    UniV2PairsInfo[i].pairs[iii].token1 ===
                                        UniV2PairsInfo[j].pairs[jj].token0 &&
                                    zeroToOne1 === true
                                ) {
                                    zeroToOne2 = true
                                    ;[dx, W, B] = uniSwapV2pairs_single(
                                        C1,
                                        C2,
                                        C3,
                                        C5,
                                        C4,
                                        C6
                                    )
                                    if (!W.lt(C5) || !dx.gt(0) || !dx.lte(C1)) {
                                        continue
                                    }
                                } else if (
                                    UniV2PairsInfo[i].pairs[iii].token0 ===
                                        UniV2PairsInfo[j].pairs[jj].token0 &&
                                    UniV2PairsInfo[i].pairs[iii].token1 ===
                                        UniV2PairsInfo[j].pairs[jj].token1 &&
                                    zeroToOne1 === false
                                ) {
                                    zeroToOne2 = true
                                    ;[dx, W, B] = uniSwapV2pairs_single(
                                        C2,
                                        C1,
                                        C3,
                                        C5,
                                        C4,
                                        C6
                                    )
                                    if (!W.lt(C5) || !dx.gt(0) || !dx.lte(C2)) {
                                        continue
                                    }
                                } else if (
                                    UniV2PairsInfo[i].pairs[iii].token0 ===
                                        UniV2PairsInfo[j].pairs[jj].token1 &&
                                    UniV2PairsInfo[i].pairs[iii].token1 ===
                                        UniV2PairsInfo[j].pairs[jj].token0 &&
                                    zeroToOne1 === false
                                ) {
                                    zeroToOne2 = false
                                    ;[dx, W, B] = uniSwapV2pairs_single(
                                        C2,
                                        C1,
                                        C3,
                                        C4,
                                        C5,
                                        C6
                                    )
                                    if (!W.lt(C4) || !dx.gt(0) || !dx.lte(C2)) {
                                        continue
                                    }
                                } else {
                                    continue
                                }

                                let amountOut1
                                if (zeroToOne1) {
                                    amountOut1 = uniSwapV2GetAmountOut(
                                        C1,
                                        C2,
                                        C3,
                                        dx
                                    )
                                    if (
                                        !amountOut1.lt(C2) ||
                                        amountOut1.isZero()
                                    )
                                        continue
                                } else {
                                    amountOut1 = uniSwapV2GetAmountOut(
                                        C2,
                                        C1,
                                        C3,
                                        dx
                                    )
                                    if (
                                        !amountOut1.lt(C1) ||
                                        amountOut1.isZero()
                                    )
                                        continue
                                }

                                if (
                                    // B.gte(BigNumber.from("1000000")) &&
                                    B.gte(BigNumber.from("0"))
                                ) {
                                    try {
                                        console.log(
                                            `Arbitrage opportunity found from ${UniV2PairsInfo[i].swapName} to ${UniV2PairsInfo[j].swapName}`
                                        )
                                        // const arbInside1 = {
                                        //     pair1: pair1.address,
                                        //     zeroToOne1: zeroToOne1,
                                        //     pair2: pair2.address,
                                        //     zeroToOne2: zeroToOne2,
                                        //     fromExtoEx:
                                        //         UniV2PairsInfo[i].swapName +
                                        //         " - " +
                                        //         UniV2PairsInfo[j].swapName,
                                        //     fromPairToPair:
                                        //         networkConfig[137].AaveV3
                                        //             .addresses[ii].name +
                                        //         " - " +
                                        //         UniV2PairsInfo[j].pairs[jj]
                                        //             .address,
                                        //     amountIn: dx.toString(),
                                        //     amountout1: amountOut1.toString(),
                                        //     expectedAmountout: W.toString(),
                                        //     expectedBenefit: B.toString(),
                                        // }
                                        // console.log(arbInside1)

                                        /* Execution of swap */
                                        const swapInp1 = [
                                            dx,
                                            amountOut1,
                                            zeroToOne1,
                                            UniV2PairsInfo[i].pairs[iii]
                                                .address,
                                        ]

                                        let amountOut2: BigNumber
                                        if (zeroToOne2) {
                                            amountOut2 = uniSwapV2GetAmountOut(
                                                C4,
                                                C5,
                                                C6,
                                                amountOut1
                                            )
                                        } else {
                                            amountOut2 = uniSwapV2GetAmountOut(
                                                C5,
                                                C4,
                                                C6,
                                                amountOut1
                                            )
                                        }
                                        const swapBenefit = amountOut2.sub(dx)
                                        const baseTokenPrice =
                                            await priceConvertor(
                                                networkConfig[137].AaveV3
                                                    .addresses[ii].name
                                            )
                                        const ten = ethers.BigNumber.from("10")
                                        const extimatedGasPrice =
                                            ethers.utils.parseUnits(
                                                "35",
                                                "gwei"
                                            )
                                        const estimatedGasLimit =
                                            ethers.BigNumber.from("318000")
                                        const estimatedGasCost =
                                            extimatedGasPrice.mul(
                                                estimatedGasLimit
                                            )
                                        const benefitInMatic = baseTokenPrice
                                            .mul(swapBenefit)
                                            .div(ten.pow(baseTokenDecimal))
                                        const afterGasBenefit = benefitInMatic
                                            .mul(ethers.BigNumber.from("5"))
                                            .div(ethers.BigNumber.from("10000"))
                                            .sub(estimatedGasCost)
                                        if (afterGasBenefit.lt(0)) {
                                            console.log(
                                                `Transaction not benefitial ${ethers.utils.formatEther(
                                                    afterGasBenefit
                                                )}`
                                            )
                                            continue
                                        }
                                        if (
                                            amountOut2.isZero() ||
                                            amountOut2.lte(dx)
                                        ) {
                                            console.log(
                                                `Amount out 2 is 0 so skiped`
                                            )
                                            continue
                                        }

                                        const swapInp2 = [
                                            amountOut1,
                                            amountOut2,
                                            zeroToOne2,
                                            UniV2PairsInfo[j].pairs[jj].address,
                                        ]

                                        console.log({ swapInp1, swapInp2 })

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
                                                networkConfig[137].AaveV3
                                                    .addresses[ii].address,
                                                dx,
                                                swapParam
                                            )

                                        const txReceipt = txResponse.wait()
                                        const gasUsed = (await txReceipt)
                                            .gasUsed
                                        const gasPrice = (await txReceipt)
                                            .effectiveGasPrice
                                        const gasCost = gasUsed.mul(gasPrice)
                                        const arbInside = {
                                            fromExtoEx:
                                                UniV2PairsInfo[i].swapName +
                                                " - " +
                                                UniV2PairsInfo[j].swapName,
                                            fromPairToPair:
                                                networkConfig[137].AaveV3
                                                    .addresses[ii].name +
                                                " - " +
                                                UniV2PairsInfo[j].pairs[jj]
                                                    .address,
                                            inputAmount: dx.toString(),
                                            outputAmount: amountOut2.toString(),
                                            calcBenefit: B.toString(),
                                            realizedBenefit:
                                                swapBenefit.toString(),
                                            benefitInMatic:
                                                benefitInMatic.toString(),
                                            benefitAfterGas:
                                                afterGasBenefit.toString(),
                                            gasUsed: gasUsed.toString(),
                                            gasPrice: gasPrice.toString(),
                                            gasCost: gasCost.toString(),
                                            estimatedGasCost:
                                                estimatedGasCost.toString(),
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
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
