import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';
import { DetailPage, HomePage, LoginPage } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    Component: ProtectedLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: '/:id',
        Component: DetailPage,
      },
    ],
  },
  {
    path: '/login',
    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
    ],
  },
]);
