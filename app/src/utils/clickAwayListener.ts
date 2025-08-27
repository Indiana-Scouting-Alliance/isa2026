import { useEffect } from "react";

export default function useClickAwayListener(
  ref: React.RefObject<HTMLElement | null>,
  onClick: () => void
) {
  useEffect(() => {
    function handleClickAway(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick();
      }
    }

    document.addEventListener("mousedown", handleClickAway);

    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, [ref, onClick]);
}
