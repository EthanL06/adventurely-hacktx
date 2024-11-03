"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import React, { useEffect } from "react";
import TaskGroup from "./_components/TaskGroup";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useTasks } from "@/lib/utils";
import { Task } from "@/types/tasks";
import { Timestamp } from "firebase/firestore";
import { getStats } from "../actions";

interface FormData {
  title: string;
  description: string;
  due_date: string;
}

type Props = {};

const Page = (props: Props) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { addTask, tasksQuery } = useTasks();

  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const formatRelativeDate = (dueDate: Timestamp) => {
    const date = new Date(dueDate.toDate());
    const now = new Date();
    const diffDays = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return "This Week";
    if (diffDays < 14) return "Next Week";
    return "Later";
  };

  const groupTasksByDate = (tasks: Task[]) => {
    // Sort the tasks by due date in ascending order
    tasks.sort((a: Task, b: Task) => {
      const dateA = a.due_date
        ? new Date((a.due_date as Timestamp).toDate()).getTime()
        : 0;
      const dateB = b.due_date
        ? new Date((b.due_date as Timestamp).toDate()).getTime()
        : 0;
      return dateA - dateB;
    });

    return tasks.reduce(
      (groups, task) => {
        const dateCategory = formatRelativeDate(task.due_date as Timestamp);
        if (!groups[dateCategory]) groups[dateCategory] = [];
        groups[dateCategory].push(task);
        return groups;
      },
      {} as Record<string, Task[]>,
    );
  };

  const tasks = tasksQuery?.docs.map((doc) => doc.data() as Task) || [];
  const groupedTasks = groupTasksByDate(tasks);

  const onSubmit = async (data: {
    title: string;
    description: string;
    due_date: string;
  }) => {
    await addTask({
      title: data.title,
      description: data.description,
      due_date: new Date(data.due_date) as unknown as Timestamp,
      done: false,
    });

    reset();
    setIsDialogOpen(false);
  };

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
          <h1 className="retro-text text-3xl">Your Tasks (3/9 complete)</h1>
          <div className="flex items-center">
            <Dialog
              open={isDialogOpen}
              onOpenChange={(val) => {
                setIsDialogOpen(val);
              }}
            >
              <DialogTrigger
                onClick={() => {
                  setIsDialogOpen(true);
                }}
                asChild
              >
                <Button className="flex items-center" size={"xs"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  <div>Add Task</div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[40rem]">
                <DialogHeader>
                  <DialogTitle>Add a new task...</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      {...register("title", { required: true })}
                      id="title"
                      placeholder="Task title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      {...register("description", { required: true })}
                      id="description"
                      placeholder="Task description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      {...register("due_date", { required: true })}
                      type="datetime-local"
                      id="due_date"
                      placeholder="Task due date"
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="is-primary ml-auto mt-4 w-full bg-[#209CEE] text-white"
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-y-12">
          {Object.keys(groupedTasks).map((date) => (
            <TaskGroup key={date} date={date} tasks={groupedTasks[date]} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Page;
