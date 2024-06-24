import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useSatuanBarang(uuid = null, options = {}) {
  return useQuery({
    queryKey: uuid ? ["satuan-barang", uuid] : ["satuan-barang"],
    queryFn: async () =>
      await axios
        .get(uuid ? `/data/satuan-barang/${uuid}` : "/data/satuan-barang/show")
        .then((res) => res.data),
    cacheTime: 0,
    ...options,
  });
}
