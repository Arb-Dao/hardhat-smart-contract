import { AggregatorV3Interface, IERC20 } from "./typechain-types/"
import { ethers } from "hardhat"
import { BigNumber } from 'bignumber.js';

const provider = ethers.getDefaultProvider("matic", {
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
    alchemy: process.env.ALCHEMY_API_KEY,
    pocket: process.env.POCKET_API_KEY,
})

export const main = async function (tokenName: string) {
    const addresses = [
        /*WMATIC:*/ "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
        /*DAI:*/ "0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D",
        /*USDC:*/ "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7",
        /*USDT:*/ "0x0A6513e40db6EB1b165753AD52E80663aeA50545",
        /*WETH:*/ "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        /*WBTC:*/ "0xc907E116054Ad103354f2D350FD2514433D57F6f",
        /*SUSHI:*/ "0x49B0c695039243BBfEb8EcD054EB70061fd54aa0",
        /*LINK:*/ "0xd9FFdb71EbE7496cC440152d43986Aae0AB76665",
        /*GHST:*/ "0xDD229Ce42f11D8Ee7fFf29bDB71C7b81352e11be",
        /*DPI:*/ "0xC70aAF9092De3a4E5000956E672cDf5E996B4610" /* eths */,
        /*CRV:*/ "0x336584C8E6Dc19637A5b36206B1c79923111b405",
        /*BAL:*/ "0xD106B538F2A868c28Ca1Ec7E298C3325E0251d66",
        /*miMATIC:*/ "0xd8d483d813547CfB624b8Dc33a00F2fcbCd2D428",
        /*jEUR:*/ "0x9b88d07B2354eF5f4579690356818e07371c7BeD",
        /*EURS:*/ "0x9b88d07B2354eF5f4579690356818e07371c7BeD",
        /*agEUR:*/ "0x9b88d07B2354eF5f4579690356818e07371c7BeD",
    ]
    let tokenAddress: string
    if (tokenName == "WMATIC") {
        tokenAddress = addresses[0]
    } else if (tokenName == "WETH") {
        tokenAddress = addresses[4]
    } else if (tokenName == "WBTC") {
        tokenAddress = addresses[5]
    } else if (tokenName == "SUSHI") {
        tokenAddress = addresses[6]
    } else if (tokenName == "LINK") {
        tokenAddress = addresses[7]
    } else if (tokenName == "GHST") {
        tokenAddress = addresses[8]
    } else if (tokenName == "DPI") {
        tokenAddress = addresses[9]
    } else if (tokenName == "CRV") {
        tokenAddress = addresses[10]
    } else if (tokenName == "BAL") {
        tokenAddress = addresses[11]
    } else if (tokenName == "miMATIC") {
        tokenAddress = addresses[12]
    } else if (tokenName == "jEUR") {
        tokenAddress = addresses[13]
    } else if (tokenName == "EURS") {
        tokenAddress = addresses[14]
    } else {
        tokenAddress = addresses[15]
    }

    const linkPriceContract = (await ethers.getContractAt(
        "AggregatorV3Interface",
        tokenAddress,
        provider
    )) as AggregatorV3Interface

    let [, price, , ,] = await linkPriceContract.latestRoundData()

    if (tokenName == "DPI") {
        const linkPriceContract1 = await ethers.getContractAt(
            "AggregatorV3Interface",
            "0xF9680D99D6C9589e2a93a78A04A279e509205945",
            provider
        )
        let [, price1, , ,] = linkPriceContract1.latestRoundData()
        price = price.mul(price1).div(ethers.BigNumber.from("100000000"))
    }
    price = price.div(ethers.BigNumber.from("100000000"))

    const tokenIERC20 = await ethers.getContractAt("IERC20", tokenAddress, provider) as IERC20
    const decimals = tokenIERC20.decimals()

    return price
}

/*
function latestRoundData()
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRoun



*/
