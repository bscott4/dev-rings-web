import { useState, MouseEvent, FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip from "@mui/material/Tooltip";
import type { SxProps } from "@mui/system";
import type { PopperPlacementType } from "@mui/core/Popper";

interface Props {
  id: string;
  icon?: JSX.Element;
  sx?: SxProps;
  paperSx?: SxProps;
  close?: boolean;
  placement?: PopperPlacementType;
}

export const PopIt: FC<Props> = ({
  id,
  children,
  close = false,
  icon,
  sx,
  paperSx,
  placement = "bottom",
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl) && !close;
  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box sx={sx}>
        <Tooltip title={id} PopperProps={open ? { open: !open } : {}}>
          <Button
            aria-describedby={open ? id : undefined}
            variant="text"
            onClick={(event: MouseEvent<HTMLElement>) => {
              setAnchorEl(anchorEl ? null : event.currentTarget);
            }}
            sx={{ height: 60 }}
          >
            {icon}
          </Button>
        </Tooltip>
        <Popper
          id={open ? id : undefined}
          open={open}
          anchorEl={anchorEl}
          modifiers={[
            {
              name: "flip",
              enabled: false,
            },
          ]}
          placement={placement}
        >
          <Paper elevation={0} sx={paperSx}>
            {children}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
