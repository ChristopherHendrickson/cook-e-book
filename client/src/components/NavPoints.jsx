import { useNavigate } from "react-router-dom"

const NavPoints = ( { pages, currentPage }) => {
    const navigate = useNavigate()

    const handleClick = (url) => {
        navigate(url)
    }

    return (
        <div className='main-nav'>
            <div className='nav-container'>
            {pages.map((page)=>{
                return <a 
                key={page}
                onClick={()=>handleClick('/'+page.replace(' ','').toLowerCase())} 
                className={`nav-title${currentPage == page ? ' current' : ''}`}>
                    {page}
                </a>
            })}
            </div>
        </div>
    )


}

export default NavPoints
