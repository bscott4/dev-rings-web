import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import type { SxProps } from "@mui/system";
import {
  useUserDoc,
  useEventsCollection,
  useWebhooksCollection,
} from "@lib/firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { SetGoalModal } from "./SetGoalModal";
import { Ring } from "./Ring";
import { EventsPopper } from "./events-popper";
import type { Log } from "components";

export interface RepoEvent {
  createdAt: Timestamp;
  dateString: string;
  eventType: string;
  repo: string;
  message: string;
  url: string;
}

interface DevRingProps {
  userId: string;
  log: Log;
}

export const DevRing = ({ userId, log }: DevRingProps) => {
  const userData = useUserDoc(userId);
  const events = useEventsCollection(userId);
  const repos = useWebhooksCollection(userId);

  const [dateString, { actual, goal }] = log;

  if (!userData || !events) return null;

  if (!repos)
    return (
      <Link href="/repos" passHref>
        <Button>{`You aren't tracking any repos! Head to the repos page to add more`}</Button>
      </Link>
    );

  // TODO: Can delete this once I programmatically initialize dailyGoal
  const hasGoal = Object.prototype.hasOwnProperty.call(userData, "dailyGoal");
  if (!hasGoal) return <SetGoalModal userId={userId} />;
  const { dailyGoal } = userData;

  const dayEvents = filterEventsByDateString(events, dateString);
  const hasDayEvents = dayEvents.length > 0;

  if (!hasDayEvents)
    return (
      <Box sx={containerSx}>
        <Typography variant="h4" sx={{ pb: 5 }}>
          {`No code committed today – push a commit to see it here!`}
        </Typography>
        <Image
          src="https://media.giphy.com/media/Yx5ns1mSPBle0/giphy.gif"
          height={500}
          width={700}
        />
      </Box>
    );

  return (
    <Box sx={containerSx}>
      <Ring progress={actual} goal={goal} />
      <EventsPopper events={dayEvents} />
    </Box>
  );
};

// TODO: Test this a bunch! Can't have any timezone mishaps
const filterEventsByDateString = (events: RepoEvent[], dateString: string) => {
  const dateStringEvents = events.map((event) => [
    event.createdAt.toDate().toLocaleDateString().replace(/\//g, "-"), // MM-DD-YYYY
    event,
  ]);

  return dateStringEvents
    .filter((event) => event[0] === dateString)
    .map((event) => event[1]) as RepoEvent[];
};

const containerSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
} as SxProps;
