import { useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import useWindowSize from "react-use/lib/useWindowSize";
import {
  useCollection,
  useUserDoc,
  setIsOnboarding,
} from "@lib/firebase/firestore";
import type { RepoEvent, Webhook } from "@lib/firebase/firestore";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import type { SxProps } from "@mui/system";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import { OnboardingSteps } from "components";

const Onboarding: NextPage = () => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [activeStep, setActiveStep] = useState(0);
  const events = useCollection("events") as RepoEvent[] | null;
  const webhooks = useCollection("webhooks") as Webhook[] | null;
  const userData = useUserDoc();
  if (!userData) return null;
  const [userId, { dailyGoal, timezone }] = userData;

  const steps: Array<[string, boolean]> = [
    ["Select repos to track", Boolean(webhooks)],
    ["Set a daily contributions goal", Boolean(dailyGoal)],
    ["Confirm timezone", Boolean(timezone)],
    ["Code", Boolean(events)],
  ];

  const incrementStep = () => setActiveStep(activeStep + 1);
  const decrementStep = () => setActiveStep(activeStep - 1);
  return (
    <Box sx={containerSx}>
      <Stepper activeStep={activeStep} sx={{ width: "60%" }}>
        {steps.map(([label]) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep < steps.length ? (
        <OnboardingSteps activeStep={activeStep} onSuccess={incrementStep} />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", mt: 10 }}>
          <Typography sx={{ mt: 2, mb: 1 }}>
            {`Woo! You're ready to start building momentum with Dev Rings 🚀`}
          </Typography>
          <Confetti
            width={width}
            height={height}
            numberOfPieces={1000}
            recycle={false}
            onConfettiComplete={() => {
              toast.success(`Onboarding complete`, {
                position: "top-center",
              });
              setIsOnboarding(userId);
              setTimeout(() => router.push("/"), 1000);
            }}
          />
        </Box>
      )}
      {activeStep < steps.length && (
        <Box sx={buttonsSx}>
          <Button disabled={activeStep === 0} onClick={decrementStep}>
            Back
          </Button>
          <Button disabled={!steps[activeStep][1]} onClick={incrementStep}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

const containerSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: 1,
  height: "90vh",
} as SxProps;

const buttonsSx = {
  display: "flex",
  justifyContent: "space-between",
  width: "60%",
  pt: 2,
} as SxProps;

export default Onboarding;