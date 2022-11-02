import React,{useEffect,useState} from 'react';

import TableComponent from '../table/table.component';
import dayjs from 'dayjs';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import { createLeavePolicy, getGovHolidayList, getLeavePolicyList } from '../../actions/hr';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';

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


const LeavePolicy = ({setHeading}) => {
    const today = new Date()
    const tomorrow = new Date()
    let dispatch = useDispatch()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const [headCells,setHeadCells] = useState([])
    const [roleCells,setRoleCells] = useState([])
    const [denseTable,setDenseTable] = useState(true)
    const [openAddNewPolicy,setOpenAddNewPolicy] = useState(false)
    const [newPolicyName,setNewPolicyName] = useState("")
    // const [newPolicyDays,setNewPolicyDays] = useState([])
    const [newPolicyDays,setNewPolicyDays] = useState(0)
    const [policyValidTill,setPolicyValidTill] = useState("")

    const [govHolidays,setGovHolidays] = useState({})
    const [includeOptional,setIncludeOptional] = useState(true)
    const [includeMandatory,setIncludeMandatory] = useState(true)
    const [selectedDays,setSelectedDays] = useState([])
    const [validTillvalue,setValidTillValue] = useState("")
    const leavePolicyList = useSelector(state=>state.hr.leavePolicy)

    const handleClickOnAddDesignation = ()=>{
        setOpenAddNewPolicy(true)
    }
    const handleCreateAddPolicy = async()=>{
        // var data = []
        // for (const holiday in govHolidays){
        //     if(includeMandatory){
        //         if(govHolidays[holiday].mandatory!=""){
        //             data.push({year:holiday.split("-")[0],month:holiday.split("-")[1],day:holiday.split("-")[2]})
        //         }
        //     }
        //     if(includeMandatory){
        //         if(govHolidays[holiday].restricted!=""){
        //             data.push({year:holiday.split("-")[0],month:holiday.split("-")[1],day:holiday.split("-")[2]})
        //         }
    
        //     }
        // }
        // console.log(dayjs(validTillvalue,"YYYY-MM-DD").valueOf())
        // console.log({policyName:newPolicyName,validTill:dayjs(validTillvalue,"YYYY-MM-DD").valueOf(),dates:JSON.stringify([...data,...selectedDays])})
        console.log({newPolicyName,newPolicyDays})
        dispatch(createLeavePolicy({newPolicyName,newPolicyDays}))
        
    }

    const handleCloseAddPolicy = ()=>{
        setOpenAddNewPolicy(false)
        setNewPolicyName("")
        setNewPolicyDays([today, tomorrow])
    }

    useEffect(() => {
        setHeading("Leave Policy")

    }, []);

    async function getHolidays(){
        setGovHolidays(await getGovHolidayList())
        
    }
    useEffect(()=>{
        var head = []
        var row = []
        head.push(createHead("id",true))
        head.push(createHead("policyName",false))
        head.push(createHead("days",true))
        setHeadCells(head)
        console.log({leavePolicyList})
        for (var i =0;i<leavePolicyList.length;i++){
            if(leavePolicyList[i]){
                var a = {
                    id:leavePolicyList[i].id,
                    policyName:leavePolicyList[i].policyName,
                    days:leavePolicyList[i].days
                }
                row.push(a)
            }
        }
        setRoleCells(row)
    },[leavePolicyList])

    useEffect(()=>{
        dispatch(getLeavePolicyList())
        // getHolidays()
    },[])

    // useEffect(()=>{
    //     console.log({govHolidays})
    // },[govHolidays])
    return (
        <>
            <Button onClick={handleClickOnAddDesignation} variant={"outlined"} style={{color:"#333",border:"1px solid #333",marginBottom:"10px"}}>Create <AddIcon /></Button>
            <>
                <Dialog open={openAddNewPolicy} onClose={handleCloseAddPolicy} maxWidth="sm" fullWidth>
                    <DialogContent style={{height:"500px"}}>
                        <DialogContentText style={{fontSize:"14px",fontWeight:500}}>
                            Add Leave Policy
                        </DialogContentText>
                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: "5px auto", maxWidth: '100%' },
                                '& .MuiInputLabel-root':{marginTop:"1px",fontSize:"12px",},
                                '& .MuiInputBase-input':{fontSize:"12px"},
                                "& .rmdp-container":{width:"100%",fontSize:"12px"},
                                m:"auto"
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Policy name"
                                type="text"
                                fullWidth
                                style={{marginTop:"8px"}}
                                value={newPolicyName}
                                onChange={(e)=>setNewPolicyName(e.target.value)}
                                variant="standard"
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                label="No. of days"
                                type="number"
                                fullWidth
                                style={{marginTop:"8px"}}
                                value={newPolicyDays}
                                onChange={(e)=>setNewPolicyDays(e.target.value)}
                                variant="standard"
                            />
                            {/* <DatePicker
                                style={{border:"none",marginTop:"8px",outline:"none",width:"100%",boxShadow:"none"}}
                                value={policyValidTill} 
                                format={"YYYY-MM-DD"}
                                render={<CustomRMDInput lable="Valid Till" setSelectedDays={setValidTillValue} />}
                                onChange={setPolicyValidTill}
                                // plugins={[
                                //     <DatePanel />
                                // ]}
                            /> */}
                            {/* <Box sx={{
                                    mt:"8px",
                                    "& .MuiSvgIcon-root":{width:18,height:18},
                                    "& .MuiFormControlLabel-label":{fontSize:"14px"}
                                }}>
                                <FormControlLabel  control={<Checkbox checked={includeMandatory} onChange={(e)=>setIncludeMandatory(e.target.checked)} />} label="Include Govt. Mandotary holidays (2 years)" />
                                <FormControlLabel  control={<Checkbox checked={includeOptional} onChange={(e)=>setIncludeOptional(e.target.checked)} />} label="Include Govt. Optional holidays (2 years)" />
                            </Box> */}
                            {/* <DatePicker
                                style={{border:"none",marginTop:"8px",outline:"none",width:"100%",boxShadow:"none"}}
                                multiple
                                sort
                                value={newPolicyDays} 
                                format={"YYYY-MM-DD"}
                                render={<CustomRMDInput setSelectedDays={setSelectedDays} lable="Dates" helperText="Only date and month will be considered and will be applied for 2 years on the same dates selected above."/>}
                                onChange={setNewPolicyDays}
                                plugins={[
                                    <DatePanel />
                                ]}
                            /> */}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button  onClick={handleCreateAddPolicy} style={{fontSize:"12px",color:"#212529"}}>Save</Button>
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
                    onClickOnRow={()=>{}}
                /> 
        </>
    );
}

const CustomRMDInput = ({ openCalendar, value ,setSelectedDays,lable,helperText})=>{
    useEffect(()=>{
        if(setSelectedDays){
            setSelectedDays(value)
        }
    },[value])
    return (
        <TextField
            autoFocus
            margin="dense"
            label={lable}
            type="text"
            fullWidth
            readOnly
            onClick={openCalendar}
            value={value}
            style={{marginTop:"0px"}}
            variant="standard"
            helperText={helperText}
        />
    )
}

export default LeavePolicy;
