import React, { useEffect,useState } from 'react';

import { Button, Grid, IconButton, ListItemButton, Typography } from '@mui/material';
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
import { createDepartment, getBranchList, getDepartmentList } from '../../actions/hr';

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

const Department = ({setHeading}) => {
    let dispatch = useDispatch()
    const [denseTable,setDenseTable] = useState(true)
    const [headCells,setHeadCells] = useState([])
    const [newDepartment,setNewDepartment] = useState("")
    const [newDepartmentBranch,setNewDepartmentBranch] = useState({name:""})
    const [openAddDepartment,setOpenAddDepartment] = useState(false)
    const branchList = useSelector(state=>state.hr.branch)
    const departmentList = useSelector(state=>state.hr.department)
    
    const [showBranchList,setShowBranchList] = useState(false)
    const [showDepartmentList,setShowDepartmentList] = useState(false)
    const [departmentCells,setDepartmentCells] = useState([])


    const onClickOnRow = (event,id)=>{
        console.log(id)
        // const row = departmentCells.find(item=>item.id==id)
        // console.log(row)
    }

    const handleClickOnAddDepartment = ()=>{
        setNewDepartment("")
        
        setOpenAddDepartment(true);
    }
    const handleCloseAddDepartment = () => {
        setOpenAddDepartment(false);
        setNewDepartment("")
    };
    const handleCreateAddDepartment = ()=>{
        if(newDepartmentBranch===null || newDepartment==null){
            console.log("Invalid request select a branch")
            return 
        }
        dispatch(createDepartment({name:newDepartment,branchId:newDepartmentBranch.id}))
        console.log(newDepartment,newDepartmentBranch)
        setNewDepartment("")
        setOpenAddDepartment(false);
    }


    useEffect(() => {
        setHeading("Department")
        var head = []
        head.push(createHead("id",true))
        head.push(createHead("name",false))
        head.push(createHead("branch",false))
        head.push(createHead("noOfEmployes",true))
        head.push(createHead("createdAt",true))
        // head.push(createHead("updatedAt",true))
        setHeadCells(head)
    }, []);

    useEffect(()=>{
        if (branchList.length==0){
            dispatch(getBranchList())
        }
    },[branchList])

    useEffect(()=>{
        if (departmentList.length==0){
            dispatch(getDepartmentList())
        }else{
            var row = []
            for(var i =0;i<departmentList.length;i++){
                if(departmentList[i]){
                    console.log(departmentList[i])
                    var a = {id:departmentList[i].id,name:departmentList[i].name,branch:departmentList[i].branch.name,noOfEmployes:departmentList[i].employees?departmentList[i].employees.length:0,createdAt:dayjs(departmentList[i].createdAt).format("MM-DD-YYYY")}
                    row.push(a)
                }
            }
            setDepartmentCells(row)
        }
    },[departmentList])

    return (
        <>
            <Button onClick={handleClickOnAddDepartment} variant={"outlined"} style={{color:"#333",border:"1px solid #333",marginBottom:"10px"}}>Create <AddIcon /></Button>
            <>
            <Dialog open={openAddDepartment} onClose={handleCloseAddDepartment} maxWidth="sm" fullWidth>
                    {/* <DialogTitle>Add Employee</DialogTitle> */}
                    <DialogContent>
                        <DialogContentText style={{fontSize:"14px",fontWeight:500}}>
                            Add Department Type.
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
                                label="Department Name"
                                type="text"
                                fullWidth
                                value={newDepartment}
                                onChange={(e)=>setNewDepartment(e.target.value)}
                                variant="standard"
                            />
                            <TextField
                                // autoFocus
                                margin="dense"
                                label="Branch Name"
                                type="text"
                                fullWidth
                                onFocus={()=>{
                                    setShowBranchList(true)
                                }}
                                onBlur={()=>{
                                    setTimeout(() => {
                                        setShowBranchList(false)
                                    }, 200);
                                }}
                                value={newDepartmentBranch.name}
                                onChange={(e)=>{
                                    console.log(e.target.value)
                                    setNewDepartmentBranch((prev)=>{
                                        var newstate = {}
                                        newstate.name = e.target.value
                                        return newstate
                                    })
                                }}
                                variant="standard"
                            />
                            <div style={{
                                overflow:"auto",
                                minHeight:"300px",

                            }}>
                                {showBranchList && (
                                    <div style={{
                                        border:"1px solid #999",
                                        borderRadius:"5px",
                                        // position:"absolute",
                                        minWidth:"100%",
                                        marginTop:"5px",
                                        fontSize:"12px",
                                        background:"#fff",
                                    }}>
                                        <Typography
                                                component={"p"}
                                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                                        >
                                            In Branch :
                                        </Typography>
                                        {branchList?.map((item,idx)=>{
                                            if(item.name.toLowerCase().includes(newDepartmentBranch?.name?.toLowerCase())){
                                                return (
                                                    <Typography key={idx} component={"p"} 
                                                        sx={{
                                                            borderBottom:branchList.length-1==idx?"0px":"1px solid #999",
                                                            margin:0,
                                                            padding:"7px 9px",
                                                            fontSize:"12px",
                                                            "&:hover":{
                                                                cursor:"pointer",
                                                                backgroundColor:"#999",
                                                                color:"#fff"
                                                            }
                                                        }}
                                                        onClick={()=>{
                                                            setNewDepartmentBranch(item)
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                )
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button  onClick={handleCreateAddDepartment} style={{fontSize:"12px",color:"#212529"}}>Save</Button>
                    </DialogActions>
                </Dialog>
            </>
            <TableComponent 
                rows={departmentCells} 
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

export default Department;
