import { AggregatorV3Interface, IERC20 } from "./typechain-types/"
import { ethers } from "hardhat"
import { BigNumber } from "ethers"

export const priceConvertor = async function (tokenName: string) {
    /* DPI is in eths */
    const addresses = {
        WMATIC: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
        MATICX: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
        STMATIC: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
        DAI: "0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D",
        USDC: "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7",
        USDT: "0x0A6513e40db6EB1b165753AD52E80663aeA50545",
        WETH: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        WBTC: "0xc907E116054Ad103354f2D350FD2514433D57F6f",
        SUSHI: "0x49B0c695039243BBfEb8EcD054EB70061fd54aa0",
        LINK: "0xd9FFdb71EbE7496cC440152d43986Aae0AB76665",
        GHST: "0xDD229Ce42f11D8Ee7fFf29bDB71C7b81352e11be",
        DPI: "0xC70aAF9092De3a4E5000956E672cDf5E996B4610",
        CRV: "0x336584C8E6Dc19637A5b36206B1c79923111b405",
        BAL: "0xD106B538F2A868c28Ca1Ec7E298C3325E0251d66",
        MIMATIC: "0xd8d483d813547CfB624b8Dc33a00F2fcbCd2D428",
        JEUR: "0x9b88d07B2354eF5f4579690356818e07371c7BeD",
        EURS: "0x9b88d07B2354eF5f4579690356818e07371c7BeD",
        AGEUR: "0x9b88d07B2354eF5f4579690356818e07371c7BeD",
        AAVE: "0x72484B12719E23115761D5DA1646945632979bB6",
    }

    let tokenAddress: string
    for (const [tkName, tkAddrress] of Object.entries(addresses)) {
        if (tokenName.toUpperCase() === tkName) {
            tokenAddress = tkAddrress
        }
    }

    const baseTokenPriceContract = (await ethers.getContractAt(
        "AggregatorV3Interface",
        tokenAddress!
    )) as AggregatorV3Interface

    const precisionBaseNum = await baseTokenPriceContract.decimals()
    const precisionBase = ethers.BigNumber.from(precisionBaseNum)
    let [, priceBase, , ,] = await baseTokenPriceContract.latestRoundData()

    const wmaticPriceContract = (await ethers.getContractAt(
        "AggregatorV3Interface",
        "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"
    )) as AggregatorV3Interface
    const precisionWmatic = ethers.BigNumber.from("8")
    const ten = ethers.BigNumber.from("10")
    const eighteen = ethers.BigNumber.from("18")
    if (tokenName == "DPI") {
        const WethPriceContract = (await ethers.getContractAt(
            "AggregatorV3Interface",
            "0xF9680D99D6C9589e2a93a78A04A279e509205945"
        )) as AggregatorV3Interface
        const precisionWeth = ethers.BigNumber.from("8")
        const [, priceWmatic, , ,] = await wmaticPriceContract.latestRoundData()
        const [, priceWeth, , ,] = await WethPriceContract.latestRoundData()

        priceBase = priceBase
            .mul(priceWeth)
            .div(ten.pow(precisionWeth))
            .div(priceWmatic)
            .mul(ten.pow(precisionWmatic))

        return priceBase
    }

    const [, priceWmatic, , ,] = await wmaticPriceContract.latestRoundData()
    priceBase = priceBase
        .div(priceWmatic)
        .mul(ten.pow(precisionWmatic))
        .mul(ten.pow(eighteen.sub(precisionBase)))

    return priceBase
}
