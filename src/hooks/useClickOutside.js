import { useEffect } from "react";

export function useClickOutside(ref, onOutside, isActive = true) {
  useEffect(() => {
    if (!isActive) return;

    const handlePointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutside();
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") onOutside();
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [ref, onOutside, isActive]);
}
