"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import React, { useState, useEffect } from "react";
import { useAuthStore, firebaseSignOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Props = {};

const getLocalTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const getRandom = () => {
  return Math.floor(Math.random() * 100) + 1;
};

// LOAD STATS, getRandom() is temporary
var stats = {
  power: getRandom(),
  luck: getRandom(),
  health: getRandom(),
  stamina: getRandom(),
};

const Home = (props: Props) => {
  const router = useRouter();
  const { user } = useAuthStore();
  if (!user) {
    router.push("/");
    return;
  }

  // TIME
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(getLocalTime());

    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000;

    const timeoutId = setTimeout(() => {
      setCurrentTime(getLocalTime());

      const intervalId = setInterval(() => {
        setCurrentTime(getLocalTime());
      }, 60000);

      return () => clearInterval(intervalId);
    }, msUntilNextMinute);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="p-4">
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

      <div className="pb-2">
        <div className="absolute right-5 top-5 !p-0">
          <Button
            onClick={() => {
              firebaseSignOut();
            }}
            size="sm"
            className="text-xs"
          >
            Sign Out
          </Button>
        </div>
        <span className="retro-text-solid absolute left-5 top-5 !p-0 text-2xl text-white">
          {" "}
          {currentTime}
        </span>
      </div>
      <h1 className="retro-text-solid text-center text-4xl text-white">Home</h1>
      <h3 className="text-1xl retro-text-solid pb-5 text-center text-white">
        Good afternoon, {user?.displayName}!
      </h3>

      <div className="lg flex grid-cols-4 flex-col gap-2 lg:grid">
        <Container className="col-span-1 !p-4 text-xl">
          <h1 className="retro-text text-md text-center text-black">Stats</h1>
          <div className="flex justify-center">
            <img className="p-6" src="./favicon.ico"></img>{" "}
            {/*TEMPORARY IMAGE*/}
          </div>
          <div>
            <Container className="grid grid-rows-4 gap-y-2 !p-3 text-xs text-black">
              <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-1 row-span-1 text-left">Power</div>
                <div
                  style={{
                    width: `${stats.power}%`,
                  }}
                  className="col-span-2 row-span-1 bg-green-500 text-right align-middle text-xs"
                >
                  <span className="align-middle">{stats.power}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-1 row-span-1 text-left">Luck</div>
                <div
                  style={{
                    width: `${stats.luck}%`,
                  }}
                  className="col-span-2 row-span-1 bg-green-500 text-right align-middle text-xs"
                >
                  <span className="left-0 inline-block align-middle">
                    {stats.luck}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-1 row-span-1 text-left">Health</div>
                <div
                  style={{
                    width: `${stats.health}%`,
                  }}
                  className="col-span-2 row-span-1 bg-green-500 text-right align-middle text-xs"
                >
                  <span className="left-0 inline-block align-middle">
                    {stats.health}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-1 row-span-1 text-left">Stamina</div>
                <div
                  style={{
                    width: `${stats.stamina}%`,
                  }}
                  className="col-span-2 row-span-1 bg-green-500 text-right align-middle text-xs"
                >
                  <span className="left-0 inline-block align-middle">
                    {stats.stamina}
                  </span>
                </div>
              </div>
            </Container>

            <div className="grid pt-2">
              <Button size="sm">
                <div>View History</div>
              </Button>
            </div>
          </div>
        </Container>
        <Container className="col-span-3 p-3">
          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <div>
              <h1 className="text-1xl retro-text pb-3 pt-2 text-center text-black">
                Today's Tasks
              </h1>
              <div
                id="today-tasks"
                className="grid min-h-40 gap-2 border-4 border-solid border-black p-2.5 text-sm text-white"
              >
                {/*INSERT TASKS HERE*/}

                <div id="no-tasks" className="text-center text-xs text-black">
                  <i>Looks like you have nothing to do today!</i>
                </div>

                {/* TEMPLATE TO USE
                 <div className=" text-center">
                  - Task name here
                </div>
                */}
              </div>
            </div>
            <div>
              <h1 className="text-1xl retro-text pb-3 pt-2 text-center text-black">
                Quick Actions
              </h1>
              <div className="grid gap-2 border-2 border-solid border-white text-sm text-white">
                <Button
                  onClick={() => {
                    router.push("/tasks");
                  }}
                >
                  <div>Tasks</div>
                </Button>
                <Button>
                  <div>Storyline</div>
                </Button>
                <Button>
                  <div>Inventory</div>
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-1 gap-4 pt-4">
            <div>
              <h1 className="text-1xl retro-text pt-2 text-center text-black">
                Daily Quests
              </h1>
              <div
                id="daily-quests"
                className="grid gap-3 p-2.5 text-sm text-white"
              >
                {/*INSERT TASKS HERE*/}

                <div className="grid gap-3">
                  {/*USE THIS TEMPLATE*/}
                  <div className="border-4 border-solid border-black p-2 text-center text-black">
                    - Quest 1
                    <div className="text-[10px]">
                      <b>Reward: </b>
                      +5 Power, +5 Luck, +5 Health
                    </div>
                  </div>
                  <div className="border-4 border-solid border-black p-2 text-center text-black">
                    - Quest 1
                    <div className="text-[10px]">
                      <b>Reward: </b>
                      +5 Power, +5 Luck, +5 Health
                    </div>
                  </div>
                  <div className="border-4 border-solid border-black p-2 text-center text-black">
                    - Quest 1
                    <div className="text-[10px]">
                      <b>Reward: </b>
                      +5 Power, +5 Luck, +5 Health
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
