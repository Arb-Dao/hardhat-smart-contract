import { uniswapV2SpotPrice } from "./uniswap-helper"

/**
 * @dev The promise to get spot price of exchanges at once.
 * @notice The exchanges are predefined base on liquidity to avoid usage of low liquid markets
 * @return List of objects with the name of exchange and the prices
 */
export const WMATIC_ETH = new Promise<Object[]>(async (resolve) => {
    const baseToken = "weth",
        quoteToken = "wmatic",
        factoryAddress1 = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
        factoryAddress2 = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"
    const price1: number = Number(
            await uniswapV2SpotPrice(baseToken, quoteToken, factoryAddress1)
        ),
        price2: number = Number(
            await uniswapV2SpotPrice(baseToken, quoteToken, factoryAddress2)
        )

    resolve([price1, price2])
})
