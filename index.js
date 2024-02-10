const { FireblocksWeb3Provider, ChainId, ApiBaseUrl } = require("@fireblocks/fireblocks-web3-provider")
const ethers = require("ethers")

// Import the Goerli USDC ABI
const ABI = require("./USDC_GOERLI_ABI.json");

// Goerli USDC Contract Address
const CONTRACT_ADDRESS = "0x5f9eF6e1BB2AcB8F592A483052b732CeB78E58ca"

if (process.env.PROXY_UNTRUSTED_CERT){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}


const eip1193Provider = new FireblocksWeb3Provider({
    privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH,
    apiKey: process.env.FIREBLOCKS_API_KEY,
    vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS,
    chainId: ChainId.GOERLI,
    apiBaseUrl: ApiBaseUrl.Sandbox, // If using a sandbox workspace,
    proxyPath: "https://127.0.0.1:8080"
});


console.log("proxy path is " + process.env.PROXY_PATH);
if (process.env.PROXY_UNTRUSTED_CERT){
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }




(async() => {

    const provider = new ethers.providers.Web3Provider(eip1193Provider);
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());
    const amount = 1e6

    // Invoke approve method
    //const tx = await myContract.retrieve()
    const tx = await myContract.store(amount) 
    console.log(JSON.stringify(tx, null, 2))

})().catch(error => {
    console.log(error)
});