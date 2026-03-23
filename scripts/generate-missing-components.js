// scripts/generate-missing-components.js

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../components/employee/dashboards');

// ✅ المكونات المطلوبة
const missingComponents = [
  // Developer Manager
  { name: 'DeveloperProjectDetailsPage', dir: 'developer-manager', type: 'details', title: 'Project Details', realQuery: 'GET_PROJECT_BY_ID', dataField: 'project', hasId: true },
  { name: 'DeveloperProfilePage', dir: 'developer-manager', type: 'profile', title: 'Developer Profile', realQuery: 'GET_DEVELOPER', dataField: 'developer' },
  { name: 'SkillsMatrixPage', dir: 'developer-manager', type: 'matrix', title: 'Skills Matrix', realQuery: 'DEVELOPER_MANAGER_STATS', dataField: 'skillDistribution' },
  { name: 'DeveloperReportsPage', dir: 'developer-manager', type: 'reports', title: 'Developer Reports', realQuery: 'DEVELOPER_MANAGER_STATS', dataField: 'developerManagerStats' },
  { name: 'NewDeveloperProjectPage', dir: 'developer-manager', type: 'form', title: 'New Project', realMutation: 'CREATE_PROJECT' },
  { name: 'AssignProjectPage', dir: 'developer-manager', type: 'assign', title: 'Assign Project', realMutation: 'ASSIGN_PROJECT' },

  // Support Agent
  { name: 'TicketDetailsPage', dir: 'support-agent', type: 'details', title: 'Ticket Details', realQuery: 'GET_TICKET', dataField: 'ticket', hasId: true },
  { name: 'SupportSettingsPage', dir: 'support-agent', type: 'settings', title: 'Support Settings', realQuery: 'EMPLOYEE_SETTINGS', dataField: 'employeeSettings' },
  { name: 'MyTicketsPage', dir: 'support-agent', type: 'list', title: 'My Tickets', realQuery: 'OPEN_TICKETS', dataField: 'openTickets' },

  // Store Manager
  { name: 'SuspendedStoresPage', dir: 'store-manager', type: 'list', title: 'Suspended Stores', realQuery: 'STORE_MANAGER_STATS', dataField: 'suspendedStores' },
  { name: 'StoreDetailsPage', dir: 'store-manager', type: 'details', title: 'Store Details', realQuery: 'GET_STORE', dataField: 'store', hasId: true },
  { name: 'SuspendStorePage', dir: 'store-manager', type: 'form', title: 'Suspend Store', realMutation: 'SUSPEND_STORE' },
  { name: 'StoreCategoriesPage', dir: 'store-manager', type: 'list', title: 'Store Categories', realQuery: 'STORE_MANAGER_STATS', dataField: 'storesByCategory' },
  { name: 'StoreAnalyticsPage', dir: 'store-manager', type: 'analytics', title: 'Store Analytics', realQuery: 'STORE_MANAGER_STATS', dataField: 'storeManagerStats' },

  // Seller Manager
  { name: 'SellersPage', dir: 'seller-manager', type: 'list', title: 'All Sellers', realQuery: 'SELLER_MANAGER_STATS', dataField: 'topSellers' },
  { name: 'SellerDetailsPage', dir: 'seller-manager', type: 'details', title: 'Seller Details', realQuery: 'GET_SELLER', dataField: 'seller', hasId: true },
  { name: 'SellerReportsPage', dir: 'seller-manager', type: 'reports', title: 'Seller Reports', realQuery: 'SELLER_MANAGER_STATS', dataField: 'sellerManagerStats' },

  // Marketing Manager
  { name: 'EmailMarketingPage', dir: 'marketing-manager', type: 'list', title: 'Email Campaigns', realQuery: 'ACTIVE_CAMPAIGNS', dataField: 'activeCampaigns' },
  { name: 'NewCampaignPage', dir: 'marketing-manager', type: 'form', title: 'New Campaign', realMutation: 'CREATE_CAMPAIGN_EMPLOYEE' },
  { name: 'CampaignDetailsPage', dir: 'marketing-manager', type: 'details', title: 'Campaign Details', realQuery: 'CAMPAIGN_PERFORMANCE', dataField: 'campaignPerformance', hasId: true },
  { name: 'EditCampaignPage', dir: 'marketing-manager', type: 'form', title: 'Edit Campaign', realMutation: 'UPDATE_CAMPAIGN_STATUS' },
  { name: 'AudiencePage', dir: 'marketing-manager', type: 'analytics', title: 'Audience Insights', realQuery: 'MARKETING_MANAGER_STATS', dataField: 'marketingManagerStats' },

  // Manager
  { name: 'AssignTaskPage', dir: 'manager', type: 'form', title: 'Assign Task', realMutation: 'ASSIGN_TASK' },
  { name: 'AddTeamMemberPage', dir: 'manager', type: 'form', title: 'Add Team Member', realMutation: 'ADD_EMPLOYEE' },
  { name: 'TeamMemberProfilePage', dir: 'manager', type: 'profile', title: 'Team Member Profile', realQuery: 'GET_EMPLOYEE', dataField: 'employee', hasId: true },
  { name: 'NewProjectPage', dir: 'manager', type: 'form', title: 'New Project', realMutation: 'CREATE_PROJECT' },
  { name: 'ManagerReportsPage', dir: 'manager', type: 'reports', title: 'Manager Reports', realQuery: 'MANAGER_STATS', dataField: 'managerStats' },
  { name: 'ProjectDetailsPage', dir: 'manager', type: 'details', title: 'Project Details', realQuery: 'GET_PROJECT_BY_ID', dataField: 'project', hasId: true },
  { name: 'EditProjectPage', dir: 'manager', type: 'form', title: 'Edit Project', realMutation: 'UPDATE_PROJECT' },
  { name: 'BudgetPage', dir: 'manager', type: 'analytics', title: 'Budget Overview', realQuery: 'MANAGER_STATS', dataField: 'managerStats' },

  // HR Manager
  { name: 'PostJobPage', dir: 'hr', type: 'form', title: 'Post Job', realMutation: 'CREATE_JOB' },
  { name: 'InterviewsPage', dir: 'hr', type: 'list', title: 'Interviews', realQuery: 'HR_INTERVIEWS', dataField: 'hrInterviews' },
  { name: 'AddEmployeePage', dir: 'hr', type: 'form', title: 'Add Employee', realMutation: 'ADD_EMPLOYEE' },
  { name: 'ApplicationDetailsPage', dir: 'hr', type: 'details', title: 'Application Details', realQuery: 'GET_ADMIN_APPLICATION', dataField: 'adminJobApplication', hasId: true },
  { name: 'EmployeeProfilePage', dir: 'hr', type: 'profile', title: 'Employee Profile', realQuery: 'GET_EMPLOYEE', dataField: 'employee', hasId: true },

  // Finance Manager
  { name: 'SalaryDetailsPage', dir: 'finance-manager', type: 'details', title: 'Salary Details', realQuery: 'GET_SALARY', dataField: 'salary', hasId: true },
  { name: 'FinanceReportsPage', dir: 'finance-manager', type: 'reports', title: 'Financial Reports', realQuery: 'FINANCE_MANAGER_STATS', dataField: 'financeManagerStats' },
  { name: 'PayoutDetailsPage', dir: 'finance-manager', type: 'details', title: 'Payout Details', realQuery: 'GET_PAYOUT', dataField: 'payout', hasId: true },
  { name: 'FinanceAnalyticsPage', dir: 'finance-manager', type: 'analytics', title: 'Financial Analytics', realQuery: 'FINANCE_MANAGER_STATS', dataField: 'financeManagerStats' },

  // App Manager
  { name: 'AppAnalyticsPage', dir: 'app-manager', type: 'analytics', title: 'App Analytics', realQuery: 'APP_MANAGER_STATS', dataField: 'appManagerStats' },
  { name: 'AppReviewPage', dir: 'app-manager', type: 'form', title: 'Review App', realMutation: 'REVIEW_APP' },
  { name: 'AppDetailsPage', dir: 'app-manager', type: 'details', title: 'App Details', realQuery: 'GET_APP', dataField: 'app', hasId: true },
  { name: 'AppsPage', dir: 'app-manager', type: 'list', title: 'Applications', realQuery: 'APP_MANAGER_STATS', dataField: 'topApps' },
  { name: 'CategoriesPage', dir: 'app-manager', type: 'list', title: 'Categories', realQuery: 'APP_MANAGER_STATS', dataField: 'appsByStatus' },
  { name: 'DeveloperDetailsPage', dir: 'app-manager', type: 'details', title: 'Developer Details', realQuery: 'ALL_DEVELOPERS', dataField: 'allDevelopers', hasId: true },

  // App Reviewer
  { name: 'ReviewAppPage', dir: 'app-reviewer', type: 'form', title: 'Review App', realMutation: 'SUBMIT_REVIEW' },

  // Content Moderator
  { name: 'ContentDetailsPage', dir: 'content-moderator', type: 'details', title: 'Content Details', realQuery: 'PENDING_REPORTS', dataField: 'pendingReports', hasId: true },
  { name: 'FlaggedContentPage', dir: 'content-moderator', type: 'list', title: 'Flagged Content', realQuery: 'CONTENT_MODERATOR_STATS', dataField: 'pendingReportsList' },
  { name: 'GuidelinesPage', dir: 'content-moderator', type: 'static', title: 'Moderation Guidelines' },
];

