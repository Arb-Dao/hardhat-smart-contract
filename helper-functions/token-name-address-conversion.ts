import tokenlist from "./token-list.json"
/**
 * @dev This function convert name to onchain address and viceversa
 * @param tokenNameOrAddress the token symbol or the address on polygon chain.
 * @return The address or symbol of the token on polygon chain depending on the input.
 */
export function tokenNameAddressConvertor(tokenNameOrAddress: string): string {
    for (const [key, value] of Object.entries(tokenlist)) {
        if (key.toUpperCase() === tokenNameOrAddress.toUpperCase()) {
            return value
        } else if (value.toUpperCase() === tokenNameOrAddress.toUpperCase()) {
            return key
        }
    }
    return "Token doesn't exist"
}