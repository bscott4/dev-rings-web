import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@lib/firebase/auth";
import type { Log } from "@lib/firebase/firestore";
import { dayjs } from "@lib/dayjs";
import { Typography, ButtonBase } from "@mui/material";
import { CompletedRing, ProgressRing } from "components";

export const DayTile = ({ log }: { log: Log }) => {
  const [hover, setHover] = useState(false);
  const userId = useAuth();
  if (!userId) return null;

  const [dateString, { actual, goal }] = log;
  const isDayOff = !actual && !goal;
  const hitGoal = !isDayOff && actual >= goal;
  return (
    <Link
      href={{
        pathname: "/[userId]/[dateString]",
        query: { userId, dateString },
      }}
      passHref
    >
      <ButtonBase
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        // TODO: How do I let popper know to close onClick?
        // onClick={() => setAnchorEl(null)}
        disabled={isDayOff}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          height: 60,
          width: 60,
          border: "3px solid #DCDEE6",
          borderRadius: 3,
          bgcolor: hover ? "#F5F6FD" : null,
          pt: "2px",
        }}
      >
        <Typography sx={{ fontSize: 10, alignSelf: "flex-end", mr: "4px" }}>
          {dayjs(dateString).date()}
        </Typography>
        {hitGoal ? (
          <CompletedRing isMini />
        ) : (
          <ProgressRing values={isDayOff ? [0, 1] : [actual, goal]} size={30} />
        )}
      </ButtonBase>
    </Link>
  );
};
