
export type AttendanceType = 'present' | 'absent' | 'leave' | 'holiday' | 'weekend' | 'none';

export interface DayData {
  date: number;
  attendance: AttendanceType;
  checkInTime?: string;
  checkOutTime?: string;
}
