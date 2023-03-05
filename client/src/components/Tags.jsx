

const Tags = ({ tags, selectedTags, onClick }) => {

    if (!selectedTags) {
        selectedTags=[...tags]
    }

    const selectedTagsNames = selectedTags.map((tag) =>{
        return tag.name
    })
    tags.forEach((tag)=>{
        if (!selectedTagsNames.includes(tag.name)) {
            tag.class='deselected'
        } else {
            tag.class=tag.type
        }
    })

    
    return (
        <ul className="tags">
            {tags.map((tag)=>{
                return <li onClick={onClick ? ()=>{onClick(tag)} : null} className={`tag-${tag.class}`} key={`tag-${tag.name}`}>{tag.display_name}</li>
            })}
        </ul>
    )
}

export default Tags