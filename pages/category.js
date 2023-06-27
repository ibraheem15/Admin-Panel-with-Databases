import React, { useEffect } from "react";
import RootLayout from "../components/layout";
import Sidebar from "../components/sidebar";
import { useRouter } from "next/dist/client/router";

export default function category() {
  const router = useRouter();
  useEffect(() => {
    router.push("/category/read");
  }, []);

  return (
    <RootLayout>
      <div style={{ marginTop: "70px" }}>
        {/* route to all categories automatically*/}
      </div>
    </RootLayout>
  );
}
