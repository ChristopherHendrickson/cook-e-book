

const TabNumbers = ({ moreData, viewFrom, highestLoadedFrom, handleSubmit}) => {

    const currentPage = viewFrom/15+1
    const highestLoadedPage = highestLoadedFrom/15+1
    const pageNumbers = [currentPage]
    console.log(highestLoadedPage)
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
                {pageNumbers.map((number)=>{
                    return (
                    <td key={`page${number}`}>
                        <a onClick={
                            (event)=>{
                                window.scrollTo(0, 0)
                                handleSubmit(event,(number-1)*15)
                                
                            }
                        }>{number}</a>
                    </td>
                    )
                })}
                {moreData &&
                <>
                <td>
                    <button id={'load-more'} onClick={
                        (event)=>{
                                window.scrollTo(0, 0)
                                handleSubmit(event,viewFrom+15)
                            }
                        }>{'>>'}
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