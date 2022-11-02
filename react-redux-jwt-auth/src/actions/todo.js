import TodoService from "../services/todo.service";

const onError=(error)=>{
    const message = (
        error.response &&
        error.response.data &&
        error.response.data.message
    )|| error.message || error.toString()
    console.log({message})
}

export const getUsersTask = ()=>(dispatch)=>{
    return TodoService.getAllUsersTasks().then(
        (response)=>{
            dispatch({
                type:"TODOS",
                payload:response.data
            })
            return Promise.resolve();
        },
        (error)=>{
            onError(error)
        }
    )
}
export const createUserTask = ({task,status,dueDate})=>(dispatch)=>{
    return TodoService.createTodoTask(task,status,dueDate).then(
        (response)=>{
            dispatch({
                type:"CREATE_TODOS",
                payload:response.data
            })
            return Promise.resolve();
        },
        (error)=>{
            onError(error)
        }
    )
} 

export const updateUserTask = ({index,id,status,dueDate})=>(dispatch)=>{
    var date = new Date(dueDate)
    var due = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    return TodoService.updateTodoTask(id,status,dueDate).then(
        (response)=>{
            console.log(dueDate)
            dispatch({
                type:"UPDATE_TODOS",
                payload:{...response.data,index,status,duedate:due}
            })
            return Promise.resolve();
        },
        (error)=>{
            onError(error)
        }
    )
} 



