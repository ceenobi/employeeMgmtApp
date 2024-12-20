export type UserAuthFormProps = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type Userinfo = {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dept: string;
  role: string;
  photo?: string;
  isVerified?: boolean;
  isVisible?: boolean;
  createdAt?: string;
  jobTitle?: string | undefined;
  status: string;
  employeeId?: string;
  leaveCount?: number;
  bio?: string;
  gender?: string;
  jobType?: string | undefined;
  maritalStatus?: string;
  dateOfBirth?: string;
  salary?: number;
  allowance?: number;
  address?: {
    homeAddress?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
  };
};

export type DepartmentsData = {
  _id: string;
  name: string;
  supervisor: string;
  supervisorEmployeeId?: string;
};

export interface PayrollFormData {
  _id?: string;
  employee?: string;
  employeeId: string;
  month: number;
  year: number;
  salary: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  tax: number;
  net?: number;
  payrollId?: string;
  status?: string;
  leaveWithoutPay: number;
  lateDays?: number;
  payPeriod: {
    start: string;
    end: string;
  };
  userId?: {
    firstName?: string;
    lastName?: string;
  };
}
