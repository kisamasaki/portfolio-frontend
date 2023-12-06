import { Comic } from "../types";
import useSWR from "swr";
import axios from "axios";

const getComics = async (url: string) => {
  const { data } = await axios.get<Comic[]>(url, {
    withCredentials: true,
  });
  return data;
};

export const useQueryGenreComics = (genre: string, page: string) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/comics?genreCode=${genre}&pageNumber=${page}`;

  const { data, error, isLoading } = useSWR(apiUrl, getComics);

  return {
    data,
    error,
    isLoading,
  };
};
