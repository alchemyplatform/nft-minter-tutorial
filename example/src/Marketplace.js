import { useState } from 'react';
import NftCard from './components/nftcard';
import {fetchNFTs} from './util/fetchNFTs';
require("dotenv").config();

const Marketplace = () => {

    const [NFTs, setNFTs] = useState("")
    const contractAddress = process.env.CONTRACT_ADDRESS

    return (
        <div className='marketplace'>
            <button onClick={() => {fetchNFTs(contractAddress, setNFTs, contractAddress)}}>Search</button>

            <section>
                {
                    NFTs ? NFTs.map(NFT => {
                        
                        return (
                           <NftCard key={NFT.value.id + NFT.value.  contractAddress} image={NFT.value.image} id={NFT.value.id} title={NFT.value.title} description={NFT.value.description}></NftCard>
                        )
                    }) : <div>No NFTs found</div>
                }
            </section>
        </div>
    )
}


export default Marketplace;