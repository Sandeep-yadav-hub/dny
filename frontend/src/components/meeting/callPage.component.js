import { Experimental_CssVarsProvider, Grid } from '@mui/material';
import React,{useEffect,useRef,useState,useContext} from 'react';
import CallPageFooter from './callPageFooter.component';
import MeetingInfo from './meetingInfo.component';
import {useDispatch, useSelector} from "react-redux"
import MeetingContext from '../../context/meeting.context';
import {socket} from "../../helpers/socket.helper"
import { useParams } from 'react-router';
import Peer from 'simple-peer'




// setting the constraints of video box
const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


const CallPage = () => {
    let {id} = useParams()
    let dispatch = useDispatch()
    const [peers, setPeers] = useState([]);
    const {meetingId,isAdminOfMeeting,meetingUserName,localStream,setLocalStream,volumeCallback,setVolumeCallback,volumeInterval,setVolumeInterval,messages,setMessages} = useContext(MeetingContext)
    const meetingData = useSelector(state=>state.meeting)
    const [videoWidth,setvideoWidth] = useState(`${peers.length+1>=4?(95/4):peers.length+1>=3<4?(95/3):peers.length+1>=2<3?(95/2):(95)}%`,)
    var localVideoRef = useRef(null)

    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([])

    // const isAdmin = window.location.hash == "#init" ? true : false;

    const runOnSocketConnetction = (socket)=>{
        socketRef.current = socket
        initWebRTC()
    }

    useEffect(() => {
        document.getElementById("root").style.background = "#222"
        document.getElementById("root").style.height = "100vh"
        if (socket.connected){
            runOnSocketConnetction(socket)
        }else{
            socket.on('connect', () => {
                // console.log("connected",socket)
                runOnSocketConnetction(socket)
                
            });
        
            socket.on('disconnect', (socket) => {
                console.log("disconnected",socket)
                socket.emit("leave room")
            });
        }
        
        return () => {
            // socket.off('connect');
            // socket.off('disconnect');
            document.getElementById("root").style.background = "#fff"
            console.log(" call_page component removed which means InitWebRTC function will run again")
            console.log("removing component")
        };
      }, []);


    const createPeer = (userToSignal, callerID,username, stream) =>{
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        
        peer.on("signal", signal => {
            console.log({userToSignal, callerID, stream},"signal")
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal ,username,roomID:id})
        })

        return {peer,username};
    }
    const addPeer = (incomingSignal, callerID, username,stream)=> {
        console.log({incomingSignal, callerID, stream})
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID,username,roomID:id })
        })

        peer.signal(incomingSignal);

        return {peer,username};
    }

    

    const createPeerAndConnect = (stream)=>{
        // console.log("createPeerAndConnect")
        userVideo.current.srcObject = stream;
        socketRef.current.on("messages in room",(data)=>{
            console.log({data})
            setMessages(prev=>{
                var newState = [...prev]
                if(data.attahcment!=null){
                    var bytes = new Uint8Array(data.attahcment);
                    var blob = new Blob([bytes.buffer]);
                    newState.push({...data,attahcment:URL.createObjectURL(blob)})
                }else{
                    newState.push({...data,attahcment:false})
                }
                return newState
            })
        })
        socketRef.current.on("left room",data=>{
            console.log(data,"left room")
        })
        socketRef.current.emit("join meeting room", {roomID:id,username:meetingUserName});
        socketRef.current.on("user joined/leave in meeting",(users)=>{
            console.log("user joined/leave in meeting",{users})
            const peerss = [];
            users.forEach(user => {
                if (user.socketID!=socketRef.current.id){
                    const peer = createPeer(user.socketID, socketRef.current.id, user.username,stream);
                    peersRef.current.push({
                        peerID: user.socketID,
                        peer:peer.peer,
                        username:peer.username
                    })
                    peerss.push(peer);
                }
            })
            setPeers(peerss);
        })
        socketRef.current.on("user joined", payload => {
            console.log({payload})
            const peer = addPeer(payload.signal, payload.callerID, payload.username,stream);
            peersRef.current.push({
                peerID: payload.callerID,
                peer:peer.peer,
                username:peer.username
            })

            setPeers(users => [...users, peer]);
        });
        socketRef.current.on("receiving returned signal", payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });
    }
    const animateAudioIcon = (stream,callBack,interv)=>{
        return new Promise((resolve,reject)=>{
            try {
                const audioContext = new AudioContext()
                const audioSource = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.minDecibels = -127;
                analyser.maxDecibels = 0;
                analyser.smoothingTimeConstant = 0.4;
                audioSource.connect(analyser);
                const volumes = new Uint8Array(analyser.frequencyBinCount);
                
                callBack = () => {
                        analyser.getByteFrequencyData(volumes);
                        let volumeSum = 0;
                        for(const volume of volumes)
                            volumeSum += volume;
                        const averageVolume = volumeSum / volumes.length;
                        // console.log({averageVolume})
                        // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
                    }
                setVolumeCallback(callBack)
                interv = setInterval(volumeCallback, 100);
                setVolumeInterval(interv)
                setInterval(callBack, 100)
                resolve(true)
            } catch (error) {
                reject(false)
            }
        })
        
    }
    const initWebRTC = async()=>{
        // console.log("call_page component mounted")
        const supported = navigator.mediaDevices.getSupportedConstraints();
        let callBack = null
        let interv = null
        navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: {
                sampleSize: 16,
                channelCount: 2,
                echoCancellation: true
            },
        }).then(async(stream) => {
            // console.log({stream})
            setLocalStream(stream)
            createPeerAndConnect(stream)
            const animatedAudioIcon = await animateAudioIcon(stream,callBack,interv)
            if (animatedAudioIcon){
                // endChanges
                dispatch({
                    type:"SETAUDIOFEED",
                    payload:{audioFeed:true}
                })
                dispatch({
                    type:"SETVIDEOFEED",
                    payload:{videoFeed:true}
                })
            }else{
                dispatch({
                    type:"SETAUDIOFEED",
                    payload:{audioFeed:false}
                })
                dispatch({
                    type:"SETVIDEOFEED",
                    payload:{videoFeed:false}
                })
            }
          })
          .catch((err) => {
            // localVideoRef.current.srcObject = null
            setLocalStream(null)
            dispatch({
                type:"SETAUDIOFEED",
                payload:{audioFeed:false}
            })
            dispatch({
                type:"SETVIDEOFEED",
                payload:{videoFeed:false}
            })
          });
    }
    useEffect(()=>{
        var width = `${peers.length+1>=4?(document.querySelector(".videoContainer").clientWidth/4):peers.length+1>=3<4?(document.querySelector(".videoContainer").clientWidth/3):peers.length+1>=2<3?(document.querySelector(".videoContainer").clientWidth/2):(document.querySelector(".videoContainer").clientWidth)}px`
        setvideoWidth(width)
    },[peers])

    return (
        <>
            <div className="videoContainer" style={{background:"#222",height:"80vh",position:"relative"}}>
                <MeetingInfo />
                <div style={{columnGap:"10px",rowGap:"10px",height:"80vh",padding:"10px",justifyContent:"center",alignItems:"center",display:"flex",flexWrap:"wrap"}}>
                    <div style={{display:"flex",flexDirection:"column"}}>
                        <video muted style={{
                            width:videoWidth,
                            border:"2px solid #fff",
                            borderRadius:"4px",
                            // maxHeight:"50%"
                        }} ref={userVideo} item autoPlay playsInline />
                        <span style={{fontSize:"14px",color:"#fff"}}>{meetingUserName.toUpperCase()}</span>
                    </div>
                    {peers.map((peer, index) => {
                        return (
                            <Video item key={index} peer={peer.peer} username={peer.username}  videoWidth={videoWidth}/>
                        );
                    })}
                </div>
            </div>
            <CallPageFooter  setvideoWidth={setvideoWidth} peers={peers} socketRef={socketRef}/>
        </>
    );
}

export default CallPage;


const Video = (props) => {
    const videoRef = useRef();
    const videoCointainerRef = useRef()

    useEffect(() => {
        if (props.peer){
            props.peer.on("stream", stream => {
                if (stream){
                    videoRef.current.srcObject = stream;
                    videoCointainerRef.current.style.display="flex"
                }
            })
        }
    }, []);

    

    return (
        <div ref={videoCointainerRef} style={{flexDirection:"column",display:"none"}}>
            <video playsInline autoPlay ref={videoRef} style={{
                width:props.videoWidth,
                border:"2px solid #fff",
                borderRadius:"4px",
                // maxHeight:"50%"
            }} />
            <span style={{fontSize:"14px",color:"#fff"}}>{props.username.toUpperCase()}</span>
        </div>

    );
}