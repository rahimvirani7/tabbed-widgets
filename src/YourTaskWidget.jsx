import { useMemo } from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton as MuiToggleButton,
} from "@mui/material";
import { ListAltTwoTone as MuiListAltTwoTone } from "@mui/icons-material";
import CustomGenericWidget from "./CustomGenericWidget";
import { TaskList } from "./TaskList";
import { TaskListItemOnline } from "./TaskListItemOnline";

// #region styles

const ListAltTwoTone = styled(MuiListAltTwoTone)`
  ${({ theme }) => `
    color: ${theme?.palette?.primary?.[600]};
    margin-bottom: 20px;
  `}
`;

const ContentContainer = styled.div`
  ${({ theme, $maxHeight }) => `
    position: relative;
    max-height: ${$maxHeight || '320px'};
    overflow-y: auto;
    padding: 0 20px;
  `}
`;

const ToggleButton = styled(MuiToggleButton)`
  ${({ theme }) => `
    padding: 10px;
    text-transform: none;
  `}
`;

const TaskListContainer = styled(Box)`
  ${({ theme }) => `
    padding-bottom: 10px;
  `}
`;

const TaskListWrapper = styled(Box)`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 10px;
  `}
`;

const ToggleContainer = styled(Box)`
  ${({ theme }) => `
    position: sticky;
    top: 0;
    background: #FFF;
    z-index: 1;
    padding: 20px 0;
  `}
`;

const YourTaskWidgetWrapper = styled.div`
  .MuiBox-root > .MuiCardContent-root {
    padding: 0;
    height: 100%;
  }
`;
// #endregion

const YourTasksWidget = ({
  onlineTasks = [],
  offlineTasks = [],
  title,
  maxHeight,
  hasError = false,
  onRefresh,
}) => {
  const noTasksToShowTextValue = "No tasks available"; // useContentful(noTasksToShowTextKey) || "No tasks available";
  const statusOptions = [
    { status: "PENDING", label: "Pending" },
    { status: "COMPLETED", label: "Completed" },
  ];

  // all tasks
  const allTasks = useMemo(
    () => [...offlineTasks, ...onlineTasks],
    [offlineTasks, onlineTasks],
  );

  // filtering, grouping, and disable logic
  const { onlineFilteredTasks, offlineFilteredTasks, groupedTasks } =
    useMemo(() => {
      // First filter by API availability, then by status and visibility
      const onlineFilteredTasks = onlineTasks.filter(
        (t) => {
          console.log("aaaaa", t)
          return t.visible}
      );
      const offlineFilteredTasks = offlineTasks.filter(
        (t) => {return t.visible}
      );
      const groupedTasks = offlineFilteredTasks.reduce((acc, task) => {
        if (!task.visible) return acc;
        const event = task.event || "Other";
        if (!acc[event]) acc[event] = [];
        acc[event].push(task);
        return acc;
      }, {});

      return {
        onlineFilteredTasks,
        offlineFilteredTasks,
        groupedTasks,
      };
    }, [onlineTasks, offlineTasks]);

  const noTasksToShow =
    allTasks.length === 0 ||
    (onlineFilteredTasks.length === 0 && offlineFilteredTasks.length === 0);

  return (
    console.log("All Tasks:", allTasks, onlineFilteredTasks, offlineFilteredTasks),
    <YourTaskWidgetWrapper
      data-testid="your-tasks-widget"
      data-test="widget-your-tasks"
    >
      <CustomGenericWidget
        icon={ListAltTwoTone}
        title={title}
        showMenu={false}
        hasError={hasError}
        onRefresh={onRefresh}
      >
        {noTasksToShow ? (
          <Typography
            className="flex justify-center items-center h-full py-8"
            variant="body2"
          >
            {noTasksToShowTextValue || "No tasks available"}
          </Typography>
        ) : (
          <ContentContainer $maxHeight={maxHeight?.toString()}>
            <ToggleContainer>
              <ToggleButtonGroup
                exclusive
                size="small"
                aria-label="task status"
              >
                {statusOptions.map(({ status, label }) => (
                  <ToggleButton
                    key={`${status}-${label}`}
                    value={status}
                    aria-label={label}
                    disableTouchRipple
                  >
                    <Typography variant="body2">{label}</Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </ToggleContainer>

            <TaskListContainer>
              <TaskListWrapper>
                {onlineFilteredTasks.map((task) => (
                  <TaskListItemOnline key={task.id} task={task} />
                ))}
                {/* Offline Tasks grouped by event */}
                {offlineFilteredTasks.length > 0 && (
                  <TaskList
                    groupedTasks={groupedTasks}
                  />
                )}
              </TaskListWrapper>
            </TaskListContainer>
          </ContentContainer>
        )}
      </CustomGenericWidget>
    </YourTaskWidgetWrapper>
  );
};

export default YourTasksWidget;
