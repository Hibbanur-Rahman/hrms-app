import Request from "../config/apiConfig";

const GetAllSalarySlip = async (id: string,year: string) => Request({
    url: `salary/${id}/${year}/all`,
    method: 'GET',
    secure: true,
})
const ViewSalarySlip = async (id: string) => Request({
    url: `salary/view/${id}`,
    method: 'GET',
    secure: true,
})
const DownloadSalarySlip = async (id: string) => Request({
    url: `salary/download/${id}`,
    method: 'GET',
    secure: true,
})

const ViewSalarySlipByMonth = async (id: string,month: string,year: string) => Request({
    url: `salary/view/${id}/${month}/${year}`,
    method: 'GET',
    secure: true,
})
 

const SalarySlipService = {
    GetAllSalarySlip,
    ViewSalarySlip,
    DownloadSalarySlip,
    ViewSalarySlipByMonth,
}
export default SalarySlipService;