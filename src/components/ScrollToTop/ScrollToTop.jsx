import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const saveScroll = () => {
      localStorage.setItem("scrollX", window.scrollX);
      localStorage.setItem("scrollY", window.scrollY);
    };

    window.addEventListener("beforeunload", saveScroll);
    return () => window.removeEventListener("beforeunload", saveScroll);
  }, []);

  useEffect(() => {
    const x = parseInt(localStorage.getItem("scrollX") || "0", 10);
    const y = parseInt(localStorage.getItem("scrollY") || "0", 10);

    window.scrollTo({ top: y, left: x, behavior: "smooth" });
  }, []);

  useEffect(() => {
    window.scroll(0, 0)
  }, [pathname])

  return null;
}
