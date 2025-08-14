import Request from "../config/apiConfig";

const CreateSession=async(payload)=>Request({
    url:'sessions',
    method:'POST',
    data:payload,
    secure:true,
})

const UpdateSession=async(id:string,payload)=>Request({
    url:`sessions/${id}`,
    method:'PUT',
    data:payload,
    secure:true,
})

const GetAllSessions=async()=>Request({
    url:'sessions',
    method:'GET',
    secure:true,
})


const GetSessionById=async(id:string)=>Request({
    url:`sessions/${id}`,
    method:'GET',
    secure:true,
})

const GetSessionByStudentId=async(studentId:string)=>Request({
    url:`sessions/student/${studentId}`,
    method:'GET',
    secure:true,
})

const GetSessionByEmployeeId=async(employeeId:string)=>Request({
    url:`sessions/employee/${employeeId}`,
    method:'GET',
    secure:true,
})

const DeleteSession=async(id:string)=>Request({
    url:`sessions/${id}`,
    method:'DELETE',
    secure:true,
})

const SessionService={
    CreateSession,
    UpdateSession,
    GetAllSessions,
    GetSessionById,
    GetSessionByStudentId,
    GetSessionByEmployeeId,
    DeleteSession
}

export default SessionService;
