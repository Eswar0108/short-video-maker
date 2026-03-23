import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow,
  ExpandMore,
  Category,
  VideoLibrary,
  Subtitles,
  Tag,
  CheckCircle,
  Error,
  Schedule,
  AutoAwesome
} from '@mui/icons-material';

interface CategoryConfig {
  name: string;
  description: string;
  topics: string[];
  style: string;
  voice: string;
  music: string;
  count: number;
}

interface WorkflowStatus {
  stage: 'idle' | 'generating-scripts' | 'generating-videos' | 'completed' | 'error';
  currentCategory: string;
  currentVideo: number;
  totalVideos: number;
  progress: number;
  results: any[];
  error?: string;
}

interface VideoExtraData {
  captions?: string;
  hashtags?: string[];
  status?: 'processing' | 'ready' | 'failed';
}


const WORKFLOW_STAGES = [
  'Select Categories',
  'Generate Scripts',
  'Create Videos',
  'Add Captions & Hashtags'
];

const PREDEFINED_CATEGORIES: CategoryConfig[] = [
  {
    name: 'Productivity',
    description: 'Time management, focus, and efficiency tips',
    topics: ['Time Management', 'Focus Techniques', 'Morning Routines', 'Goal Setting', 'Procrastination Solutions'],
    style: 'Problem-Solution',
    voice: 'bm_george',
    music: 'uplifting',
    count: 5
  },
  {
    name: 'Health & Fitness',
    description: 'Wellness, exercise, and healthy living',
    topics: ['Quick Workouts', 'Healthy Eating', 'Mental Health', 'Sleep Tips', 'Stress Management'],
    style: 'Tutorial',
    voice: 'bf_emma',
    music: 'motivational',
    count: 5
  },
  {
    name: 'Technology',
    description: 'Tech tips, productivity tools, and digital skills',
    topics: ['AI Tools', 'Productivity Apps', 'Coding Tips', 'Digital Detox', 'Future Tech'],
    style: 'Myth-Truth',
    voice: 'am_liam',
    music: 'electronic',
    count: 5
  },
  {
    name: 'Business',
    description: 'Entrepreneurship, finance, and career advice',
    topics: ['Side Hustles', 'Personal Finance', 'Networking', 'Leadership', 'Marketing Tips'],
    style: 'Problem-Solution',
    voice: 'bm_daniel',
    music: 'corporate',
    count: 5
  },
  {
    name: 'Lifestyle',
    description: 'Daily life, relationships, and personal growth',
    topics: ['Relationship Advice', 'Home Organization', 'Cooking Hacks', 'Travel Tips', 'Self Care'],
    style: 'Tutorial',
    voice: 'bf_lily',
    music: 'relaxing',
    count: 5
  }
];

