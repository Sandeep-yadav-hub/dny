var events = require('events');
var eventEmitter = new events.EventEmitter();
const dayjs = require("dayjs")



var queueData = {}
var ifQueueData = false
const database = {}

function deserialize(serializedJavascript){
    return eval('(' + serializedJavascript + ')');
}


//Create an event handler:
var myEmployeeQueueDataHandler = async function ({type,data}) {
    if(ifQueueData){
        switch (type) {
            case "onActive":
                queueData[data.id] = {
                    status:"inActive",
                    jobId:data.jobId
                }
                break;
            case "onProcess":
                queueData[data.id] = {
                    ...queueData[data.id],
                    status:"inProcess"
                }
                break;
            case "onComplete":
                queueData[data.id] = {
                    ...queueData[data.id],
                    status:"inComplete",
                    result:data.result
                }
                break
            case "onFailed":
                queueData[data.id] = {
                    ...queueData[data.id],
                    status:"inFailed",
                    error:data.err
                }
                break;
            case "onProgress":
                queueData[data.id] = {
                    ...queueData[data.id],
                    progress:data.progress
                }
                break
            case "onStalled":
                queueData[data.id] = {
                    ...queueData[data.id],
                    status:"inStalled",
                }
                break
            case "onStalled":
                queueData[data.id] = {
                    ...queueData[data.id],
                    status:"inWaiting",
                }
                break
            default:
                break;
        }
    }
}

//Assign the event handler to an event:
eventEmitter.on('EmployeeQueueDataHandler', myEmployeeQueueDataHandler);

exports.ifEmployeeQueuData = (ifEmployeeQueueData)=>{
    ifQueueData = ifEmployeeQueueData
}

exports.attachDatabase = (db)=>{
    database["db"] = db
}


exports.jobOnProcess = async function(job,done){
    try {
        const jobData = deserialize(job.data.obj);
        var dataToSend = {}
        if("onProcess" in jobData){
            eventEmitter.emit('EmployeeQueueDataHandler',{type:"onProcess",data:{id:job.id}});
            dataToSend = await jobData.onProcess(database["db"]?database["db"]:undefined,jobData,job)
        }
        done(null, dataToSend);
    } catch (error) {
        console.log(error)
    }
}

exports.jobOnComplete = async function(job, result){
    try {
        const jobData = deserialize(job.data.obj);
        if("onComplete" in jobData){
            await jobData.onComplete(jobData,result,job.id)
        }
        eventEmitter.emit('EmployeeQueueDataHandler',{type:"onComplete",data:{id:job.id,result}});
    } catch (error) {
        throw Error(error)
    }
}

exports.jobOnError = async function(err){
    try{
        console.log("Job Error",err)
    }catch(error){
        throw Error(error)
    }
}

exports.jobOnFailed = async function(job,err){
    try {
        const jobData = deserialize(job.data.obj);
        if("onFailed" in jobData){
            await jobData.onFailed(jobData,err,job.id)
        }
        eventEmitter.emit('EmployeeQueueDataHandler',{type:"onFailed",data:{id:job.id,err}});
    } catch (error) {
        throw Error(error)
        
    }
}

exports.jobOnStalled = async function(job){
    try {
        const jobData = deserialize(job.data.obj);
        if("onStalled" in jobData){
            await jobData.onStalled(jobData,id)
        }
        eventEmitter.emit('EmployeeQueueDataHandler',{type:"onStalled",data:{id:job.id}});
    } catch (error) {
        throw Error(error)
    }
}

exports.jobOnWaiting = async function (jobId){
    try {
        eventEmitter.emit('EmployeeQueueDataHandler',{type:"onWaiting",data:{id:jobId}});
    } catch (error) {
        throw Error(error)
        
    }
}

exports.jobOnActive = async function(job,jobPromise){
    try {
        const jobData = deserialize(job.data.obj);
        if("onActive" in jobData){
            await jobData.onActive(jobData,jobPromise,job.id)
        }
        eventEmitter.emit('EmployeeQueueDataHandler',{type:"onActive",data:{id:job.id,jobId:jobData.jobId}});
    } catch (error) {
        throw Error(error)
        
    }
}

exports.jobOnProgress = async function(job, progress){
    try {
        const jobData = deserialize(job.data.obj);
        if("onProgress" in jobData){
            await jobData.onProgress(jobData,progress,job.id)
        }
        eventEmitter.emit('EmployeeQueueDataHandler',{type:"onProgress",data:{id:job.id,progress}});
    } catch (error) {
        throw Error(error)
        
    }
}

exports.getQueueDataList = async function(){
    if(ifQueueData){
        return queueData
    }
    return "QueueData disabled"
}

exports.getQueueData = async function(id){
    if(ifQueueData){
        var toSend = {}
        for(const key in queueData){
            if(queueData[key].jobId==id){
                toSend = queueData[key]
            }else{
                toSend = {err:"Not found"}
            }
        }
        return toSend
        
    }
    return "QueueData disabled"
}