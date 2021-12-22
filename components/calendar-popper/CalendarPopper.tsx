import { useState, MouseEvent } from "react";
import { useCollections } from "@lib/firebase/firestore";
import { createMonthYear, MonthYear } from "@lib/dayjs";
import {
  Box,
  Typography,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import type { SxProps } from "@mui/system";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { Month } from "./Month";
import { filterLogs, getFirstLogDate } from "./utils";

export type Log = [
  string,
  {
    actual: number;
    goal: number;
  }
];

/*
 * Still using userId prop cuz then I don't have to return null if user from useAuth is null,
 * which breaks the app cuz we "render more hooks than previous render"
 */
export const CalendarPopper = ({ userId }: { userId: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "calendar-popper" : undefined;

  const [monthInView, setMonthInView] = useState<MonthYear>(createMonthYear());

  const [, logs] = useCollections(userId);
  if (!logs) return null;

  const logsInView = filterLogs(logs as Log[], monthInView);

  // TODO: Test this a bunch
  const firstMonth = createMonthYear(getFirstLogDate(logs as Log[]));
  const previousMonthExists = !(
    JSON.stringify(monthInView) === JSON.stringify(firstMonth)
  );

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box>
        <Button
          aria-describedby={id}
          variant="text"
          onClick={(event: MouseEvent<HTMLElement>) => {
            setAnchorEl(anchorEl ? null : event.currentTarget);
          }}
          sx={{ height: 60, ml: 1 }}
        >
          <CalendarTodayRoundedIcon />
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Paper elevation={0} sx={{ pt: 2, borderRadius: 10 }}>
            <Box sx={containerSx}>
              <Typography sx={{ fontSize: 12, color: "primary.main" }}>
                {monthInView[1]}
              </Typography>
              <Month
                logs={logsInView}
                hasPrevious={previousMonthExists}
                hasNext={true} //TODO: Update once I delete demo date --> monthInView !== currentMonth
                monthInView={monthInView}
                setMonthInView={setMonthInView}
                setAnchorEl={setAnchorEl}
              />
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

const containerSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: 480,
  border: "2px solid #DCDEE6",
  borderRadius: 10,
  p: 2,
  pt: 1,
} as SxProps;
