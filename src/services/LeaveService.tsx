import Request from '../config/apiConfig';

const GetLeaves = async ({
  employeeId,
  month,
  year,
  page,
  limit,
}: {
  employeeId: string;
  month: string;
  year: string;
  page: number;
  limit: number;
}) =>
  Request({
    url: `leave/requests/${employeeId}?month=${month}&year=${year}&page=${page}&limit=${limit}`,
    method: 'GET',
    secure: true,
  });

const CreateLeave = async (payload: any) =>
  Request({
    url: `leave/submit`,
    method: 'POST',
    secure: true,
    data: payload,
    files: true,
  });

const LeaveService = {
  GetLeaves,
  CreateLeave,
};

export default LeaveService;