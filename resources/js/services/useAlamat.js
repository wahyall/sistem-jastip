import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useAlamat(options = {}) {
  return useQuery({
    queryKey: ["alamat"],
    queryFn: async () => await axios.get("/alamat").then((res) => res.data),
    // cacheTime: 0,
    ...options,
  });
}
