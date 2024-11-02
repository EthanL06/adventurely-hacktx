import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative max-h-screen overflow-hidden">
      <div className="absolute left-0 top-36 z-0 overflow-x-hidden">
        <div className="relative flex w-full flex-nowrap">
          <div className="animate-infinite-scroll-x flex h-screen w-screen items-center justify-center md:justify-start">
            <img
              src="./images/background.png"
              alt="background"
              className="size-full object-cover"
            />
          </div>
          <div className="animate-infinite-scroll-x flex h-screen w-screen items-center justify-center md:justify-start">
            <img
              src="./images/background.png"
              alt="background"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="relative bottom-14 z-50 flex min-h-screen flex-col items-center justify-center p-5">
        <div className="mb-10 flex flex-col gap-y-2">
          <h1 className="retro-text text-center text-4xl text-[#85B6F2]">
            Adventurely
          </h1>
          <p className="retro-text text-center text-sm">Get Your Work Done.</p>
        </div>
        <div className="flex flex-col gap-y-4">
          <Button className="" variant={"retro"}>
            <div className="relative">
              <i className="nes-icon google"></i>
            </div>
            <div className="ml-7">Sign In with Google</div>
          </Button>
          <Button className="text-sm" variant={"ghost"}>
            Sign In as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}
