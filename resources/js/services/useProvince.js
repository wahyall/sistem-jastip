import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useProvince(uuid = null, options = {}) {
  return useQuery({
    queryKey: uuid ? ["province", uuid] : ["province"],
    queryFn: async () =>
      await axios
        .get(uuid ? `/indonesia/provinces/${uuid}` : "/indonesia/provinces")
        .then((res) => res.data.data),
    ...options,
  });
}
