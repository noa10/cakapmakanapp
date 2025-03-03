import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-muted-foreground mb-4">
            Manage user accounts, permissions, and roles.
          </p>
          <Button variant="outline">Manage Users</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <p className="text-muted-foreground mb-4">
            View and manage order history and transactions.
          </p>
          <Button variant="outline">View Orders</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p className="text-muted-foreground mb-4">
            View usage statistics and performance metrics.
          </p>
          <Button variant="outline">View Analytics</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-muted-foreground mb-4">
            Configure system settings and preferences.
          </p>
          <Button variant="outline">Manage Settings</Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 