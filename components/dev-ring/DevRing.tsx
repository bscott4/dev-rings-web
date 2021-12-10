import { Box } from "@mui/material";
import { useUserDoc, useEventsCollection } from "@lib/firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { SetGoalModal } from "./SetGoalModal";
import { Ring } from "./Ring";
import { EventsPopper } from "./events-popper";
import type { Log } from "components";

export interface RepoEvent {
  createdAt: Timestamp;
  eventType: string;
  repo: string;
  message: string;
  url: string;
}

interface DevRingProps {
  userId: string;
  log?: Log; // TODO: How do I type this to be conditional? I.e., if isToday is omitted, log is required
  isToday?: boolean;
}

// TODO: Can delete once I resolve comment above
const emptyLog = ["", { actual: 0, goal: 0 }] as Log;

export const DevRing = ({
  userId,
  log = emptyLog,
  isToday = false,
}: DevRingProps) => {
  const userData = useUserDoc(userId);
  const events = useEventsCollection(userId);
  if (!userData || !events) return null;

  // TODO: Can delete this once I programmatically initialize dailyGoal
  const hasGoal = Object.prototype.hasOwnProperty.call(userData, "dailyGoal");
  if (!hasGoal) return <SetGoalModal userId={userId} />;
  const { dailyGoal } = userData;

  // TODO: Improve this
  if (!log) return null;
  const { actual, goal } = log[1];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ring
        progress={isToday ? events.length : actual}
        goal={isToday ? dailyGoal : goal}
      />
      {Boolean(events.length) && <EventsPopper events={events} />}
    </Box>
  );
};
