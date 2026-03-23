'use client';

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
import { UPDATE_PROJECT } from '@/graphql/client/mutations';

export function EditProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({});
  const [mutate, { loading }] = useMutation(UPDATE_PROJECT);

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
        <h1 className="text-2xl font-bold">Edit Project</h1>
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
}