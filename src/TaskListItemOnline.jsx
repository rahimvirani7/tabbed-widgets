import { memo } from "react";
import { Box, Button, styled, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

// #region styles

const OnlineTaskItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: `0.5px solid #dadada`,
  background: "#FFF",
  "& svg": {
    width: 18,
    height: 18,
  },
}));

// #endregion

export const TaskListItemOnline = memo(({ task }) => {
  const { visible, title } = task;

  if (!visible) return null;
  return (
    <OnlineTaskItem>
      <Typography variant="body2" color="primary" sx={{ py: 2 }}>
        {title}
      </Typography>

      <Button
        variant="text"
        size="small"
        disableRipple
        // onClick={handleClick}
        aria-label="Go to task"
        className="text-nowrap"
        endIcon={<ChevronRight />}
      >
        Go to task
      </Button>
    </OnlineTaskItem>
  );
});

TaskListItemOnline.displayName = "TaskListItemOnline";
