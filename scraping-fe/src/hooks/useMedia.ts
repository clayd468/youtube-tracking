import { useCallback, useEffect, useState } from "react";
import { MEDIA_URL } from "@/constants";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export const useMediaDetail = () => {
  const params = useParams();
  const { user } = useAuth();
  const [videos, setVideos] = useState<IVideos[]>([]);

  const getDetail = useCallback(async () => {
    const response = await fetch(`${MEDIA_URL}/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user}`,
      },
    });

    const res = await response.json();
    // TODO
    // setVideos(res.data.videos);
    const fake = Array.from({ length: 20 }, (_, i) => ({
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
    }));
    setVideos([...fake]);
  }, [params.id, user]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  return { videos };
};
