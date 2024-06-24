import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useJenisPembayaran(uuid = null, options = {}) {
  return useQuery({
    queryKey: uuid ? ["jenis-pembayaran", uuid] : ["jenis-pembayaran"],
    queryFn: async () =>
      await axios
        .get(
          uuid
            ? `/data/jenis-pembayaran/${uuid}`
            : "/data/jenis-pembayaran/show"
        )
        .then((res) => res.data),
    cacheTime: 0,
    ...options,
  });
}