// ✅ دالة لتحديد مسار الاستيراد الصحيح
function getImportPath(realQuery, realMutation) {
  const queryMap = {
    'GET_PROJECT_BY_ID': '@/graphql/employee/queries',
    'GET_DEVELOPER': '@/graphql/jobs/queries',
    'GET_EMPLOYEE': '@/graphql/jobs/queries',
    'GET_ADMIN_APPLICATION': '@/graphql/jobs/queries',
    'GET_SALARY': '@/graphql/jobs/queries',
    'GET_PAYOUT': '@/graphql/employee/queries',
    'GET_STORE': '@/graphql/employee/queries',
    'GET_TICKET': '@/graphql/employee/queries',
    'GET_APP': '@/graphql/employee/queries',
    'GET_SELLER': '@/graphql/jobs/queries',
    'DEVELOPER_MANAGER_STATS': '@/graphql/employee/queries',
    'STORE_MANAGER_STATS': '@/graphql/employee/queries',
    'SELLER_MANAGER_STATS': '@/graphql/employee/queries',
    'FINANCE_MANAGER_STATS': '@/graphql/employee/queries',
    'APP_MANAGER_STATS': '@/graphql/employee/queries',
    'MARKETING_MANAGER_STATS': '@/graphql/employee/queries',
    'CONTENT_MODERATOR_STATS': '@/graphql/employee/queries',
    'SUPPORT_AGENT_STATS': '@/graphql/employee/queries',
    'EMPLOYEE_SETTINGS': '@/graphql/employee/queries',
    'OPEN_TICKETS': '@/graphql/employee/queries',
    'HR_INTERVIEWS': '@/graphql/employee/queries',
    'CAMPAIGN_PERFORMANCE': '@/graphql/employee/queries',
    'ACTIVE_CAMPAIGNS': '@/graphql/employee/queries',
    'ALL_DEVELOPERS': '@/graphql/employee/queries',
    'PENDING_REPORTS': '@/graphql/employee/queries',
    'MANAGER_STATS': '@/graphql/employee/queries',
  };

  const mutationMap = {
    'CREATE_PROJECT': '@/graphql/client/mutations',
    'UPDATE_PROJECT': '@/graphql/client/mutations',
    'CREATE_JOB': '@/graphql/jobs/mutations',
    'ADD_EMPLOYEE': '@/graphql/employee/mutations',
    'ASSIGN_TASK': '@/graphql/employee/mutations',
    'SUSPEND_STORE': '@/graphql/employee/mutations',
    'REVIEW_APP': '@/graphql/employee/mutations',
    'SUBMIT_REVIEW': '@/graphql/employee/mutations',
    'CREATE_CAMPAIGN_EMPLOYEE': '@/graphql/employee/mutations',
    'UPDATE_CAMPAIGN_STATUS': '@/graphql/employee/mutations',
    'ASSIGN_PROJECT': '@/graphql/employee/mutations',
  };

  if (realQuery && queryMap[realQuery]) return queryMap[realQuery];
  if (realMutation && mutationMap[realMutation]) return mutationMap[realMutation];
  return '@/graphql/employee/queries';
}

