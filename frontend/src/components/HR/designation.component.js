import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TableComponent from '../table/table.component';
import dayjs from 'dayjs';
import { createDesignation, getDepartmentList, getDesignationList } from '../../actions/hr';

import { Button, Grid, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


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

const Designation = ({setHeading}) => {
    let dispatch = useDispatch()
    const [headCells,setHeadCells] = useState([])
    const [roleCells,setRoleCells] = useState([])
    const [denseTable,setDenseTable] = useState(true)
    const [openAddDesignation,setOpenAddDesignation] = useState(false)
    const [showDepartmentList,setShowDepartmentList] = useState(false)
    const [showParentList,setShowParentList] = useState(false)


    const [newDesignation,setNewDesignation] = useState("")
    const [newDesignationDepartment,setNewDesignationDepartment] = useState({name:""})
    const [newDesignationParent,setNewDesignationParent] = useState({name:""})
    const [isNewDesignationParent,setIsNewDesignationParent] = useState(false)

    const designationList = useSelector(state=>state.hr.designation)
    const departmentList = useSelector(state=>state.hr.department)


    const onClickOnRow = (event,id)=>{
        console.log(id)
    }
    const handleClickOnAddDesignation = ()=>{
        setOpenAddDesignation(true)
    }
    const handleCloseAddDesignation = ()=>{
        setOpenAddDesignation(false)
        setNewDesignationParent({name:""})
        setIsNewDesignationParent(false)
        setNewDesignationDepartment({name:""})
    }
    const handleCreateAddDesignation = ()=>{
        var data ={
            name:newDesignation,
            isParent:isNewDesignationParent,
            parentId:newDesignationParent.id && newDesignationParent.id,
            departmentId:newDesignationDepartment.id && newDesignationDepartment.id
        }
        dispatch(createDesignation(data))
    }

    useEffect(()=>{
        setHeading("Designation")
    },[])

    useEffect(()=>{
        if(departmentList.length==0){
            dispatch(getDepartmentList())
        }
    },[departmentList])

    useEffect(() => {
        if(designationList.length>0){
            var row = []
            var head = []
            head.push(createHead("id",true))
            head.push(createHead("name",false))
            head.push(createHead("deaprtment",false))
            head.push(createHead("reportsTo",false))
            head.push(createHead("reportsBy",false))
            head.push(createHead("employees",true))
            // head.push(createHead("createdAt",true))
            console.log({designationList})
            for(var i =0;i<designationList.length;i++){
                if(designationList[i]){
                    var a = {
                        id:designationList[i].id,
                        name:designationList[i].name,
                        deaprtment:designationList[i].department.name,
                        reportsTo:designationList.filter(item=>item.id==designationList[i].parentId)[0]?.name,
                        reportsBy:designationList[i].child,
                        employees:designationList[i].employees.length,
                    }
                    row.push(a)
                }
            } 
            setHeadCells(head)
            setRoleCells(row)
        }else{
            dispatch(getDesignationList())
        }
    }, [designationList]);

    return (
        <>
            <Button onClick={handleClickOnAddDesignation} variant={"outlined"} style={{color:"#333",border:"1px solid #333",marginBottom:"10px"}}>Create <AddIcon /></Button>
            <>
            <Dialog open={openAddDesignation} onClose={handleCloseAddDesignation} maxWidth="sm" fullWidth>
                    {/* <DialogTitle>Add Employee</DialogTitle> */}
                    <DialogContent style={{height:"500px"}}>
                        <DialogContentText style={{fontSize:"14px",fontWeight:500}}>
                            Add Designation.
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
                            <FormGroup sx={{
                                "& .MuiSvgIcon-root":{width:"18px",height:"18px"},
                                "& .MuiTypography-root":{fontSize:"12px"}
                            }}>
                                <FormControlLabel style={{fontSize:"12px"}} control={<Checkbox checked={isNewDesignationParent} onChange={(e)=>setIsNewDesignationParent(e.target.checked)}/>} label="IsParent" />
                            </FormGroup>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Designation name"
                                type="text"
                                fullWidth
                                style={{marginTop:"0px"}}
                                value={newDesignation}
                                onChange={(e)=>setNewDesignation(e.target.value)}
                                variant="standard"
                            />
                            
                            <div style={{position:"relative"}}>
                                <TextField
                                    margin="dense"
                                    label="In Department"
                                    type="text"
                                    fullWidth
                                    onFocus={()=>{
                                        setShowDepartmentList(true)
                                    }}
                                    onBlur={()=>{
                                        setTimeout(() => {
                                            setShowDepartmentList(false)
                                        }, 200);
                                    }}
                                    value={newDesignationDepartment.name}
                                    onChange={(e)=>setNewDesignationDepartment({name:e.target.value})}
                                    variant="standard"
                                />
                                {showDepartmentList && (
                                    <div style={{
                                        border:"1px solid #999",
                                        borderRadius:"5px",
                                        position:"absolute",
                                        minWidth:"100%",
                                        marginTop:"5px",
                                        fontSize:"12px",
                                        background:"#fff",
                                        zIndex:"11"
                                    }}>
                                        <Typography
                                                component={"p"}
                                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                                        >
                                            In Department :
                                        </Typography>
                                        {departmentList?.map((item,idx)=>{
                                            if(item.name.toLowerCase().includes(newDesignationDepartment?.name?.toLowerCase())){
                                                return (
                                                    <Typography key={idx} component={"p"} 
                                                        sx={{
                                                            borderBottom:departmentList.length-1==idx?"0px":"1px solid #999",
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
                                                            setNewDesignationDepartment(item)
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
                            <div style={{position:"relative"}}>
                                <TextField
                                    margin="dense"
                                    label="Reports To (If or Leave blank)"
                                    type="text"
                                    fullWidth
                                    onFocus={()=>{
                                        setShowParentList(true)
                                    }}
                                    onBlur={()=>{
                                        setTimeout(() => {
                                            setShowParentList(false)
                                        }, 200);
                                    }}
                                    value={newDesignationParent.name}
                                    onChange={(e)=>setNewDesignationParent({name:e.target.value})}
                                    variant="standard"
                                />
                                {showParentList && (
                                    <div style={{
                                        border:"1px solid #999",
                                        borderRadius:"5px",
                                        position:"absolute",
                                        minWidth:"100%",
                                        marginTop:"5px",
                                        fontSize:"12px",
                                        background:"#fff",
                                        zIndex:"11"
                                    }}>
                                        <Typography
                                                component={"p"}
                                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                                        >
                                            Reports to :
                                        </Typography>
                                        {designationList?.map((item,idx)=>{
                                            return(
                                                <Typography key={idx} component={"p"} 
                                                        sx={{
                                                            borderBottom:designationList.length-1==idx?"0px":"1px solid #999",
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
                                                            setNewDesignationParent(item)
                                                        }}
                                                >
                                                    {item.name}
                                                </Typography>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button  onClick={handleCreateAddDesignation} style={{fontSize:"12px",color:"#212529"}}>Save</Button>
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

export default Designation;
