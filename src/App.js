import React, { useMemo } from "react";
import YourTasksWidget from "./YourTaskWidget";
import { sampleTasks, hhgTaskList } from "./mockData";

export default function App() {
  const getOnlineTasks = (onlineTasks = []) => {
    onlineTasks.forEach((task, index) => {
      const matchingTask = hhgTaskList.find(
        (hhgTask) => hhgTask.dataTestId === task.id,
      );

      if (matchingTask) {
        // Create a copy of the task to avoid mutating the original immutable object
        const updatedTask = {
          ...task,
          title: matchingTask.taskDescription,
        };
        onlineTasks[index] = updatedTask;
      }
    });

    return onlineTasks;
  };

  const hhgAllTasks = sampleTasks;
  const { onlineTasksList, offlineTasksList } = useMemo(() => {
    const onlineTasksList = getOnlineTasks(
      hhgAllTasks?.filter((task) => task.online),
    );

    const offlineTasksList = hhgAllTasks?.filter((task) => !task.online);
    return { onlineTasksList, offlineTasksList };
  }, [hhgAllTasks]);

  return (
    <div className="m-12">
      <h1 className="font-extrabold text-center text-3xl p-4 bg-indigo-500 text-white rounded-2xl">
        Tabbed Widget POC
      </h1>
      <YourTasksWidget
        onlineTasks={onlineTasksList}
        offlineTasks={offlineTasksList}
        title="Tasks Widget"
      />
    </div>
  );
}
