import React,{useState,useEffect} from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

import {getEmployeesList,createEmployeeInfo,updateEmployee,createEmployee,updateEmployeeInfo,deleteEmployeeInfo, getRolesList,setRoleToEmployee, getBranchList, setBranchToEmployee, getDepartmentList, setDepartmentToEmployee, getDesignationList, setDesignationToEmployee, getLeavePolicyList, setLeavePolciyToEmployee, setEmployeeReportsTo} from "../../actions/hr"
import { Button, Divider, Grid, IconButton, ListItem, ListItemButton, Typography } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import TextField from '@mui/material/TextField';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

import dayjs from "dayjs"



import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ContactsIcon from '@mui/icons-material/Contacts';
import SchoolIcon from '@mui/icons-material/School';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';


import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AttendanceEmployee from './attendance.employee.component';
import { getAttendance } from '../../actions/general';
import Payslip from './payslip.component';



const TABS = styled(Tabs)({
    marginRight:"5px",
    marginLeft:"5px",
    padding:"0px 0px 0px 10px",
    boxShadow:"0px 0px 4px rgb(211,211,211)",
    borderRadius:"4px",
    '& .MuiTab-root':{
        color:"#333"
    },
    '& .MuiTabs-indicator': {
        backgroundColor: '#999',
        bottom:"10px"
        
    },
    '& .Mui-selected': {
        color: '#000 !important',
    },
    '& .MuiTabs-scroller':{
        display:"flex",
        alignItems:"center"
    }
});

const dummyEducation = [
    {type:"High School",date:dayjs("2014/04/01").valueOf(),value:"Kendriya Vidayalya No.1 Dilkhudha Garden, Lucknow, UP, India"},
    {type:"Senior Secondary",date:dayjs("2016/04/01").valueOf(),value:"Kendriya Vidayalya AMC, Lucknow, UP, India"},
    {type:"Graduation",date:dayjs("2019/06/01").valueOf(),value:"BSc in Hospitality & Hotel Adminstrative IHM Bangalore, Bangalore, Karnataka,India"}
]
const dummyPrevWorkEx = [
    {type:"Inter",date:dayjs("2014/04/01").valueOf(),value:"CIOC"},
    {type:"Software engineer",date:dayjs("2016/04/01").valueOf(),value:"CIOC"},
    {type:"Software engineer",date:dayjs("2019/06/01").valueOf(),value:"Sourcehub"}
]

const dummyEmployee = {
    contactDetails:[
        {type:'Preferred Email ID',value:"pkytsky@gmail.com"},
        {type:'Email',value:"pkytsky@gmail.com"},
        {type:'Mobile Number',value:"+91 9506370145"},
        {type:"Current Address" , value:"A4 054 DLF Westend Height, Akshayanagar, bangalore, Karanataka, India"},
        {type:"Permanent Address " , value:"A4 054 DLF Westend Height, Akshayanagar, bangalore, Karanataka, India"}
    ],
    education:dummyEducation,
    personalDetails:{
        firstName:"Sandeep",
        lastName:"Yadav",
        dob:dayjs("1998/05/08").valueOf(),
        fatherName:"Krishna Prasad Yadav",
        motherName:"Lalita Yadav",
        fatherOccupation:"Army",
        motherOccupation:"House wife",
        bloodGroup:"B+",
        id:1,
        username:"sandeep",
        profilePic:""
    },
    prevWorkEx: dummyPrevWorkEx
}



