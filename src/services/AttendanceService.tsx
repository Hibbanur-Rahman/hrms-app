import Request from '../config/apiConfig';

const GetAttendanceList = async ({
  employeeId,
  month,
  year,
  page,
  limit,
}: {
  employeeId: string;
  month: number;
  year: number;
  page: number;
  limit: number;
}) =>
  Request({
    url: `attendance/${employeeId}?month=${month}&year=${year}&page=${page}&limit=${limit}`,
    method: 'GET',
    secure: true,
  });

const CheckIn = async (payload: any) =>
  Request({
    url: 'attendance/check-in',
    method: 'post',
    secure: true,
    data: payload,
  });

const CheckOut = async (payload: any) =>
  Request({
    url: 'attendance/check-out',
    method: 'post',
    secure: true,
    data: payload,
  });

  const GetTodayAttendance=async(id:any)=>Request({
    url:`attendance/${id}/today`,
    method:'GET',
    secure:true,
   
  })

const AttendanceService = {
  GetAttendanceList,
  CheckIn,
  CheckOut,
  GetTodayAttendance,
};

export default AttendanceService;
