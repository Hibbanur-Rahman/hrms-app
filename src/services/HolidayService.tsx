import Request from "../config/apiConfig";
import { HolidayResponse } from "../types/holiday";

const GetAllHolidays = async (): Promise<HolidayResponse> => Request({
    url: 'holidays/custom',
    method: 'GET',
    secure: true,
});

const HolidayService = {
    GetAllHolidays
}

export default HolidayService;