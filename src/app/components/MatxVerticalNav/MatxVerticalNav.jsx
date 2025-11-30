import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import ButtonBase from "@mui/material/ButtonBase";
import styled from "@mui/material/styles/styled";

import useSettings from "app/hooks/useSettings";
import { Paragraph, Span } from "../Typography";
import MatxVerticalNavExpansionPanel from "./MatxVerticalNavExpansionPanel";

// STYLED COMPONENTS
const ListLabel = styled(Paragraph)(({ theme, mode }) => ({
  fontSize: "12px",
  marginTop: "20px",
  marginLeft: "15px",
  marginBottom: "10px",
  textTransform: "uppercase",
  display: mode === "compact" && "none",
  color: theme.palette.text.secondary
}));

const ExtAndIntCommon = {
  display: "flex",
  overflow: "hidden",
  borderRadius: "12px",
  height: 48,
  whiteSpace: "pre",
  marginBottom: "10px",
  textDecoration: "none",
  justifyContent: "space-between",
  transition: "all 180ms ease",

  // Hover efekti – modern
  "&:hover": {
    background: "rgba(255, 255, 255, 0.15)",
    transform: "translateX(4px)",
  },

  // Compact mod
  "&.compactNavItem": {
    overflow: "hidden",
    justifyContent: "center !important"
  },

  // Icon
  "& .icon": {
    fontSize: "20px",
    paddingLeft: "16px",
    paddingRight: "16px",
    verticalAlign: "middle",
  }
};


const ExternalLink = styled("a")(({ theme }) => ({
  ...ExtAndIntCommon,
  color: theme.palette.text.primary
}));

const InternalLink = styled(Box)(({ theme }) => ({
  "& a": {
    ...ExtAndIntCommon,
    color: theme.palette.text.primary
  },
 "& .navItemActive": {
  backgroundColor: "rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(6px)",
  borderRadius: "12px",
  fontWeight: 700,
}


}));

const StyledText = styled(Span)(({ mode }) => ({
  fontSize: "0.93rem",
  fontWeight: 500,
  paddingLeft: "0.95rem",
  letterSpacing: "0.3px",
  display: mode === "compact" && "none",
  transition: "0.15s",
}));


const BulletIcon = styled("div")(({ theme }) => ({
  width: 6,
  height: 6,
  marginLeft: "22px",
  marginRight: "10px",
  borderRadius: "50%",
  background: theme.palette.text.primary,
}));


const BadgeValue = styled("div")(() => ({
  padding: "1px 8px",
  overflow: "hidden",
  borderRadius: "300px"
}));

export default function MatxVerticalNav({ items }) {
  const { settings } = useSettings();
  const { mode } = settings.layout1Settings.leftSidebar;

  const renderLevels = (data) => {
    return data.map((item, index) => {
      if (item.type === "label")
        return (
          <ListLabel key={index} mode={mode} className="sidenavHoverShow">
            {item.label}
          </ListLabel>
        );

      if (item.children) {
        return (
          <MatxVerticalNavExpansionPanel mode={mode} item={item} key={index}>
            {renderLevels(item.children)}
          </MatxVerticalNavExpansionPanel>
        );
      } else if (item.type === "extLink") {
        return (
          <ExternalLink
            key={index}
            href={item.path}
            className={`${mode === "compact" && "compactNavItem"}`}
            rel="noopener noreferrer"
            target="_blank">
            <ButtonBase key={item.name} name="child" sx={{ width: "100%" }}>
              {(() => {
                if (item.icon) {
                  return <Icon className="icon">{item.icon}</Icon>;
                } else {
                  return <span className="item-icon icon-text">{item.iconText}</span>;
                }
              })()}
              <StyledText mode={mode} className="sidenavHoverShow">
                {item.name}
              </StyledText>
              <Box mx="auto"></Box>
              {item.badge && <BadgeValue>{item.badge.value}</BadgeValue>}
            </ButtonBase>
          </ExternalLink>
        );
      } else {
        return (
          <InternalLink key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? `navItemActive ${mode === "compact" && "compactNavItem"}`
                  : `${mode === "compact" && "compactNavItem"}`
              }>
              <ButtonBase key={item.name} name="child" sx={{ width: "100%" }}>
                {item?.icon ? (
                  <Icon className="icon" sx={{ width: 36 }}>
                    {item.icon}
                  </Icon>
                ) : (
                  <Fragment>
                    <BulletIcon
                      className={`nav-bullet`}
                      sx={{ display: mode === "compact" && "none" }}
                    />
                    <Box
                      className="nav-bullet-text"
                      sx={{
                        ml: "20px",
                        fontSize: "11px",
                        display: mode !== "compact" && "none"
                      }}>
                      {item.iconText}
                    </Box>
                  </Fragment>
                )}
                <StyledText mode={mode} className="sidenavHoverShow">
                  {item.name}
                </StyledText>

                <Box mx="auto" />

                {item.badge && (
                  <BadgeValue className="sidenavHoverShow">{item.badge.value}</BadgeValue>
                )}
              </ButtonBase>
            </NavLink>
          </InternalLink>
        );
      }
    });
  };

  return <div className="navigation">{renderLevels(items)}</div>;
}
