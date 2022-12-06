import tokenlist from "../json-files/token-list.json"
/**
 * @dev This function convert name to onchain address and viceversa
 * @param tokenNameOrAddress the token symbol or the address on polygon chain.
 * @return The address or symbol of the token on polygon chain depending on the input.
 */
export function tokenNameAddressConvertor(tokenNameOrAddress: string): string {
    for (const [key, value] of Object.entries(tokenlist)) {
        if (key.toUpperCase() === tokenNameOrAddress.toUpperCase()) {
            return value[0]
        } else if (
            value[0].toUpperCase() === tokenNameOrAddress.toUpperCase()
        ) {
            return key
        }
    }
    return "Token doesn't exist"
}

/**
 * @dev This function returns the decimals of the token.
 * @param tokenNameOrAddress the token symbol or the address on polygon chain.
 * @notice If the token is not in the list it returns default value of 18
 * @return The address or symbol of the token on polygon chain depending on the input.
 */
export function tokenDecimals(tokenNameOrAddress: string): number {
    for (const [key, value] of Object.entries(tokenlist)) {
        if (key.toUpperCase() === tokenNameOrAddress.toUpperCase()) {
            return Number(value[1])
        } else if (
            value[0].toUpperCase() === tokenNameOrAddress.toUpperCase()
        ) {
            return Number(value[1])
        }
    }
    return 18
}
