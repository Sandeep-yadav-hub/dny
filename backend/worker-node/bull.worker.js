const Queue = require('bull');
var {jobOnProcess,jobOnComplete,jobOnError,jobOnFailed,jobOnFailed,jobOnStalled,jobOnWaiting,jobOnActive,jobOnProgress,getQueueDataList,getQueueData,ifEmployeeQueuData,attachDatabase} = require("./bull.helper.employee")

var serialize = require('serialize-javascript');
var io = require('socket.io-client');

const db = require("../app/models")
attachDatabase(db)

var redisHostVar;
var sockets_URL;
var DEV = false


if (process.env.USER=="kumar"){
    DEV = true
}else{
    DEV = false
}

if(DEV){
    redisHostVar = "localhost"
    sockets_URL = "http://localhost:8080"
}else{
    redisHostVar = "redis"
    sockets_URL = "http://nodeapp:8080"
}

const enableQueue = true
const sockets_SOCKET = {}

const ONETIMEJOB = "oneTimeJob"
const ROUTINEJOB = "routineJob"
const REMOVEROUTINEJOB = "removeRoutineJob"


ifEmployeeQueuData(enableQueue)



try {
    var SocketIo = io.connect(sockets_URL, {
        reconnect: true
    });
        // }
    sockets_SOCKET[sockets_URL] = SocketIo
} catch (error) {
    console.log(error)
}




const redisHost = process.env.REDIS_HOST || redisHostVar ;
const redisPort = process.env.REDIS_PORT || 6379;
const queueName = 'Employees';


// A queue for the jobs scheduled based on a routine without any external requests
const EmployeeJobQueue = new Queue(queueName, { redis: { port: redisPort, host: redisHost } });

EmployeeJobQueue.process(function (job, done) {
    jobOnProcess(job,done)
});

EmployeeJobQueue.on('active', function(job, jobPromise){
    jobOnActive(job,jobPromise)
    // A job has started. You can use `jobPromise.cancel()`` to abort it.
})

EmployeeJobQueue.on('completed', function (job, result) {
    jobOnComplete(job,result)
})
EmployeeJobQueue.on('error', function (error) {
    jobOnError(error)
})

EmployeeJobQueue.on('stalled', function (job) {
    jobOnStalled(job)
})

EmployeeJobQueue.on('lock-extension-failed', function (job, err) {
    console.log({job, err})
});

EmployeeJobQueue.on('failed', function (job, err) {
    jobOnFailed(job, err)

})

EmployeeJobQueue.on('waiting', function(jobId){
    jobOnWaiting(jobId)
});

EmployeeJobQueue.on('progress', function(job, progress){
    jobOnProgress(job, progress)
})

// ...whereas global events only pass the job ID:
EmployeeJobQueue.on('global:progress', function(jobId, progress) {
    console.log(`Job ${jobId} is ${progress}% ready!`);
});
  
EmployeeJobQueue.on('global:completed', function(jobId, result) {
    console.log(`Job ${jobId} completed! Result: ${result}`);
    EmployeeJobQueue.getJob(jobId).then(function(job) {
        if(job){
            console.log(`${job.id} removed`)
            job.remove();
        }
    });
});


function deserialize(serializedJavascript){
    return eval('(' + serializedJavascript + ')');
}

for(const socketURL in sockets_SOCKET){
    var SocketIo = sockets_SOCKET[socketURL]
    SocketIo.on('connect', async function () { 
        const routineJobs = {}
        console.log("Bull Worker connected to Application via socket with socketId: ",SocketIo.id)
        console.log({url:socketURL,status:SocketIo.connected,hostName:SocketIo.io.opts.hostname})
        SocketIo.on("addToEmployeeQueue",async function(job){
            const deserializeData = deserialize(job)
            console.log(deserializeData.jobType)
            let jobId = deserializeData.jobId
            console.log("event to run",jobId)
            switch (deserializeData.jobType) {
                case ONETIMEJOB:
                    await EmployeeJobQueue.add({obj:serialize(deserializeData)});
                    break;
                case ROUTINEJOB:
                    try {
                        routineJobs[jobId] = setInterval(async() => {
                            await EmployeeJobQueue.add({obj:serialize(deserializeData)});
                        }, deserializeData.interval);
                    } catch (error) {
                        throw new Error(error)
                    }
                case REMOVEROUTINEJOB:
                    clearInterval(routineJobs[jobId]);
                default:
                    break;
            }
        })
        SocketIo.on("enableQueueData",async()=>{
            ifEmployeeQueuData(true)
        })
        SocketIo.on("disableQueueData",async()=>{
            ifEmployeeQueuData(false)
        })
        SocketIo.on("getEmployeeQueueDataList",async function(){
            SocketIo.emit("listOfEmployeeQueueData",await getQueueDataList())
        })
    });

}






// var count = 10
// Array(count).fill("").map(async(item,idx)=>{
//     console.log({item,idx})
//     var data = {
//         jobId:idx, // must unique for every job 
//         jobType:ONETIMEJOB,
//         onProcess:async function(database,jobData,job){
//             console.log(jobData)
//             return (jobData)
//         },
//     };
//     EmployeeJobQueue.add({obj:serialize(data)});
// })



// var data = {
//     jobId:1, // must unique for every job 
//     jobType:"routine",
//     other attributes....
// } 
// data = {
//     ...data,
//     onProcess:async function(database,jobData,job){},
//     onComplete:async function(obData,result,id){},
//     onFailed:async function(jobData,err,id){},
//     onStalled:async function(job,id){},
//     onActive:async function(jobData,jobPromise,id){},
//     onProgress:async function(jobData,progress,id){}
// }

    
