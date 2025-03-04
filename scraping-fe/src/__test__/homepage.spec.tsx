import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HomePage } from "../pages/HomePage";
import { useMediaSearch } from "@/hooks";
import { PAGE_SIZE } from "@/constants";
import { BrowserRouter } from "react-router-dom";

// Mock the useMediaSearch hook
jest.mock("@/hooks", () => ({
  useMediaSearch: jest.fn()
}));

// Wrapper component for tests
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe("Render home page", () => {
  const mockSetUrl = jest.fn();
  const mockSetTxtSearch = jest.fn();
  const mockSetPage = jest.fn();
  // const mockHandleAddUrl = jest.fn();
  // const mockHandleRemoveUrl = jest.fn();
  const mockHandleScrap = jest.fn();
  const mockHandleSearch = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    (useMediaSearch as jest.Mock).mockImplementation(() => ({
      dataTable: [],
      // listUrlNew: [],
      url: "",
      setUrl: mockSetUrl,
      txtSearch: "",
      setTxtSearch: mockSetTxtSearch,
      page: 0,
      setPage: mockSetPage,
      totalRecords: 0,
      // handleAddUrl: mockHandleAddUrl,
      // handleRemoveUrl: mockHandleRemoveUrl,
      handleScrap: mockHandleScrap,
      handleSearch: mockHandleSearch,
    }));
  });

  it("should render all main components", () => {
    renderWithRouter(<HomePage />);
    
    // Check for the URL form section
    const urlForm = screen.getByRole("heading", { name: /enter url/i });
    expect(urlForm).toBeInTheDocument();
    
    // Check URL form elements
    const urlInput = screen.getByPlaceholderText(/enter url/i);
    expect(urlInput).toBeInTheDocument();
    
    const addButton = screen.getByRole("button", { name: /start scraping/i });
    expect(addButton).toBeInTheDocument();
        
    // Check search section elements
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
    
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });



  it("should handle search functionality", () => {
    renderWithRouter(<HomePage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    const searchButton = screen.getByRole("button", { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: "test search" } });
    fireEvent.click(searchButton);
    
    expect(mockSetTxtSearch).toHaveBeenCalledWith("test search");
    expect(mockHandleSearch).toHaveBeenCalled();
  });

  it("should handle URL operations", () => {
    renderWithRouter(<HomePage />);
    
    const urlInput = screen.getByPlaceholderText(/enter url/i);
    const addButton = screen.getByText(/start scraping/i);
    
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.click(addButton);
    
    expect(mockSetUrl).toHaveBeenCalledWith("https://example.com");
  });

  it("should show and handle scraping button when URLs are added", () => {
    // Mock with some URLs in the list
    (useMediaSearch as jest.Mock).mockImplementation(() => ({
      dataTable: [],
      // listUrlNew: ["https://example.com"],
      url: "https://example.com",
      setUrl: mockSetUrl,
      txtSearch: "",
      setTxtSearch: mockSetTxtSearch,
      page: 0,
      setPage: mockSetPage,
      totalRecords: 0,
      // handleAddUrl: mockHandleAddUrl,
      // handleRemoveUrl: mockHandleRemoveUrl,
      handleScrap: mockHandleScrap,
      handleSearch: mockHandleSearch,
    }));

    renderWithRouter(<HomePage />);
    
    const scrapButton = screen.getByRole("button", { name: /start scraping/i });
    expect(scrapButton).toBeInTheDocument();
    
    fireEvent.click(scrapButton);
    expect(mockHandleScrap).toHaveBeenCalled();
  });
});
