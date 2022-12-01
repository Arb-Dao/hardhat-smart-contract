import { IUniswapV2Factory, IUniswapV2Pair, IERC20 } from "../typechain-types/"
import { networkConfig } from "../helper-hardhat-config"

import fs from "fs"
import { ethers } from "hardhat"

// const provider = ethers.getDefaultProvider("matic", {
//     etherscan: process.env.ETHERSCAN_API_KEY,
//     infura: process.env.INFURA_API_KEY,
//     alchemy: process.env.ALCHEMY_API_KEY,
//     pocket: process.env.POCKET_API_KEY,
// })

const main = async () => {
    /* __________ get data from blockchain __________ */
    console.log("Trying to fetch the addresses !!!")
    let pairInfo: any[] = []

    for (let i = 0; i < networkConfig[137].UniswapV2.length; i++) {
        pairInfo.push({
            swapName: networkConfig[137].UniswapV2[i].name,
            pairs: <object[]>[],
        })        
    }    

    for (let i = 0; i < networkConfig[137].UniswapV2.length; i++) {
        /* __________ creating the factory interfaces __________ */
        const uniswapV2Factory = (await ethers.getContractAt(
            "IUniswapV2Factory",
            networkConfig[137].UniswapV2[i].Factory
        )) as IUniswapV2Factory        

        for (
            let j = 0;
            j < networkConfig[137].AaveV3.addresses.length - 1;
            j++
        ) {
            for (
                let k = j + 1;
                k < networkConfig[137].AaveV3.addresses.length;
                k++
            ) {
                /* __________ getting pair addresses __________ */
                const pairAddress = await uniswapV2Factory.getPair(
                    networkConfig[137].AaveV3.addresses[j].address,
                    networkConfig[137].AaveV3.addresses[k].address
                )

                if (pairAddress === ethers.constants.AddressZero) continue

                /* __________ getting pair interface __________ */
                const uniswapV2Pair = (await ethers.getContractAt(
                    "IUniswapV2Pair",
                    pairAddress
                )) as IUniswapV2Pair

                try {
                    const token0 = await uniswapV2Pair.token0()
                    const token1 = await uniswapV2Pair.token1()

                    const pairInfoInside = {
                        name:
                            networkConfig[137].AaveV3.addresses[j].name +
                            "-" +
                            networkConfig[137].AaveV3.addresses[k].name,
                        address: pairAddress,
                        token0: token0,
                        token1: token1,
                    }
                    
                    pairInfo[i].pairs.push(pairInfoInside)
                    console.log(
                        `For ${networkConfig[137].UniswapV2[i].name} added ${pairInfoInside.name} pair`
                    )
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    /* __________ export to Json parts __________ */
    const jsonDataString = JSON.stringify(pairInfo)
    fs.writeFileSync("UniV2PairsInfo.json", jsonDataString, {
        encoding: "utf8",
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
