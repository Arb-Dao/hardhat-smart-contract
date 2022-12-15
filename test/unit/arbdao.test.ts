import { ArbDao } from "../../typechain-types"
import { network, ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { networkConfig } from "../../helper-hardhat-config"

import uniswapV2CompatibleJSON from "../../helper-functions/json-files/exchanges-uniswap-v2-compatible.json"
import uniswapV3CompatibleJSON from "../../helper-functions/json-files/exchanges-uniswap-v3-compatible.json"
import { abi as IERC20ABI } from "../../node_modules/@uniswap/v2-core/build/IERC20.json"
import { BigNumber, Contract } from "ethers"
import {
    uniswapV2Quoter,
    uniswapV3Quoter,
} from "../../helper-functions/uniswap-helper"
import { expect } from "chai"
import { runArb } from "../../helper-functions/router"

describe("ArbDao v2 unit test", function () {
    let arbDao: ArbDao, deployer: SignerWithAddress

    beforeEach(async () => {
        const address = "0x066e7a421Fdd36f2263938aB328D8b2F09d9fCE0"
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [address],
        })
        await network.provider.send("hardhat_setBalance", [
            address,
            "0x3635C9ADC5DEAFFFFF",
        ])
        deployer = await ethers.getSigner(address)
        // console.log(`deployer loaded at ${deployer.address}`)

        const arbDaoFactory = await ethers.getContractFactory(
            "ArbDao",
            deployer
        )
        const args: any = networkConfig[137]["AaveV3poolAddressesProvider"]
        arbDao = (await arbDaoFactory.deploy(args)) as ArbDao
        await arbDao.deployed()
        const txReceivept = await arbDao.deployTransaction.wait()
        // console.log(`Arb Dao deployed at ${txReceivept.contractAddress}`)
        // console.log("__________________________________________________")
    })

    describe("executeV2Swap function", function () {
        let router: string,
            path: string[],
            token0Contract: Contract,
            token1Contract: Contract
        beforeEach(async () => {
            router = uniswapV2CompatibleJSON[0].RouterV02
            path = [
                "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            ]
            token0Contract = await ethers.getContractAt(
                IERC20ABI,
                path[0],
                deployer
            )
            token1Contract = await ethers.getContractAt(
                IERC20ABI,
                path[1],
                deployer
            )
        })
        it("Checks if the swap for v2 works", async () => {
            const amountIn = ethers.utils.parseEther("1"),
                swapParam = {
                    amountIn: amountIn,
                    routerAddress: router,
                    path: path,
                }
            await token0Contract.transfer(arbDao.address, amountIn)
            await arbDao.executeV2Swap(swapParam)
            const token1Balance: BigNumber = await token1Contract.balanceOf(
                    arbDao.address
                ),
                expectedBalance: BigNumber[][] = await uniswapV2Quoter(
                    amountIn,
                    path,
                    [router]
                )
            console.log(`after Swap balance = ${token1Balance}`)
            console.log(
                `expected balance = ${
                    expectedBalance[0][expectedBalance[0].length - 1]
                }`
            )
            expect(
                token1Balance
                    .sub(expectedBalance[0][expectedBalance[0].length - 1])
                    .toNumber()
            ).gte(0)
        })
    })

    describe("executeV3Swap function", function () {
        let router: string,
            path: string[],
            token0Contract: Contract,
            token1Contract: Contract
        beforeEach(async () => {
            router = uniswapV3CompatibleJSON[0].Router
            path = [
                "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                "100",
                "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            ]
            token0Contract = await ethers.getContractAt(
                IERC20ABI,
                path[0],
                deployer
            )
            token1Contract = await ethers.getContractAt(
                IERC20ABI,
                path[2],
                deployer
            )
        })

        it("Checks if the swap for v3 works", async () => {
            const amountIn = ethers.utils.parseEther("1"),
                pathInp = ethers.utils.solidityPack(
                    ["address", "uint24", "address"],
                    [path[0], path[1], path[2]]
                ),
                swapParam = {
                    amountIn: amountIn,
                    routerAddress: router,
                    path: pathInp,
                }

            await token0Contract.transfer(arbDao.address, amountIn)
            await arbDao.executeV3Swap(swapParam)
            const token1Balance: BigNumber = await token1Contract.balanceOf(
                    arbDao.address
                ),
                expectedBalance: BigNumber[] = await uniswapV3Quoter(
                    amountIn,
                    [path],
                    [uniswapV3CompatibleJSON[0].Quoter]
                )
            console.log(`after Swap balance = ${token1Balance}`)
            console.log(
                `expected balance = ${
                    expectedBalance[expectedBalance.length - 1]
                }`
            )
            expect(
                token1Balance
                    .sub(expectedBalance[expectedBalance.length - 1])
                    .toNumber()
            ).gte(0)
        })
    })

    describe("executeArbitrage", function () {
        it.only("Checks if the execute Arbitrage function", async () => {
            const ans = await runArb()
            await arbDao.executeArbitrage(ans)
        })
    })
})
