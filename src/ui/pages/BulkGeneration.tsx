import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { MusicMoodEnum, VoiceEnum } from "../../types/shorts";

interface BulkGenerationTask {
  id: string;
  topic: string;
  status: "pending" | "processing" | "ready" | "failed";
  progress: number;
  videoId?: string;
  error?: string;
}

const BulkGeneration: React.FC = () => {
  const [tasks, setTasks] = useState<BulkGenerationTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    voice: VoiceEnum.af_nova,
    music: MusicMoodEnum.hopeful,
    style: "Problem-Solution",
    numVideos: 5,
  });
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  // Monitor task progress
  useEffect(() => {
    if (tasks.length === 0) return;

    const interval = setInterval(async () => {
      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          if (
            task.status === "processing" ||
            (task.status === "pending" && task.videoId)
          ) {
            try {
              const response = await axios.get(
                `/api/short-video/${task.videoId}/status`,
              );
              return {
                ...task,
                status: response.data.status,
                progress: response.data.status === "ready" ? 100 : task.progress,
              };
            } catch (err) {
              return {
                ...task,
                status: "failed",
                error: "Failed to check status",
              };
            }
          }
          return task;
        }),
      );

      setTasks(updatedTasks);

      // Calculate overall progress
      const totalProgress =
        updatedTasks.reduce((sum, t) => sum + t.progress, 0) /
        updatedTasks.length;
      setOverallProgress(Math.round(totalProgress));
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  const fetchTrendingTopics = async () => {
    setLoadingTopics(true);
    try {
      const response = await axios.get("/api/trending-topics");
      setTrendingTopics(response.data);
    } catch (err) {
      console.error("Failed to fetch trending topics:", err);
      // Fallback topics if API fails
      setTrendingTopics([
        "Productivity Hacks",
        "Time Management",
        "Habit Building",
        "Learning Techniques",
        "Motivation",
        "Deep Work",
        "Procrastination Solutions",
        "Focus Techniques",
      ]);
    } finally {
      setLoadingTopics(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    const newTasks: BulkGenerationTask[] = [];
    const topicsToUse = trendingTopics.slice(0, settings.numVideos);

    try {
      // Create all videos
      for (const topic of topicsToUse) {
        try {
          const response = await axios.post("/api/bulk-generate", {
            topic,
            style: settings.style,
            voice: settings.voice,
            music: settings.music,
            minDuration: 30000, // 30 seconds
          });

          newTasks.push({
            id: response.data.id,
            topic,
            status: "processing",
            progress: 10,
            videoId: response.data.videoId,
          });
        } catch (err) {
          newTasks.push({
            id: `error-${topic}`,
            topic,
            status: "failed",
            progress: 0,
            error: `Failed to start generation: ${err}`,
          });
        }

        // Rate limiting: wait 2 seconds between requests
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setTasks(newTasks);
      setShowSettings(false);
    } catch (err) {
      console.error("Bulk generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircleIcon sx={{ color: "green" }} />;
      case "processing":
        return <HourglassEmptyIcon sx={{ color: "orange" }} />;
      case "failed":
        return <ErrorIcon sx={{ color: "red" }} />;
      default:
        return <HourglassEmptyIcon sx={{ color: "gray" }} />;
    }
  };

  const getStatusColor = (
    status: string,
  ): "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success" => {
    switch (status) {
      case "ready":
        return "success";
      case "processing":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const downloadVideo = async (videoId: string, topic: string) => {
    try {
      const response = await axios.get(`/api/short-video/${videoId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${topic.replace(/\s+/g, "_")}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Failed to download video:", err);
    }
  };

  const readyVideos = tasks.filter((t) => t.status === "ready").length;
  const failedVideos = tasks.filter((t) => t.status === "failed").length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🎬 Bulk Video Generation
      </Typography>

      {/* Summary Stats */}
      {tasks.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5" }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6">{tasks.length}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Videos
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "green" }}>
                  {readyVideos}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "orange" }}>
                  {tasks.filter((t) => t.status === "processing").length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Processing
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "red" }}>
                  {failedVideos}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Failed
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Overall Progress Bar */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">Overall Progress</Typography>
              <Typography variant="body2">{overallProgress}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </Paper>
      )}

      {/* Start Button */}
      {tasks.length === 0 && !isGenerating && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => setShowSettings(true)}
            sx={{ mr: 2 }}
          >
            Generate Videos from Trending Topics
          </Button>
          <Button variant="outlined" onClick={fetchTrendingTopics}>
            Refresh Topics
          </Button>
        </Box>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Generation Settings</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Number of Videos</InputLabel>
            <Select
              value={settings.numVideos}
              label="Number of Videos"
              onChange={(e) =>
                setSettings({ ...settings, numVideos: e.target.value as number })
              }
            >
              {[1, 3, 5, 10, 15, 20].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} videos
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Voice</InputLabel>
            <Select
              value={settings.voice}
              label="Voice"
              onChange={(e) => setSettings({ ...settings, voice: e.target.value as VoiceEnum })}
            >
              <MenuItem value={VoiceEnum.af_nova}>af_nova (Professional)</MenuItem>
              <MenuItem value={VoiceEnum.af_sarah}>af_sarah (Warm)</MenuItem>
              <MenuItem value={VoiceEnum.am_michael}>am_michael (Authoritative)</MenuItem>
              <MenuItem value={VoiceEnum.af_heart}>af_heart (Friendly)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Music Mood</InputLabel>
            <Select
              value={settings.music}
              label="Music Mood"
              onChange={(e) => setSettings({ ...settings, music: e.target.value as MusicMoodEnum })}
            >
              <MenuItem value={MusicMoodEnum.hopeful}>Hopeful (Learning)</MenuItem>
              <MenuItem value={MusicMoodEnum.chill}>Chill (Casual)</MenuItem>
              <MenuItem value={MusicMoodEnum.excited}>Excited (Energetic)</MenuItem>
              <MenuItem value={MusicMoodEnum.contemplative}>Contemplative (Deep)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Content Style</InputLabel>
            <Select
              value={settings.style}
              label="Content Style"
              onChange={(e) => setSettings({ ...settings, style: e.target.value })}
            >
              <MenuItem value="Problem-Solution">Problem → Solution</MenuItem>
              <MenuItem value="Myth-Truth">Myth → Truth</MenuItem>
              <MenuItem value="Tutorial">Tutorial</MenuItem>
              <MenuItem value="Motivation">Motivation</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cancel</Button>
          <Button
            onClick={handleBulkGenerate}
            variant="contained"
            disabled={isGenerating || loadingTopics}
          >
            {isGenerating ? <CircularProgress size={24} /> : "Start Generation"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Cards Grid */}
      {tasks.length > 0 && (
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderLeft: `4px solid ${
                    task.status === "ready"
                      ? "green"
                      : task.status === "failed"
                        ? "red"
                        : "orange"
                  }`,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {getStatusIcon(task.status)}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                      {task.topic}
                    </Typography>
                  </Box>

                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  {task.status !== "failed" && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2">Progress</Typography>
                        <Typography variant="body2">{task.progress}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}

                  {task.error && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {task.error}
                    </Alert>
                  )}
                </CardContent>

                {task.status === "ready" && task.videoId && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => downloadVideo(task.videoId!, task.topic)}
                    >
                      Download Video
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {tasks.length === 0 && !isGenerating && (
        <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f9f9f9" }}>
          <PlayArrowIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No videos generated yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Click the button above to start bulk generation from trending topics
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BulkGeneration;
