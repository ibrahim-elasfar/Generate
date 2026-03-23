'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, DollarSign, Calendar, FileText, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { GET_EMPLOYEE_SALARIES } from '@/graphql/jobs/queries';

export function SalaryReportsList() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const { data, loading } = useQuery(GET_EMPLOYEE_SALARIES, {
    variables: {
      month: selectedMonth,
      year: selectedYear,
      department: departmentFilter !== 'all' ? departmentFilter : undefined
    }
  });

  const salaries = data?.employeeSalaries || [];

  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

  const totalSalary = salaries.reduce((sum: number, s: any) => sum + s.netSalary, 0);
  const averageSalary = salaries.length > 0 ? totalSalary / salaries.length : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Reports</CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {format(new Date(2024, i, 1), 'MMMM')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2023, 2022, 2021].map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="ml-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Salaries</span>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2">${totalSalary.toLocaleString()}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Salary</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">${averageSalary.toLocaleString()}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Employees Paid</span>
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{salaries.length}</p>
          </div>
        </div>

        {/* Salaries Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Position</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Department</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Base Salary</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Bonuses</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Deductions</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Net Salary</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {salaries.map((salary: any) => (
                <tr key={salary.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{salary.employeeName}</td>
                  <td className="px-4 py-3 text-sm">{salary.position}</td>
                  <td className="px-4 py-3 text-sm">{salary.department}</td>
                  <td className="px-4 py-3 text-sm text-right">${salary.baseSalary.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">
                    +${(salary.bonuses?.performanceBonus || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">
                    -${(salary.deductions?.tax || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">
                    ${salary.netSalary.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={salary.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {salary.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/employee/finance-manager/salaries/${salary.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {salaries.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No salary data found for this period</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}