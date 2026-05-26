import { Tooltip as MUITooltip, withStyles } from "@material-ui/core";

const Tooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: 16,
    padding: "0.5rem",
  },
}))(MUITooltip);

export default Tooltip;
