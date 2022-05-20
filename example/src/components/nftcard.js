// NFT list를 출력하기 위해 NFT 정보에 따라 하나씩 카드 생성하기
//이미지, 아이디, 제목, 설명 데이터를 받아옴

const NftCard = ({ image, id, title, description }) => {
    return (
        <div className="card">
              <img className="thumb" src={image}></img>
              <article>
                <h1>{title}</h1>
                <span>{`${id.slice(0, 4)}...${id.slice(id.length - 4)}`}</span>
                <span>{description? description.slice(0, 200) : "No Description"}</span>
              </article>
        </div>
    )
}

export default NftCard