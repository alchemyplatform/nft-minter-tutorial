
const getAddressNFTs = async (endpoint, owner, contractAddress, retryAttempt) => {
    if (retryAttempt === 5) {
        return;
    }
    if (owner) {
        let data;
        try {
            if (contractAddress) {
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`).then(data => data.json())

            } else {
                // data = await fetch(`${endpoint}/v1/getNFTs?owner=${owner}`).then(data => data.json())
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}`).then(data => data.json())

            }
            // console.log("GETNFTS: ", data)
        } catch (e) {
            getAddressNFTs(endpoint, owner, contractAddress, retryAttempt+1)
        }

        return data
    }
}


const fetchNFTs = async (owner, setNFTs, contractAddress) => {
    let endpoint = "https://eth-rinkeby.alchemyapi.io/v2/GXdaB56MZ5ko2VRwwrUe1rWl1Bi8til4"
    const data = await getAddressNFTs(endpoint, owner, contractAddress)
    if (data.ownedNfts.length) {
        const NFTs = await getNFTsMetadata(data.ownedNfts, endpoint)
        console.log("NFTS metadata", NFTs)
        let fullfilledNFTs = NFTs.filter(NFT => NFT.status == "fulfilled")
        console.log("NFTS", fullfilledNFTs)
        setNFTs(fullfilledNFTs)
    } else {
        setNFTs(null)
    }
}


const getNFTsMetadata = async (NFTS, endpoint) => {
    const NFTsMetadata = await Promise.allSettled(NFTS.map(async (NFT) => {
        const metadata = await fetch(`${endpoint}/getNFTMetadata?contractAddress=${NFT.contract.address}&tokenId=${NFT.id.tokenId}`,).then(data => data.json())
        let image;
        console.log("metadata", metadata);
        console.log("왜안돼", String(metadata.metadata.image).length);
        if (String(metadata.metadata.image).length) {
            image = String(metadata.metadata.image);
        } else {
            image = "https://via.placeholder.com/500";
        }

        return {
            id: NFT.id.tokenId,
            image,
            title: metadata.metadata.name,
            description: metadata.metadata.description
        }
    }))

    return NFTsMetadata
}


export { fetchNFTs, getAddressNFTs }