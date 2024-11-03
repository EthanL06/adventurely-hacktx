"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import React, { useState, useEffect } from "react";
import { useAuthStore, firebaseSignOut, useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/utils";

type Props = {};

const getLocalTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const truncateText = (text: string, threshold: number) => {
  return text.length > threshold ? text.substring(0, threshold) + "..." : text;
};

const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function getGreetingTime() {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "afternoon";
  } else {
    return "evening";
  }
}

const exampleJSON = {
  quests: {
    lastRefresh: null as string | null,
    daily: [
      {
        name: "Quest 1",
        complete: false,
        reward: {
          power: 5,
          luck: 5,
          health: 5,
        },
      },
      {
        name: "Quest 2",
        complete: false,
        reward: {
          power: 5,
          luck: 5,
          health: 5,
        },
      },
      {
        name: "Quest 3",
        complete: true,
        reward: {
          power: 5,
          luck: 5,
          health: 5,
        },
      },
    ],
  },
  tasks: [
    {
      id: 1,
      title: "Website Redesign Project",
      description:
        "Redesign the company website to improve user experience and modernize the interface. This includes updating the visual style, reorganizing content, and ensuring mobile compatibility.",
      due_date: "11/2/2024",
      complete: false,
      subtasks: [
        {
          title: "Research user preferences",
          description:
            "Conduct surveys and analyze user feedback to identify key pain points in the current design.",
        },
        {
          title: "Create initial wireframes",
          description:
            "Develop wireframes to outline the updated layout and content structure.",
        },
      ],
    },
    {
      id: 2,
      title: "Q4 Marketing Campaign",
      description:
        "Plan and execute a targeted marketing campaign to increase engagement and sales during the holiday season. Focus on social media, email marketing, and influencer collaborations.",
      due_date: "11/2/2024",
      complete: false,
      subtasks: [
        {
          title: "Identify key influencers",
          description:
            "Compile a list of influencers who align with the brand and reach out for collaboration.",
        },
        {
          title: "Develop social media content",
          description:
            "Create engaging posts, stories, and ads for the campaign, ensuring consistency with the brand message.",
        },
      ],
    },
    {
      id: 3,
      title: "End-of-Year Financial Reporting",
      description:
        "Prepare financial statements and reports for the fiscal year. Ensure all records are accurate and aligned with auditing standards.",
      due_date: "11/2/2024",
      complete: false,
      subtasks: [
        {
          title: "Compile financial data",
          description:
            "Gather and organize all relevant financial records from the year.",
        },
        {
          title: "Review and audit data",
          description:
            "Conduct an internal review to ensure accuracy and compliance with regulations.",
        },
      ],
    },
    {
      id: 3,
      title: "End Financial TESTTT",
      description:
        "Prepare financial statements and reports for the fiscal year. Ensure all records are accurate and aligned with auditing standards.",
      due_date: "11/2/2024",
      complete: false,
      subtasks: [
        {
          title: "Compile financial data",
          description:
            "Gather and organize all relevant financial records from the year.",
        },
        {
          title: "Review and audit data",
          description:
            "Conduct an internal review to ensure accuracy and compliance with regulations.",
        },
      ],
    },
  ],
  stats: {
    power: 100,
    luck: 100,
    health: 100,
    stamina: 100,
  },
};

// TASKS
const today = new Date().toLocaleDateString("en-US");
const todayTasks = exampleJSON.tasks
  .filter((task) => task.due_date == today && !task.complete)
  .slice(0, 3);

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

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
      }, 1000);

      return () => clearInterval(intervalId);
    }, msUntilNextMinute);

    return () => clearTimeout(timeoutId);
  }, []);

  // STATS

  // QUESTS
  if (
    exampleJSON.quests.lastRefresh == null ||
    exampleJSON.quests.lastRefresh != today
  ) {
    exampleJSON.quests.lastRefresh = today;
    // Create quests here using AI
  }

  return (
    <div className="p-4">
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
      </div>

      <div>
        <span className="retro-text-solid absolute left-5 top-5 !p-0 text-2xl text-white">
          {currentTime}
        </span>
      </div>

      <h1 className="retro-text-solid text-center text-4xl text-white">Home</h1>
      <h3 className="text-1xl retro-text-solid pb-5 text-center text-white">
        Good {getGreetingTime()}, {user?.displayName}!
      </h3>

      <div className="lg flex grid-cols-4 flex-col gap-2 lg:grid">
        <Container className="col-span-1 !p-4 text-xl">
          <h1 className="retro-text text-md text-center text-black">
            Character Stats
          </h1>
          <div className="flex justify-center">
            <img className="p-6" src="./images/character.png" alt="Character" />
          </div>
          <div>
            <Container className="grid grid-rows-4 gap-y-2 !p-3 text-xs text-black">
              <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-1 row-span-1 text-left">HP</div>
                <div
                  style={{ width: `${profile?.stats.hp}%` }}
                  className="col-span-2 row-span-1 bg-green-500 text-right align-middle text-xs"
                >
                  <span className="align-middle">{profile?.stats.hp}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-1 row-span-1 text-left">XP</div>
                <div
                  style={{ width: `${profile?.stats.xp}%` }}
                  className="col-span-2 row-span-1 bg-green-500 text-right align-middle text-xs"
                >
                  <span className="left-0 inline-block align-middle">
                    {profile?.stats.xp}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-1 row-span-1 text-left">STR</div>
                <div
                  style={{ width: `${profile?.stats.str}%` }}
                  className="col-span-2 row-span-1 bg-green-500 text-right align-middle text-xs"
                >
                  <span className="left-0 inline-block align-middle">
                    {profile?.stats.str}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-1 row-span-1 text-left">INT</div>
                <div
                  style={{ width: `${profile?.stats.int}%` }}
                  className="col-span-2 row-span-1 bg-green-500 text-right align-middle text-xs"
                >
                  <span className="left-0 inline-block align-middle">
                    {profile?.stats.int}
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
            <div className="p-2.5">
              <h1 className="text-1xl retro-text pb-3 pt-2 text-center text-black">
                Today's To-Do
              </h1>
              <div
                id="today-tasks"
                className={`grid min-h-40 grid-rows-${todayTasks.length > 1 ? todayTasks.length : 1} gap-2 border-4 border-solid border-black p-2.5 text-sm text-white`}
              >
                {todayTasks.length > 0 ? (
                  todayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`text-center text-xs text-black ${task.complete ? "line-through" : ""}`}
                    >
                      - {task.title}
                      <div className="text-[8px] font-light">
                        {truncateText(task.description, 50)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div id="no-tasks" className="text-center text-xs text-black">
                    <i>Looks like you have nothing to do today!</i>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-1xl retro-text pb-3 pt-4 text-center text-black">
                Quick Actions
              </h1>
              <div className="grid gap-2 border-2 border-solid border-white text-sm text-white">
                <Button onClick={() => router.push("/tasks")}>
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
                <div className="grid gap-3">
                  {exampleJSON.quests.daily.map((quest) => (
                    <div
                      key={`ID_${quest.name}`}
                      className={`border-4 border-solid ${!quest.complete ? "border-black" : "border-[#22C55D]"} p-2 text-center text-black ${quest.complete ? "text-green-500" : ""}`}
                    >
                      {quest.complete ? "✔" : "-"} {quest.name}
                      <div className="text-[8px] font-light">
                        <b>Reward: </b>
                        {Object.entries(quest.reward).map(
                          ([key, value], index, array) => (
                            <span key={key}>
                              +{value} {capitalize(key)}
                              {index < array.length - 1 && ", "}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
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
