import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useCity(uuid, query, options = {}) {
  return useQuery({
    queryKey: uuid ? ["city", uuid, query || ""] : ["city", query || ""],
    queryFn: async () =>
      await axios
        .get(
          uuid
            ? `/indonesia/cities/${uuid}`
            : "/indonesia/cities" + query ?? ""
        )
        .then((res) => res.data.data),
    ...options,
  });
}
