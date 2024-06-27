import { memo } from "react";
import BottomNavLayout from "../layouts/BottomNavLayout";

export default memo(function Index() {
  return (
    <BottomNavLayout title="Beranda">
      <h1>Home</h1>
    </BottomNavLayout>
  );
});
