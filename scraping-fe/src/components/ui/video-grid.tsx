import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import React from "react";

interface VideoGridProps {
  videos: IVideos[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  return (
    <div>
      <div className={`grid grid-cols-3 gap-8 overflow-auto max-h-[70vh] `}>
        {videos?.length ? (
          videos.map((video, i) => (
            <div
              key={i}
              className="mb-4 px-4 border border-gray-300 shadow-lg rounded-lg flex flex-col items-center aspect-square w-full overflow-hidden"
            >
              <iframe
                className="w-full h-3/5 rounded-lg mt-4 mx-4"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="flex items-center py-2 space-x-8 text-gray-600 text-lg">
                <div className="flex items-center space-x-1">
                  <Eye size={16} />
                  <span>{Number(video.viewCount).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp size={16} />
                  <span>{Number(video.likeCount).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle size={16} />
                  <span>{Number(video.commentCount).toLocaleString()}</span>
                </div>
              </div>
              <div
                className="line-clamp-3 overflow-hidden text-ellipsis w-4/5 text-gray-600"
                title={video.title}
              >
                {video.title}
              </div>
            </div>
          ))
        ) : (
          <> No results. </>
        )}
      </div>
    </div>
  );
};

export { VideoGrid };
