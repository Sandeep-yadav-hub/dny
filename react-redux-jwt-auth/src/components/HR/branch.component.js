import React, { useEffect,useState } from 'react';



import { Button, Grid, IconButton, ListItemButton } from '@mui/material';
import TableComponent from '../table/table.component';
import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { createBranch, getBranchList } from '../../actions/hr';


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


const Branch = ({setHeading}) => {
    let dispatch = useDispatch()
    const [denseTable,setDenseTable] = useState(true)
    const [headCells,setHeadCells] = useState([])
    const [branchCells,setBranchCells] = useState([])
    const [newBranch,setNewBranch] = useState("")
    const [openAddBranch,setOpenAddBranch] = useState(false)
    const BRANCH = useSelector(state=>state.hr.branch)


    const handleClickOnAddBranch = ()=>{
        setNewBranch("")
        setOpenAddBranch(true);
    }
    const handleCloseAddBranch = () => {
        setOpenAddBranch(false);
        setNewBranch("")
    };
    const handleCreateAddBranch = ()=>{
        // setBranchCells(branch=>{
        //     var newState=[...branch]
        //     newState.push({id:branch.length,name:newBranch,noOfEmployes:0,createdAt:dayjs().format("MM-DD-YYYY"),updatedAt:dayjs().format("MM-DD-YYYY")})
        //     return newState
        // })
        dispatch(createBranch({name:newBranch}))
        setNewBranch("")
        setOpenAddBranch(false);
    }

    const onClickOnRow = (event,id)=>{
        console.log(id)
        const row = branchCells.find(item=>item.id==id)
        console.log(row)
    }

    useEffect(()=>{
        setHeading("Branch")
        var head = []
        head.push(createHead("id",true))
        head.push(createHead("name",false))
        head.push(createHead("noOfEmployes",true))
        head.push(createHead("createdAt",true))
        // head.push(createHead("updatedAt",true))
        setHeadCells(head)
        if(BRANCH.length==0){
            dispatch(getBranchList())
        }
    },[])

    useEffect(() => {
        if(BRANCH){
            setBranchCells(BRANCH.map(item=>{
                return (
                    {
                        id:item.id,
                        name:item.name,
                        employees:item.employees.length,
                        createdAt:dayjs(item.createdAt).format("MM-DD-YYYY"),
                    }
                )
            }))
        }
    }, [BRANCH]);


    return (
        <>
            <Button onClick={handleClickOnAddBranch} variant={"outlined"} style={{color:"#333",border:"1px solid #333",marginBottom:"10px"}}>Create <AddIcon /></Button>
            <>
                <Dialog open={openAddBranch} onClose={handleCloseAddBranch} maxWidth="sm" fullWidth>
                    {/* <DialogTitle>Add Employee</DialogTitle> */}
                    <DialogContent>
                        <DialogContentText style={{fontSize:"14px",fontWeight:500}}>
                            Add Branch Type.
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
                                label="Branch Name"
                                type="text"
                                fullWidth
                                value={newBranch}
                                onChange={(e)=>setNewBranch(e.target.value)}
                                variant="standard"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button  onClick={handleCreateAddBranch} style={{fontSize:"12px",color:"#212529"}}>Save</Button>
                    </DialogActions>
                </Dialog>
            </>
            <TableComponent 
                rows={branchCells} 
                headCells={headCells} 
                denseTable={denseTable} 
                // onClickOnDelete={(selected,selectedIdx)=>{
                //     console.log(selected,selectedIdx)
                // }} 
                onClickOnRow={onClickOnRow}
            />
        </>
    );
}

export default Branch;
