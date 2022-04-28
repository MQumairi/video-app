import { useEffect } from "react";
import axios from "axios";

const DirectoryList = () => {
  useEffect(() => {
    // Inner function
    const fetch_videos = async ()  => {
        const response = await axios.get("http://localhost:5000/api/videos")
        console.log(response)
    }
    // Call function
    fetch_videos()
  });
  return <div>List</div>;
};

export default DirectoryList;
