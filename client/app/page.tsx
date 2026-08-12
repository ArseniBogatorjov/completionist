'use client';

import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';

export default function Home() {
  const handleLogout = async () => {
    await apiClient('/auth/logout', {
      method: 'POST',
    });
  };

  return (
    <main>
      <div>Hello!</div>
      <Button onClick={handleLogout}>Logout</Button>
    </main>
  );
}
