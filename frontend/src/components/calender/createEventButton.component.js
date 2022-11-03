import React,{useState,useEffect} from 'react';
import dayjs from "dayjs";
import {useDispatch,useSelector} from "react-redux"

import { styled } from '@mui/material/styles';
import { Button, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Stack } from '@mui/system';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import NotesIcon from '@mui/icons-material/Notes';
import DoneIcon from '@mui/icons-material/Done';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import ListIcon from '@mui/icons-material/List';
import DeleteIcon from '@mui/icons-material/Delete';


import { createCalenderEvent,editCalenderEvent,deleteCalenderEvent} from '../../actions/calender';


function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-event-create-dialog"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 12,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: 'transparent',
    borderColor: '#5f6368',
    '&:hover': {
        backgroundColor: '#F1F3F4',
        borderColor: '#5f6368',
        boxShadow: 'none',
    },
    '&:active':{
        backgroundColor: '#F1F3F4',
        borderColor: '#5f6368',
        boxShadow: 'none',
    },
    // '&:focus': {
    //     boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    // },
  });

// const lables = ["","#ff7a7a","#9393ff"]
const lables = ["purple","red","blue","yellow","green"]

const CreateEventButton = ({day,setOpenDialog,setClickedEvent,clickedEvent,openDialog=false,showCreateButton=true,events=[]}) => {
    let dispatch = useDispatch()
    const [open, setOpen] = useState(openDialog);
    const [title,setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selclable,setSelcLable] = useState("red")
    const [currDayEvents,setCurrDayEvents] = useState([])
    const [currDayEventEditId,setCurrDayEventId] = useState(null)
    const [currDayEventEdit,setCurrDayEdit] = useState(null)
    const [addMode,setAddMode] = useState(false)
    const dayEvents  = useSelector(state=>state.calender)


    const resetDialog = ()=>{
        setTitle("")
        setDescription("")
        setSelcLable("red")
        setAddMode(false)
        setCurrDayEvents([])
        setCurrDayEdit(null)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetDialog()
        setClickedEvent(null)
        setCurrDayEventId(null)
        if (setOpenDialog){
            setOpenDialog(false)
        }
    };
    
    const createEvent = ()=>{
        handleClickOpen()
    }

    useEffect(() => {
        if (setOpenDialog){
            setOpen(openDialog)
        }
    }, [openDialog]);

    useEffect(() => {
        if (dayEvents.length>0 && day){
            setCurrDayEvents(()=>{
                var events = dayEvents.filter((item,idx)=>{
                    if (item.day== day.valueOf()){
                        return item
                    }
                })
                // setCurrDayEventId(events[0].id)
                // setTitle(events[0].title)
                // setDescription(events[0].description)
                // setSelcLable(events[0].lable)
                // setCurrDayEdit(events[0].day)
                return events
            })
        }
    }, [dayEvents,day]);

    useEffect(() => {
        if (!localStorage.getItem("calenderEvents")){
            localStorage.setItem("calenderEvents",JSON.stringify([]))
        }
    }, []);

    useEffect(()=>{
        setCurrDayEvents(()=>{
            if (day){
                var events = dayEvents.filter((item,idx)=>{
                    if (item.day== day.valueOf()){
                        return item
                    }
                })
            }else{
                var events=[]
            }

            if (clickedEvent){
                setOpen(true)
                setCurrDayEventId(clickedEvent.id)
                setTitle(clickedEvent.title)
                setDescription(clickedEvent.description)
                setSelcLable(clickedEvent.lable)
                setCurrDayEdit(clickedEvent.day)
                setAddMode(false)
            }else{
                setAddMode(true)
            }
            return events
        })
    },[clickedEvent,open])

    useEffect(() => {
        if (!currDayEventEditId && open){
            setAddMode(true)
        }
    }, [currDayEventEditId,open]);

    const handleCreateEvent = ()=>{
        if (title.length==0){
            console.log("title")
            return
        }
        dispatch(createCalenderEvent({id:Date.now(),title,description,lable:selclable,day:day.valueOf()}))
        handleClose()
    }
    const handleEditEvent = ()=>{
        if (title.length==0){
            console.log("title")
            return
        }
        dispatch(editCalenderEvent({id:currDayEventEditId,title,description,lable:selclable,day:currDayEventEdit.valueOf()}))
        handleClose()
    }
    const handleAddEvent=()=>{
        setTitle("")
        setDescription("")
        setSelcLable("red")
        setCurrDayEdit(null)
        setAddMode(true)
        setCurrDayEventId(null)
    }
    const handleDeleteEvent = ()=>{
        if (currDayEventEditId){
            dispatch(deleteCalenderEvent({id:currDayEventEditId}))
            handleClose()
        }
    }

    return (
        <>
            {showCreateButton && (
                <BootstrapButton variant='outlined' style={{color:"#3C4043",width:"100%"}} onClick={createEvent}>Create</BootstrapButton>
            )}
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-event-create-dialog"
                maxWidth={"sm"}
                fullWidth={true}
            >
                <DialogTitle style={{ cursor: 'initial',display:"flex",justifyContent:"space-between" }} >
                    <div style={{display:"flex",justifyContent:"center",alignItems:"cenetr",padding:"5px",color:"gray"}}>
                        <DragHandleIcon id="draggable-event-create-dialog"/>
                    </div>
                    <div>
                        {currDayEventEditId && (
                            <IconButton onClick={handleDeleteEvent}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent
                    sx={{
                        '& .MuiTextField-root': {width: '100%', },
                        '& .MuiInputLabel-root':{marginTop:"1px"}
                    }}
                >
                    <div style={{alignItems:"center",display:"flex",justifyContent:""}}>
                        <div style={{width:"24px",height:"24px"}}>
                            {/* <div>hello</div> */}
                        </div>
                        <TextField 
                            id="title"
                            label="Add Title"
                            type="text"
                            value={title}
                            fullWidth
                            variant="standard"
                            style={{margin:"0px 0px 30px 20px"}}
                            onChange={(e)=>setTitle(e.target.value)}
                        />
                    </div>
                    <div style={{alignItems:"center",display:"flex",justifyContent:""}}>
                        <div style={{color:"gray"}}>
                            <AccessTimeIcon />
                        </div>
                        <p style={{margin:"0px 0px 0px 20px"}}>
                            {day?day.format("dddd, MMMM DD"):dayjs().format("dddd, MMMM DD")}
                        </p>
                    </div>
                    <div style={{display:"flex",justifyContent:"",marginTop:"20px"}}>
                        <div style={{color:"gray"}}>
                            <NotesIcon />
                        </div>
                        <TextField 
                            id="eventDescription"
                            label="Add a Description"
                            type="text"
                            variant="filled"
                            value={description}
                            multiline
                            maxRows={4}
                            style={{margin:"0px 0px 0px 20px"}}
                            onChange={(e)=>setDescription(e.target.value)}
                        />
                    </div>
                    <div style={{marginTop:"15px",marginLeft:"0px",display:"flex",alignItems:"center"}}>
                        <div style={{color:"gray"}}>
                            <TurnedInNotIcon />
                        </div>
                        <div style={{margin:"0px 0px 0px 20px"}}>
                            {lables.map((lable,idx)=>{
                                return(
                                    <IconButton key={idx} onClick={()=>setSelcLable(lable)} style={{background:lable,marginLeft:idx===0?"0px":"10px",padding:lable!==selclable?"15px":""}}>
                                        {lable===selclable&&(
                                            <DoneIcon style={{color:"white",width:"15px",height:"15px"}}/>
                                        )}
                                    </IconButton>
                                )
                            })}
                        </div>
                    </div>
                    <div style={{marginTop:"20px",marginLeft:"0px",display:"flex"}}>
                        <div style={{color:"gray"}}>
                            <ListIcon />
                        </div>
                        <div style={{margin:"0px 0px 0px 20px"}}>
                        {currDayEvents.map((evt,idx)=>{
                            if (evt.day == day.valueOf()){
                                return(
                                    <div key={idx} onClick={()=>{
                                        setCurrDayEventId(evt.id)
                                        setTitle(evt.title)
                                        setDescription(evt.description)
                                        setSelcLable(evt.lable)
                                        setCurrDayEdit(evt.day)
                                        setAddMode(false)
                                    }} style={{textAlign:"left",background:`${evt.lable}`,width:"100%",borderRadius:"4px",color:"#f4f4f4",padding:"4px 4px",fontSize:"12px",marginTop:"2px"}}>{evt.title}</div>
                                )
                            }
                        })}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions style={{padding:"0 10px"}}>
                    {events.length>0 ?(
                        <> 
                            {addMode?(
                                <BootstrapButton  variant='outlined' style={{color:"#3C4043",marginBottom:"20px"}} onClick={handleCreateEvent}>
                                    Save
                                </BootstrapButton>
                            ):(

                                <>
                                    <BootstrapButton  variant='outlined' style={{color:"#3C4043",marginBottom:"20px"}} onClick={handleAddEvent}>
                                        Add New
                                    </BootstrapButton>
                                    <BootstrapButton  variant='outlined' style={{color:"#3C4043",marginBottom:"20px",marginLeft:"20px"}} onClick={handleEditEvent}>
                                        Save
                                    </BootstrapButton>
                                </>
                            )}
                        </>
                    ):(
                        <BootstrapButton  variant='outlined' style={{color:"#3C4043",marginBottom:"20px"}} onClick={handleCreateEvent}>
                            Save
                        </BootstrapButton>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreateEventButton;