const Employee = ({setHeading}) => {
    let dispatch = useDispatch()
    const [value, setValue] = useState(0);
    const [limit,setLimit] = useState(10)
    const [offset,setOffset] = useState(0)
    const [employees,setEmployee] = useState([])
    const [openTabs,setOpenTabs] = useState([])
    const [currentEmployee,setCurrentEmployee] = useState()
    const [openAddEmployee, setOpenAddEmployee] = useState(false);
    const [newEmployee,setNewEmployee] = useState("")
    const hrEmployees = useSelector(state=>state.hr.employees)
    const handleChange = (event, newValue) => {
        console.log(newValue)
        setValue(newValue);
    };

    useEffect(() => {
        console.log({hrEmployees})
        if (hrEmployees){
            setEmployee(hrEmployees)
        }
    }, [hrEmployees]);

    // useEffect(() => {
    //     if (employees.length>0){
    //         hrEmployees.map((item,idx)=>{
    //             dispatch(getAttendance({id:item.id}))
    //         })
    //     }
    // }, [employees]);



    useEffect(()=>{
        if (currentEmployee){
            setCurrentEmployee(prevState=>{
                var updatedEmployee = hrEmployees.filter(item=>item.id==currentEmployee.personalDetails.empId)[0]
                if (updatedEmployee){
                    var data = {
                        contactDetails:[...updatedEmployee.employeesinfos.filter(item=>item.type=="Contact details")],
                        education:updatedEmployee.employeesinfos.filter(item=>item.type=="Education details"),
                        personalDetails:{
                            empId:updatedEmployee.id,
                            firstName:updatedEmployee.firstName,
                            lastName:updatedEmployee.lastName,
                            dob:dayjs(updatedEmployee.dob).valueOf(),
                            fatherName:updatedEmployee.fatherName,
                            motherName:updatedEmployee.motherName,
                            fatherOccupation:updatedEmployee.fatherOccupation,
                            motherOccupation:updatedEmployee.motherOccupation,
                            bloodGroup:updatedEmployee.bloodGroup,
                            id:updatedEmployee.user.id,
                            username:updatedEmployee.user.username,
                            profilePic:updatedEmployee.user.profilepic,
                            email:updatedEmployee.user.email
                        },
                        designation:updatedEmployee.designation?updatedEmployee.designation:{name:"",id:0},
                        permission:updatedEmployee.user.roles,
                        leavePolicys:updatedEmployee.leavePolicys,
                        primaryReportsTo:updatedEmployee.primaryReportsTo,
                        secondryReportsTo:updatedEmployee.secondryReportsTo,
                        branch:updatedEmployee.branch?updatedEmployee.branch:[],
                        department:updatedEmployee.department?updatedEmployee.department:{name:"",id:0},
                        prevWorkEx: updatedEmployee.employeesinfos.filter(item=>item.type=="Prev Work Experience")
                    }
                    setCurrentEmployee(data)
                }
            })
        }
    },[hrEmployees])

    const getEmployees = async()=>{
        if(hrEmployees.length==0){
            dispatch(getEmployeesList({limit,offset}))
        }
    }

    const handleClickOnTab = async({id})=>{
        var employee = hrEmployees.filter(item=>item.id==id)[0]
        var data = {
            contactDetails:[...employee.employeesinfos.filter(item=>item.type=="Contact details")],
            education:employee.employeesinfos.filter(item=>item.type=="Education details"),
            personalDetails:{
                empId:employee.id,
                firstName:employee.firstName,
                lastName:employee.lastName,
                dob:dayjs(employee.dob).valueOf(),
                fatherName:employee.fatherName,
                motherName:employee.motherName,
                fatherOccupation:employee.fatherOccupation,
                motherOccupation:employee.motherOccupation,
                bloodGroup:employee.bloodGroup,
                id:employee.user.id,
                username:employee.user.username,
                profilePic:employee.user.profilepic,
                email:employee.user.email
            },
            designation:employee.designation?employee.designation:{name:"",id:0},
            permission:employee.user.roles,
            branch:employee.branch?employee.branch:[],
            primaryReportsTo:employee.primaryReportsTo,
            secondryReportsTo:employee.secondryReportsTo,
            leavePolicys:employee.leavePolicys,
            department:employee.department?employee.department:{name:"",id:0},
            prevWorkEx: employee.employeesinfos.filter(item=>item.type=="Prev Work Experience")
        }
        setCurrentEmployee(data)
    }


    const handleOnClickEmployeeUsername = async(data)=>{    
        var {id} = data
        setOpenTabs(prevState=>{
            var newState = [...prevState]
            var index = newState.findIndex(x => x.id==id)
            if (index==-1){
                newState.push(data)
                setValue(newState.length-1);
            }else{
                setValue(index)
            }
            handleClickOnTab({id})
            return newState
        })

    }
    const handleClickOnAddEmployee = ()=>{
        setNewEmployee("")
        setOpenAddEmployee(true);
    }
    const handleCloseAddEmployee = () => {
        setOpenAddEmployee(false);
        setNewEmployee("")

      };

    const handleCreateAddEmployee = ()=>{
        console.log({newEmployee})
        dispatch(createEmployee({username:newEmployee}))
        setNewEmployee("")
        setOpenAddEmployee(false);
    }

    useEffect(()=>{

        getEmployees()
        setHeading("Employees")
    },[])

    return (
        <div >
            <div style={{display:"flex"}}>
                <div style={{fontSize:"14px",height:"80vh",overflow:"auto",width:"300px",marginRight:"5px",padding:"5px",boxShadow:"0px 0px 4px rgb(221, 221, 221)",paddingTop:"20px",borderRadius:"4px"}}>
                    <div style={{width:"90%",margin:"auto",marginBottom:"10px"}}>
                        <Button variant='outlined' style={{color:"#000",fontSize:"14px",border:"1px solid #adb5bd",borderRadius:"4px",width:"100%"}} onClick={handleClickOnAddEmployee}>
                            Add Employee
                        </Button>
                    </div>
                    <>
                    <Dialog open={openAddEmployee} onClose={handleCloseAddEmployee} maxWidth="sm" fullWidth>
                        {/* <DialogTitle>Add Employee</DialogTitle> */}
                        <DialogContent>
                            <DialogContentText style={{fontSize:"14px",fontWeight:500}}>
                                To Add Employee, lets start with Employee username.
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
                                    label="Employee username"
                                    type="text"
                                    fullWidth
                                    value={newEmployee}
                                    onChange={(e)=>setNewEmployee(e.target.value)}
                                    variant="standard"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button  onClick={handleCreateAddEmployee} style={{fontSize:"12px",color:"#212529"}}>Save</Button>
                        </DialogActions>
                    </Dialog>
                    </>
                    {/* <div style={{border:"1px solid #adb5bd",borderRadius:"4px",padding:"8px 10px",width:"90%",margin:"auto",marginBottom:"10px"}}>
                        <p style={{margin:0,fontSize:"14px",color:"#444",textAlign:"center"}}>Add Employee</p>
                    </div> */}
                    {employees?.map((item,idx)=>{
                        return (
                            <ListItem key={idx} disablePadding style={{}}>
                                <ListItemButton key={idx} onClick={()=>{
                                    handleOnClickEmployeeUsername({...item})
                                }} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <p style={{margin:"0",fontSize:"12px"}}>
                                        {item?.firstName.length>0?item.firstName.toUpperCase():item?.user?.username.toUpperCase()}
                                    </p>
                                    <MoreVertIcon />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </div>
                <Box sx={{ width: '76%' }}>
                    {openTabs?.length>0 && (
                        <>
                            <TABS
                                value={value}
                                onChange={handleChange}
                                aria-label="Employee tabs"
                                scrollButtons={false}
                                variant="scrollable"
                            >
                                {openTabs?.map((item,idx)=>{
                                    return(
                                        <Tab style={{borderBottom:"#999",fontSize:"12px",minHeight:"24px",padding:"10px 12px"}} key={idx} value={item.idx} label={item?.firstName.length>0?item.firstName.toUpperCase():item?.user?.username.toUpperCase()} onClick= {()=>handleClickOnTab({id:item.id})} />
                                    )
                                })}
                            </TABS>
                            {currentEmployee && (
                                <CurrentEmployee currentEmployee={currentEmployee} setCurrentEmployee={setCurrentEmployee}/>
                            )} 
                        </>
                    )}
                </Box>
            </div>
        </div>
    );
}

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

function stringAvatar(name,src,alt) {
    if (name){
        var nameChildren = name.split(" ")
        return {
          sx: {
            bgcolor: stringToColor(name),
            width: 100, height: 100,margin:"auto"
          },
          alt:alt,
          src:src,
          children: `${name.split(' ')[0][0]} ${nameChildren.length>1? name.split(' ')[1][0]:""}`,
        };
    }
  }

const CurrentEmployee = ({currentEmployee,setCurrentEmployee})=>{
    const [employee,setEmployee] = useState()
    const [whichPanel,setWhichPanel] = useState()

    useEffect(()=>{
        setEmployee(currentEmployee)
    },[currentEmployee])

    return (
        // <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} style={{padding:"5px",height:"76vh"}}>
                <Grid item xs={4}>
                    <div style={{boxShadow:"0px 0px 4px rgb(221, 221, 221)",marginTop:"6px",height:"92.5%",borderRadius:"4px",paddingTop:"4px"}}>
                        <div style={{width:"70%",margin:"30px auto auto auto",borderRadius:"4px",padding:"10px"}}>
                            <Avatar
                                {...stringAvatar(`${employee?.personalDetails.firstName} ${employee?.personalDetails.lastName}`,"",employee?.personalDetails.firstName)}
                            />
                            <Divider  style={{marginTop:"10px"}}/>
                            <div style={{width:"100%",margin:"auto"}}>
                                <p style={{fontSize:"12px",margin:0,textAlign:"left",marginTop:"10px",display:"flex",flexDirection:"column"}}>
                                    <span style={{fontWeight:500}}>EMP ID: <span style={{fontWeight:300}}>#{employee?.personalDetails.id}</span></span>
                                    <span style={{fontWeight:500}}>Full Name: <span style={{fontWeight:300}}>{employee?.personalDetails.firstName} {employee?.personalDetails.lastName}</span></span>
                                    <span style={{fontWeight:500}}>DOB: <span style={{fontWeight:300}}>{dayjs(employee?.personalDetails.dob).format("MM/DD/YYYY")}</span></span>
                                    <span style={{fontWeight:500}}>Blood Group: <span style={{fontWeight:300}}>{employee?.personalDetails.bloodGroup}</span></span>
                                    <span style={{fontWeight:500}}>Email: <span style={{fontWeight:300}}>{employee?.personalDetails.email}</span></span>
                                </p>
                            </div>
                        </div>
                        <div style={{width:"100%",padding:"0px 50px 10px",margin:"auto",overflow:"auto",height:"50%"}}>
                            {['Contact Details','Personal Details',"Education Details","Previous Work Experience","Employee Details","Attendance","Payslip"].map((item,idx)=>{
                                return (
                                    <div key={idx} onClick={()=>{
                                        setWhichPanel(item)
                                    }} style={{padding:"10px",boxShadow:"0px 0px 4px #999",marginTop:"10px",borderRadius:"4px",cursor:"pointer",background:"#fff"}}>
                                        <p style={{margin:"0",fontSize:"12px"}}>{item}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <EmployeePanel currentEmployee={currentEmployee} setCurrentEmployee={setCurrentEmployee} whichPanel={whichPanel}/>

                    {/* <p >{currentEmployee?.username}</p> */}
                </Grid>
            </Grid>
        // </Box>
    )
}


const EmployeePanel = ({currentEmployee,setCurrentEmployee,whichPanel})=>{

    if (whichPanel=="Contact Details"){
        return (
            <ContactDetails currentEmployee={currentEmployee}/>
        )
    }else if(whichPanel=="Personal Details"){
        return (
            <PersonalDetails currentEmployee={currentEmployee}/>
        )
    }else if(whichPanel=="Education Details"){
        return (
            <EducationDetails currentEmployee={currentEmployee}/>
        )
    }else if (whichPanel == "Previous Work Experience"){
        return (
            <PrevWorkExDetails currentEmployee={currentEmployee}/>
        )
    }else if (whichPanel == "Exit"){
        return (
            <Exit currentEmployee={currentEmployee}/>
        )
    }else if (whichPanel == "Employee Details"){
        return(
            <PermissionPanel currentEmployee={currentEmployee} setCurrentEmployee={setCurrentEmployee}/>
        )
    }else if (whichPanel == "Attendance"){
        return (
            <AttendanceEmployee currentEmployee={currentEmployee}/>
        )
    }else if(whichPanel == "Payslip"){
        return (
            <Payslip currentEmployee = {currentEmployee} />
        )
    }

}


const ChipItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

const PermissionPanel = ({currentEmployee,setCurrentEmployee})=>{
    let dispatch = useDispatch()
    const [chipData, setChipData] = useState([]);
    const [leavePolicyChipData,setLeavePolicyChipData] = useState([])
    const [role, setRole] = useState("");
    const [branch,setBranch] = useState("")
    const [department,setDepartment] = useState("")
    const [designation,setDesignation] = useState("")
    const [leavePolicyName,setLeavePolicyName] = useState("")

    const [showList,setShowList] = useState(false)
    const [showBranchList,setShowBranchList] = useState(false)
    const [showDepartmentList,setShowDepartmentList] = useState(false)
    const [showDesignationList,setShowDesignationList] = useState(false)
    const [showLeavePolicyList,setShowLeavePolicyList] = useState(false)
    const [showPrimaryReportList,setShowPrimaryReportList] = useState(false)
    const [showSecondryReportList,setShowSecondryReportList] = useState(false)


    const rolesList = useSelector(state=>state.hr.roles)
    const branchList = useSelector(state=>state.hr.branch)
    const employeeList = useSelector(state=>state.hr.employees)
    const departmentList = useSelector(state=>state.hr.department)
    const designationList = useSelector(state=>state.hr.designation)
    const leavePolicyList = useSelector(state=>state.hr.leavePolicy)

    const [rolesListTried,setRolesListTried] = useState(false)
    const [branchListTried,setBranchListTried] = useState(false)
    const [employeeListTried,setEmployeeListTried] = useState(false)
    const [departmentListTried,setDepartmentListTried] = useState(false)
    const [designationListTried,setDesignationListTried] = useState(false)
    const [leavePolicyListTried,setLeavePolicyListTried] = useState(false)

    useEffect(()=>{
        if(!rolesListTried){
            if (rolesList.length==0){
                setRolesListTried(true)
                dispatch(getRolesList())
            }
        }
    },[rolesList])

    useEffect(()=>{
        if(!designationListTried){
            if (designationList.length==0){
                setDesignationListTried(true)
                dispatch(getDesignationList())
            }
        }
    },[designationList])
    
    useEffect(() => {
        if(!branchListTried){
            if(branchList.length==0){
                setBranchListTried(true)
                dispatch(getBranchList())
            }
        }
    }, [branchList]);

    useEffect(() => {
        if(!departmentListTried){
            if(departmentList.length==0){
                setDepartmentListTried(true)
                dispatch(getDepartmentList())
            }
        }
    }, [departmentList]);

    useEffect(() => {
        console.log(!leavePolicyListTried)
        if(!leavePolicyListTried){
            if(leavePolicyList.length==0){
                setLeavePolicyListTried(true)
                dispatch(getLeavePolicyList())
            }
        }
    }, [leavePolicyList]);


    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => {
            var rIds = []
            var newState =  chips.filter((chip) => {
                if(chip.id !== chipToDelete.id){
                    rIds.push(chip.id)
                    return chip
                }
            })
            var newPermission = newState
            var newStateOfCurrentEmployee = employeeList.filter(item2=>item2.id==currentEmployee.personalDetails.empId)[0]
            dispatch(
                setRoleToEmployee({newPermission,empId:currentEmployee.personalDetails.empId,newStateOfCurrentEmployee,uId:currentEmployee?.personalDetails?.id,rId:rIds})
            )
            
            return newState
        });

    };  

    useEffect(()=>{
        console.log(currentEmployee)
        setChipData(currentEmployee?.permission)
        setLeavePolicyChipData(currentEmployee?.leavePolicys)
    },[currentEmployee])


    return (
        <>
            <div style={{marginTop:"10px"}}>
                <Typography component={"h3"} style={{fontSize:"16px",display:"flex",justifyContent:"start",alignItems:"center"}}> <span><AddModeratorIcon style={{marginRight:"10px",marginBottom:"3px"}}/></span> Permissions/Employement Type</Typography>
                <Paper
                    sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.2,
                        m: 0,
                        marginTop:"5px",
                        // border:"1px solid #999",
                        boxShadow:"0px 0px 4px rgb(211,211,211)",
                        background:"transparent",
                        maxWidth:"100%",
                        borderRadius:"4px"
                    }}
                    component="ul"
                    >
                    {chipData?.map((data) => {
                        let icon;

                        

                        return (
                        <ChipItem key={data.id}>
                            <Chip
                            icon={icon}
                            label={data.name}
                            onDelete={handleDelete(data)}
                            style={{
                                height:"25px",
                                borderRadius:"4px"
                            }}
                            />
                        </ChipItem>
                        );
                    })}
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <input value={role} 
                        onBlur={()=>{
                            setTimeout(() => {
                                setShowList(false)
                            }, 200);
                        }} 
                        onFocus={()=>{
                            setShowList(true)
                        }} style={{borderRadius:"4px",padding:"5px 7px",marginTop:"0px" ,border:"0px",outline:"none",maxWidth:"100%",fontSize:"12px"}} type="text" name="role"  onChange={(e)=>{
                            setRole(e.target.value)
                        }} placeholder="Add permissions.." />
                    </div>
                </Paper>
                {showList && (
                    <div
                        onClick={()=>{
                            setTimeout(() => {
                                setShowList(false)
                            }, 150)
                        }}
                        style={{
                            border:"1px solid #999",
                            borderRadius:"5px",
                            position:"absolute",
                            minWidth:"49%",
                            marginTop:"5px",
                            fontSize:"12px",
                            background:"#fff",
                            zIndex:11
                        }}
                    >
                        <Typography
                                component={"p"}
                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                        >
                            Assign Permission/Employment Type :
                        </Typography>
                        {rolesList.length==0 && (
                            <Typography
                                component={"p"}
                                style={{fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                            >
                                Create Employemnet Type/Permission Before Continuing...
                            </Typography>
                        )}
                        {rolesList?.map((item,idx)=>{
                            if(item.name.includes(role)){
                                return (
                                    <Typography key={idx} component={"p"} 
                                        sx={{
                                            borderBottom:rolesList.length-1==idx?"0px":"1px solid #999",
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
                                            setChipData(chips=>{
                                                var newChips=[...chips]
                                                if (chips.find(c=>c.id==item.id)){
                                                    return chips
                                                }
                                                newChips.push(item)
                                                var newPermission = [...currentEmployee.permission,item]
                                                var newStateOfCurrentEmployee = employeeList.filter(item2=>item2.id==currentEmployee.personalDetails.empId)[0]
                                                dispatch(
                                                    setRoleToEmployee({newPermission,newStateOfCurrentEmployee,empId:currentEmployee.personalDetails.empId,uId:currentEmployee?.personalDetails?.id,rId:[...currentEmployee.permission.map(i=>{return i.id}),item.id]})
                                                )
                                                // dispatch({type:"UPDATEEMPLOYEE",payload:{
                                                //     id:currentEmployee.personalDetails.empId,
                                                //     data:{...newStateOfCurrentEmployee,user:{...newStateOfCurrentEmployee.user,roles:newPermission}}
                                                // }})
                                                setRole("")
                                                return newChips
                                            })

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
            <div style={{marginTop:"10px"}}>
                <Typography component={"h3"} style={{fontSize:"16px",display:"flex",justifyContent:"start",alignItems:"center"}}> <span><AddModeratorIcon style={{marginRight:"10px",marginBottom:"3px"}}/></span> Leave Policy</Typography>
                <Paper
                    sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.2,
                        m: 0,
                        marginTop:"5px",
                        // border:"1px solid #999",
                        boxShadow:"0px 0px 4px rgb(211,211,211)",
                        background:"transparent",
                        maxWidth:"100%",
                        borderRadius:"4px"
                    }}
                    component="ul"
                    >
                    {leavePolicyChipData?.map((data) => {
                        let icon;

                        

                        return (
                        <ChipItem key={data.id}>
                            <Chip
                            icon={icon}
                            label={data.policyName}
                            onDelete={()=>console.log(data)}
                            style={{
                                height:"25px",
                                borderRadius:"4px"
                            }}
                            />
                        </ChipItem>
                        );
                    })}
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <input value={leavePolicyName} 
                        onBlur={()=>{
                            setTimeout(() => {
                                setShowLeavePolicyList(false)
                            }, 200);
                        }} 
                        onFocus={()=>{
                            setShowLeavePolicyList(true)
                        }} style={{borderRadius:"4px",padding:"5px 7px",marginTop:"0px" ,border:"0px",outline:"none",maxWidth:"100%",fontSize:"12px"}} type="text" name="role"  onChange={(e)=>{
                            setLeavePolicyName(e.target.value)
                        }} placeholder="Add Leave Policy.." />
                    </div>
                </Paper>
                {showLeavePolicyList && (
                    <div
                        onClick={()=>{
                            setTimeout(() => {
                                setShowList(false)
                            }, 150)
                        }}
                        style={{
                            border:"1px solid #999",
                            borderRadius:"5px",
                            position:"absolute",
                            minWidth:"49%",
                            marginTop:"5px",
                            fontSize:"12px",
                            background:"#fff",
                            zIndex:11
                        }}
                    >
                        <Typography
                                component={"p"}
                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                        >
                            Assign Leave Policy :
                        </Typography>
                        {leavePolicyList.length==0 && (
                            <Typography
                                component={"p"}
                                style={{fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                            >
                                Create Leave Policy Before Continuing...
                            </Typography>
                        )}
                        {leavePolicyList?.map((item,idx)=>{
                            if(item.policyName.toLowerCase().includes(leavePolicyName.toLowerCase())){
                                return (
                                    <Typography key={idx} component={"p"} 
                                        sx={{
                                            borderBottom:leavePolicyList.length-1==idx?"0px":"1px solid #999",
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
                                            setLeavePolicyChipData(chips=>{

                                                var newChips=[...chips]
                                                if (chips.find(c=>c.id==item.id)){
                                                    return chips
                                                }
                                                newChips.push(item)
                                                var newLeavePolicys = [...currentEmployee.leavePolicys,item]
                                                var newStateOfCurrentEmployee = employeeList.filter(item2=>item2.id==currentEmployee.personalDetails.empId)[0]
                                                dispatch(
                                                    setLeavePolciyToEmployee({newLeavePolicys,newStateOfCurrentEmployee,empId:currentEmployee.personalDetails.empId,uId:currentEmployee?.personalDetails?.id,lId:[...currentEmployee.leavePolicys.map(i=>{return i.id}),item.id]})
                                                )
                                                // dispatch({type:"UPDATEEMPLOYEE",payload:{
                                                //     id:currentEmployee.personalDetails.empId,
                                                //     data:{...newStateOfCurrentEmployee,user:{...newStateOfCurrentEmployee.user,roles:newPermission}}
                                                // }})
                                                setLeavePolicyName("")
                                                return newChips
                                            })

                                        }}
                                    >
                                        {item.policyName}
                                    </Typography>
                                )
                            }
                        })}
                    </div>
                )}
            
            </div>
            <div style={{display:"flex",justifyContent:"spance-between",columnGap:"10px"}}>
                <div style={{marginTop:"15px",width:"50%"}}>
                    <Typography component={"h3"} style={{fontSize:"16px",display:"flex",justifyContent:"start",alignItems:"center"}}> <span><BadgeIcon style={{marginRight:"10px",marginBottom:"3px"}}/></span> Branch</Typography>
                    <Paper
                        sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0.2,
                            m: 0,
                            marginTop:"5px",
                            // border:"1px solid #999",
                            boxShadow:"0px 0px 4px rgb(211,211,211)",

                            background:"transparent",
                            maxWidth:"100%",
                            borderRadius:"4px"
                        }}
                        component="ul"
                        >
                            <ChipItem key={currentEmployee.branch?.id}>
                                <Chip
                                    label={currentEmployee.branch?.name}
                                    // onDelete={handleDelete(currentEmployee.branch)}
                                    style={{
                                        height:"25px",
                                        borderRadius:"4px"
                                    }}
                                />
                            </ChipItem>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <input value={branch} 
                            onBlur={()=>{
                                setTimeout(() => {
                                    setShowBranchList(false)
                                }, 200);
                            }} 
                            onFocus={()=>{
                                setShowBranchList(true)
                            }} style={{borderRadius:"4px",padding:"5px 7px",marginTop:"0px" ,border:"0px",outline:"none",maxWidth:"100%",fontSize:"12px"}} type="text" name="role" onChange={(e)=>{
                                setBranch(e.target.value)
                            }} placeholder="Change Branch.." />
                        </div>
                    </Paper>
                    {showBranchList && (
                        <div 
                            onClick={()=>{
                                setTimeout(() => {
                                    setShowBranchList(false)
                                }, 150);
                            }}
                            style={{
                                border:"1px solid #999",
                                borderRadius:"5px",
                                position:"absolute",
                                minWidth:"24%",
                                marginTop:"5px",
                                fontSize:"12px",
                                background:"#fff",
                                zIndex:11
                            }}
                        >
                            <Typography
                                component={"p"}
                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                            >
                                Transfer To :
                            </Typography>
                            {branchList.length==0 && (
                                <Typography
                                    component={"p"}
                                    style={{fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                                >
                                    Create Branch Before Continuing...
                                </Typography>
                            )}
                            {branchList?.map((item,idx)=>{
                                if(item.name.toLowerCase().includes(branch.toLowerCase())){
                                    return (
                                        <Typography key={idx}  sx={{
                                            borderBottom:branchList.length-1==idx?"0px":"1px solid #999",
                                            margin:0,
                                            padding:"7px 9px",
                                            fontSize:"12px",
                                            "&:hover":{
                                                cursor:"pointer",
                                                backgroundColor:"#999",
                                                color:"#fff"
                                            }
                                        }} onClick={()=>{
                                            var newStateOfCurrentEmployee = employeeList.filter(item=>item.id==currentEmployee.personalDetails.empId)[0]
                                            dispatch(setBranchToEmployee({
                                                empId:currentEmployee.personalDetails.empId,
                                                newStateOfCurrentEmployee,
                                                branch:item,
                                                id:currentEmployee.personalDetails.empId,
                                                branchId:item.id
                                            }))
                                            // dispatch({type:"UPDATEEMPLOYEE",payload:{
                                            //     id:currentEmployee.personalDetails.empId,
                                            //     data:{...newStateOfCurrentEmployee,branch:item}
                                            // }})
                                            setBranch("")
                                        }}>{item.name}</Typography>
                                    )
                                }
                            })}
                        </div>
                    )}
                
                </div>
                <div style={{marginTop:"15px",width:"50%"}}>
                    <Typography component={"h3"} style={{fontSize:"16px",display:"flex",justifyContent:"start",alignItems:"center"}}> <span><BadgeIcon style={{marginRight:"10px",marginBottom:"3px"}}/></span> Department</Typography>
                    <Paper
                        sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0.2,
                            m: 0,
                            marginTop:"5px",
                            // border:"1px solid #999",
                            boxShadow:"0px 0px 4px rgb(211,211,211)",

                            background:"transparent",
                            maxWidth:"100%",
                            borderRadius:"4px"
                        }}
                        component="ul"
                        >
                            <ChipItem key={currentEmployee.department?.id}>
                                <Chip
                                    label={`${currentEmployee.department.name?currentEmployee.department.name:""} ${(currentEmployee.department.name && currentEmployee.branch.name)?`(${currentEmployee.department.branch.name})`:""}`}
                                    // onDelete={handleDelete(currentEmployee.branch)}
                                    style={{
                                        height:"25px",
                                        borderRadius:"4px"
                                    }}
                                />
                            </ChipItem>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <input value={department} 
                            onBlur={()=>{
                                setTimeout(() => {
                                    setShowDepartmentList(false)
                                }, 200);
                            }} 
                            onFocus={()=>{
                                setShowDepartmentList(true)
                            }} style={{borderRadius:"4px",padding:"5px 7px",marginTop:"0px" ,border:"0px",outline:"none",maxWidth:"100%",fontSize:"12px"}} type="text" name="role" onChange={(e)=>{
                                setDepartment(e.target.value)
                            }} placeholder="Change Department.." />
                        </div>
                    </Paper>
                    {showDepartmentList && (
                        <div onClick={()=>{
                            setTimeout(() => {
                                setShowDepartmentList(false)
                            }, 150);
                        }} style={{
                            border:"1px solid #999",
                            borderRadius:"5px",
                            position:"absolute",
                            minWidth:"24%",
                            marginTop:"5px",
                            fontSize:"12px",
                            background:"#fff",
                            zIndex:11
                        }}>
                            <Typography
                                component={"p"}
                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                            >
                                Transfer To :
                            </Typography>
                            {departmentList.length==0 && (
                                <Typography
                                    component={"p"}
                                    style={{fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                                >
                                    Create Department Before Continuing...
                                </Typography>
                            )}
                            {departmentList?.map((item,idx)=>{
                                if((item.name.toLowerCase().includes(department.toLowerCase()) || item.branch.name.toLowerCase().includes(department.toLowerCase())) && item.branch.name.toLowerCase().includes(currentEmployee.branch.name?currentEmployee.branch.name.toLowerCase():"")){
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
                                                var newStateOfCurrentEmployee = employeeList.filter(item=>item.id==currentEmployee.personalDetails.empId)[0]
                                                dispatch(setDepartmentToEmployee({
                                                    empId:currentEmployee.personalDetails.empId,
                                                    newStateOfCurrentEmployee,
                                                    department:item,
                                                    id:currentEmployee.personalDetails.empId,
                                                    departmentId:item.id
                                                }))
                                            }}
                                        >
                                            {item.name} <span style={{fontSize:"10px"}}>({item.branch.name})</span>
                                        </Typography>
                                    )
                                }
                            })}
                        </div>
                    )}
                    
                </div>
            </div>
            <div style={{display:"flex",justifyContent:"spance-between",columnGap:"10px"}}>
                <div style={{marginTop:"15px",width:"50%"}}>
                    <Typography component={"h3"} style={{fontSize:"16px",display:"flex",justifyContent:"start",alignItems:"center"}}> <span><BadgeIcon style={{marginRight:"10px",marginBottom:"3px"}}/></span> Primary Reports To</Typography>
                    <Paper
                        sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0.2,
                            m: 0,
                            marginTop:"5px",
                            // border:"1px solid #999",
                            boxShadow:"0px 0px 4px rgb(211,211,211)",

                            background:"transparent",
                            maxWidth:"100%",
                            borderRadius:"4px"
                        }}
                        component="ul"
                        >
                            <ChipItem key={currentEmployee.primaryReportsTo?.id}>
                                <Chip
                                    label={`${currentEmployee.primaryReportsTo?.firstName?currentEmployee.primaryReportsTo.firstName:""}`}
                                    // onDelete={handleDelete(currentEmployee.branch)}
                                    style={{
                                        height:"25px",
                                        borderRadius:"4px"
                                    }}
                                />
                            </ChipItem>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <input value={department} 
                            onBlur={()=>{
                                setTimeout(() => {
                                    setShowPrimaryReportList(false)
                                }, 200);
                            }} 
                            onFocus={()=>{
                                setShowPrimaryReportList(true)
                            }} 
                            style={{borderRadius:"4px",padding:"5px 7px",marginTop:"0px" ,border:"0px",outline:"none",maxWidth:"100%",fontSize:"12px"}} type="text" name="role" 
                            // onChange={(e)=>{
                            //     setDepartment(e.target.value)
                            // }} 
                            placeholder="Change Primary Reports To.." />
                        </div>
                    </Paper>
                    {showPrimaryReportList && (
                        <div onClick={()=>{
                            setTimeout(() => {
                                setShowPrimaryReportList(false)
                            }, 150);
                        }} style={{
                            border:"1px solid #999",
                            borderRadius:"5px",
                            position:"absolute",
                            minWidth:"24%",
                            marginTop:"5px",
                            fontSize:"12px",
                            background:"#fff",
                            zIndex:11
                        }}>
                            <Typography
                                component={"p"}
                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                            >
                                Assign To :
                            </Typography>
                            {employeeList.length==0 && (
                                <Typography
                                    component={"p"}
                                    style={{fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                                >
                                    Create Employee Before Continuing...
                                </Typography>
                            )}
                            {employeeList?.map((item,idx)=>{
                                // if((item.firstName.toLowerCase().includes(department.toLowerCase()) || item.branch.name.toLowerCase().includes(department.toLowerCase())) && item.branch.name.toLowerCase().includes(currentEmployee.branch.name?currentEmployee.branch.name.toLowerCase():"")){
                                    return (
                                        <Typography key={idx} component={"p"} 
                                            sx={{
                                                borderBottom:employeeList.length-1==idx?"0px":"1px solid #999",
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
                                                var newStateOfCurrentEmployee = employeeList.filter(item=>item.id==currentEmployee.personalDetails.empId)[0]
                                                dispatch(setEmployeeReportsTo({
                                                    empId:currentEmployee.personalDetails.empId,
                                                    newStateOfCurrentEmployee,
                                                    reportTo:item,
                                                    reportsToId:item.id,
                                                    typeOfReport:"PrimaryReportsTo"
                                                }))
                                            }}
                                        >
                                            {item.firstName}
                                        </Typography>
                                    )
                                // }
                            })}
                        </div>
                    )}
                    
                </div>
                <div style={{marginTop:"15px",width:"50%"}}>
                    <Typography component={"h3"} style={{fontSize:"16px",display:"flex",justifyContent:"start",alignItems:"center"}}> <span><BadgeIcon style={{marginRight:"10px",marginBottom:"3px"}}/></span> Secondry Reports To</Typography>
                    <Paper
                        sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0.2,
                            m: 0,
                            marginTop:"5px",
                            // border:"1px solid #999",
                            boxShadow:"0px 0px 4px rgb(211,211,211)",

                            background:"transparent",
                            maxWidth:"100%",
                            borderRadius:"4px"
                        }}
                        component="ul"
                        >
                            <ChipItem key={currentEmployee.secondryReportsTo?.id}>
                                <Chip
                                    label={currentEmployee.secondryReportsTo?.firstName}
                                    // onDelete={handleDelete(currentEmployee.branch)}
                                    style={{
                                        height:"25px",
                                        borderRadius:"4px"
                                    }}
                                />
                            </ChipItem>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <input value={branch} 
                            onBlur={()=>{
                                setTimeout(() => {
                                    setShowSecondryReportList(false)
                                }, 200);
                            }} 
                            onFocus={()=>{
                                setShowSecondryReportList(true)
                            }} 
                            // onChange={(e)=>{
                            //     setBranch(e.target.value)
                            // }} 
                            style={{borderRadius:"4px",padding:"5px 7px",marginTop:"0px" ,border:"0px",outline:"none",maxWidth:"100%",fontSize:"12px"}} type="text" name="role" 
                            placeholder="Change Secondry Reports To.." />
                        </div>
                    </Paper>
                    {showSecondryReportList && (
                        <div 
                            onClick={()=>{
                                setTimeout(() => {
                                    setShowSecondryReportList(false)
                                }, 150);
                            }}
                            style={{
                                border:"1px solid #999",
                                borderRadius:"5px",
                                position:"absolute",
                                minWidth:"24%",
                                marginTop:"5px",
                                fontSize:"12px",
                                background:"#fff",
                                zIndex:11
                            }}
                        >
                            <Typography
                                component={"p"}
                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                            >
                                Assign To :
                            </Typography>
                            {employeeList.length==0 && (
                                <Typography
                                    component={"p"}
                                    style={{fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                                >
                                    Create Employee Before Continuing...
                                </Typography>
                            )}
                            {employeeList?.map((item,idx)=>{
                                // if(item.name.toLowerCase().includes(branch.toLowerCase())){
                                    return (
                                        <Typography key={idx}  sx={{
                                            borderBottom:employeeList.length-1==idx?"0px":"1px solid #999",
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
                                            var newStateOfCurrentEmployee = employeeList.filter(item=>item.id==currentEmployee.personalDetails.empId)[0]
                                            dispatch(setEmployeeReportsTo({
                                                empId:currentEmployee.personalDetails.empId,
                                                newStateOfCurrentEmployee,
                                                reportTo:item,
                                                reportsToId:item.id,
                                                typeOfReport:"SecondryReportsTo"
                                            }))
                                            // dispatch({type:"UPDATEEMPLOYEE",payload:{
                                            //     id:currentEmployee.personalDetails.empId,
                                            //     data:{...newStateOfCurrentEmployee,branch:item}
                                            // }})
                                            // setBranch("")
                                        }}
                                        >{item.firstName}</Typography>
                                    )
                                // }
                            })}
                        </div>
                    )}
                
                </div>
            </div>
            <div style={{display:"flex",justifyContent:"spance-between",columnGap:"10px"}}>
                <div style={{marginTop:"15px",width:"50%"}}>
                    <Typography component={"h3"} style={{fontSize:"16px",display:"flex",justifyContent:"start",alignItems:"center"}}> <span><BadgeIcon style={{marginRight:"10px",marginBottom:"3px"}}/></span>Designation</Typography>
                    <Paper
                        sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0.2,
                            m: 0,
                            marginTop:"5px",
                            // border:"1px solid #999",
                            boxShadow:"0px 0px 4px rgb(211,211,211)",
                            background:"transparent",
                            maxWidth:"100%",
                            borderRadius:"4px"
                        }}
                        component="ul"
                        >
                            <ChipItem key={currentEmployee.designation?.id}>
                                <Chip
                                    label={currentEmployee.designation?.name}
                                    // onDelete={handleDelete(currentEmployee.branch)}
                                    style={{
                                        height:"25px",
                                        borderRadius:"4px"
                                    }}
                                />
                            </ChipItem>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <input value={designation} 
                                onBlur={()=>{
                                    setTimeout(() => {
                                        setShowDesignationList(false)
                                    }, 200);
                                }} 
                                onFocus={()=>{
                                    setShowDesignationList(true)
                                }} 
                                style={{borderRadius:"4px",padding:"5px 7px",marginTop:"0px" ,border:"0px",outline:"none",maxWidth:"100%",fontSize:"12px"}} type="text" name="role" 
                                onChange={(e)=>{
                                    setDesignation(e.target.value)
                                }} 
                                placeholder="Change Designation..." 
                            />
                        </div>
                    </Paper>
                    {showDesignationList && (
                        <div 
                            onClick={()=>{
                                setTimeout(() => {
                                    setShowDesignationList(false)
                                }, 150);
                            }}
                            style={{
                                border:"1px solid #999",
                                borderRadius:"5px",
                                position:"absolute",
                                minWidth:"24%",
                                marginTop:"5px",
                                fontSize:"12px",
                                background:"#fff",
                                zIndex:11
                            }}
                        >
                            <Typography
                                component={"p"}
                                style={{background:"#999",color:"#fff",borderBottom:"1px solid #999",fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                            >
                                Change To :
                            </Typography>
                            {designationList?.filter(item=>item.department.id==currentEmployee.department.id).length==0 && (
                                <Typography
                                    component={"p"}
                                    style={{fontSize:"12px",padding:"7px 9px",fontWeight:500}} 
                                >
                                    Create Designation Before Continuing or Check if Department id Assigned...
                                </Typography>
                            )}
                            {designationList?.map((item,idx)=>{
                                if(item.name.toLowerCase().includes(designation.toLowerCase())&& item.department.id == currentEmployee.department.id){
                                    return (
                                        <Typography key={idx}  sx={{
                                            borderBottom:designationList.length-1==idx?"0px":"1px solid #999",
                                            margin:0,
                                            padding:"7px 9px",
                                            fontSize:"12px",
                                            "&:hover":{
                                                cursor:"pointer",
                                                backgroundColor:"#999",
                                                color:"#fff"
                                            }
                                        }} onClick={()=>{
                                            var newStateOfCurrentEmployee = employeeList.filter(item=>item.id==currentEmployee.personalDetails.empId)[0]
                                            dispatch(setDesignationToEmployee({
                                                empId:currentEmployee.personalDetails.empId,
                                                newStateOfCurrentEmployee,
                                                designation:item,
                                                id:currentEmployee.personalDetails.empId,
                                                designationId:item.id
                                            }))
                                            // dispatch(setBranchToEmployee({
                                            //     empId:currentEmployee.personalDetails.empId,
                                            //     newStateOfCurrentEmployee,
                                            //     branch:item,
                                            //     id:currentEmployee.personalDetails.empId,
                                            //     branchId:item.id
                                            // }))
                                            // dispatch({type:"UPDATEEMPLOYEE",payload:{
                                            //     id:currentEmployee.personalDetails.empId,
                                            //     data:{...newStateOfCurrentEmployee,branch:item}
                                            // }})
                                            setDesignation("")
                                        }}>{item.name}</Typography>
                                    )
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}


const EducationDetails = ({currentEmployee})=>{
    let dispatch = useDispatch()
    const [disabled,setDisabled] = useState(true)
    const [edit,setEdit] = useState(false)

    const [dummyEdu,setDummyEdu] = useState([])
    const [ dummyEduFields,setDummyEduFields] = useState([])

    useEffect(()=>{
        setDummyEdu(prevState=>{
            setDummyEduFields(currentEmployee?.education)
            return currentEmployee?.education
        })
    },[currentEmployee])



    return(
        <>
            {!edit ?(
                <>
                    <div style={{display:"flex",justifyContent:"end",padding:"8px"}}>
                        <IconButton onClick={()=>{
                            setEdit(true)
                            setDisabled(false)

                        }}>
                            <EditIcon />
                        </IconButton>
                    </div>
                    {dummyEdu?.length==0?(
                        <div style={{color:"#999",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh"}}>
                            <SchoolIcon />
                            <p style={{width:"70%",textAlign:"center"}}>Click on Edit Icon on top right corner to add Employee's Education Details</p>
                        </div>
                    ):(
                        <Timeline
                            sx={{
                                marginTop:"24px",
                                height:"60vh",
                                [`& .${timelineOppositeContentClasses.root}`]: {
                                    flex: 0.2,
                                },
                            }}
                        >
                            {dummyEdu?.map((item,idx)=>{
                                return(
                                    <TimelineItem key={idx} >
                                        <TimelineOppositeContent style={{fontSize:"12px"}} color="textSecondary">
                                            {item.key}
                                            <p style={{color:"#333",margin:"0"}}>
                                                {dayjs(item.date).format("MM-YYYY")}
                                            </p>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot />
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent style={{fontSize:"12px"}}>
                                            {item.value}
                                        </TimelineContent>
                                    </TimelineItem>
                                )
                            })}
                        </Timeline>
                    )}
                    
                </>
            ):(
                <>
                    <div style={{display:"flex",justifyContent:"end",padding:"8px"}}>
                        <IconButton onClick={()=>{
                            setEdit(false)
                            setDisabled(true)
                            // setDummyEdu(dummyEduFields)

                        }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Box
                        sx={{
                            '& .MuiTextField-root': {marginBottom:"15px",width: '100%' },
                            '& .MuiInputLabel-root':{marginTop:"1px",fontSize:"12px"},
                            '& .MuiInputBase-input':{fontSize:"12px"},
                            '& .MuiSelect-select':{width: '100%',padding:"5px 7px"},
                        }}
                        noValidate
                        autoComplete="off"
                        style={{width:"100%",margin:"22px auto auto",height:"60vh",overflow:"auto",padding:"0 20px"}}
                    >
                        {dummyEduFields?.map((item,idx)=>{
                            return(
                                <>
                                    <Grid key={idx} container>
                                        {/* <InputLabel id="Type-label">Type</InputLabel> */}
                                        <Select
                                            disabled
                                            labelId="Type-label"
                                            value={"Education details"}
                                            label="Type"
                                            style={{width:"100%",marginBottom:"15px"}}
                                            onChange={(e)=>{
                                                setDummyEduFields(prevState=>{
                                                    var indx;
                                                    var date = prevState.filter((item,index)=>{
                                                        if(index==idx){
                                                            indx = index
                                                            return index
                                                        }
                                                    })
                                                    var newState = [...prevState]
                                                    newState[indx] ={...prevState[indx],type:e.target.value}
                                                    return newState
                                                })
                                            }}
                                            >
                                            <MenuItem value={"Contact details"}>Contact details</MenuItem>
                                            <MenuItem value={"Education details"}>Education details</MenuItem>
                                            <MenuItem value={"Prev Work Experience"}>Prev Work Experience</MenuItem>
                                        </Select>
                                        
                                    </Grid>
                                    <Grid container>
                                        <TextField
                                            // error
                                            disabled={disabled}
                                            fullWidth
                                            size="small"
                                            id="key"
                                            label="key"
                                            style={{width:"100%"}}
                                            value={item.key}
                                            item
                                            onChange={(e)=>{
                                                setDummyEduFields(prevState=>{
                                                    var indx;
                                                    var date = prevState.filter((item,index)=>{
                                                        if(index==idx){
                                                            indx = index
                                                            return index
                                                        }
                                                    })
                                                    var newState = [...prevState]
                                                    newState[indx] ={...prevState[indx],key:e.target.value}
                                                    return newState
                                                })
                                            }}
                                            xs={6}
                                            helperText={item.key.length==0?"Eg: High School,Gradutation":""}
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                label="End Date"
                                                inputFormat="MM/DD/YYYY"
                                                disabled={disabled}
                                                value={dayjs(item.date).format("MM/DD/YYYY")}
                                                onChange={(e)=>{
                                                    setDummyEduFields(prevState=>{
                                                        var indx;
                                                        var date = prevState.filter((item,index)=>{
                                                            if(index==idx){
                                                                indx = index
                                                                return index
                                                            }
                                                        })
                                                        var newState = [...prevState]
                                                        newState[indx] = {...prevState[indx],date:dayjs(dayjs(e).format("YYYY/MM/DD")).valueOf()}
                                                        return newState
                                                    })
                                                }}
                                                renderInput={(params) => <TextField  size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                        <TextField
                                            // error
                                            disabled={disabled}
                                            fullWidth
                                            size="small"
                                            id="value"
                                            label="value"
                                            style={{width:"100%"}}
                                            value={item.value}
                                            defaultValue={item.value}
                                            onChange={(e)=>{
                                                setDummyEduFields(prevState=>{
                                                    var indx;
                                                    var date = prevState.filter((item,index)=>{
                                                        if(index==idx){
                                                            indx = index
                                                            return index
                                                        }
                                                    })
                                                    var newState = [...prevState]
                                                    newState[indx] ={...prevState[indx],value:e.target.value}
                                                    return newState
                                                })
                                            }}
                                            item
                                            xs={12}
                                            helperText={item.value.length==0?"Name of the insititute/organisation":""}
                                        />
                                    </Grid>
                                    <div style={{display:"flex",justifyContent:"left",padding:"1px"}}>
                                        {item.id ?(
                                            <>
                                                <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                    console.log({id:currentEmployee?.id,data:dummyEduFields[idx]})
                                                    dispatch(updateEmployeeInfo({data:dummyEduFields[idx]}))

                                                    // setEdit(false)
                                                    // setDisabled(true)

                                                }}>
                                                    <DoneIcon style={{marginRight:"5px"}} /><span>Update</span>
                                                </IconButton>
                                                <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                    dispatch(deleteEmployeeInfo({data:dummyEduFields[idx]}))

                                                    // setEdit(false)
                                                    // setDisabled(true)

                                                }}>
                                                    <CloseIcon style={{marginRight:"5px"}} /><span>Remove</span>
                                                </IconButton>
                                            </>
                                            
                                        ):(
                                            <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                dispatch(createEmployeeInfo({id:currentEmployee?.personalDetails?.empId,data:dummyEduFields[idx]}))
                                                // setEdit(false)
                                                // setDisabled(true)

                                            }}>
                                                <DoneIcon style={{marginRight:"5px"}} /><span>Add</span>
                                            </IconButton>
                                            
                                        )}
                                    </div>
                                    <Divider style={{background:"#333",margin:"10px auto",width:"50%"}}/>
                                </>
                            )
                        })}
                        <div style={{width:"max-content",margin:"auto"}}>
                            <IconButton style={{padding:"5px 7px",fontSize:"12px",borderRadius:"4px"}} onClick={()=>{
                                    setDummyEduFields(prevState=>{
                                        if(prevState.length>0){
                                            var newState = [...prevState]
                                        }else{
                                            var newState = []
                                        }
                                        newState.push({type:"Education details",key:"",date:dayjs(new Date()).valueOf(),value:"",id:null})
                                        return newState
                                    })
                                }}>
                                <SchoolIcon style={{marginRight:"10px"}}/> <span>Add</span>
                            </IconButton>
                        </div>
                    </Box>
                </>
            )}
        </>
    )
}

const PrevWorkExDetails = ({currentEmployee})=>{
    let dispatch = useDispatch()

    const [disabled,setDisabled] = useState(true)
    const [edit,setEdit] = useState(false)

    const [dummyPrevEx,setDummyPrevEx] = useState([])
    const [ dummyPrevExFields,setDummyPrevExFields] = useState([])

    useEffect(()=>{
        setDummyPrevEx(prevState=>{
            setDummyPrevExFields(currentEmployee?.prevWorkEx)
            return currentEmployee?.prevWorkEx
        })
    },[currentEmployee])
    return(
        <>
            {!edit?(
                <>
                    <div style={{display:"flex",justifyContent:"end",padding:"8px"}}>
                        <IconButton onClick={()=>{
                            setEdit(true)
                            setDisabled(false)

                        }}>
                            <EditIcon />
                        </IconButton>
                    </div>
                    {/* {dummyPrevEx.length==0} */}
                    {dummyPrevEx?.length==0 ?(
                        <div style={{color:"#999",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh"}}>
                            <AddBusinessIcon />
                            <p style={{width:"70%",textAlign:"center"}}>Click on Edit Icon on top right corner to add Employee's previous work experience</p>
                        </div>
                    ):(
                        <Timeline
                            sx={{
                                marginTop:"24px",
                                height:"60vh",
                                [`& .${timelineOppositeContentClasses.root}`]: {
                                    flex: 0.2,
                                },
                            }}
                        >   
                            {dummyPrevEx?.map((item,idx)=>{
                                return(
                                    <TimelineItem key={idx} >
                                        <TimelineOppositeContent style={{fontSize:"12px"}} color="textSecondary">
                                            {item.key}
                                            <p style={{color:"#333",margin:"0"}}>
                                                {dayjs(item.date).format("MM-YYYY")}
                                            </p>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot />
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent style={{fontSize:"12px"}}>
                                            {item.value}
                                        </TimelineContent>
                                    </TimelineItem>
                                )
                            })}
                        </Timeline>
                    )}

                </>
            ):(
                <>
                    <div style={{display:"flex",justifyContent:"end",padding:"8px"}}>
                        <IconButton onClick={()=>{
                            setEdit(false)
                            setDisabled(true)
                            // setDummyPrevEx(dummyPrevExFields)

                        }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Box
                        sx={{
                            '& .MuiTextField-root': {marginBottom:"15px",width: '100%' },
                            '& .MuiInputLabel-root':{marginTop:"1px",fontSize:"12px"},
                            '& .MuiInputBase-input':{fontSize:"12px"},
                            '& .MuiSelect-select':{width: '100%',padding:"5px 7px"}
                        }}
                        noValidate
                        autoComplete="off"
                        style={{width:"100%",margin:"22px auto auto",height:"60vh",overflow:"auto"}}
                    >   
                        {dummyPrevExFields?.map((item,idx)=>{
                            return(
                                <>
                                    <Grid key={idx} container>
                                        <Select
                                            disabled
                                            labelId="Type-label"
                                            value={"Prev Work Experience"}
                                            label="Type"
                                            style={{width:"100%",marginBottom:"15px"}}
                                            onChange={(e)=>{
                                                setDummyPrevExFields(prevState=>{
                                                    var indx;
                                                    var date = prevState.filter((item,index)=>{
                                                        if(index==idx){
                                                            indx = index
                                                            return index
                                                        }
                                                    })
                                                    var newState = [...prevState]
                                                    newState[indx] ={...prevState[indx],type:e.target.value}
                                                    return newState
                                                })
                                            }}
                                            >
                                            <MenuItem value={"Contact details"}>Contact details</MenuItem>
                                            <MenuItem value={"Education details"}>Education details</MenuItem>
                                            <MenuItem value={"Prev Work Experience"}>Prev Work Experience</MenuItem>
                                        </Select>
                                        
                                    </Grid>
                                    <Grid container>
                                    <TextField
                                            // error
                                            disabled={disabled}
                                            fullWidth
                                            size="small"
                                            id="key"
                                            label="key"
                                            value={item.key}
                                            style={{width:"100%"}}
                                            item
                                            onChange={(e)=>{
                                                setDummyPrevExFields(prevState=>{
                                                    var indx;
                                                    var date = prevState.filter((item,index)=>{
                                                        if(index==idx){
                                                            indx = index
                                                            return index
                                                        }
                                                    })
                                                    var newState = [...prevState]
                                                    newState[indx] ={...prevState[indx],key:e.target.value}
                                                    return newState
                                                })
                                            }}
                                            xs={6}
                                            helperText={item.key.length==0?"Eg:Intern,Sales Manager etc":""}
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                label="End Date"
                                                inputFormat="MM/DD/YYYY"
                                                disabled={disabled}
                                                value={dayjs(item.date).format("MM/DD/YYYY")}
                                                style={{width:"100%"}}
                                                onChange={(e)=>{
                                                    setDummyPrevExFields(prevState=>{
                                                        var indx;
                                                        var date = prevState.filter((item,index)=>{
                                                            if(index==idx){
                                                                indx = index
                                                                return index
                                                            }
                                                        })
                                                        var newState = [...prevState]
                                                        newState[indx] = {...prevState[indx],date:dayjs(dayjs(e).format("YYYY/MM/DD")).valueOf()}
                                                        return newState
                                                    })
                                                }}
                                                renderInput={(params) => <TextField  size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                        <TextField
                                            // error
                                            disabled={disabled}
                                            fullWidth
                                            size="small"
                                            id="value"
                                            label="value"
                                            style={{width:"100%"}}
                                            value={item.value}
                                            defaultValue={item.value}
                                            onChange={(e)=>{
                                                setDummyPrevExFields(prevState=>{
                                                    var indx;
                                                    var date = prevState.filter((item,index)=>{
                                                        if(index==idx){
                                                            indx = index
                                                            return index
                                                        }
                                                    })
                                                    var newState = [...prevState]
                                                    newState[indx] ={...prevState[indx],value:e.target.value}
                                                    return newState
                                                })
                                            }}
                                            item
                                            xs={12}
                                            helperText={item.value.length==0?"Name of the insititute/organisation":""}
                                        />
                                    </Grid>
                                    <div style={{display:"flex",justifyContent:"left",padding:"1px"}}>
                                        {item.id ?(
                                            <>
                                                <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                    console.log({id:currentEmployee?.id,data:dummyPrevExFields[idx]})
                                                    dispatch(updateEmployeeInfo({data:dummyPrevExFields[idx]}))

                                                    // setEdit(false)
                                                    // setDisabled(true)

                                                }}>
                                                    <DoneIcon style={{marginRight:"5px"}} /><span>Update</span>
                                                </IconButton>
                                                <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                    dispatch(deleteEmployeeInfo({data:dummyPrevExFields[idx]}))

                                                    // setEdit(false)
                                                    // setDisabled(true)

                                                }}>
                                                    <CloseIcon style={{marginRight:"5px"}} /><span>Remove</span>
                                                </IconButton>
                                            </>
                                        ):(
                                            <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                dispatch(createEmployeeInfo({id:currentEmployee?.personalDetails?.empId,data:dummyPrevExFields[idx]}))
                                                // setEdit(false)
                                                // setDisabled(true)

                                            }}>
                                                <DoneIcon style={{marginRight:"5px"}} /><span>Add</span>
                                            </IconButton>
                                        )}
                                    </div>
                                    <Divider style={{background:"#333",margin:"10px auto",width:"50%"}}/>
                                </>
                            )
                        })}
                        <div style={{width:"max-content",margin:"auto"}}>
                            <IconButton style={{padding:"5px 7px",borderRadius:"4px",fontSize:"12px"}} onClick={()=>{
                                    setDummyPrevExFields(prevState=>{
                                        if(prevState.length>0){
                                            var newState = [...prevState]
                                        }else{
                                            var newState = []
                                        }
                                        newState.push({type:"Prev Work Experience",key:"",date:dayjs(new Date()).valueOf(),value:"",id:null})
                                        return newState
                                    })
                                }}>
                                <AddBusinessIcon style={{marginRight:"10px"}}/> <span>Add</span>
                            </IconButton>
                        </div>
                    </Box>
                </>
            )}
        </>
    )
}

const Exit = ()=>{
    return(
        <>
            Exit
        </>
    )
}

const ContactDetails = ({currentEmployee})=>{
    let dispatch = useDispatch()
    const [disabled,setDisabled] = useState(true)
    const [edit,setEdit] = useState(false)
    const [contactDe,setContactDetail] = useState([])
    const [dummyContectDeField,setDummyContactDeield] = useState([])

    useEffect(() => {
        setContactDetail(prevState=>{
            setDummyContactDeield(currentEmployee?.contactDetails)
            return currentEmployee?.contactDetails
        })
        // setContactDetail(currentEmployee.contactDetails)
    }, [currentEmployee]);

    return(
        <>
            {edit ?(
                <>
                    <div style={{display:"flex",justifyContent:"end",padding:"8px"}}>
                        <IconButton onClick={()=>{
                            setEdit(false)
                            setDisabled(true)

                        }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Box
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '35ch' },
                            '& .MuiInputLabel-root':{marginTop:"1px",fontSize:"12px"},
                            '& .MuiInputBase-input':{fontSize:"12px"}

                        }}
                        noValidate
                        autoComplete="off"
                        style={{width:"100%",margin:"22px auto auto",height:"60vh",overflow:"auto"}}
                    >
                       
                        {dummyContectDeField?.map((item,idx)=>{
                            return (
                                <Grid key={idx}>
                                    <TextField
                                        // error
                                        disabled={disabled}
                                        // fullWidth
                                        size="small"
                                        id={item.type.replace(" ","")}
                                        label="Key"
                                        value={item.key}
                                        onChange={(e)=>{
                                            setDummyContactDeield(prevState=>{
                                                var indx;
                                                var date = prevState.filter((item,index)=>{
                                                    if(index==idx){
                                                        indx = index
                                                        return index
                                                    }
                                                })
                                                var newState = [...prevState]
                                                newState[indx] ={...prevState[indx],key:e.target.value}
                                                return newState
                                            })
                                        }}
                                        item
                                        // style={{width:"100%"}}
                                        xs={12}
                                        helperText={item.key.length>0?"":"For eg: Address, Permananet Address,Mobile Number etc"}
                                    />
                                    <TextField
                                        // error
                                        disabled={disabled}
                                        // fullWidth
                                        size="small"
                                        id={item.type.replace(" ","")}
                                        label="Value"
                                        value={item.value}
                                        item
                                        onChange={(e)=>{
                                            setDummyContactDeield(prevState=>{
                                                var indx;
                                                var date = prevState.filter((item,index)=>{
                                                    if(index==idx){
                                                        indx = index
                                                        return index
                                                    }
                                                })
                                                var newState = [...prevState]
                                                newState[indx] ={...prevState[indx],value:e.target.value}
                                                return newState
                                            })
                                        }}
                                        // style={{width:"100%"}}
                                        xs={12}
                                        // helperText="Incorrect Mobile Number"
                                    />
                                    <div style={{display:"flex",justifyContent:"left",padding:"1px"}}>
                                        {item.id ?(
                                            <>
                                                <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                    console.log({idx:idx,data:dummyContectDeField[idx]})
                                                    dispatch(updateEmployeeInfo({idx:idx,data:dummyContectDeField[idx]}))


                                                    // setEdit(false)
                                                    // setDisabled(true)

                                                }}>
                                                    <DoneIcon style={{marginRight:"5px"}} /><span>Update</span>
                                                </IconButton>
                                                <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                    dispatch(deleteEmployeeInfo({data:dummyContectDeField[idx]}))

                                                    // setEdit(false)
                                                    // setDisabled(true)

                                                }}>
                                                    <CloseIcon style={{marginRight:"5px"}} /><span>Remove</span>
                                                </IconButton>
                                            </>
                                        ):(
                                            <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                                dispatch(createEmployeeInfo({id:currentEmployee?.personalDetails?.empId,data:dummyContectDeField[idx]}))
                                                // setEdit(false)
                                                // setDisabled(true)

                                            }}>
                                                <DoneIcon style={{marginRight:"5px"}} /><span>Add</span>
                                            </IconButton>
                                        )}
                                    </div>
                                    <Divider style={{margin:"10px auto",borderBottom:"1px solid #333"}}/>

                                </Grid>
                            )
                        })}
                        
                        <div style={{width:"max-content",margin:"auto"}}>
                            <IconButton style={{padding:"5px 7px", borderRadius:"4px",fontSize:"12px"}} onClick={()=>{
                                    setDummyContactDeield(prevState=>{
                                        if(prevState.length>0){
                                            var newState = [...prevState]
                                        }else{
                                            var newState = []
                                        }
                                        newState.push({type:"Contact details",key:"",date:dayjs(new Date()).valueOf(),value:"",id:null})
                                        return newState
                                    })
                                }}>
                                <ContactsIcon style={{marginRight:"10px"}}/><span>Add</span>
                            </IconButton>
                        </div>
                    </Box>
                </>
            ):(
                <>
                    <div style={{display:"flex",justifyContent:"end",padding:"8px"}}>
                            <IconButton onClick={()=>{
                                setEdit(true)
                                setDisabled(false)

                            }}>
                                <EditIcon />
                            </IconButton>
                    </div>
                        {contactDe?.length==0?(
                            <div style={{color:"#999",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh"}}>
                                <ContactsIcon />
                                <p style={{width:"70%",textAlign:"center"}}>Click on Edit Icon on top right corner to add Employee's Contact Details</p>
                            </div>
                        ):(
                            <div style={{margin:"22px auto auto",padding:"8px",fontSize:"13px"}}>
                                {contactDe?.map((item,idx)=>{
                                    return (
                                        <p key={idx} style={{fontWeight:500}}>{item.key} : <span style={{fontSize:"12px",fontWeight:300}}>{item.value}</span></p>
                                    )
                                })}
                            </div>
                        )}

                </>
                
            )}
        </>
    )
}

const PersonalDetails = ({currentEmployee})=>{
    let dispatch = useDispatch()
    const [disabled,setDisabled] = useState(true)
    const [edit,setEdit] = useState(false)
    const [personalDe,setPersonalDe] = useState({})
    useEffect(()=>{
        setPersonalDe(currentEmployee?.personalDetails)
    },[currentEmployee])


    return(
        <>
            {edit ?(
                <>
                    <div style={{display:"flex",justifyContent:"end",padding:"8px"}}>
                        <IconButton onClick={()=>{
                            setEdit(false)
                            setDisabled(true)

                        }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Box
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '35ch' },
                            '& .MuiInputLabel-root':{marginTop:"1px",fontSize:"12px"},
                            '& .MuiInputBase-input':{fontSize:"12px"}

                        }}
                        noValidate
                        autoComplete="off"
                        style={{width:"100%",margin:"22px auto auto"}}
                    >
                        <Grid container  style={{margin:"auto",marginBottom:"10px"}}>
                            <TextField
                                // error
                                disabled={disabled}
                                size="small"
                                id="firstName"
                                label="First Name"
                                value={personalDe.firstName}
                                onChange={(e)=>{
                                    setPersonalDe(prevState=>{
                                        var newState= {...prevState}
                                        newState.firstName = e.target.value
                                        return newState
                                    })
                                }}
                                item
                                xs={6}
                                // helperText="Incorrect Mobile Number"
                            />
                            <TextField
                                // error
                                disabled={disabled}
                                size="small"
                                id="lastName"
                                label="Last Name"
                                value={personalDe.lastName}
                                onChange={(e)=>{
                                    setPersonalDe(prevState=>{
                                        var newState= {...prevState}
                                        newState.lastName = e.target.value
                                        return newState
                                    })
                                }}
                                item
                                xs={6}
                                // helperText="Incorrect Mobile Number"
                            />
                            
                        </Grid>
                        <Grid container  style={{margin:"auto"}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Date of birth"
                                    inputFormat="DD/MM/YYYY"
                                    disabled={disabled}
                                    value={dayjs(personalDe.dob).format("MM/DD/YYYY")}
                                    onChange={(e)=>{
                                        setPersonalDe(prevState=>{
                                            var newState= {...prevState}
                                            newState.dob = dayjs(dayjs(e).format("YYYY/MM/DD")).valueOf()
                                            return newState
                                        })
                                    }}
                                    renderInput={(params) => <TextField  size="small" {...params} />}
                                />
                            </LocalizationProvider>
                            <TextField
                                // error
                                disabled={disabled}
                                size="small"
                                id="bloodGroup"
                                label="Blood group"
                                value={personalDe.bloodGroup}
                                onChange={(e)=>{
                                    setPersonalDe(prevState=>{
                                        var newState= {...prevState}
                                        newState.bloodGroup = e.target.value
                                        return newState
                                    })
                                }}
                                item
                                xs={6}
                                // helperText="Incorrect Mobile Number"
                            />
                        </Grid>
                        <Grid container  style={{margin:"auto"}}>
                            <TextField
                                // error
                                disabled={disabled}
                                size="small"
                                id="fatherName"
                                label="Father's Name"
                                value={personalDe.fatherName}
                                onChange={(e)=>{
                                    setPersonalDe(prevState=>{
                                        var newState= {...prevState}
                                        newState.fatherName = e.target.value
                                        return newState
                                    })
                                }}
                                item
                                xs={6}
                                // helperText="Incorrect Mobile Number"
                            />
                            <TextField
                                // error
                                disabled={disabled}
                                size="small"
                                id="fatherOccupation"
                                label="Father's Occupation"
                                value={personalDe.fatherOccupation}
                                onChange={(e)=>{
                                    setPersonalDe(prevState=>{
                                        var newState= {...prevState}
                                        newState.fatherOccupation = e.target.value
                                        return newState
                                    })
                                }}
                                item
                                xs={6}
                                // helperText="Incorrect Mobile Number"
                            />
                        </Grid>
                        <Grid container  style={{margin:"auto"}}>
                            <TextField
                                // error
                                disabled={disabled}
                                size="small"
                                id="motherName"
                                label="Mother's Name"
                                value={personalDe.motherName}
                                onChange={(e)=>{
                                    setPersonalDe(prevState=>{
                                        var newState= {...prevState}
                                        newState.motherName = e.target.value
                                        return newState
                                    })
                                }}
                                item
                                xs={6}
                                // helperText="Incorrect Mobile Number"
                            />
                            
                            <TextField
                                // error
                                disabled={disabled}
                                size="small"
                                id="motherOccupation"
                                label="Mother's Occupation"
                                value={personalDe.motherOccupation}
                                onChange={(e)=>{
                                    setPersonalDe(prevState=>{
                                        var newState= {...prevState}
                                        newState.motherOccupation = e.target.value
                                        return newState
                                    })
                                }}
                                item
                                xs={6}
                                // helperText="Incorrect Mobile Number"
                            />
                        </Grid>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",margin:"10px auto"}}>
                            <IconButton style={{fontSize:"12px",borderRadius:"4px",padding:"5px 7px"}} onClick={()=>{
                                var data = {
                                    firstName:personalDe.firstName,
                                    lastName:personalDe.lastName,
                                    dob:personalDe.dob,
                                    fatherName:personalDe.fatherName,
                                    fatherOccupation:personalDe.fatherOccupation,
                                    motherName:personalDe.motherName,
                                    motherOccupation:personalDe.motherOccupation,
                                    bloodGroup:personalDe.bloodGroup

                                }
                                dispatch(updateEmployee({id:currentEmployee?.personalDetails?.empId,data:data}))
                                // setEdit(false)
                                // setDisabled(true)

                            }}>
                                <DoneIcon style={{marginRight:"10px"}}/><span>Update</span>
                            </IconButton>
                        </div>
                    </Box>
                </>
            ):(
                <>
                    <div style={{display:"flex",justifyContent:"end",padding:"8px"}}>
                        <IconButton onClick={()=>{
                           setEdit(true)
                           setDisabled(false)

                        }}>
                            <EditIcon />
                        </IconButton>
                    </div>
                    <div style={{margin:"22px auto auto",padding:"8px",fontSize:"13px"}}>
                        <p style={{fontWeight:500}}>First Name : <span style={{fontSize:"12px",fontWeight:300}}>{personalDe.firstName}</span></p>
                        <p style={{fontWeight:500}}>Last Name : <span style={{fontSize:"12px",fontWeight:300}}>{personalDe.lastName}</span></p>
                        <p style={{fontWeight:500}}>DOB : <span style={{fontSize:"12px",fontWeight:300}}>{dayjs(personalDe.dob).format("MM/DD/YYYY")}</span></p>
                        <p style={{fontWeight:500}}>Father's Name : <span style={{fontSize:"12px",fontWeight:300}}>{personalDe.fatherName}</span></p>
                        <p style={{fontWeight:500}}>Mother's Name : <span style={{fontSize:"12px",fontWeight:300}}>{personalDe.motherName}</span></p>
                        <p style={{fontWeight:500}}>Father's Occupation : <span style={{fontSize:"12px",fontWeight:300}}>{personalDe.fatherOccupation}</span></p>
                        <p style={{fontWeight:500}}>Mother's Occupation : <span style={{fontSize:"12px",fontWeight:300}}>{personalDe.motherOccupation}</span></p>
                        <p style={{fontWeight:500}}>Blood group : <span style={{fontSize:"12px",fontWeight:300}}>{personalDe.bloodGroup}</span></p>
                    </div>
                </>
            )}
            
        </>
    )
}




export default Employee;
