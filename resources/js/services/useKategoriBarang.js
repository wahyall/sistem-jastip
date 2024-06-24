import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useKategoriBarang(uuid = null, options = {}) {
  return useQuery({
    queryKey: uuid ? ["kategori-barang", uuid] : ["kategori-barang"],
    queryFn: async () =>
      await axios
        .get(
          uuid ? `/data/kategori-barang/${uuid}` : "/data/kategori-barang/show"
        )
        .then((res) => res.data),
    cacheTime: 0,
    ...options,
  });
}
