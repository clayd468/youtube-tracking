import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LoadingView } from "./components/ui/loading";
import { toastConfig } from "./config/toast";
import { useLoading } from "./hooks/useLoading";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { DetailPage, HomePage, LoginPage, RegisterPage } from "./pages";

function App() {
  const { isLoading } = useLoading();
  return (
    <>
      <ToastContainer {...toastConfig} />
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/:id" element={<DetailPage />} />
        </Route>
      </Routes>
      {isLoading && <LoadingView />}
    </>
  );
}

export default App;
