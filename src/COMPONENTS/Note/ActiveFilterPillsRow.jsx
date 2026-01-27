import { useEffect, useRef, useState } from "react";
import ActiveFilterPills from "./ActiveFilterPills";

export default function ActiveFilterPillsRow(props) {
  const containerRef = useRef(null);

  const [isScrollable, setIsScrollable] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  // 🔍 Detect scrollability
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkScrollable = () => {
      setIsScrollable(el.scrollWidth > el.clientWidth);
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  // 👆 Hide hint after first scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
        setShowHint(false);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasScrolled]);

  if (!props?.localFilters) return null;

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={containerRef}
        className={`
          animate-slide-in
          ${showHint ? "animate-pulse-subtle" : ""}
        `}
      >
        <ActiveFilterPills {...props} />
      </div>

      {/* LEFT fade */}
      {isScrollable && showHint && (
        <div className="
          pointer-events-none
          absolute left-0 top-0 h-full w-6
          bg-gradient-to-r from-black/70 to-transparent
          md:hidden
        " />
      )}

      {/* RIGHT fade */}
      {isScrollable && showHint && (
        <div className="
          pointer-events-none
          absolute right-0 top-0 h-full w-6
          bg-gradient-to-l from-black/70 to-transparent
          md:hidden
        " />
      )}
    </div>
  );
}