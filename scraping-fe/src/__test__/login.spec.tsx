import { act } from "react-dom/test-utils";
import { LoginPage } from "../pages/LoginPage";
import { renderWithProvider } from "./common/render-with-provider";
import { fireEvent } from "@testing-library/dom";
describe("Render login page", () => {
  it("check element in login page", async () => {
    const { getByText } = renderWithProvider(<LoginPage />);
    expect(getByText("Scrape Media")).toBeInTheDocument();
    expect(
      getByText("Enter your username & password below to login")
    ).toBeInTheDocument();
    expect(getByText("Username")).toBeInTheDocument();
    expect(getByText("Password")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
  });

  it("check error message when click login button", async () => {
    const { getByText } = renderWithProvider(<LoginPage />);
    const loginButton = getByText("Login");
    await act(async () => {
      loginButton.click();
    });
    expect(getByText("Username and password are required")).toBeInTheDocument();
  });

  it("check login with valid data and call api", async () => {
    const { getByText, getByLabelText } = renderWithProvider(<LoginPage />);
    const loginButton = getByText("Login");
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "test" } });
      fireEvent.change(passwordInput, { target: { value: "test" } });
      loginButton.click();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("check login with valid data and call api failed", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("username or password is incorrect")
    );
    const { getByText, getByLabelText } = renderWithProvider(<LoginPage />);
    const loginButton = getByText("Login");
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "test" } });
      fireEvent.change(passwordInput, { target: { value: "test" } });
      loginButton.click();
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(getByText("username or password is incorrect")).toBeInTheDocument();
  });
});
