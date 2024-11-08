import React from "react";

type Props = {
  children: React.ReactNode;
};

const TestSvg = ({ children }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
      {children}
    </svg>
  );
};

export default TestSvg;
