import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  title?: string;
  center?: boolean;
  children: React.ReactNode;
  className?: string;
};

const Container = ({ title, center = false, children, className }: Props) => {
  return (
    <div
      className={cn(
        `nes-container bg-white`,
        {
          "with-title": title,
          "is-centered": center,
        },
        className,
      )}
    >
      {title && <p className="title">{title}</p>}
      {children}
    </div>
  );
};

export default Container;
