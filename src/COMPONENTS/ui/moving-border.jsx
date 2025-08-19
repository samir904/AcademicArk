// components/ui/moving-border.jsx
import React from "react";
import { cn } from "../../lib/utils"; // or your utility function

export const Button = React.forwardRef(({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = "4s",
  className,
  ...otherProps
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        "bg-transparent relative text-xl p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
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

// MovingBorder component
export const MovingBorder = ({
  children,
  duration = "4s",
  rx,
  ry,
  ...otherProps
}) => {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      {...otherProps}
    >
      <div
        className="absolute inset-[-1000px] animate-spin"
        style={{
          animation: `spin ${duration} linear infinite`,
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `conic-gradient(from 0deg, transparent, #3b82f6, transparent)`,
            borderRadius: rx && ry ? `${rx} ${ry}` : "50%",
          }}
        />
      </div>
    </div>
  );
};
