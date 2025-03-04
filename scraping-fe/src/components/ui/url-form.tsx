import React from "react";
import { Button, Input } from "@/components/ui";

interface UrlFormProps {
  url: string;
  setUrl: (url: string) => void;
  handleScrap: () => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ url, setUrl, handleScrap }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-10 w-2/3 mx-auto">
      <h1 className="text-[28px] mb-4">
        Enter URL of the website you want to scrape on youtube!
      </h1>
      <div className="flex gap-2 relative w-full">
        <Input
          placeholder="Enter URL of the website you want to scrape on youtube!"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          className="rounded-md bg-blue hover:bg-blue/80"
          onClick={handleScrap}
        >
          Start Scraping
        </Button>
      </div>
    </div>
  );
};

export { UrlForm };
