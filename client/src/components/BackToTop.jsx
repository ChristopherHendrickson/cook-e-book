import { useState, useEffect } from "react"

const BackToTop = () => {

    const [scrolled,setScrolled] = useState(false)

    useEffect(()=>{
        window.addEventListener('scroll',()=>{
            if (window.pageYOffset > 1000) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        })
    },[])

    const handleClick = () => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    }


    return (
        <>
            <div className='back-to-top-pad'></div>
            <div className={`back-to-top${scrolled ? ' visible':''}`}>
                <span onClick={handleClick}>Back To Top</span>
            </div>
        </>
    )
}

export default BackToTop