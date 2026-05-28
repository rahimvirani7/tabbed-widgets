import { styled, Typography } from "@mui/material";
import { OfflineTaskCard } from "./OfflineTaskCard";

// #region styles

const Container = styled("ul")`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
  `}
`;
// #endregion

export const TaskList = ({ groupedTasks = {}, onToggle = () => {} }) => {
  if (Object.keys(groupedTasks).length === 0) return null;

  return (
    <Container>
      {Object.entries(groupedTasks).map(([event, tasks]) => (
        <li key={event} data-testid={`${event} Group`}>
          <Typography
            variant="body2"
            component="h3"
            className="border-t pt-3 mb-2 border-Gray300"
            color="primary.800"
          >
            {event}
          </Typography>
          <ul data-testid="offline-task-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <OfflineTaskCard task={task} className="mb-3" />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </Container>
  );
};

TaskList.displayName = "TaskList";
export default TaskList;