// ✅ قالب analytics المصحح نهائياً
const analyticsTemplate = (comp) => {
  const { realQuery, dataField, name, title } = comp;
  const importPath = getImportPath(realQuery, null);
  
  return `'use client';

import { useQuery } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ${realQuery} } from '${importPath}';

export function ${name}() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading } = useQuery(${realQuery});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const stats = data?.${dataField} || {};

  const total = stats.total !== undefined ? stats.total : (stats.totalApps !== undefined ? stats.totalApps : (stats.totalRevenue !== undefined ? stats.totalRevenue : 0));
  const active = stats.active !== undefined ? stats.active : (stats.activeApps !== undefined ? stats.activeApps : (stats.activeCampaigns !== undefined ? stats.activeCampaigns : 0));
  const revenueAmount = stats.totalRevenue !== undefined ? stats.totalRevenue : (stats.totalSpent !== undefined ? stats.totalSpent : 0);
  const growth = stats.growth !== undefined ? stats.growth : 15;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">${title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">${'{total}'}</p>
              </div>
              <BarChart className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">${'{active}'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">${'${revenueAmount}'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Growth</p>
                <p className="text-2xl font-bold text-blue-600">+${'{growth}'}%</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
            ${'{JSON.stringify(stats, null, 2)}'}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}`;
};

