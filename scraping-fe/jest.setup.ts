import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    scrollTo: jest.fn(),
  })),
});

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

jest.setTimeout(20000);

jest.mock("@/constants", () => ({
  MEDIA_URL: "http://localhost:3000/media",
  AUTH_LOGIN_URL: "http://localhost:3000/auth/login",
  AUTH_REGISTER_URL: "http://localhost:3000/auth/register",
  SCRAP_URL: "http://localhost:3000/scrap",
  BASE_URL: "http://localhost:3000",
  USER_URL: "http://localhost:3000/users",
  USER_ME_URL: "http://localhost:3000/users/me",
}));

global.fetch = jest.fn();
