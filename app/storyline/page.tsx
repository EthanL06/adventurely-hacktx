"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { useTasks } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getStoryLine } from "../actions";
import { Task } from "@/types/tasks";
import { useAuth } from "@/lib/auth";

type Props = {};

const Page = (props: Props) => {
  const { user } = useAuth();
  const { tasksQuery } = useTasks();
  const [storyLine, setStoryLine] = useState("");

  useEffect(() => {
    const tasks =
      tasksQuery?.docs.map((doc) => {
        const data = doc.data() as Task;
        return {
          ...data,
          due_date: data.due_date
            ? {
                seconds: data.due_date.seconds,
                nanoseconds: data.due_date.nanoseconds,
              }
            : null,
        };
      }) || [];

    getStoryLine(user?.displayName || "Guest", { tasks: tasks as Task[] }).then(
      ({ storyLine }) => {
        setStoryLine(storyLine.storyLine);
      },
    );
  }, []);

  return (
    <div className="px-12 py-4">
      <Link href={"/dashboard"}>
        <Button className="p-0" variant={"ghost"}>
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
          </svg>
          <div>Back to Dashboard</div>
        </Button>
      </Link>

      <Container>
        <div className="flex justify-between">
          <h1 className="retro-text text-3xl">Storyline</h1>
        </div>

        <div>{storyLine}</div>
      </Container>
    </div>
  );
};

export default Page;
