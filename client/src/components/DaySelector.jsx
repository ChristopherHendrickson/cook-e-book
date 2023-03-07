

const DaySelector = ({ selectedDays, setSelectedDays, handleSingleUpdate }) => {
    const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const handleSelect = (day) => {
        const newSelectedDays = [...selectedDays]
        if (selectedDays.includes(day)) {
            newSelectedDays.splice(newSelectedDays.indexOf(day), 1);
            handleSingleUpdate(day,true)
        } else {
            newSelectedDays.push(day)
            handleSingleUpdate(day,false)
        }
        setSelectedDays(newSelectedDays)
    }
    
    return (
        <ul className='d-sel'>
        {daysOfTheWeek.map((day)=>{
            return <li onClick={()=>handleSelect(day)} key={`d-s-${day}`} className={`d-s-item${selectedDays.includes(day) ? ' selected' : ''}`}>{day}</li>
        })}
        </ul>
    )
}

export default DaySelector