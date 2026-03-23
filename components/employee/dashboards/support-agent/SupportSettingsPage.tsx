'use client';

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
import { EMPLOYEE_SETTINGS } from '@/graphql/employee/queries';
import { UPDATE_EMPLOYEE_SETTINGS } from '@/graphql/employee/mutations';

export function SupportSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, loading } = useQuery(EMPLOYEE_SETTINGS);
  const [mutate] = useMutation(UPDATE_EMPLOYEE_SETTINGS);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/sign-in');
    if (data) setSettings(data?.employeeSettings || {});
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
      <h1 className="text-2xl font-bold">Support Settings</h1>

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
}