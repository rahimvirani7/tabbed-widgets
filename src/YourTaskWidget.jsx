import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton as MuiToggleButton,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ListAltTwoTone as MuiListAltTwoTone,
  LocalShipping,
  Flight,
  Warehouse,
} from "@mui/icons-material";
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

const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid #e0e0e0;
  margin: 0 -20px;
  padding: 0 20px;
`;

const StyledTab = styled(Tab)`
  text-transform: none;
  font-size: 14px;
  min-height: 48px;
`;
// #endregion

// Map tabCategory values to icons
const TAB_ICONS = {
  "Ground Transport": <LocalShipping fontSize="small" />,
  "Air Transport": <Flight fontSize="small" />,
  "Storage": <Warehouse fontSize="small" />,
};

// Derive ordered unique tab categories from the full task list
function getTabCategories(tasks) {
  const seen = new Set();
  const categories = [];
  for (const task of tasks) {
    if (task.tabCategory && !seen.has(task.tabCategory)) {
      seen.add(task.tabCategory);
      categories.push(task.tabCategory);
    }
  }
  return categories;
}

const YourTasksWidget = ({
  onlineTasks = [],
  offlineTasks = [],
  title,
  maxHeight,
  hasError = false,
  onRefresh,
}) => {
  const noTasksToShowTextValue = "No tasks available";
  const statusOptions = [
    { status: "PENDING", label: "Pending" },
    { status: "COMPLETED", label: "Completed" },
  ];

  // all tasks
  const allTasks = useMemo(
    () => [...offlineTasks, ...onlineTasks],
    [offlineTasks, onlineTasks],
  );

  // Derive tab categories from all tasks (preserves order of first appearance)
  const tabCategories = useMemo(() => getTabCategories(allTasks), [allTasks]);

  const [activeTab, setActiveTab] = useState(0);
  const [activeStatus, setActiveStatus] = useState("PENDING");

  const activeCategory = tabCategories[activeTab] ?? null;

  // filtering, grouping, and disable logic
  const { onlineFilteredTasks, offlineFilteredTasks, groupedTasks } =
    useMemo(() => {
      // Filter by tab category first, then by visibility and status
      const matchesCategory = (t) =>
        activeCategory === null || t.tabCategory === activeCategory;

      const matchesStatus = (t) => {
        if (activeStatus === "PENDING") return !t.completed;
        if (activeStatus === "COMPLETED") return t.completed;
        return true;
      };

      const onlineFilteredTasks = onlineTasks.filter(
        (t) => t.visible && matchesCategory(t) && matchesStatus(t),
      );
      const offlineFilteredTasks = offlineTasks.filter(
        (t) => t.visible && matchesCategory(t) && matchesStatus(t),
      );

      const groupedTasks = offlineFilteredTasks.reduce((acc, task) => {
        const event = task.event || "Other";
        if (!acc[event]) acc[event] = [];
        acc[event].push(task);
        return acc;
      }, {});

      return { onlineFilteredTasks, offlineFilteredTasks, groupedTasks };
    }, [onlineTasks, offlineTasks, activeCategory, activeStatus]);

  const noTasksToShow =
    allTasks.length === 0 ||
    (onlineFilteredTasks.length === 0 && offlineFilteredTasks.length === 0);

  return (
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
        {allTasks.length === 0 ? (
          <Typography
            className="flex justify-center items-center h-full py-8"
            variant="body2"
          >
            {noTasksToShowTextValue} to show.
          </Typography>
        ) : (
          <ContentContainer $maxHeight={maxHeight?.toString()}>
            {/* Category Tabs */}
            {tabCategories.length > 0 && (
              <StyledTabs
                value={activeTab}
                onChange={(_, newValue) => {
                  setActiveTab(newValue);
                  setActiveStatus("PENDING");
                }}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="task category tabs"
              >
                {tabCategories.map((category) => (
                  <StyledTab
                    key={category}
                    label={category}
                    icon={TAB_ICONS[category] ?? null}
                    iconPosition="start"
                  />
                ))}
              </StyledTabs>
            )}

            <ToggleContainer>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={activeStatus}
                onChange={(_, newStatus) => {
                  if (newStatus !== null) setActiveStatus(newStatus);
                }}
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

            {noTasksToShow ? (
              <Typography variant="body2" className="py-4 text-center">
                {noTasksToShowTextValue} in this category/status.
              </Typography>
            ) : (
              <TaskListContainer>
                <TaskListWrapper>
                  {onlineFilteredTasks.map((task) => (
                    <TaskListItemOnline key={task.id} task={task} />
                  ))}
                  {offlineFilteredTasks.length > 0 && (
                    <TaskList groupedTasks={groupedTasks} />
                  )}
                </TaskListWrapper>
              </TaskListContainer>
            )}
          </ContentContainer>
        )}
      </CustomGenericWidget>
    </YourTaskWidgetWrapper>
  );
};

export default YourTasksWidget;
