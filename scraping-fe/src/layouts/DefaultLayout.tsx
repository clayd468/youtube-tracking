import { Outlet } from 'react-router-dom';

export const DefaultLayout = () => {
  return (
    <>
      <section className="container">
        <Outlet />
      </section>
    </>
  );
};
