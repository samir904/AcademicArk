import { cn } from "../../lib/utils";
import React from "react";

export function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      
      {/* Radial gradient fade effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white/0 dark:from-black dark:via-black/50 dark:to-black/0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    </div>
  );
}
