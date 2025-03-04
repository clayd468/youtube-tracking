import AppProvider from "@/layouts/AppProvider";
import { render } from "@testing-library/react";
import { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

export const renderWithProvider = (ui: ReactElement) => {
  return render(
    <BrowserRouter>
      <AppProvider>{ui}</AppProvider>
    </BrowserRouter>
  );
};
