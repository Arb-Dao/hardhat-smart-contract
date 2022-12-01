import { expect } from "chai"
import { ethers, network } from "hardhat"
import {
    networkConfig,
    uniSwapV2GetAmountOut,
} from "../../helper-hardhat-config"
import { AaveFlashLoanV3, IUniswapV2Pair, IERC20 } from "../../typechain-types/"

describe("AaveFlashLoanV3 unit test", function () {
    let aaveFlashLoanV3: AaveFlashLoanV3
    let deployer: ethers.SignerWithAddress
    let abiCoder: ethers.utils.AbiCoder

    beforeEach(async () => {
        // const accounts = await ethers.getSigners()
        // deployer = accounts[0]
        // await deployments.fixture(["all"])
        // aaveFlashLoanV3 = await ethers.getContract("AaveFlashLoanV3", deployer)
        abiCoder = new ethers.utils.AbiCoder()
        const address = "0x066e7a421Fdd36f2263938aB328D8b2F09d9fCE0"
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [address],
        })
        await network.provider.send("hardhat_setBalance", [
            address,
            "0x3635C9ADC5DEA00000",
        ])
        deployer = await ethers.getSigner(address)

        console.log(`deployer loaded at ${deployer.address}`)

        const aaveFlashLoanV3ContractFactory = await ethers.getContractFactory(
            "AaveFlashLoanV3",
            deployer
        )
        const args: any = networkConfig[137]["poolAddressesProvider"]
        aaveFlashLoanV3 = (await aaveFlashLoanV3ContractFactory.deploy(
            args
        )) as AaveFlashLoanV3
        await aaveFlashLoanV3.deployed()
        const txReceivept = await aaveFlashLoanV3.deployTransaction.wait()
        console.log(
            `aaveFlashLoanV3 deployed at ${txReceivept.contractAddress}`
        )
        console.log("__________________________________________________")
    })

    describe("flashloan funcion", function () {
        it("checks", async () => {
            const pair = (await ethers.getContractAt(
                "IUniswapV2Pair",
                "0x80676b414a905De269D0ac593322Af821b683B92",
                deployer
            )) as IUniswapV2Pair
            const token0 = await pair.token0()
            const token1 = await pair.token1()
            const IERC20pair0 = (await ethers.getContractAt(
                "IERC20",
                token0,
                deployer
            )) as IERC20
            const IERC20pair1 = (await ethers.getContractAt(
                "IERC20",
                token1,
                deployer
            )) as IERC20

            let [reserve0, reserve1, timestamp] = await pair.getReserves()

            const amountIn1 = ethers.utils.parseEther("20")

            const amountOut1 = uniSwapV2GetAmountOut(
                reserve0,
                reserve1,
                amountIn1
            )
            const swapInp1 = [amountIn1, amountOut1, true, pair.address]

            reserve0 = reserve0.add(amountIn1)
            reserve1 = reserve1.sub(amountOut1)

            const amountIn2 = amountOut1

            const amountOut2 = uniSwapV2GetAmountOut(
                reserve1,
                reserve0,
                amountIn2
            )
            const swapInp2 = [amountIn2, amountOut2, false, pair.address]

            const param = abiCoder.encode(
                [
                    "uint8",
                    "tuple(uint256, uint256, bool, address)",
                    "tuple(uint256, uint256, bool, address)",
                ],
                [2, swapInp1, swapInp2]
            )            

            const tx = await IERC20pair0.transfer(
                aaveFlashLoanV3.address,
                ethers.utils.parseEther("1")
            )

            // console.log(param);
            

            const baseToken = networkConfig[137]["WMATIC"]

            await aaveFlashLoanV3.aaveFlashLoanV3(baseToken, amountIn1, param)
        })
    })

    describe.skip("executeSwap", function () {
        it("correctly execute swap", async () => {
            const pair = (await ethers.getContractAt(
                "IUniswapV2Pair",
                "0x80676b414a905De269D0ac593322Af821b683B92",
                deployer
            )) as IUniswapV2Pair
            const token0 = await pair.token0()
            const token1 = await pair.token1()
            const IERC20pair0 = (await ethers.getContractAt(
                "IERC20",
                token0,
                deployer
            )) as IERC20
            const IERC20pair1 = (await ethers.getContractAt(
                "IERC20",
                token1,
                deployer
            )) as IERC20

            const [reserve0, reserve1, timestamp] = await pair.getReserves()

            const amountIn = ethers.utils.parseEther("1")

            const amountOut = uniSwapV2GetAmountOut(
                reserve0,
                reserve1,
                amountIn
            )

            const tx = await IERC20pair0.transfer(
                aaveFlashLoanV3.address,
                amountIn
            )
            const swapInp = {
                amountIn: amountIn,
                amountOut: amountOut,
                Token0To1: true,
                poolAddress: pair.address,
            }
            await aaveFlashLoanV3.executeSwap(swapInp)
            console.log("here")

            const balaceAfter = await IERC20pair1.balanceOf(
                aaveFlashLoanV3.address
            )
            expect(balaceAfter).to.eq(amountOut)
        })
    })

    describe.skip("executeArbitrage function", function () {
        it("do the job", async () => {
            const pair = (await ethers.getContractAt(
                "IUniswapV2Pair",
                "0x80676b414a905De269D0ac593322Af821b683B92",
                deployer
            )) as IUniswapV2Pair
            const token0 = await pair.token0()
            const token1 = await pair.token1()
            const IERC20pair0 = (await ethers.getContractAt(
                "IERC20",
                token0,
                deployer
            )) as IERC20
            const IERC20pair1 = (await ethers.getContractAt(
                "IERC20",
                token1,
                deployer
            )) as IERC20

            let [reserve0, reserve1, timestamp] = await pair.getReserves()

            const amountIn1 = ethers.utils.parseEther("0.5")

            const amountOut1 = uniSwapV2GetAmountOut(
                reserve0,
                reserve1,
                amountIn1
            )
            const swapInp1 = [amountIn1, amountOut1, true, pair.address]

            reserve0 = reserve0.add(amountIn1)
            reserve1 = reserve1.sub(amountOut1)

            const amountIn2 = ethers.utils.parseEther("0.5")

            const amountOut2 = uniSwapV2GetAmountOut(
                reserve0,
                reserve1,
                amountIn2
            )
            const swapInp2 = [amountIn2, amountOut2, true, pair.address]

            const param = abiCoder.encode(
                [
                    "uint8",
                    "tuple(uint256, uint256, bool, address)",
                    "tuple(uint256, uint256, bool, address)",
                ],
                [2, swapInp1, swapInp2]
            )            

            const tx = await IERC20pair0.transfer(
                aaveFlashLoanV3.address,
                ethers.utils.parseEther("1")
            )
            await aaveFlashLoanV3.executeArbitrage(param)
        })
    })
})
