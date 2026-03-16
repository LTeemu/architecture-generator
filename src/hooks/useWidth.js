import { useState, useEffect } from "react";

export function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 900);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}
