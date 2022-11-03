var storageEvents = localStorage.getItem("calenderEvents") 
var parsedEvents = storageEvents?JSON.parse(storageEvents):[]

export default function (state = parsedEvents, action) {
  const { type, payload } = action;
  switch (type) {
    case "PUSH_EVENT_CALENDER":
        localStorage.setItem("calenderEvents",JSON.stringify([...state,payload]))
        return [...state,payload];
    case "UPDATE_EVENT_CALENDER":
        var newState= state.map((evt)=>evt.id === payload.id?payload:evt)
        localStorage.setItem("calenderEvents",JSON.stringify(newState))
        return newState
    case "DELETE_EVENT_CALENDER":
        var newState = state.filter((evt)=>evt.id != payload.id)
        localStorage.setItem("calenderEvents",JSON.stringify(newState))
        return newState
    default:
      return state;
  }
}
