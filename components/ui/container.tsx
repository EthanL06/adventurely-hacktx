import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  title?: string;
  center?: boolean;
  children: React.ReactNode;
};

const Container = ({ title, center = false, children }: Props) => {
  return (
    <div
      className={cn(`nes-container bg-white`, {
        "with-title": title,
        "is-centered": center,
      })}
    >
      <p className="title">{title}</p>
      {children}
    </div>
  );
};

export default Container;