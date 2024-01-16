import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const etherscanLink = require('@metamask/etherscan-link')

// Config for Development
// https://github.com/Aquaverse/social-mining-contracts/blob/main/README.m
const desiredNetworkId = 11155111; //Sepolia

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};


async function switchChain() {
  
  // Request the current network ID from MetaMask
  const currentNetworkId = await window.ethereum.request({ method: 'net_version' });

  // Check if the current network matches the desired network
  if (currentNetworkId !== desiredNetworkId.toString()) {
    try {
      // Prompt the user to switch networks
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${desiredNetworkId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Error switching network:', error);
    }
  }
  // Continue with your smart contract interactions...
 
}

async function excuteTransaction(transactionParameters) {
  try {

    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    const txLink = etherscanLink.createExplorerLink(txHash, desiredNetworkId)

    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: " +
        txLink,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
}

export const socialpass_selfMint = async () => {
  // Source: https://github.com/Aquaverse/social-mining-contracts/blob/main/abi/SocialPass.json
  const socialPassContractABI = require("../abi/SocialPass.json");
    // From Server API
  const socialPassContractAddress = "0xAe61f1594d47E53434f235065cBd1B8324789596";
  const tokenURI = "ipfs://bafkreibto3z7jrwonc7swekfv4q2xy6dofe7y34np62m5m72gc6biglhjm";

  await switchChain();
  const contract = new web3.eth.Contract(socialPassContractABI, socialPassContractAddress);

  const transactionParameters = {
    to: socialPassContractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: contract.methods
      .selfMint(tokenURI)
      .encodeABI(),
  };
  
// Call the balanceOf method on the NFT contract
  return await excuteTransaction(transactionParameters);
};


export const hotspot_mint = async () => {
  // Source: https://github.com/Aquaverse/social-mining-contracts/blob/main/abi/HotSpot.json
  const hotSpotContractABI = require("../abi/HotSpot.json");
  // From Server API
  const hotSpotContractAddress = "0x8faB9ca27aa718B2B3eF0515AF3Bd07bB21EE99C";
  const tokenURI = "ipfs://bafkreidpigxjfnjro6pxht3b5bzym2d7pe6hbwzgmkj5545kaqmaebbyly";
  const costPrice_ether = '0.006'

  await switchChain();
  const weiAmount = web3.utils.toWei(costPrice_ether, "ether")
  const contract = new web3.eth.Contract(hotSpotContractABI, hotSpotContractAddress);

  const transactionParameters = {
    to: hotSpotContractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    value: web3.utils.toHex(weiAmount),
    data: contract.methods
      .mint(tokenURI)
      .encodeABI(),
  };


  return await excuteTransaction(transactionParameters);
};
