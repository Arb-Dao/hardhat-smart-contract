// // SPDX-License-Identifier: AGPL-3.0
// pragma solidity 0.8.10;

// /* Import */
// import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";

// /* Custom errors*/
// error notOwner();
// error notAavePoolV3();

// contract ArbDao is FlashLoanSimpleReceiverBase {
//     /* state variabels*/
//     address immutable i_owner;

//     /* structs */
//     struct uniV2Swap {
//         uint256 amountIn;
//         uint256 amountOut;
//         bool Token0To1;
//         address poolAddress;
//     }

//     /* modifiers */
//     modifier onlyOwner() {
//         if (msg.sender != i_owner) revert notOwner();
//         _;
//     }

//     /* functions */

//     /**@dev Initialaze the contract
//      * @param _addressProviderV3 Aave V3 address provider
//      */
//     constructor(
//         IPoolAddressesProvider _addressProviderV3
//     ) FlashLoanSimpleReceiverBase(_addressProviderV3) {
//         i_owner = msg.sender;
//     }

//     /**@dev Initialaze the flash loan from aave pool
//      * @notice Aave pool will call the execute operation function
//      * @param _asset requested token to borrow
//      * @param _amount requeste amount to borrow
//      * @param _params extra parameters to pass to unisawp for example
//      */
//     function aaveFlashLoanV3(
//         address _asset,
//         uint256 _amount,
//         bytes calldata _params
//     ) public {
//         POOL.flashLoanSimple(address(this), _asset, _amount, _params, 0);
//     }

//     /**
//      * @notice This function is called by AAve pool V3
//      */
//     function executeOperation(
//         address _asset,
//         uint256 _amount,
//         uint256 _premium,
//         address, // (my note) flashloan initiator. since i don't need it I don't save it
//         bytes calldata _params
//     ) external override returns (bool) {
//         if (msg.sender != address(POOL)) revert notAavePoolV3();

//         // do stuff here
//         // abi.decode(params) to decode params
//         executeArbitrage(_params);

//         // approving AAve pool, repaying the money
//         IERC20(_asset).approve(address(POOL), _amount + _premium);
//         return true;
//     }

//     function executeArbitrage(bytes calldata _params) private {
//         uint256 _numOperations = abi.decode(_params[0:32], (uint256));

//         for (uint256 i = 0; i < _numOperations; i++) {
//             uniV2Swap memory _swapParams = abi.decode(
//                 _params[(i * 128 + 32):((i + 1) * 128 + 32)],
//                 (uniV2Swap)
//             );
//             executeSwap(_swapParams);
//         }
//     }

//     function executeSwap(uniV2Swap memory _swapParams) private {
//         IUniswapV2Pair tradingPair = IUniswapV2Pair(_swapParams.poolAddress);
//         address _token0 = tradingPair.token0();
//         address _token1 = tradingPair.token1();

//         if (_swapParams.Token0To1) {
//             IERC20(_token0).transfer(
//                 address(tradingPair),
//                 _swapParams.amountIn
//             );
//             tradingPair.swap(0, _swapParams.amountOut, address(this), "");
//         } else {
//             IERC20(_token1).transfer(
//                 address(tradingPair),
//                 _swapParams.amountIn
//             );
//             tradingPair.swap(_swapParams.amountOut, 0, address(this), "");
//         }
//     }

//     function withdrawERC20(address _asset, uint256 _amount) external onlyOwner {
//         IERC20(_asset).transfer(msg.sender, _amount);
//     }

//     function withdrawETH() external onlyOwner returns (bool) {
//         (bool success, ) = payable(msg.sender).call{
//             value: address(this).balance
//         }("");
//         return success;
//     }
// }
