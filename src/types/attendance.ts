// Attendance Type Definitions

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface CheckInOut {
  location: Location;
  time: string;
  distance?: number;
  isAutoCheckOut?: boolean;
}

export interface DailyCheckIn {
  date: string;
  checkedIn: boolean;
}

export interface AttendanceRecord {
  _id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  checkIn: CheckInOut;
  checkOut: CheckInOut;
  dailyCheckIn: DailyCheckIn;
  duration: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  formattedCheckIn: string;
  formattedCheckOut: string;
  id: string;
}

export interface AttendancePagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AttendanceListResponse {
  success: boolean;
  data: AttendanceRecord[];
  message: string;
  pagination: AttendancePagination;
  filter: {
    employeeId: string;
    month: string;
    year: string;
    page: number;
    limit: number;
  };
}

// Attendance Count Types
export interface WorkingHours {
  hours: number;
  minutes: number;
  formatted: string;
}

export interface AttendanceCount {
  attendanceCount: number;
  totalWorkingHours: WorkingHours;
  averageWorkingHours: WorkingHours;
}

export interface LeaveCategoryBreakdown {
  count: number;
  days: number;
}

export interface LeaveDetails {
  _id: string;
  name: string;
  reason: string;
  applyDate: string;
  leaveDays: number;
  status: string;
  leaveCategory: string;
  selectedDates: string[];
  createdAt: string | null;
  updatedAt: string | null;
  fromDate: string;
  toDate: string;
  approvedDate: string | null;
  rejectedDate: string | null;
  approverName: string;
}

export interface LeaveInfo {
  totalLeaveRequests: number;
  totalLeaveDays: number;
  approvedLeaves: number;
  approvedLeaveDays: number;
  pendingLeaves: number;
  pendingLeaveDays: number;
  rejectedLeaves: number;
  rejectedLeaveDays: number;
  approvedLeaveCategoryBreakdown: {
    [key: string]: LeaveCategoryBreakdown;
  };
  leaveDetails: LeaveDetails[];
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  designation: string;
}

export interface AttendanceCountData {
  employee: Employee;
  attendance: AttendanceCount;
  leave: LeaveInfo;
  filter: {
    employeeId: string;
    month: string;
    year: string;
  };
}

export interface AttendanceCountResponse {
  success?: boolean;
  data?: AttendanceCountData;
  message?: string;
}
