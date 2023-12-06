import { CompletedComic } from "../types";
import useSWR from "swr";
import axios from "axios";

const getComics = async (url: string) => {
  const { data } = await axios.get<CompletedComic[]>(url, {
    withCredentials: true,
  });
  return data;
};

export const useQueryLatestCompletedComics = () => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/completedComics/getLatestCompletedComics`;

  const {
    data: latestData,
    error: latestError,
    isLoading: isLatestDataLoading,
  } = useSWR(apiUrl, getComics);

  return {
    latestData,
    latestError,
    isLatestDataLoading,
  };
};
