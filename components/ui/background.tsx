import React from "react";

type Props = {};

const Background = (props: Props) => {
  return (
    <>
      <div id="interlaced" className="z-50"></div>
      <div className="fixed left-0 top-36 z-0">
        <div className="relative flex w-full flex-nowrap">
          <div className="flex h-screen w-screen animate-infinite-scroll-x items-center justify-center md:justify-start">
            <img
              src="./images/background.png"
              alt="background"
              className="size-full object-cover"
            />
          </div>
          <div className="flex h-screen w-screen animate-infinite-scroll-x items-center justify-center md:justify-start">
            <img
              src="./images/background.png"
              alt="background"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Background;