# Arb Dao project

This project is doing:

1. find arbitrage opportunities
   1.1. uniswap v2 compatible pools
   1.2. uniswap v3 compatible pools

2. Get the flashloan
   2.1. currently only from aave v3 3. do the swap

3. Do the swap found by the router
  
4. Return the Flashloan and keep the benefit

These functionallity will be added to the bot

1. Possibility to do the flash loan in different lending protocols such as dydx, aave, balancer and etc.
2. Liquidation trigger in different lending protocols.
3. Possibility to make a leveraged position using AAve
