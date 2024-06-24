import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useKurir(uuid = null, cabangId, options = {}) {
  return useQuery({
    queryKey: uuid ? ["kurir", uuid] : ["kurir", cabangId],
    queryFn: async () =>
      await axios
        .get(
          uuid ? `/user/${uuid}` : `/user/show?role=kurir&cabang_id=${cabangId}`
        )
        .then((res) => res.data),
    cacheTime: 0,
    ...options,
  });
}
