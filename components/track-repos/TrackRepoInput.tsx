import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "@lib/firebase/auth";
import { Box, FormControl, Input, Tooltip } from "@mui/material";
import type { SxProps } from "@mui/system";
import { trackRepo } from "./trackRepo";
import GitHubSvg from "@mui/icons-material/GitHub";

export const TrackRepoInput = () => {
  const { register, handleSubmit } = useForm<{ repoUrl: string }>();

  const userId = useAuth();
  if (!userId) return null;

  const onSubmit: SubmitHandler<{ repoUrl: string }> = async ({ repoUrl }) => {
    // TODO: Add validation for repos that are already being tracked
    const isGitHubUrl = githubUrl.test(repoUrl);
    const isRepoOwner = repoUrl.includes(userId);

    if (!isGitHubUrl) {
      toast.error(`This is not a GitHub repo link`);
      return;
    }
    if (!isRepoOwner) {
      toast.error(`You don't own this repo`);
      return;
    }

    const re = new RegExp(`(?<=${userId}/).*(?=[.]git)`);
    const result = re.exec(repoUrl);
    if (!result) {
      // TODO: When would this occur? Need to make this more specific
      toast.error("Yoinks, something went wrong 😟");
      return;
    }
    const repo = result[0];
    const status = await trackRepo(userId, repo);
    if (status !== 200) {
      // TODO: Log to Sentry
      toast.error("Yoinks, something went wrong 😟");
      return;
    }
    toast.success("Webhook successfully created");
  };

  return (
    <Box sx={containerSx}>
      <Tooltip title="Paste a private GitHub repo here to start tracking it">
        <FormControl variant="standard">
          <Input
            {...register("repoUrl")}
            id="repoUrl"
            type="text"
            placeholder={"https://github.com/you/your-awesome-repo.git"}
            // TODO: Make GitHubSvg on theme
            startAdornment={<GitHubSvg />}
            onKeyPress={(kp) => {
              if (kp.key === "Enter") {
                handleSubmit(onSubmit)();
                kp.preventDefault();
                // TODO: What does this do ☝️
              }
            }}
            sx={{ width: 450 }}
          />
        </FormControl>
      </Tooltip>
    </Box>
  );
};

const containerSx = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "start",
  width: 400,
  ml: 5,
  mt: 1,
} as SxProps;

const githubUrl = new RegExp(`https://github.com/(.*)/(.*)[.]git`);
