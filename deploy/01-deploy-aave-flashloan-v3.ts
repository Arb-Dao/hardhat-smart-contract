import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig } from "../helper-hardhat-config"

const deployMyArb: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { deployments, ethers, network } = hre
    const { deploy, log } = deployments

    const deployer = (await ethers.getSigners())[0]
    log(`The deployer address is: ${deployer.address}`)

    const chainId = network.config.chainId

    let args: any = [networkConfig[137].AaveV3.poolAddressesProvider]
    log("Deploying MyArb and waiting for confirmations...")
    const myArb = await deploy("MyArb", {
        from: deployer.address,
        log: true,
        args: args,
        waitConfirmations: 1,
    })

    log(`MyArb deployed at ${myArb.address}`)
    log("__________________________________________________")

    // if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
    //     // verify the code
    //     await verify(MyArb.address, args)
    // }
}

export default deployMyArb
deployMyArb.tags = ["all", "myArb"]
