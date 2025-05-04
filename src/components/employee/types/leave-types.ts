
export interface LeaveType {
  id: string;
  name: string;
  description: string | null;
}

export interface LeaveBalance {
  id: string;
  leave_type_id: string;
  total_days: number;
  used_days: number;
  remaining: number;
  type: string;
}

export interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  leave_type: string;
}

export interface LeaveFormData {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}
