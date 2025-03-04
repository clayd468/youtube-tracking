import { render, screen, fireEvent, act } from "@testing-library/react";
import { DetailPage } from "../pages/DetailPage";
import { useMediaDetail } from "@/hooks";
import { BrowserRouter, useNavigate } from "react-router-dom";

// Mock the hooks
jest.mock("@/hooks", () => ({
  useMediaDetail: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Wrapper component for tests
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Detail page", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock navigate function
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);

    // Default mock implementation for useMediaDetail
    (useMediaDetail as jest.Mock).mockImplementation(() => ({
      videos: [
        {
          id: "id",
          videoId: "zbVtf4OzlZQ",
          title:
            "Binance Red Packet Code Today | Red Packet Code in Binance Today | Red Packet Code Today Binance",
          description:
            "Binance Red Packet Code Today | Red Packet Code In Binance Today | Red Packet Code Binance Today Topics Covered ...",
          viewCount: "2158",
          likeCount: "125",
          favoriteCount: "0",
          commentCount: "78",
        },
      ],
      isLoading: false,
      error: null,
    }));
  });

  it("should render all main components", () => {
    renderWithRouter(<DetailPage />);

    // Check for the Back button
    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();

    // Check for search buttons
    const search = screen.getAllByRole("button");
    expect(search.length).toBeGreaterThan(1); // At least Back + search buttons
  });

  it("should handle back button click", () => {
    renderWithRouter(<DetailPage />);

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("should render videos when available", () => {
    const mockVideos = [
      {
        id: "id",
        videoId: "zbVtf4OzlZQ",
        title:
          "Binance Red Packet Code Today | Red Packet Code in Binance Today | Red Packet Code Today Binance",
        description:
          "Binance Red Packet Code Today | Red Packet Code In Binance Today | Red Packet Code Binance Today Topics Covered ...",
        viewCount: "2158",
        likeCount: "125",
        favoriteCount: "0",
        commentCount: "78",
      },
    ];

    (useMediaDetail as jest.Mock).mockImplementation(() => ({
      videos: mockVideos,
      isLoading: false,
      error: null,
    }));

    renderWithRouter(<DetailPage />);

    // Check if videos are rendered
    const videoElements = screen.getAllByTitle("YouTube video player");
    expect(videoElements.length).toBe(mockVideos.length);

    mockVideos.forEach((video, index) => {
      expect(videoElements[index]).toHaveAttribute(
        "src",
        `https://www.youtube.com/embed/${video.videoId}`
      );
    });
  });

  // it("should handle search action", async () => {
  //   renderWithRouter(<DetailPage />);

  //   const searchInput = screen.getByRole("textbox");
  //   const searchButton = screen.getByRole("button", { name: /search/i });

  //   await act(async () => {
  //     fireEvent.change(searchInput, { target: { value: "Binance" } });
  //     fireEvent.click(searchButton);
  //   });

  //   const videoElements = screen.getAllByTitle("YouTube video player");
  //   expect(videoElements.length).toBe(1);
  //   expect(videoElements[0]).toHaveAttribute(
  //     "src",
  //     "https://www.youtube.com/embed/zbVtf4OzlZQ"
  //   );
  // });

  // it("should show no results message when no videos match search", async () => {
  //   renderWithRouter(<DetailPage />);

  //   const searchInput = screen.getByRole("textbox");
  //   const searchButton = screen.getByRole("button", { name: /search/i });

  //   await act(async () => {
  //     fireEvent.change(searchInput, { target: { value: "Nonexistent" } });
  //     fireEvent.click(searchButton);
  //   });

  //   const noResultsMessage = screen.getByText(/no results/i);
  //   expect(noResultsMessage).toBeInTheDocument();
  // });
});
