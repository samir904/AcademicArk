"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  ...otherProps
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        "relative h-16 w-auto overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl px-6 py-3",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
});

Button.displayName = "Button";

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}) => {
  const pathRef = useRef(null);
  const progress = useMotionValue(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for SVG to be rendered before starting animation
    const checkSVGReady = () => {
      if (pathRef.current && pathRef.current.getTotalLength) {
        setIsReady(true);
      } else {
        // Retry if SVG is not ready
        requestAnimationFrame(checkSVGReady);
      }
    };

    checkSVGReady();
  }, []);

  useAnimationFrame((time) => {
    // Only run animation if SVG is properly rendered
    if (!isReady || !pathRef.current) return;

    try {
      const length = pathRef.current.getTotalLength();
      if (length && length > 0) {
        const pxPerMillisecond = length / duration;
        progress.set((time * pxPerMillisecond) % length);
      }
    } catch (error) {
      console.warn("SVG animation error:", error);
    }
  });

  const x = useTransform(progress, (val) => {
    if (!pathRef.current || !isReady) return 0;
    try {
      return pathRef.current.getPointAtLength(val)?.x ?? 0;
    } catch {
      return 0;
    }
  });

  const y = useTransform(progress, (val) => {
    if (!pathRef.current || !isReady) return 0;
    try {
      return pathRef.current.getPointAtLength(val)?.y ?? 0;
    } catch {
      return 0;
    }
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect 
          fill="none" 
          width="100%" 
          height="100%" 
          rx={rx} 
          ry={ry} 
          ref={pathRef} 
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
