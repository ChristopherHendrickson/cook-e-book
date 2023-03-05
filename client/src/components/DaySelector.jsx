

const DaySelector = ({ selectedDays, setSelectedDays }) => {
    const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const handleSelect = (day) => {
        const newSelectedDays = [...selectedDays]
        console.log('click')
        if (selectedDays.includes(day)) {
            newSelectedDays.splice(newSelectedDays.indexOf(day), 1);
        } else {
            newSelectedDays.push(day)
        }
        console.log(newSelectedDays)
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