
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Timeline context
import { useTimeline } from "examples/Timeline/context";

// Custom styles for the TimelineItem
import { timelineItem, timelineItemIcon } from "examples/Timeline/TimelineItem/styles";

function TimelineItem({ color, icon, title, dateTime, description, badges, lastItem }) {
  const isDark = useTimeline();

  // Đảm bảo badges luôn là một mảng để tránh lỗi undefined.length
  const safeBadges = Array.isArray(badges) ? badges : [];

  const renderBadges =
    safeBadges.length > 0
      ? safeBadges.map((badge, key) => {
          const badgeKey = `badge-${key}`;

          return (
            <SoftBox key={badgeKey} mr={key === safeBadges.length - 1 ? 0 : 0.5}>
              <SoftBadge color={color} size="xs" badgeContent={badge} container />
            </SoftBox>
          );
        })
      : null;

  return (
    <SoftBox position="relative" sx={(theme) => timelineItem(theme, { lastItem })}>
      <SoftBox
        bgColor={isDark ? "dark" : "white"}
        width="1.625rem"
        height="1.625rem"
        borderRadius="50%"
        position="absolute"
        top="3.25%"
        left="2px"
        zIndex={2}
      >
        <Icon sx={(theme) => timelineItemIcon(theme, { color })}>{icon}</Icon>
      </SoftBox>
      <SoftBox ml={5.75} pt={description ? 0.7 : 0.5} lineHeight={0} maxWidth="30rem">
        <SoftTypography variant="button" fontWeight="medium" color={isDark ? "white" : "dark"}>
          {title}
        </SoftTypography>
        <SoftBox mt={0.5}>
          <SoftTypography
            variant="caption"
            fontWeight="medium"
            color={isDark ? "secondary" : "text"}
          >
            {dateTime}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1.5}>
          {description ? (
            <SoftTypography variant="button" fontWeight="regular" color="text">
              {description}
            </SoftTypography>
          ) : null}
        </SoftBox>
        {safeBadges.length > 0 ? (
          <SoftBox display="flex" pb={lastItem ? 1 : 2}>
            {renderBadges}
          </SoftBox>
        ) : null}
      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of TimelineItem
TimelineItem.defaultProps = {
  color: "info",
  badges: [],
  lastItem: false,
  description: "",
};

// Typechecking props for the TimelineItem
TimelineItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  description: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  lastItem: PropTypes.bool,
};

export default TimelineItem;