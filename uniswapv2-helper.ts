import BigNumber from "bignumber.js"
import { ethers } from "ethers"

function convertToBignumber(etherBig: ethers.BigNumber): BigNumber {
    let str = etherBig.toString()
    return new BigNumber(str)
}

function converToEther(bigNum: BigNumber): ethers.BigNumber {
    let str = bigNum.toString()
    str = str.split(".")[0]
    return ethers.BigNumber.from(str)
}

/**
 * @dev This function will calculate the output from uniSwap v2 pool
 * @param resX The reserve of the pair for the input token
 * @param resY The reserve of the pair for the output token
 * @param fee The fee need to be paid to the pool. ex. 3 (0.03%)
 * @param dx The amount of input token
 * @return The output amount from the pool
 */
export function uniSwapV2GetAmountOut(
    resX: ethers.BigNumber,
    resY: ethers.BigNumber,
    fee: number,
    dx: ethers.BigNumber
): ethers.BigNumber {
    const C: ethers.BigNumber = ethers.BigNumber.from(1000 - fee)
    const feeBase: ethers.BigNumber = ethers.BigNumber.from("1000")

    const dy = resY
        .mul(dx.mul(C))
        .div(feeBase)
        .div(resX.add(dx.mul(C).div(feeBase)))
    return dy
}

/**
 * @dev This function will calculate benefit based on uniSwap v2 curve
 * @param resX1 The reserve of the pair1 for the input token
 * @param resY1 The reserve of the pair1 for the output token
 * @param c1 The fee need to be paid to the pool 1. ex. 3 (0.03%)
 * @param resX2 The reserve of the pair2 for the input token
 * @param resY2 The reserve of the pair2 for the output token
 * @param c2 The fee need to be paid to the pool 2. ex. 3 (0.03%)
 * @return array of Big Numbers. 1) Optimal input 2) optimal output 3) Potential benefit
 */
export function uniSwapV2pairs_single(
    resX1: ethers.BigNumber,
    resY1: ethers.BigNumber,
    c1: number,
    resX2: ethers.BigNumber,
    resY2: ethers.BigNumber,
    c2: number
): ethers.BigNumber[] {
    const fee1: ethers.BigNumber = ethers.BigNumber.from(1000 - c1)
    const fee2: ethers.BigNumber = ethers.BigNumber.from(1000 - c2)
    const feeBase: ethers.BigNumber = ethers.BigNumber.from("1000")

    const a: ethers.BigNumber = fee1
        .mul(resY1.mul(resX1))
        .div(feeBase)
        .mul(fee2.mul(resY2.mul(resX2)))
        .div(feeBase)

    const b: ethers.BigNumber = resX1.mul(resY2)
    const c: ethers.BigNumber = fee1
        .mul(resY2)
        .div(feeBase)
        .add(resY1.mul(fee1.mul(fee2)).div(feeBase).div(feeBase))

    let aBig = convertToBignumber(a)
    aBig = aBig.sqrt()
    const aSqrt = converToEther(aBig)

    const dx1 = aSqrt.sub(b).div(c)

    const W = fee1
        .mul(resY1.mul(resX2).mul(fee2).mul(dx1))
        .div(feeBase)
        .div(feeBase)
        .div(
            resX1
                .mul(resY2)
                .add(fee1.mul(resY2.mul(dx1)).div(feeBase))
                .add(
                    resY1
                        .mul(dx1.mul(fee1.mul(fee2)))
                        .div(feeBase)
                        .div(feeBase)
                )
        )
    const B = W.sub(dx1)

    return [dx1, W, B]
}
