import React,{useState,useEffect} from 'react';
import {useDispatch,useSelector} from "react-redux"

import {updateUserTask} from "../actions/todo"



// material UI imports
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


const EditTodo = ({openEditOption,setOpenEditOption,listOfStatus,currentTaskToUpdate,setCurrentTaskToUpdate}) => {
    var dispatch = useDispatch()
    const [status, setStatus] = useState('')
    const [dueDate,setDueDate] = useState(new Date())
    const {todos} = useSelector(state=>state.todos)
    const [currentTask,setCurrentTask] = useState({})

    const handleChange = (event) => {
        console.log(currentTaskToUpdate)
        setStatus(event.target.value);
    };

    const handleClose = () => {
        setOpenEditOption(false);
        setCurrentTaskToUpdate({
            id:undefined,
            index:undefined
        })
        setStatus("")
        setDueDate(new Date())
    };

    const handleSave = ()=>{
        dispatch(updateUserTask({
            index:currentTaskToUpdate.index,
            id:currentTask.id,
            status,
            dueDate
        })).then(handleClose())
    }
    
    useEffect(() => {
        if (currentTaskToUpdate.index!= undefined){
            setCurrentTask(prevState=>{
                setStatus(todos[currentTaskToUpdate.index].status)
                setDueDate(new Date(todos[currentTaskToUpdate.index].duedate))
                return todos[currentTaskToUpdate.index]
            })
        }
        return () => {
            setCurrentTask({})
            setStatus("")
            setDueDate(new Date())
        };
    }, [currentTaskToUpdate.index]);

    return (
        <>
            <Dialog open={openEditOption} onClose={handleClose}>
                <DialogTitle>Update</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            '& .MuiInputLabel-root':{marginTop:"1px"}
                        }}
                        noValidate
                        autoComplete="off"
                        // style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"650px",margin:"20px auto auto auto",marginTop:"20px"}}
                    >
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small">Status</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={status}
                            label="Status"
                            onChange={handleChange}
                        >
                            {listOfStatus.map((item,index)=>{
                                return(
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                )
                            })}
                        </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker
                                label="Due Date"
                                inputFormat="YYYY/MM/DD "
                                value={dueDate}
                                onChange={newValue=>setDueDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small"/>}
                            />
                        </LocalizationProvider>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EditTodo;
