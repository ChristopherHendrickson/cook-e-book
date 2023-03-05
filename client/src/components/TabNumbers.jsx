

const TabNumbers = ({ moreData, viewFrom, setViewFrom, highestLoadedFrom, handleSubmit}) => {


    const currentPage = viewFrom/15+1
    const highestLoadedPage = highestLoadedFrom/15+1
    const pageNumbers = [currentPage]
    for (let i=1;i<7;i++) {
        if (currentPage+i <= highestLoadedPage) {
            pageNumbers.push(currentPage+i)
        } 
        if (currentPage-i > 0) {
            pageNumbers.unshift(currentPage-i)
        } 
        if (pageNumbers.length>=7) {
            break
        }
  
    }
    

    return (
        <>
        {Number.isInteger(highestLoadedFrom) && 
        <table>
            <tbody>
            <tr>
                {pageNumbers.map((page)=>{
                    const isCurrent = (page-1)*15 == viewFrom
                    return (
                    <td key={`page${page}`} className={isCurrent ? "tab-button-current" : "tab-button"} >
                        <button disabled={isCurrent} onClick={
                            ()=>{
                                setViewFrom((page-1)*15)
                                setTimeout(()=>{
                                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})

                                },5)

                                
                            }
                        }>{page}</button>
                    </td>
                    )
                })}
                {moreData &&
                <>
                <td>
                    <button id={'load-more'} onClick={
                        (event)=>{
                                handleSubmit(event,viewFrom+15)
                                window.scrollTo({top: 0, left: 0, behavior: 'smooth'})

                            }
                        }>{'>'}
                    </button>
                </td>
                </>
                }
            </tr>
            </tbody>
        </table>
        }
        </>
    )

}

export default TabNumbers