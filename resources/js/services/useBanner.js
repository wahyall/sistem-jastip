import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useBanner(uuid = null, options = {}) {
  return useQuery({
    queryKey: uuid ? ["banner", uuid] : ["banner"],
    queryFn: async () =>
      await axios
        .get(uuid ? `/data/banner/${uuid}` : "/data/banner/show")
        .then((res) => res.data),
    cacheTime: 0,
    ...options,
  });
}
