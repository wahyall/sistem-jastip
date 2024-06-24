import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useDistrict(uuid, query, options = {}) {
  return useQuery({
    queryKey: uuid
      ? ["district", uuid, query ?? ""]
      : ["district", query ?? ""],
    queryFn: async () =>
      await axios
        .get(
          uuid
            ? `/indonesia/districts/${uuid}`
            : "/indonesia/districts" + query ?? ""
        )
        .then((res) => res.data.data),
    ...options,
  });
}
