import React from "react"
import dayjs from "dayjs"

const CalenderContext = React.createContext({
    monthIdx:dayjs().month(),
    setMonthIdx:(index)=>{},
})

export default CalenderContext