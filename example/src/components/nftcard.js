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