import { act } from "react-dom/test-utils";
import { RegisterPage } from "../pages/RegisterPage";
import { renderWithProvider } from "./common/render-with-provider";
import { fireEvent } from "@testing-library/dom";

describe("Render register page", () => {
  it("check element in register page", async () => {
    const { getByText } = renderWithProvider(<RegisterPage />);
    expect(getByText("Scrape Media")).toBeInTheDocument();
    expect(
      getByText("Enter your username & password below to register")
    ).toBeInTheDocument();
    expect(getByText("Username")).toBeInTheDocument();
    expect(getByText("Password")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
  });

  it("check error message when click register button with empty fields", async () => {
    const { getByText } = renderWithProvider(<RegisterPage />);
    const registerButton = getByText("Register");
    await act(async () => {
      registerButton.click();
    });
    expect(getByText("Username and password are required")).toBeInTheDocument();
  });

  it("check register with valid data and call api", async () => {
    const { getByText, getByLabelText } = renderWithProvider(<RegisterPage />);
    const registerButton = getByText("Register");
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "testpassword" } });
      registerButton.click();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("check register with valid data and call api failed", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Registration failed")
    );
    const { getByText, getByLabelText } = renderWithProvider(<RegisterPage />);
    const registerButton = getByText("Register");
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "testpassword" } });
      registerButton.click();
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(getByText("Registration failed")).toBeInTheDocument();
  });
});