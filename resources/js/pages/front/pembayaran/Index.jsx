import { memo } from "react";
import BottomNavLayout from "../layouts/BottomNavLayout";

export default memo(function Index() {
  return (
    <BottomNavLayout
      title="Pembayaran"
      back={true}
      bottomNav={false}
      backUrl="/pesanan"
    >
      <section></section>
    </BottomNavLayout>
  );
});
