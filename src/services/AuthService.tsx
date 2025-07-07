import Request from '../config/apiConfig';
import apiUrls from '../config/apiUrl';

const Login = async (payload: any) =>
  Request({
    method: 'POST',
    url: `auth/${apiUrls.login}`,
    data: payload,
  });
const Register = async (payload: any) =>
  Request({
    method: 'POST',
    url: `${apiUrls.register}`,
    data: payload,
  });

const ForgotPassword = async (payload: any) =>
  Request({
    method: 'POST',
    url: `auth/${apiUrls.forgotPassword}`,
    data: payload,
  });
const GetUserDetail=async()=>
  Request({
    method: 'GET',
    url: `auth/${apiUrls.getUserDetail}`,
    secure: true,
  });

const AuthService = {
  Login,
  Register,
  ForgotPassword,
  GetUserDetail,
};

export default AuthService;
