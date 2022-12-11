// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.10;

/* Import */
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

/* IERC20 interface */
interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function balanceOf(address owner) external view returns (uint256);
}

/* Custom errors*/
error notOwner();
error notAavePoolV3();

contract ArbDao is FlashLoanSimpleReceiverBase {
    /* state variabels*/
    address immutable i_owner;

    /* structs */
    struct uniV2Swap {
        address[] path;
        address routerAddress;
        uint256 amountIn;
    }

    struct uniV3Swap {
        bytes path;
        address routerAddress;
        uint256 amountIn;
    }

    /* modifiers */
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert notOwner();
        _;
    }

    /* functions */

    /**@dev Initialaze the contract
     * @param _addressProviderV3 Aave V3 address provider
     */
    constructor(
        IPoolAddressesProvider _addressProviderV3
    ) FlashLoanSimpleReceiverBase(_addressProviderV3) {
        i_owner = msg.sender;
    }

    /**@dev Initialaze the flash loan from aave pool
     * @notice Aave pool will call the execute operation function
     * @param _asset requested token to borrow
     * @param _amount requeste amount to borrow
     * @param _params extra parameters to pass to unisawp for example
     */
    function aaveFlashLoanV3(
        address _asset,
        uint256 _amount,
        bytes calldata _params
    ) public {
        POOL.flashLoanSimple(address(this), _asset, _amount, _params, 0);
    }

    /**
     * @notice This function is called by AAve pool V3
     */
    function executeOperation(
        address _asset,
        uint256 _amount,
        uint256 _premium,
        address, // (my note) flashloan initiator. since i don't need it I don't save it
        bytes calldata _params
    ) external override returns (bool) {
        if (msg.sender != address(POOL)) revert notAavePoolV3();

        // do stuff here
        // abi.decode(params) to decode params
        executeArbitrage(_params);

        // approving AAve pool, repaying the money
        IERC20(_asset).approve(address(POOL), _amount + _premium);
        return true;
    }

    function executeArbitrage(bytes calldata _params) private {
        while (true) {
            _params[0:20];
        }
    }

    function executeV2Swap(uniV2Swap memory _swapParams) public {
        IERC20(_swapParams.path[0]).approve(
            _swapParams.routerAddress,
            _swapParams.amountIn
        );
        IUniswapV2Router01(_swapParams.routerAddress).swapExactTokensForTokens(
            _swapParams.amountIn,
            0,
            _swapParams.path,
            address(this),
            block.timestamp
        );
    }

    function executeV3Swap(uniV3Swap memory _swapParams) public {
        address inputToken;
        // assembly is needed to access the first token data
        assembly {
            let data := mload(_swapParams)
            inputToken := mload(add(data, 20))
        }
        IERC20(inputToken).approve(
            _swapParams.routerAddress,
            _swapParams.amountIn
        );
        ISwapRouter(_swapParams.routerAddress).exactInput(
            ISwapRouter.ExactInputParams({
                path: _swapParams.path,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _swapParams.amountIn,
                amountOutMinimum: 0
            })
        );
    }

    function withdrawERC20(address _asset, uint256 _amount) external onlyOwner {
        IERC20(_asset).transfer(msg.sender, _amount);
    }

    function withdrawETH() external onlyOwner returns (bool) {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        return success;
    }
}
