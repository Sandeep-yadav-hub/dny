const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
? { user,todos:[] }
: { user: null,todos:[]};

export default function (state=initialState,action){
    const {type,payload} = action
    switch (type) {
        case "TODOS":
            return{
                ...state,
                todos:payload
            }
        case "CREATE_TODOS":
            var newTodos = [...state.todos]
            newTodos.push(payload)
            return{
                ...state,
                todos:newTodos
            }
        case "UPDATE_TODOS":
            var newTodos = [...state.todos]
            console.log({payload})

            newTodos[payload.index] = {...newTodos[payload.index],status:payload.status,duedate:payload.duedate}
            return{
                ...state,
                todos:newTodos
            }
        default:
            return{
                ...state
            };
    }
}