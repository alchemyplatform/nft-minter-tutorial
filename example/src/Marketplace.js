import { useState } from 'react';
import NftCard from './components/nftcard';
import {fetchNFTs} from './util/fetchNFTs';

const Marketplace = () => {

    const [owner, setOwner] = useState("")
    const [NFTs, setNFTs] = useState("")
    const contractAddress = "0xAf289f4A821b8a7D92b0f3163A24527C2399a50B";

    return (
        <div className='marketplace'>
            <button onClick={() => {fetchNFTs("0x90D3f8631A67D0bf2c053Ccf95668BE101f9e95f", setNFTs, contractAddress)}}>Search</button>

            <section className='flex flex-wrap justify-center'>
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