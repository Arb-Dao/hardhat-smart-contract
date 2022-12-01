export const networkConfig = {
    137: {
        UniswapV2: [
            {
                name: "quickSwap",
                Factory: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
                RouterV02: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
                Fee: 3,
            },
            {
                name: "JetSwap",
                Factory: "0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7",
                RouterV02: "0x5C6EC38fb0e2609672BDf628B1fD605A523E5923",
                Fee: 1,
            },
            {
                name: "DFYNSwap",
                Factory: "0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B",
                RouterV02: "0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429",
                Fee: 3,
            },
            {
                name: "ApeSwap",
                Factory: "0xCf083Be4164828f00cAE704EC15a36D711491284",
                RouterV02: "0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607",
                Fee: 2,
            },
            {
                name: "sushiSwap",
                Factory: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "fraxSwap",
                Factory: "0x54F454D747e037Da288dB568D4121117EAb34e79",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "MeerkatSwap",
                Factory: "0x7cFB780010e9C861e03bCbC7AC12E013137D47A5",
                RouterV02: "",
                Fee: 2,
            },
            {
                name: "polyCatSwap",
                Factory: "0x477Ce834Ae6b7aB003cCe4BC4d8697763FF456FA",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "gravityFinanceSwap",
                Factory: "0x3ed75AfF4094d2Aaa38FaFCa64EF1C152ec1Cf20",
                RouterV02: "",
                Fee: 5,
            },
            {
                name: "vulcanSwap",
                Factory: "0x293f45b6F9751316672da58AE87447d712AF85D7",
                RouterV02: "",
                Fee: 3,
            },
        ],
        AaveV3: {
            poolAddressesProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
            addresses: [
                {
                    name: "WMATIC",
                    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
                },
                {
                    name: "DAI",
                    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                },
                {
                    name: "USDC",
                    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                },
                {
                    name: "USDT",
                    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                },
                {
                    name: "WETH",
                    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                },
                {
                    name: "WBTC",
                    address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
                },
                {
                    name: "SUSHI",
                    address: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
                },
                {
                    name: "LINK",
                    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
                },
                {
                    name: "GHST",
                    address: "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7",
                },
                {
                    name: "DPI",
                    address: "0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369",
                },
                {
                    name: "CRV",
                    address: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
                },
                {
                    name: "BAL",
                    address: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
                },
                {
                    name: "miMATIC",
                    address: "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1",
                },
                {
                    name: "jEUR",
                    address: "0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c",
                },
                {
                    name: "EURS",
                    address: "0xE111178A87A3BFf0c8d18DECBa5798827539Ae99",
                },
                {
                    name: "agEUR",
                    address: "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4",
                },
            ],
        },
    },
    1: {
        UniswapV2: [
            {
                name: "uniSwapV2",
                Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "sushiSwap",
                Factory: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "Convergence",
                Factory: "0x4eef5746ED22A2fD368629C1852365bf5dcb79f1",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "SwipeSwap",
                Factory: "0x8a93B6865C4492fF17252219B87eA6920848EdC0",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "SumSwap",
                Factory: "0x96FF042f8c6757fCE515d171F194b5816CAFEe11",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "ShibaSwap",
                Factory: "0x115934131916C8b277DD010Ee02de363c09d037c",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "YouSwap",
                Factory: "0xa7028337D3DA1F04d638Cc3B4dD09411486b49EA",
                RouterV02: "",
                Fee: 3,
            },
            {
                name: "DefiSwap",
                Factory: "0x9DEB29c9a4c7A88a3C0257393b7f3335338D9A9D",
                RouterV02: "",
                Fee: 3,
            },
        ],
        AaveV3: {
            poolAddressesProvider: "0xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
            addresses: [
                {
                    name: "BUSD",
                    address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
                },
                {
                    name: "DAI",
                    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                },
                {
                    name: "FRAX",
                    address: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
                },
                {
                    name: "GUSD",
                    address: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
                },
                {
                    name: "LUSD",
                    address: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
                },
                {
                    name: "SUSD",
                    address: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
                },
                {
                    name: "TUSD",
                    address: "0x0000000000085d4780B73119b644AE5ecd22b376",
                },
                {
                    name: "USDC",
                    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                },
                {
                    name: "USDP",
                    address: "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
                },
                {
                    name: "USDT",
                    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                },
                {
                    name: "WBTC",
                    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
                },
                {
                    name: "WETH",
                    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                },
            ],
        },
    },
    5: {
        name: "goerli",
        UniswapV2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        UniswapV2Router02: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        poolAddressesProvider: "0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D",
        WETH: "0x2e3A2fb8473316A02b8A297B982498E661E1f6f5",
        DAI: "0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464",
        LINK: "0x07C725d58437504CA5f814AE406e70E21C5e8e9e",
        USDC: "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43",
        WBTC: "0x8869DFd060c682675c2A8aE5B21F2cF738A0E3CE",
        USDT: "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49",
        AAVE: "0x63242B9Bd3C22f18706d5c4E627B4735973f1f07",
        EURS: "0xaA63E0C86b531E2eDFE9F91F6436dF20C301963D",
    },
    31337: {
        name: "hardhat",
        UniswapV2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        UniswapV2Router02: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        poolAddressesProvider: "0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D",
        WETH: "0x2e3A2fb8473316A02b8A297B982498E661E1f6f5",
        DAI: "0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464",
        LINK: "0x07C725d58437504CA5f814AE406e70E21C5e8e9e",
        USDC: "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43",
        WBTC: "0x8869DFd060c682675c2A8aE5B21F2cF738A0E3CE",
        USDT: "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49",
        AAVE: "0x63242B9Bd3C22f18706d5c4E627B4735973f1f07",
        EURS: "0xaA63E0C86b531E2eDFE9F91F6436dF20C301963D",
    },
}

export const developmentChains = ["hardhat", "localhost"]
