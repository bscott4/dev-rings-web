import { motion } from "framer-motion";
import { Box } from "@mui/material";

interface Props {
  isMini?: boolean;
}

export const CompletedRing = ({ isMini = false }: Props) => {
  const size = isMini ? 40 : 400;
  const checkStart = [size * 0.433, size * 0.516];
  const checkVertex = [size * 0.483, size * 0.566];
  const checkEnd = [size * 0.6, size * 0.45];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: -0.7,
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx={size * 0.5}
          cy={size * 0.5}
          r={size * 0.33}
          stroke="#556cd6"
          strokeWidth={isMini ? 4 : 20}
          strokeLinecap="round"
          fill="transparent"
          style={{ rotate: 270 }}
          variants={draw}
          custom={1}
        />
        <motion.line
          x1={checkStart[0]}
          y1={checkStart[1]}
          x2={checkVertex[0]}
          y2={checkVertex[1]}
          stroke={CHECKMARK_COLOUR}
          strokeWidth={isMini ? 3 : 15}
          strokeLinecap="round"
          custom={3}
          variants={draw}
        />
        <motion.line
          x1={checkVertex[0]}
          y1={checkVertex[1]}
          x2={checkEnd[0]}
          y2={checkEnd[1]}
          stroke={CHECKMARK_COLOUR}
          strokeWidth={isMini ? 3 : 15}
          strokeLinecap="round"
          custom={4.2}
          variants={draw}
        />
      </motion.svg>
    </Box>
  );
};

// TODO: Add to theme
const CHECKMARK_COLOUR = "#66CC00";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: any) => {
    const delay = 0.5 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};
