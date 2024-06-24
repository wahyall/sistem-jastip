import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useCabang(uuid = null, options = {}) {
  return useQuery({
    queryKey: uuid ? ["cabang", uuid] : ["cabang"],
    queryFn: async () =>
      await axios
        .get(uuid ? `/user/${uuid}` : "/user/show?role=cabang")
        .then((res) => res.data),
    cacheTime: 0,
    ...options,
  });
}
