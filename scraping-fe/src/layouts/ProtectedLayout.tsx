import { Outlet } from 'react-router-dom';
import { Header } from '@/layouts';
import { ProtectedRoute } from '@/router/protected-router';

export const ProtectedLayout = () => {
  return (
    <>
      <Header />
      <main>
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      </main>
    </>
  );
};
