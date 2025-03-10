import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import User from "../components/User";
import { useEffect, useState } from "react";

import styles from "./AppLayout.module.css";

function AppLayout() {
  //My stuff
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isPotrait, setIsPotrait] = useState(
    window.innerWidth > window.innerHeight
  );
  const path = window.location.pathname;
  console.log(isPotrait);

  useEffect(() => {
    const handleSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsPotrait(window.innerWidth > window.innerWidth);
    };

    window.addEventListener("resize", handleSize);
    console.log(isMobile);

    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, []);

  if (path.includes("app") && isMobile) {
    alert(
      "For best experience, please turn on desktop mode and rotate your device to landscape mode."
    );
  }

  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
