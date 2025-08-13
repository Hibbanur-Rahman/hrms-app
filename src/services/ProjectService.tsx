import Request from '../config/apiConfig';

const GetAllEmployees = async () =>
  Request({
    url: 'employee/fetch?all=true',
    method: 'get',
    secure: true,
  });

  const GetAllProjects = async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = queryString ? `project/user?${queryString}` : 'project/user';
    
    return Request({
      url,
      method: 'get',
      secure: true,
    });
  };

const CreateProject = async (payload: any) =>
  Request({
    url: 'project',
    method: 'post',
    secure: true,
    data: payload,
    files: true,
  });

const DeleteProject = async (id: string) =>
  Request({
    url: `project/${id}`,
    method: 'delete',
    secure: true,
  });

const UpdateProject = async (id: string, payload: any) =>
  Request({
    url: `project/${id}`,
    method: 'put',
    secure: true,
    data: payload,
    files: true,
  });

  const GetProjectById = async (id: string) =>
  Request({
    url: `project/${id}`,
    method: 'get',
    secure: true,
  });


const ProjectService = {
  GetAllEmployees, 
  GetAllProjects,
  CreateProject,
  DeleteProject,
  UpdateProject,
  GetProjectById,
};

export default ProjectService;
