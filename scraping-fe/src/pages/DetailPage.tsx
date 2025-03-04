import React, { useEffect, useState } from "react";
import { useMediaDetail } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { VideoGrid, Button, SearchBar } from "@/components/ui";

export const DetailPage = () => {
  const { videos } = useMediaDetail();
  const [videosShow, setVideoShows] = useState<IVideos[]>(videos);
  const [txtSearch, setTxtSearch] = useState<string>("");

  const navigate = useNavigate();
  useEffect(() => {
    if (videos && videos.length > 0) {
      setVideoShows(videos);
    }
  }, [videos]);

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleSearch = () => {
    if (!videos) return;
  
    const searchQuery = txtSearch?.trim()?.toLowerCase();
    
    if (!searchQuery) {
      setVideoShows(videos);
      return;
    }

    console.log(2222222222, searchQuery, videos)
  
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
