import React from "react";
import styled from "styled-components";
import {
  Switch,
  Box,
  Typography,
  Card as MuiCard,
  CardContent,
} from "@mui/material";

// #region styles

const Card = styled(MuiCard)(({ theme }) => ({
  border: `1px solid #dadada`,
  background: "#FFF",
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const StyledTypography = styled(Typography)`
  font-size: 12px;
`;

const BoxContainer = styled(Box)`
  display: flex;
  align-items: center;
  align-self: flex-end;
`;
// #endregion

const OfflineTaskCardComponent = ({
  task: { title, onClick: offlineOnclick, visible = true },
  className,
  onClick,
  completed,
}) => {
  if (!visible) return null;
  return (
    <Card variant="outlined" className={className} aria-pressed={completed}>
      <CardContentStyled>
        <Box>
          <Typography className="mb-1" variant="body2" color="#000">
            {title}
          </Typography>
        </Box>
        <BoxContainer>
          <Switch
            size="small"
            checked={completed ?? false}
            color="success"
            aria-label="Mark task as complete"
            aria-checked={completed}
            onChange={(event) => {
              event.stopPropagation();
              if (onClick) {
                onClick();
              }
              if (offlineOnclick) {
                offlineOnclick();
              }
            }}
          />
          <StyledTypography variant="body2" color="primary">
            Mark Complete
          </StyledTypography>
        </BoxContainer>
      </CardContentStyled>
    </Card>
  );
};

export const OfflineTaskCard = React.memo(OfflineTaskCardComponent);
OfflineTaskCard.displayName = "OfflineTaskCard";
