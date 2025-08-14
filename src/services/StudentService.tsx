import Request from '../config/apiConfig';

const CreateStudent = async (payload: FormData) =>
  Request({
    url: 'student',
    method: 'POST',
    data: payload,
    secure: true,
    files: true,
  });

const UploadCSV = async (payload: FormData) =>
  Request({
    url: 'student/add-csv',
    method: 'POST',
    data: payload,
    secure: true,
    files: true,
  });

const GetAll = async () =>
  Request({
    url: 'student/all',
    method: 'GET',
    secure: true,
  });

const GetStudentByEmployeeId = async (employeeId: string) =>
  Request({
    url: `student/employee/${employeeId}`,
    method: 'GET',
    secure: true,
  });

const GetStudentByEmployee = async ({
  page,
  limit,
}: {
  page: string | number;
  limit: string | number;
}) =>
  Request({
    url: `student/employee`,
    method: 'GET',
    secure: true,
    params: {
      page,
      limit,
    },
  });

const GetStudentByTeacher = async (teacherId: string) =>
  Request({
    url: `student/teacher/${teacherId}/assigned-students`,
    method: 'GET',
    secure: true,
  });

const GetStudentById = async (studentId: string) =>
  Request({
    url: `student/${studentId}`,
    method: 'GET',
    secure: true,
  });

const UpdateStudent = async (id: string, payload: FormData) =>
  Request({
    url: `student/${id}`,
    method: 'PUT',
    data: payload,
    secure: true,
    files: true,
  });

const DeleteStudent = async (id: string) =>
  Request({
    url: `student/${id}`,
    method: 'DELETE',
    secure: true,
  });

const StudentService = {
  CreateStudent,
  UploadCSV,
  GetAll,
  GetStudentByEmployeeId,
  GetStudentByEmployee,
  GetStudentByTeacher,
  GetStudentById,
  UpdateStudent,
  DeleteStudent,
};

export default StudentService;
