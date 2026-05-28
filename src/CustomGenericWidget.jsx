import React, { memo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Icon,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import styled from "styled-components";

const StyledCard = styled(Card)(
  ({ theme }) => ({
    width: "600px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#FFF",
    boxShadow: theme?.shadows?.[1],
    marginTop: "20px",
  }),
  `.MuiCardHeader-root {
    padding: 12px;
  }`,
  `.MuiCardContent-root {
    padding: 12px;
  }`,
);

const ScrollableContainer = styled(Box)(({ maxHeight }) => ({
  maxHeight: maxHeight ? `${maxHeight}px` : "none",
  overflowY: maxHeight ? "auto" : "visible",
  flexGrow: 1,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme?.palette?.primary?.[800],
}));

const CustomGenericWidget = memo(
  ({
    icon: IconComponent,
    title,
    children,
    maxHeight,
    widgetWidth,
    showMenu = true,
    dataTestId = "custom-generic-widget",
  }) => {
    return (
      <StyledCard
        variant="outlined"
        $widgetWidth={widgetWidth}
        data-test={dataTestId}
      >
        <CardHeader
          avatar={
            <Icon>
              <IconComponent className="align-top" />
            </Icon>
          }
          title={<StyledTitle variant="subtitle1">{title}</StyledTitle>}
          action={
            showMenu && (
              <IconButton sx={{ p: 1.5 }} aria-label="more">
                <MoreVertTwoToneIcon />
              </IconButton>
            )
          }
        />
        <Divider />
        <ScrollableContainer
          maxHeight={maxHeight}
          data-testid="widget-container"
        >
          <CardContent>{children}</CardContent>
        </ScrollableContainer>
      </StyledCard>
    );
  },
);

export default CustomGenericWidget;
