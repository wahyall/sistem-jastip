import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useKeranjang(options = {}) {
  return useQuery({
    queryKey: ["keranjang"],
    queryFn: async () => await axios.get("/keranjang").then((res) => res.data),
    // cacheTime: 0,
    ...options,
  });
}
