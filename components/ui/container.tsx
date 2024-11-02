import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  title?: string;
  center?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Container = ({
  title,
  center = false,
  children,
  className,
  onClick,
}: Props) => {
  return (
    <div
      onClick={onClick}
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
