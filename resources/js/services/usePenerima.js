import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function usePenerima(uuid = null, options = {}) {
  return useQuery({
    queryKey: uuid ? ["penerima", uuid] : ["penerima"],
    queryFn: async () =>
      await axios
        .get(uuid ? `/data/penerima/${uuid}` : "/data/penerima/show")
        .then((res) => res.data),
    cacheTime: 0,
    ...options,
  });
}
