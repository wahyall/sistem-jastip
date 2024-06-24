import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function usePengirim(uuid = null, options = {}) {
  return useQuery({
    queryKey: uuid ? ["pengirim", uuid] : ["pengirim"],
    queryFn: async () =>
      await axios
        .get(uuid ? `/data/pengirim/${uuid}` : "/data/pengirim/show")
        .then((res) => res.data),
    cacheTime: 0,
    ...options,
  });
}
