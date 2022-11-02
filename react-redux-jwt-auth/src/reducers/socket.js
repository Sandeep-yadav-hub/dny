const initialState = {
    connected:false,
    joined:false,
    usersToChatWith:[],
    socketId:"",
    messages:[]
};

function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case "connected":
      return { ...state,connected:true,socketId:payload.id};
    case "join":
      return { ...state,joined:true};
    case "disJoin":
      return { ...state,joined:false};
    case "disconnected":
      return { ...state,connected:false,joined:false,socketId:""};
    case "usersToChatWith":
      return {...state,usersToChatWith:payload.userList}
    case "message":
      var newState = {...state}
      newState.messages.push(payload.msgItem)
      return newState
    case "messageFromDB":
      var newState = {...state}
      newState.messages.push(...payload.msgItems)
      // const unique = [...new Set(sortByKey(newState.messages,"createdAt").map(item => item?.id))];
      const unique = [...new Map(sortByKey(newState.messages,"createdAt").map(item =>
        [item["createdAt"], item])).values()];
      newState.messages = unique
      return newState
    default:
      return state;
  }
}
