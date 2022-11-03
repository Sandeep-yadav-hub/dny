import React,{useEffect,useState} from 'react';
import {getUsersTask,createUserTask} from "../actions/todo"
import {useDispatch,useSelector} from "react-redux"

// material UI imports
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


// custom component
import EditTodo from "./editTodo.component"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


const inputTextStyle = {
    outline:"none",
    padding:"5px",
    fontSize:"14px",
    width:350,
    borderRadius:"3px",
    border:"1px solid"
}
const inputDateStyle = {
    outline:"none",
    padding:"5px",
    fontSize:"14px",
    borderRadius:"3px",
    width:"180px",
    border:"1px solid"
}

const buttonAddTask = {
    outline:"none",
    padding:"5px",
    fontSize:"14px",
    borderRadius:"3px",
    border:"1px solid",
    backgroundColor:"Transparent"
}
  

const Todo = ({setTabOpend}) => {
    let dispatch = useDispatch()
    const [taskValue,setTaskValue] = useState("")
    const [dueDate,setDueDate] = useState(new Date())
    const [currentTaskToUpdate,setCurrentTaskToUpdate] = useState({
        id:undefined,
        index:undefined
    })
    const {todos} = useSelector(state=>state.todos)
    const [openEditOption, setOpenEditOption] = useState(false);

    const handleClickOpen = (id,index) => {
        setCurrentTaskToUpdate({
            id,index
        })
    };


    const listOfStatus = ["pending","in progress","completed"]
    useEffect(() => {
        if (todos.length==0){
            dispatch(getUsersTask())
        }
        setTabOpend("TODO")
        return () => {
            
        };
    }, []);

    useEffect(() => {
        if (currentTaskToUpdate.index!=undefined){
            setOpenEditOption(true);
        }
        return () => {
            setOpenEditOption(false)
        };
    }, [currentTaskToUpdate.index]);

    const quickDemo = ()=>{
        let task = {
            task:"buy silk choc",
            status:"pending",
            dueDate:"2022-08-20"
        }
        dispatch(createUserTask(task))

    }
    const onAddtask = ()=>{
        let task = {
            task:taskValue,
            status:"pending",
            dueDate
        }
        dispatch(createUserTask(task)).then(()=>{
            setTaskValue("")
            setDueDate(new Date())

        })
    }
    return (
        <>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <TableContainer component={Paper} style={{maxWidth:"650px",maxHeight:"400px"}}>
                    <Table sx={{ maxWidth:650,maxHeight:400 }} aria-label="task list table">
                         <caption style={{fontSize:"10px"}}>
                            <span style={{color:"#004085",backgroundColor:"#CCE5FF",padding:"3px 6px",borderRadius:"4px",marginRight:"10px"}}>Pending/Created</span>
                            <span style={{color:"#856404",backgroundColor:"#FFF3CD",padding:"3px 6px",borderRadius:"4px",marginRight:"10px"}}>In Progress</span>
                            <span style={{color:"#155724",backgroundColor:"#D4EDDA",padding:"3px 6px",borderRadius:"4px"}}>Completed</span>
                         </caption>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">S.No</StyledTableCell>

                                <StyledTableCell>Task</StyledTableCell>
                                {/* <StyledTableCell align="center">Created On</StyledTableCell> */}
                                <StyledTableCell align="center">Due Date</StyledTableCell>
                                <StyledTableCell align="center">Modified On</StyledTableCell>
                                {/* <StyledTableCell align="center">Status</StyledTableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {todos?.map((task,index) => (
                            <StyledTableRow key={task.id} onClick={()=>handleClickOpen(task.id,index)}>
                                <StyledTableCell align="left">{index+1}.</StyledTableCell>
                                <StyledTableCell align="left"><span style={{padding:"3px 6px",borderRadius:"4px",backgroundColor:task.status=='pending'&& '#CCE5FF' || task.status=="in progress" && '#FFF3CD' || task.status=='completed' && '#D4EDDA',color:task.status=='pending'&& '#004085' || task.status=="in progress" && '#856404' || task.status=='completed' && '#155724'}}>{task.task}</span></StyledTableCell>
                                {/* <StyledTableCell align="center">
                                    {task.createdAt?.split("T")[0]}
                                </StyledTableCell> */}
                                <StyledTableCell align="center">{task.duedate?.split("T")[0]}</StyledTableCell>
                                <StyledTableCell align="center">{task.updatedAt?.split("T")[0]}</StyledTableCell>
                                {/* <StyledTableCell align="center">{task.status}</StyledTableCell> */}
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            
            <div>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                        '& .MuiInputLabel-root':{marginTop:"1px"}
                    }}
                    noValidate
                    autoComplete="off"
                    style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"650px",margin:"10px auto auto auto",marginTop:"10px"}}
                >
                    <TextField
                        label="Next Task"
                        size="small"
                        onChange={e=>setTaskValue(e.target.value)}
                        value={taskValue}
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker
                            label="Due Date"
                            inputFormat="YYYY/MM/DD "
                            value={dueDate}
                            onChange={newValue=>setDueDate(newValue)}
                            renderInput={(params) => <TextField {...params} size="small"/>}
                        />
                    </LocalizationProvider>
                    <Button onClick={onAddtask} variant="outlined">Add</Button>
                </Box>
            </div>
            
            <EditTodo openEditOption={openEditOption} setOpenEditOption={setOpenEditOption} listOfStatus={listOfStatus} currentTaskToUpdate={currentTaskToUpdate} setCurrentTaskToUpdate={setCurrentTaskToUpdate}/>
            
        </>
    );
}

export default Todo;
