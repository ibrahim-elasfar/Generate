'use client';

import { useQuery } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Eye } from 'lucide-react';
import Link from 'next/link';
import { HR_EMPLOYEES } from '@/graphql/employee/queries';
import { useState } from 'react';

export function HREmployeesList() {
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const { data, loading } = useQuery(HR_EMPLOYEES, {
    variables: { department: departmentFilter !== 'all' ? departmentFilter : undefined }
  });

  if (loading) return <div>Loading...</div>;

  const employees = data?.hrEmployees || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employees Directory</CardTitle>
        <div className="flex gap-4">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/employee/hr/employees/add">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map((emp: any) => (
            <div key={emp.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={emp.image} />
                  <AvatarFallback>{emp.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{emp.name}</h4>
                  <p className="text-sm text-gray-600">{emp.position}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{emp.department}</Badge>
                    <span className="text-xs text-gray-500">ID: {emp.employeeId}</span>
                  </div>
                </div>
              </div>
              <Link href={`/employee/hr/employees/${emp.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}