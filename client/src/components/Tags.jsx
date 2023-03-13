import { useContext } from "react"
import { CustomTagsContext } from "../context/CustomTagsContext"

const Tags = ({ tags, selectedTags, onClick }) => {

    const [customTags,setCustomTags] = useContext(CustomTagsContext)

    if (!tags) {
        tags = customTags //tags rendered from filter dropdowns do no specify tags
    }

    if (!selectedTags) {
        selectedTags=[...tags] //this colours in tags in the recipe displays by default
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