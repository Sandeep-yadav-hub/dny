import React, { useEffect,useState } from 'react';

import {useDispatch, useSelector} from "react-redux"

import TableComponent from '../table/table.component';
import dayjs from 'dayjs';

import {getRolesList,createRole,deleteRole} from "../../actions/hr"

import { Button, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';







function createHead(key,numeric){
    const result = key.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return {
        id: key,
        numeric: numeric,
        disablePadding: false,
        label: finalResult,
    } 
}
  


const EmploymentType = ({setHeading}) => {
    let dispatch = useDispatch()
    const [denseTable,setDenseTable] = useState(true)
    const rolesList = useSelector(state=>state.hr.roles)
    const [headCells,setHeadCells] = useState([])
    const [roleCells,setRoleCells] = useState([])
    const [newEmployement,setNewEmployement] = useState("")
    const [openAddEmployement,setOpenAddEmployement] = useState(false)


    const handleClickOnAddEmployement = ()=>{
        setNewEmployement("")
        setOpenAddEmployement(true);
    }
    const handleCloseAddEmployement = () => {
        setOpenAddEmployement(false);
        setNewEmployement("")
    };
    const handleCreateAddEmployement = ()=>{
        setOpenAddEmployement(false);
        dispatch(createRole({name:newEmployement}))
        setNewEmployement("")
    }

    const onClickOnRow = (event,id)=>{
        console.log(id)
        const row = rolesList.find(item=>item.id==id)
        console.log(row)
    }

    useEffect(()=>{
        if(rolesList.length==0){
            dispatch(getRolesList())
        }
        setHeading("Employment Type")
    },[])

    useEffect(()=>{
        if (rolesList.length>0){
            var head = []
            var row = []
            head.push(createHead("id",true))
            head.push(createHead("name",false))
            head.push(createHead("noOfEmployes",true))
            head.push(createHead("createdAt",true))
            head.push(createHead("updatedAt",true))
            for(var i =0;i<rolesList.length;i++){
                if(rolesList[i]){
                    var a = {id:rolesList[i].id,name:rolesList[i].name,noOfEmployes:rolesList[i].users?rolesList[i].users.length:0,createdAt:dayjs(rolesList[i].createdAt).format("MM-DD-YYYY"),updatedAt:dayjs(rolesList[i].updatedAt).format("MM-DD-YYYY")}
                    delete a.users
                    row.push(a)
                }
            }
            setHeadCells(head)
            setRoleCells(row)
        }
    },[rolesList])


    return (
        <>
            <Button onClick={handleClickOnAddEmployement} variant={"outlined"} style={{color:"#333",border:"1px solid #333",marginBottom:"10px"}}>Create <AddIcon /></Button>
            <>
                <Dialog open={openAddEmployement} onClose={handleCloseAddEmployement} maxWidth="sm" fullWidth>
                    {/* <DialogTitle>Add Employee</DialogTitle> */}
                    <DialogContent>
                        <DialogContentText style={{fontSize:"14px",fontWeight:500}}>
                            Add Employement Type.
                        </DialogContentText>
                        <Box 
                            sx={{
                            '& .MuiTextField-root': { m: "5px auto", maxWidth: '100%' },
                            '& .MuiInputLabel-root':{marginTop:"1px",fontSize:"12px",},
                            '& .MuiInputBase-input':{fontSize:"12px"},
                            m:"auto"
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Employement Type"
                                type="text"
                                fullWidth
                                value={newEmployement}
                                onChange={(e)=>setNewEmployement(e.target.value)}
                                variant="standard"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button  onClick={handleCreateAddEmployement} style={{fontSize:"12px",color:"#212529"}}>Save</Button>
                    </DialogActions>
                </Dialog>
            </>
            <TableComponent 
                rows={roleCells} 
                headCells={headCells} 
                denseTable={denseTable} 
                // onClickOnDelete={(selected,selectedIdx)=>{
                //     console.log(selected,selectedIdx)
                //     dispatch(deleteRole({ids:selected,idxs:selectedIdx}))
                // }} 
                onClickOnRow={onClickOnRow}
            />
        </>
    );
}




export default EmploymentType;
