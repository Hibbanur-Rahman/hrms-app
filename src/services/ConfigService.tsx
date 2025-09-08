import Request from "../config/apiConfig";

const GetUrlList=async()=>Request({
    url:'api-base-url/all',
    method:'GET',
})

const GetClientConfig=async()=>Request({
    url:'company-information',
    method:'GET',
})
const ConfigService={
    GetUrlList,
    GetClientConfig
}

export default ConfigService;