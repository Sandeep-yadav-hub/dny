import ChatService from "../services/chat.service";

const onError=(error)=>{
    const message = (
        error.response &&
        error.response.data &&
        error.response.data.message
    )|| error.message || error.toString()
    console.log({message})
}

export const socketConnected = ({id})=>(dispatch)=>{
    dispatch({
        type: "connected",
        payload:{id}
    });
    return Promise.resolve(); 
}

export const joinedServer = ()=>(dispatch)=>{
    dispatch({
        type: "join",
    });
    return Promise.resolve(); 
}

export const disJoinedServer = ()=>(dispatch)=>{
    dispatch({
        type: "disJoin",
    });
    return Promise.resolve(); 
}

export const socketDisconnected = ()=>(dispatch)=>{
    dispatch({
        type: "disconnected",
    });
    return Promise.resolve(); 
}

export const addMessage=({msgItem})=>(dispatch)=>{
    console.log("adding message")
    dispatch({
        type: "message",
        payload:{msgItem}
    });
    return Promise.resolve();
}

export const getChatUsers=()=>(dispatch)=>{
    return ChatService.getChatUsers().then(
        (response)=>{
            console.log(response.data,"chatUser")
            
            dispatch({
                type:"usersToChatWith",
                payload:{userList:response.data}
            })
            return Promise.resolve();
        },
        (error)=>{
            onError(error)
        }
    )
}

export const getChatList=({parent})=>(dispatch)=>{
    return ChatService.getChatList(parent).then(
        (response)=>{
            // dispatch({
            //     type:"usersToChatWith",
            //     payload:{userList:response.data}
            // })
            return response.data;
        },
        (error)=>{
            onError(error)
        }
    )
}

export const getChatBetween=({parent,sentTo})=>(dispatch)=>{
    return ChatService.getChatBetween(parent,sentTo).then(
        (response)=>{
            // dispatch({
            //     type:"usersToChatWith",
            //     payload:{userList:response.data}
            // })
            return response.data;
        },
        (error)=>{
            onError(error)
        }
    )
}