// ✅ قوالب المكونات الأخرى
const templates = {
  list: (comp) => `'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ${comp.realQuery} } from '${getImportPath(comp.realQuery, comp.realMutation)}';

export function ${comp.name}() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data, loading } = useQuery(${comp.realQuery});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  let items = data?.${comp.dataField} || [];
  if (typeof items === 'object' && !Array.isArray(items)) {
    items = Object.values(items).flat();
  }

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.businessName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">${comp.title}</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id || item._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{item.name || item.title || item.businessName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description || item.email || item.businessName}</p>
                </div>
                <Link href={\`./\${item.id || item._id}\`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`,

  details: (comp) => `'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ${comp.realQuery} } from '${getImportPath(comp.realQuery, comp.realMutation)}';

export function ${comp.name}() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = params?.id as string;

  const { data, loading } = useQuery(${comp.realQuery}, {
    variables: { id },
    skip: !id
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const item = data?.${comp.dataField};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">${comp.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={\`./edit\`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
            {JSON.stringify(item, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}`,

  form: (comp) => `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { ${comp.realMutation} } from '${getImportPath(comp.realQuery, comp.realMutation)}';

export function ${comp.name}() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({});
  const [mutate, { loading }] = useMutation(${comp.realMutation});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  const handleSubmit = async () => {
    try {
      await mutate({ variables: { input: formData } });
      router.push('/employee/' + location.pathname.split('/')[3]);
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">${comp.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name..."
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`,

  analytics: analyticsTemplate,

  profile: (comp) => `'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ${comp.realQuery} } from '${getImportPath(comp.realQuery, comp.realMutation)}';

export function ${comp.name}() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = params?.id as string;

  const { data, loading } = useQuery(${comp.realQuery}, {
    variables: { id },
    skip: !id
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const profile = data?.${comp.dataField};

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">${comp.title}</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.image} />
              <AvatarFallback>{profile?.name?.[0] || profile?.user?.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile?.name || profile?.user?.name}</h2>
              <p className="text-gray-500">{profile?.email || profile?.user?.email}</p>
              <Badge className="mt-1">{profile?.status || 'Active'}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {profile?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.position && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{profile.position}</span>
              </div>
            )}
            {profile?.department && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{profile.department}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`,

  matrix: (comp) => `'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Code } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ${comp.realQuery} } from '${getImportPath(comp.realQuery, comp.realMutation)}';

export function ${comp.name}() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading } = useQuery(${comp.realQuery});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  let skills = data?.${comp.dataField} || [];
  if (typeof skills === 'object' && !Array.isArray(skills)) {
    skills = Object.values(skills).flat();
  }

  const maxCount = Math.max(...skills.map(s => s.count || 0), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">${comp.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">{skill.name || skill.skill}</h3>
                </div>
                <span className="text-sm font-medium">{skill.count || 0} developers</span>
              </div>
              <Progress value={((skill.count || 0) / maxCount) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`,

  assign: (comp) => `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { ${comp.realMutation} } from '${getImportPath(comp.realQuery, comp.realMutation)}';
import { DEVELOPER_TEAM, DEVELOPER_APPS } from '@/graphql/employee/queries';
import { Skeleton } from '@/components/ui/skeleton';

export function ${comp.name}() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  
  const [mutate, { loading }] = useMutation(${comp.realMutation});
  const { data: developersData, loading: devsLoading } = useQuery(DEVELOPER_TEAM);
  const { data: projectsData, loading: projectsLoading } = useQuery(DEVELOPER_APPS);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (devsLoading || projectsLoading) return <Skeleton className="h-96 w-full" />;

  const developers = developersData?.developerTeam || [];
  const projects = projectsData?.developerApps || [];

  const handleSubmit = async () => {
    try {
      await mutate({ variables: { developerId: selectedDeveloper, projectId: selectedProject } });
      router.push('/employee/developer-manager/team');
    } catch (error) {
      console.error('Failed to assign:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">${comp.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assign Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Developer</Label>
            <Select onValueChange={setSelectedDeveloper}>
              <SelectTrigger>
                <SelectValue placeholder="Select developer..." />
              </SelectTrigger>
              <SelectContent>
                {developers.map((dev) => (
                  <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Project</Label>
            <Select onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedDeveloper || !selectedProject || loading}>
              <Save className="h-4 w-4 mr-2" />
              Assign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`,

  reports: (comp) => `'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ${comp.realQuery} } from '${getImportPath(comp.realQuery, comp.realMutation)}';

export function ${comp.name}() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading } = useQuery(${comp.realQuery});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const reports = data?.${comp.dataField} || {};

  const formatReports = () => {
    if (Array.isArray(reports)) return reports;
    return Object.entries(reports).map(([key, value]) => ({
      id: key,
      title: key.replace(/([A-Z])/g, ' $1').trim(),
      date: new Date().toISOString(),
      data: value
    }));
  };

  const reportList = formatReports();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">${comp.title}</h1>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      <div className="space-y-4">
        {reportList.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`,

  settings: (comp) => `'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ${comp.realQuery} } from '${getImportPath(comp.realQuery, comp.realMutation)}';
import { UPDATE_EMPLOYEE_SETTINGS } from '@/graphql/employee/mutations';

export function ${comp.name}() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading } = useQuery(${comp.realQuery});
  const [mutate] = useMutation(UPDATE_EMPLOYEE_SETTINGS);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
    if (data) setSettings(data?.${comp.dataField} || {});
  }, [session, status, data, router]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const handleSave = async () => {
    try {
      await mutate({ variables: { input: settings } });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">${comp.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch 
              checked={settings.emailNotifications !== false}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Push Notifications</Label>
            <Switch 
              checked={settings.pushNotifications !== false}
              onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
          </div>

          <div>
            <Label>Default Language</Label>
            <Input 
              value={settings.language || 'en'}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Timezone</Label>
            <Input 
              value={settings.timezone || 'UTC'}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="mt-1"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}`,

  static: (comp) => `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ${comp.name}() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
  }, [session, status, router]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">${comp.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Moderation Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Content Policy</h3>
            <p className="text-gray-600">All content must be appropriate and follow community standards...</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Prohibited Content</h3>
            <p className="text-gray-600">The following types of content are strictly prohibited...</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Action Guidelines</h3>
            <p className="text-gray-600">When taking action on reported content, follow these guidelines...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`,
};

// ✅ دالة لتوليد المحتوى حسب النوع
function generateComponentContent(comp) {
  const template = templates[comp.type];
  if (!template) {
    console.warn(`⚠️ Unknown type: ${comp.type} for ${comp.name}, using list template`);
    return templates.list(comp);
  }
  return template(comp);
}

// إنشاء المكونات
console.log('🚀 Generating missing components...\n');

let successCount = 0;
let errorCount = 0;

missingComponents.forEach(comp => {
  try {
    const fullPath = path.join(baseDir, comp.dir, `${comp.name}.tsx`);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = generateComponentContent(comp);
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Created: ${comp.dir}/${comp.name}.tsx`);
    successCount++;
  } catch (error) {
    console.error(`❌ Failed to create ${comp.name}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Success: ${successCount} components`);
console.log(`   ❌ Failed: ${errorCount} components`);
console.log(`   📁 Location: ${baseDir}`);
console.log('\n🎉 All missing components generated successfully!');