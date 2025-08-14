import Request from "../config/apiConfig";

const CreateTask=async(payload:any)=>Request({
    url:`task`,
    method:'POST',
    secure:true,
    data:payload,
})

const CreateSubTask=async(payload:any)=>Request({
    url:`task/subtask`,
    method:'POST',
    secure:true,
    data:payload,
})

const GetTaskById=async(id:string)=>Request({
    url:`task/${id}`,
    method:'GET',
    secure:true,
})

const GetActivityLogs=async(id:string)=>Request({
    url:`task/${id}/activity-logs`,
    method:'GET',
    secure:true,
})

const UpdateTask=async(id:string,payload:any)=>Request({
    url:`task/${id}`,
    method:'PUT',
    secure:true,
    data:payload,
})

const DeleteTask=async(id:string)=>Request({
    url:`task/${id}`,
    method:'DELETE',
    secure:true,
})

const CreateComment=async(id:string,payload:any)=>Request({
    url:`task/${id}/comments`,
    method:'POST',
    secure:true,
    data:payload,
})

const UpdateTaskState=async(id:string,payload:any)=>Request({
    url:`task/${id}/state`,
    method:'PUT',
    secure:true,
    data:payload,
})


const TaskService={
    CreateTask,
    CreateSubTask,
    GetTaskById,
    GetActivityLogs,
    UpdateTask,
    DeleteTask,
    CreateComment,
    UpdateTaskState
}

export default TaskService;