const WorkflowGenerator: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<CategoryConfig[]>([]);
  const [customCategory, setCustomCategory] = useState<CategoryConfig>({
    name: '',
    description: '',
    topics: [],
    style: 'Problem-Solution',
    voice: 'male-professional',
    music: 'uplifting',
    count: 3
  });
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>({
    stage: 'idle',
    currentCategory: '',
    currentVideo: 0,
    totalVideos: 0,
    progress: 0,
    results: []
  });
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [videoExtra, setVideoExtra] = useState<Record<string, VideoExtraData>>({});
  const [copyMessage, setCopyMessage] = useState('');


  const handleCategorySelect = (category: CategoryConfig) => {
    setSelectedCategories(prev => {
      const exists = prev.find(c => c.name === category.name);
      if (exists) {
        return prev.filter(c => c.name !== category.name);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.name && customCategory.topics.length > 0) {
      setSelectedCategories(prev => [...prev, customCategory]);
      setCustomCategory({
        name: '',
        description: '',
        topics: [],
        style: 'Problem-Solution',
        voice: 'male-professional',
        music: 'uplifting',
        count: 3
      });
      setShowCustomDialog(false);
    }
  };

  const addTopic = () => {
    if (topicInput.trim()) {
      setCustomCategory(prev => ({
        ...prev,
        topics: [...prev.topics, topicInput.trim()]
      }));
      setTopicInput('');
    }
  };

  const removeTopic = (topic: string) => {
    setCustomCategory(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topic)
    }));
  };

  const startWorkflow = async () => {
    if (selectedCategories.length === 0) return;

    setWorkflowStatus({
      stage: 'generating-scripts',
      currentCategory: '',
      currentVideo: 0,
      totalVideos: selectedCategories.reduce((sum, cat) => sum + cat.count, 0),
      progress: 0,
      results: []
    });

    try {
      // Generate scripts for all categories
      const scriptPromises = selectedCategories.map(async (category) => {
        const response = await fetch('/api/workflow/generate-scripts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: category.name,
            topics: category.topics,
            style: category.style,
            count: category.count
          })
        });

        if (!response.ok) throw new Error(`Failed to generate scripts for ${category.name}`);

        const scripts = await response.json();
        return { category: category.name, scripts, config: category };
      });

      const scriptResults = await Promise.all(scriptPromises);

      setWorkflowStatus(prev => ({
        ...prev,
        stage: 'generating-videos',
        progress: 25
      }));

      // Generate videos sequentially
      const videoResults = [];
      let videoCount = 0;

      for (const categoryResult of scriptResults) {
        setWorkflowStatus(prev => ({
          ...prev,
          currentCategory: categoryResult.category
        }));

        for (const script of categoryResult.scripts) {
          setWorkflowStatus(prev => ({
            ...prev,
            currentVideo: videoCount + 1
          }));

          const videoResponse = await fetch('/api/workflow/generate-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              script,
              voice: categoryResult.config.voice,
              music: categoryResult.config.music,
              category: categoryResult.category
            })
          });

          if (!videoResponse.ok) throw new Error(`Failed to generate video for ${script.topic}`);

          const videoResult = await videoResponse.json();
          videoResults.push(videoResult);
          videoCount++;

          setVideoExtra(prev => ({
            ...prev,
            [videoResult.videoId]: {
              status: 'processing',
              captions: (videoResult.captions || []).map((c: any) => c.text).join(' '),
              hashtags: videoResult.hashtags || []
            }
          }));

          // Poll for video status until ready
          let status = 'processing';
          while (status === 'processing') {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds
            status = await fetchVideoStatus(videoResult.videoId);
            if (status === 'failed') {
              throw new Error(`Video generation failed for ${script.topic}`);
            }
          }

          setWorkflowStatus(prev => ({
            ...prev,
            progress: 25 + (videoCount / prev.totalVideos) * 75
          }));
        }
      }

      setWorkflowStatus(prev => ({
        ...prev,
        stage: 'completed',
        progress: 100,
        results: videoResults
      }));

    } catch (error) {
      setWorkflowStatus(prev => ({
        ...prev,
        stage: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  const getCurrentStep = () => {
    switch (workflowStatus.stage) {
      case 'idle': return 0;
      case 'generating-scripts': return 1;
      case 'generating-videos': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const fetchVideoStatus = async (videoId: string) => {
    try {
      const response = await fetch(`/api/short-video/${videoId}/status`);
      if (!response.ok) throw new Error('Failed to fetch video status');
      const result = await response.json();
      setVideoExtra((prev) => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          status: result.status
        }
      }));
      return result.status;
    } catch (err) {
      return 'failed';
    }
  };

  const fetchCaptions = async (videoId: string) => {
    if (!videoId) return;
    const existing = videoExtra[videoId]?.captions;
    if (existing) return existing;

    const response = await fetch(`/api/video/${videoId}/captions`);
    if (!response.ok) throw new Error('Failed to fetch captions');
    const data = await response.json();
    const captionText = (data.captions || []).map((c: any) => c.text).join(' ');
    setVideoExtra((prev) => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        captions: captionText
      }
    }));
    return captionText;
  };

  const fetchHashtags = async (topic: string, category: string) => {
    const response = await fetch(`/api/hashtags?topic=${encodeURIComponent(topic)}&category=${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error('Failed to fetch hashtags');
    const data = await response.json();
    return data.hashtags || [];
  };

  const copyToClipboard = async (text: string, message: string) => {
    if (!navigator.clipboard) {
      setCopyMessage('Clipboard API not supported in this browser.');
      return;
    }
    await navigator.clipboard.writeText(text);
    setCopyMessage(message);
    setTimeout(() => setCopyMessage(''), 3000);
  };

  const loadAndCopyCaptions = async (videoId: string) => {
    try {
      const captions = await fetchCaptions(videoId);
      if (captions) {
        await copyToClipboard(captions, 'Captions copied to clipboard!');
      }
    } catch (err) {
      setCopyMessage('Unable to copy captions.');
    }
  };

  const loadAndCopyHashtags = async (topic: string, category: string, videoId: string) => {
    try {
      let hashtags = videoExtra[videoId]?.hashtags;
      if (!hashtags) {
        hashtags = await fetchHashtags(topic, category);
      }
      const text = (hashtags || []).join(' ');
      await copyToClipboard(text, 'Hashtags copied to clipboard!');
      setVideoExtra((prev) => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          hashtags
        }
      }));
    } catch (err) {
      setCopyMessage('Unable to copy hashtags.');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesome color="primary" />
        Workflow Video Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Generate complete video series across multiple categories with scripts, captions, and hashtags
      </Typography>

      {/* Workflow Progress */}
      {workflowStatus.stage !== 'idle' && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={getCurrentStep()} sx={{ mb: 2 }}>
              {WORKFLOW_STAGES.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {workflowStatus.stage === 'generating-scripts' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} />
                <Typography>Generating scripts for {selectedCategories.length} categories...</Typography>
              </Box>
            )}

            {workflowStatus.stage === 'generating-videos' && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Creating videos for: {workflowStatus.currentCategory}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Video {workflowStatus.currentVideo} of {workflowStatus.totalVideos}
                </Typography>
                <LinearProgress variant="determinate" value={workflowStatus.progress} sx={{ mt: 1 }} />
              </Box>
            )}

            {workflowStatus.stage === 'completed' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✅ Workflow completed! Generated {workflowStatus.results.length} videos across {selectedCategories.length} categories
              </Alert>
            )}

            {workflowStatus.stage === 'error' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                ❌ Error: {workflowStatus.error}
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category Selection */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Select Categories</Typography>
            <Button
              variant="outlined"
              startIcon={<Category />}
              onClick={() => setShowCustomDialog(true)}
            >
              Create Custom Category
            </Button>
          </Box>

          <Grid container spacing={2}>
            {PREDEFINED_CATEGORIES.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.name}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedCategories.find(c => c.name === category.name)
                      ? '2px solid #1976d2'
                      : '1px solid #e0e0e0',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {category.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip label={`${category.count} videos`} size="small" />
                      <Chip label={category.style} size="small" />
                      <Chip label={category.voice} size="small" />
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      Topics: {category.topics.slice(0, 2).join(', ')}
                      {category.topics.length > 2 && '...'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedCategories.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Selected Categories</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category.name}
                    label={`${category.name} (${category.count} videos)`}
                    onDelete={() => handleCategorySelect(category)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total videos: {selectedCategories.reduce((sum, cat) => sum + cat.count, 0)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Start Workflow Button */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          onClick={startWorkflow}
          disabled={selectedCategories.length === 0 || workflowStatus.stage !== 'idle'}
          sx={{ px: 4, py: 2 }}
        >
          Start Workflow Generation
        </Button>
      </Box>

      {/* Results */}
      {workflowStatus.results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Generated Videos</Typography>
            <List>
              {workflowStatus.results.map((result, index) => {
                const extra = videoExtra[result.videoId] || {};
                const videoUrl = `/api/short-video/${result.videoId}`;

                return (
                  <React.Fragment key={result.videoId || index}>
                    <ListItem>
                      <ListItemIcon>
                        <VideoLibrary color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={result.topic}
                        secondary={`Category: ${result.category} | Duration: ${result.duration}s | Status: ${extra.status || 'processing'}`}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Subtitles />}
                          onClick={() => loadAndCopyCaptions(result.videoId)}
                        >
                          Copy Captions
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Tag />}
                          onClick={() => loadAndCopyHashtags(result.topic, result.category, result.videoId)}
                        >
                          Copy Hashtags
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          component="a"
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={extra.status !== 'ready'}
                        >
                          Download
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={async () => {
                            const status = await fetchVideoStatus(result.videoId);
                            if (status === 'ready') {
                              setCopyMessage('Video is ready to download.');
                              setTimeout(() => setCopyMessage(''), 3000);
                            }
                          }}
                        >
                          Refresh status
                        </Button>
                      </Box>
                    </ListItem>
                    {extra.captions && (
                      <Box sx={{ p: 2, backgroundColor: '#f8f8f8', width: '100%', wordBreak: 'break-word' }}>
                        <Typography variant="subtitle2">Captions</Typography>
                        <Typography variant="body2">{extra.captions}</Typography>
                      </Box>
                    )}
                    {extra.hashtags && (
                      <Box sx={{ p: 2, backgroundColor: '#f0f4ff', width: '100%', wordBreak: 'break-word' }}>
                        <Typography variant="subtitle2">Hashtags</Typography>
                        <Typography variant="body2">{extra.hashtags.join(' ')}</Typography>
                      </Box>
                    )}

                    {index < workflowStatus.results.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
            {copyMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {copyMessage}
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Category Dialog */}
      <Dialog open={showCustomDialog} onClose={() => setShowCustomDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Custom Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={customCategory.name}
                onChange={(e) => setCustomCategory(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={customCategory.description}
                onChange={(e) => setCustomCategory(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Style</InputLabel>
                <Select
                  value={customCategory.style}
                  onChange={(e) => setCustomCategory(prev => ({ ...prev, style: e.target.value }))}
                >
                  <MenuItem value="Problem-Solution">Problem-Solution</MenuItem>
                  <MenuItem value="Myth-Truth">Myth-Truth</MenuItem>
                  <MenuItem value="Tutorial">Tutorial</MenuItem>
                  <MenuItem value="Motivation">Motivation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Voice</InputLabel>
                <Select
                  value={customCategory.voice}
                  onChange={(e) => setCustomCategory(prev => ({ ...prev, voice: e.target.value }))}
                >
                        <MenuItem value="af_heart">AF Heart</MenuItem>
                  <MenuItem value="af_nova">AF Nova</MenuItem>
                  <MenuItem value="bf_emma">BF Emma</MenuItem>
                  <MenuItem value="bf_lily">BF Lily</MenuItem>
                  <MenuItem value="bm_george">BM George</MenuItem>
                  <MenuItem value="bm_daniel">BM Daniel</MenuItem>
                  <MenuItem value="am_liam">AM Liam</MenuItem>
                  <MenuItem value="am_eric">AM Eric</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Video Count"
                value={customCategory.count}
                onChange={(e) => setCustomCategory(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                inputProps={{ min: 1, max: 20 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Topic"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                />
                <Button variant="contained" onClick={addTopic}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {customCategory.topics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => removeTopic(topic)}
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCustomCategorySubmit}
            variant="contained"
            disabled={!customCategory.name || customCategory.topics.length === 0}
          >
            Create Category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowGenerator;