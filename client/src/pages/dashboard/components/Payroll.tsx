import { Userinfo } from "@/emply-types";
import { formatCurrency } from "@/utils/format";
import { Banknote } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  user: Userinfo;
  getPayrollHistoryNetpay: number;
  payrollPercentageChange: number;
  getTotalDeductions: number;
  getTotalAllowances: number;
  totalAllowances: number;
  totalDeductions: number;
  averagePayrollAmount: number;
  payrollGrowthRate: number;
  budgetComparisonPercentage: number;
  budget: number;
  upcomingPayrollDates: string[];
  //netPayDistribution: { [key: string]: number };
  netPayDistributionPercentage: {
    department: string;
    netPay: number;
    percentage: number;
  }[];
  chartData: {
    date: string;
    netPay: number;
  }[];
};

export default function Payroll({
  user,
  getPayrollHistoryNetpay,
  payrollPercentageChange,
  getTotalDeductions,
  getTotalAllowances,
  totalDeductions,
  totalAllowances,
  averagePayrollAmount,
  payrollGrowthRate,
  budgetComparisonPercentage,
  budget,
  upcomingPayrollDates,
  netPayDistributionPercentage,
  chartData,
}: Props) {
  const role = ["user","admin", "super-admin"];
  const payrollFrequency = "Monthly";

  const chartDataGraph = chartData.map((trend) => ({
    date: trend.date,
    netPay: trend.netPay,
  }));

  return (
    <div className="mt-4 bg-gray-900 shadow-lg p-4 rounded-md">
      <p className="mb-4">Payroll</p>
      {role.includes(user?.role) && (
        <>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="stats shadow p-3">
              <div className="stat text-gray-200">
                <div className="stat-figure text-primary">
                  <Banknote />
                </div>
                <div className="stat-title">Net Pay History</div>
                <div className="stat-value text-primary">
                  {formatCurrency(getPayrollHistoryNetpay)}
                </div>
                <div className="stat-desc">
                  {payrollPercentageChange}% change the past year
                </div>
              </div>
            </div>
            <div>
              <div>
                <p className="text-gray-400">Average Payroll Amount</p>
                <p className="text-primary">
                  {formatCurrency(averagePayrollAmount)}
                </p>
              </div>
              <div className="divider"></div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-gray-400">All Time Allowances</p>
                  <p className="text-primary">
                    {formatCurrency(getTotalAllowances)}
                  </p>
                </div>
                <div className="divider"></div>
                <div>
                  <p className="text-gray-400">All Time Deductions</p>
                  <p className="text-primary">
                    {formatCurrency(getTotalDeductions)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
        </>
      )}
      {role.includes(user?.role) && (
        <>
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <p className="text-gray-400 mb-2">Payroll Growth Rate</p>
              <div
                className="radial-progress text-success"
                style={
                  {
                    "--value": Math.max(0, Math.min(100, payrollGrowthRate)),
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                {payrollGrowthRate}%
              </div>
              <p className="text-sm">
                {payrollGrowthRate}% within the last year
              </p>
            </div>

            <div className="stat place-items-center w-[200px]">
              <div className="stat-title">Budget</div>
              <div className="text-secondary text-xl">
                {formatCurrency(budget)}
              </div>
              <div className="stat-desc text-secondary">
                {budgetComparisonPercentage > 0
                  ? `↑ ${budgetComparisonPercentage}%`
                  : `↓ ${Math.abs(budgetComparisonPercentage)}%`}
              </div>
            </div>

            <div className="flex gap-6">
              <div>
                {Object.entries(totalAllowances).map(([key, value], index) => (
                  <div key={index}>
                    <p className="text-gray-400 capitalize text-sm">{key}</p>
                    <p className="text-primary text-sm">
                      {formatCurrency(value)}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                {Object.entries(totalDeductions).map(([key, value], index) => (
                  <div key={index}>
                    <p className="text-gray-400 capitalize text-sm">{key}</p>
                    <p className="text-primary text-sm">
                      {formatCurrency(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="divider"></div>
        </>
      )}
      <div className="flex flex-wrap justify-between items-center">
        <div className="stat place-items-start w-[200px]">
          <div className="stat-title">Payroll Frequency</div>
          <div className="text-secondary text-xl">{payrollFrequency}</div>
        </div>
        <div className="stat place-items-start w-[200px]">
          <div className="stat-title">Upcoming Payroll Dates</div>
          {upcomingPayrollDates.map((item, index) => (
            <div className="text-secondary text-sm" key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="divider"></div>
      <div>
        <h1 className="text-gray-400">Net Pay Distribution</h1>
        <div className="mt-4 flex flex-wrap gap-6">
          {netPayDistributionPercentage.map((item) => (
            <div key={item.department}>
              <div
                className="radial-progress text-success"
                style={
                  {
                    "--value": Math.max(0, Math.min(100, item.percentage)),
                  } as React.CSSProperties
                }
                role="progressbar"
              ></div>
              <p className="text-sm text-center">
                {item.percentage.toFixed(2)}%
              </p>
              <p className="text-sm text-center">{item.department}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="divider"></div>
      <div className="hidden md:block">
        <h2 className="mb-4">Historical Payroll Trends</h2>
        <LineChart width={600} height={300} data={chartDataGraph}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="netPay"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
}
