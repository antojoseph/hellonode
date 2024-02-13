const { FireblocksWeb3Provider, ChainId, ApiBaseUrl } = require("@fireblocks/fireblocks-web3-provider");
const { Utils } = require("alchemy-sdk");
const ethers = require("ethers");

// Example USDC Contract ABI (simplified for `approve` function)
const usdcAbi = [
    "function approve(address spender, uint256 amount) public returns (bool)"
  ];

// Goerli USDC Contract Address
const CONTRACT_ADDRESS = "0x5f9eF6e1BB2AcB8F592A483052b732CeB78E58ca";

if (process.env.PROXY_UNTRUSTED_CERT){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const eip1193Provider = new FireblocksWeb3Provider({
    privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
    apiKey: process.env.FIREBLOCKS_API_KEY,
    vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
    chainId: ChainId.GOERLI,
    apiBaseUrl: ApiBaseUrl.Sandbox // If using a sandbox workspace,
});


(async () => {

    const provider = new ethers.providers.Web3Provider(eip1193Provider);
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, usdcAbi, signer);

    // Define the spender address and the amount you want to approve
    const spenderAddress = '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5';
    const amount = ethers.utils.parseUnits('100.0', 6); // Approving 100 USDC, assuming USDC uses 6 decimal places

    // Generate the transaction object for the approve function
    const tx = await myContract.populateTransaction.approve(spenderAddress, amount);
    // another way to create a transaction object
    const transaction = {
        to: "0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd",
        value: Utils.parseEther("0.001"),
        gasLimit: "21000",
        maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
        maxFeePerGas: Utils.parseUnits("20", "gwei"),
        nonce: 2,
        type: 2,
        chainId: 5, // Corresponds to ETH_GOERLI
    };

    // Sign the transaction
    const signedTx = await signer.signTransaction(transaction);
  
    console.log("Signed Transaction:", signedTx);
    // Now, signedTx contains the signed transaction which you can manually send to the Ethereum network later
  })().catch(error => {
    console.error(error);
});
