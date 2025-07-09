import Request from '../config/apiConfig';

const GetAllEmployees = async () =>
  Request({
    url: 'employee/fetch?all=true',
    method: 'get',
    secure: true,
  });

  const GetAllProjects = async () =>
  Request({
    url: 'project/user',
    method: 'get',
    secure: true,
  });

const CreateProject = async (payload: any) =>
  Request({
    url: 'project',
    method: 'post',
    secure: true,
    data: payload,
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
