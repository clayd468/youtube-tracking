import { useEffect, useState } from "react";
import { useMediaDetail } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { VideoGrid, Button, SearchBar } from "@/components/ui";

export const DetailPage = () => {
  const { videos } = useMediaDetail();
  const [videosShow, setVideoShows] = useState<IVideos[]>([]);
  const [txtSearch, setTxtSearch] = useState<string>("");

  const navigate = useNavigate();
  useEffect(() => {
    if (videos.length > 0) {
      setVideoShows((prevVideos) => {
        if (JSON.stringify(prevVideos) === JSON.stringify(videos)) {
          return prevVideos;
        }

        return [...videos];
      });
    }
    
  }, [videos]);

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleSearch = () => {
    if (!videos || videos.length === 0) return;
  
    const searchQuery = txtSearch?.trim()?.toLowerCase();
    
    if (!searchQuery) {
      setVideoShows(videos);
      return;
    }
  
    setVideoShows(
      videos.filter((video) => 
        video.title.toLowerCase().includes(searchQuery)
      )
    );
  };

  return (
    <div className="w-2/3 mx-auto">
      <section className="py-8">
        <div className="flex justify-between items-center">
          <Button onClick={handleBackToHome} size="sm" variant="outline">
            Back
          </Button>
          <div className="-mb-2">
            <SearchBar
              txtSearch={txtSearch}
              setTxtSearch={setTxtSearch}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      </section>
      <section>
        <VideoGrid videos={videosShow} />
      </section>
    </div>
  );
};
