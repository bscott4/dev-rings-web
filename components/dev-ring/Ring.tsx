import { CircularProgress } from "@mui/material";

interface RingProps {
  progress: number;
  goal: number;
  size?: "full" | "mini";
}

export const Ring = ({ progress, goal, size = "full" }: RingProps) => {
  const percent = (progress / goal) * 100;
  const isFullSize = size === "full";
  return (
    <CircularProgress
      variant="determinate"
      size={isFullSize ? 200 : 30}
      thickness={8}
      value={percent}
    />
  );
};