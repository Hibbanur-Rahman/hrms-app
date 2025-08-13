// Holiday types for the HRMS application

export interface Country {
  id: string;
  name: string;
}

export interface Holiday {
  _id: string;
  country: Country;
  date: string;
  name: string;
  description?: string;
  type: string[];
  primary_type?: string;
  canonical_url?: string;
  urlid?: string;
  locations: string;
  states: string;
  addedBy: string;
  isCustom: boolean;
  createdAt: string;
  __v: number;
}

export interface HolidayResponse {
  status: number;
  data: {
    data: Holiday[];
    message?: string;
  };
}
