import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tabs,
  TabPanel,
  Tab,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Download,
  Info,
  Edit,
  Visibility,
  Delete,
  ContentCopy,
  AutoAwesome,
} from '@mui/icons-material';
import { useState as useStateCallback } from 'react';

interface Scene {
  text: string;
  searchTerms: string[];
}

interface ScriptTemplate {
  pattern: string;
  description: string;
  examples: string[];
  scenes: (topic: string, hook: string) => Scene[];
}

interface CategoryConfig {
  name: string;
  description: string;
  viralPatterns: string[];
  recommendedVoices: string[];
  recommendedMusic: string[];
  templateCount: number;
}

interface GeneratedVideo {
  id: string;
  topic: string;
  category: string;
  script: Scene[];
  config: any;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  createdAt: string;
  videoUrl?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SCRIPT_TEMPLATES: Record<string, ScriptTemplate> = {
  'Problem-Solution': {
    pattern: 'Problem-Solution',
    description: 'Hook with problem → Present solution → Call to action',
    examples: [
      'Struggling with morning routine? Here\'s the fix...',
      'Too much screen time? Try this trick...',
    ],
    scenes: (topic: string, hook: string) => [
      {
        text: `${hook} [problem statement here].`,
        searchTerms: ['problem', 'issue', 'struggle'],
      },
      {
        text: `Here's the solution: [step 1], [step 2], [step 3].`,
        searchTerms: ['solution', 'fix', 'method'],
      },
      {
        text: `Try this for a week and drop a comment if it worked!`,
        searchTerms: ['results', 'success', 'try'],
      },
    ],
  },
  'Myth-Truth': {
    pattern: 'Myth-Truth',
    description: 'Expose common myth → Reveal truth → Why it matters',
    examples: [
      'Myth: You need 8 hours of sleep. Truth: It depends...',
      'Myth: Cardio burns fat fastest. Truth: Strength training...',
    ],
    scenes: (topic: string, hook: string) => [
      {
        text: `Everyone believes [myth]. But here's the truth...`,
        searchTerms: ['myth', 'misconception', 'belief'],
      },
      {
        text: `The reality is [truth]. Studies show [evidence].`,
        searchTerms: ['truth', 'facts', 'evidence', 'science'],
      },
      {
        text: `This matters because [impact]. Share if you learned something!`,
        searchTerms: ['impact', 'results', 'change'],
      },
    ],
  },
  'Transformation': {
    pattern: 'Transformation',
    description: 'Before state → Process → After state → How to replicate',
    examples: [
      'From beginner to expert in 30 days...',
      'How I lost 20 pounds without gym...',
    ],
    scenes: (topic: string, hook: string) => [
      {
        text: `I used to [before state]. Now I [after state]. Here's how...`,
        searchTerms: ['before', 'journey', 'start'],
      },
      {
        text: `Step 1: [action 1]. Step 2: [action 2]. Step 3: [action 3].`,
        searchTerms: ['process', 'steps', 'method'],
      },
      {
        text: `You can do this too. Start today and tag me in your progress!`,
        searchTerms: ['results', 'success', 'transformation'],
      },
    ],
  },
  'Tutorial-Hacks': {
    pattern: 'Tutorial-Hacks',
    description: 'Hook with outcome → Show technique → Final result',
    examples: [
      '⏱️ 10-minute [skill] hack nobody knows...',
      '💡 One simple trick that changes [outcome]...',
    ],
    scenes: (topic: string, hook: string) => [
      {
        text: `${hook}`,
        searchTerms: ['hack', 'trick', 'shortcut'],
      },
      {
        text: `Here's exactly what to do: [technique details and steps].`,
        searchTerms: ['tutorial', 'how-to', 'guide'],
      },
      {
        text: `That's it! Try it now and let me know your results!`,
        searchTerms: ['results', 'outcome', 'success'],
      },
    ],
  },
  'Story-Based': {
    pattern: 'Story-Based',
    description: 'Personal story → Lesson learned → Apply to viewers',
    examples: [
      'This one moment changed my entire life...',
      'The biggest mistake I made was...',
    ],
    scenes: (topic: string, hook: string) => [
      {
        text: `${hook}`,
        searchTerms: ['story', 'experience', 'journey'],
      },
      {
        text: `What I learned: [lesson 1], [lesson 2], [lesson 3].`,
        searchTerms: ['lesson', 'learning', 'wisdom'],
      },
      {
        text: `You don't have to make the same mistake. Apply this today!`,
        searchTerms: ['advice', 'tip', 'guidance'],
      },
    ],
  },
};

const CATEGORIES: Record<string, CategoryConfig> = {
  Productivity: {
    name: 'Productivity',
    description: 'Time management, focus, habits, routines',
    viralPatterns: ['Problem-Solution', 'Tutorial-Hacks', 'Transformation'],
    recommendedVoices: ['af_nova', 'am_adam', 'bf_isabella'],
    recommendedMusic: ['energetic', 'motivational', 'uplifted'],
    templateCount: 15,
  },
  Fitness: {
    name: 'Fitness',
    description: 'Workouts, nutrition, health, transformation',
    viralPatterns: ['Transformation', 'Tutorial-Hacks', 'Myth-Truth'],
    recommendedVoices: ['am_adam', 'af_sarah', 'bf_charlotte'],
    recommendedMusic: ['motivational', 'energetic', 'uplifted'],
    templateCount: 20,
  },
  Finance: {
    name: 'Finance',
    description: 'Money, investing, budgeting, wealth building',
    viralPatterns: ['Myth-Truth', 'Problem-Solution', 'Story-Based'],
    recommendedVoices: ['am_adam', 'bf_isabella', 'bf_charlotte'],
    recommendedMusic: ['uplifted', 'motivational', 'chill'],
    templateCount: 18,
  },
  Lifestyle: {
    name: 'Lifestyle',
    description: 'Fashion, home, relationships, self-improvement',
    viralPatterns: ['Story-Based', 'Transformation', 'Tutorial-Hacks'],
    recommendedVoices: ['af_nova', 'af_sarah', 'bf_isabella'],
    recommendedMusic: ['chill', 'uplifted', 'happy'],
    templateCount: 25,
  },
  Entertainment: {
    name: 'Entertainment',
    description: 'Reactions, trends, challenges, fun facts',
    viralPatterns: ['Myth-Truth', 'Story-Based', 'Tutorial-Hacks'],
    recommendedVoices: ['af_nova', 'am_michael', 'bf_charlotte'],
    recommendedMusic: ['energetic', 'happy', 'uplifted'],
    templateCount: 30,
  },
  Learning: {
    name: 'Learning',
    description: 'Skills, education, tips, hacks, knowledge',
    viralPatterns: ['Tutorial-Hacks', 'Problem-Solution', 'Myth-Truth'],
    recommendedVoices: ['af_sarah', 'am_michael', 'bf_isabella'],
    recommendedMusic: ['uplifted', 'chill', 'motivational'],
    templateCount: 22,
  },
};

export const ProScriptGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [topic, setTopic] = useState('');
  const [hook, setHook] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Productivity');
  const [selectedPattern, setSelectedPattern] = useState('Problem-Solution');
  const [selectedVoice, setSelectedVoice] = useState('af_nova');
  const [selectedMusic, setSelectedMusic] = useState('energetic');
  const [batchCount, setBatchCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewScript, setPreviewScript] = useState<Scene[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [voices, setVoices] = useState<string[]>([]);
  const [musicMoods, setMusicMoods] = useState<string[]>([]);
  const [statusPolling, setStatusPolling] = useState<string[]>([]);

  // Fetch available voices and music
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [voicesRes, musicRes] = await Promise.all([
          fetch('/api/voices'),
          fetch('/api/music-tags'),
        ]);
        const voicesData = await voicesRes.json();
        const musicData = await musicRes.json();
        setVoices(voicesData);
        setMusicMoods(musicData);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      }
    };
    fetchResources();
  }, []);

  // Poll for video status updates
  useEffect(() => {
    if (statusPolling.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updates = await Promise.all(
          statusPolling.map(videoId =>
            fetch(`/api/short-video/${videoId}/status`).then(r => r.json())
          )
        );

        setGeneratedVideos(prev =>
          prev.map((video, idx) => ({
            ...video,
            status: updates[statusPolling.indexOf(video.id)]?.status || video.status,
          }))
        );

        // Remove completed videos from polling
        const stillPending = statusPolling.filter(
          videoId =>
            generatedVideos.find(v => v.id === videoId)?.status === 'processing'
        );
        setStatusPolling(stillPending);
      } catch (error) {
        console.error('Status poll error:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [statusPolling, generatedVideos]);

  const generatePreview = () => {
    if (!topic) {
      alert('Please enter a topic');
      return;
    }
    if (!hook) {
      alert('Please enter a hook/opening line');
      return;
    }

    const template = SCRIPT_TEMPLATES[selectedPattern];
    if (!template) {
      alert('Invalid pattern selected');
      return;
    }

    const scenes = template.scenes(topic, hook);
    setPreviewScript(scenes);
    setPreviewOpen(true);
  };

  const generateBatchVideos = async () => {
    if (!topic || !hook) {
      alert('Please fill in all details first');
      return;
    }

    setLoading(true);
    const newVideos: GeneratedVideo[] = [];
    const videoIds: string[] = [];

    try {
      for (let i = 0; i < batchCount; i++) {
        const template = SCRIPT_TEMPLATES[selectedPattern];
        const scenes = template.scenes(
          topic,
          i === 0 ? hook : `${hook} (variation ${i + 1})`
        );

        const response = await fetch('/api/short-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenes,
            config: {
              orientation: 'portrait',
              voice: selectedVoice,
              musicMood: selectedMusic,
              captionPosition: 'bottom',
              musicVolume: 0.3,
              paddingBack: 2000,
            },
          }),
        });

        if (!response.ok) throw new Error(`Request ${i + 1} failed`);

        const data = await response.json();
        videoIds.push(data.videoId);

        newVideos.push({
          id: data.videoId,
          topic,
          category: selectedCategory,
          script: scenes,
          config: {
            voice: selectedVoice,
            music: selectedMusic,
          },
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }

      setGeneratedVideos(prev => [...prev, ...newVideos]);
      setStatusPolling(videoIds);
      setTopic('');
      setHook('');
    } catch (error) {
      alert(`Error generating videos: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async (videoId: string) => {
    try {
      const response = await fetch(`/api/short-video/${videoId}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${videoId}.mp4`;
      a.click();
    } catch (error) {
      alert('Failed to download video');
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      await fetch(`/api/short-video/${videoId}`, { method: 'DELETE' });
      setGeneratedVideos(prev => prev.filter(v => v.id !== videoId));
    } catch (error) {
      alert('Failed to delete video');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'processing':
        return 'info';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
          🎬 Pro Script Generator
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Create viral videos with AI-powered scripts, category-based generation, and batch processing
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Script Builder" />
          <Tab label="Category Guides" />
          <Tab label="Generated Videos" icon={<AutoAwesome />} iconPosition="start" />
          <Tab label="Viral Patterns" icon={<Info />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab 1: Script Builder */}
      <CustomTabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {/* Input Form */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📝 Create Your Script
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    label="Category"
                  >
                    {Object.keys(CATEGORIES).map(cat => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Topic"
                  placeholder="e.g., 'Morning Productivity Routine'"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  sx={{ mb: 2 }}
                  multiline
                  rows={2}
                />

                <TextField
                  fullWidth
                  label="Hook (Opening Line)"
                  placeholder="e.g., 'Most people waste 2 hours every morning'"
                  value={hook}
                  onChange={e => setHook(e.target.value)}
                  sx={{ mb: 2 }}
                  multiline
                  rows={2}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Script Pattern</InputLabel>
                  <Select
                    value={selectedPattern}
                    onChange={e => setSelectedPattern(e.target.value)}
                    label="Script Pattern"
                  >
                    {Object.keys(SCRIPT_TEMPLATES).map(pattern => (
                      <MenuItem key={pattern} value={pattern}>
                        {SCRIPT_TEMPLATES[pattern].pattern}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={generatePreview}
                    fullWidth
                  >
                    Preview Script
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={generatePreview}
                    fullWidth
                  >
                    Generate
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Configuration Panel */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  ⚙️ Video Configuration
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Voice</InputLabel>
                  <Select
                    value={selectedVoice}
                    onChange={e => setSelectedVoice(e.target.value)}
                    label="Voice"
                  >
                    {voices.map(voice => (
                      <MenuItem key={voice} value={voice}>
                        {voice}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Music Mood</InputLabel>
                  <Select
                    value={selectedMusic}
                    onChange={e => setSelectedMusic(e.target.value)}
                    label="Music Mood"
                  >
                    {musicMoods.map(mood => (
                      <MenuItem key={mood} value={mood}>
                        {mood}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Batch Count</InputLabel>
                  <Select
                    value={batchCount}
                    onChange={e => setBatchCount(e.target.value as number)}
                    label="Batch Count"
                  >
                    {[1, 3, 5, 10].map(count => (
                      <MenuItem key={count} value={count}>
                        {count} video{count !== 1 ? 's' : ''} (
                        {count === 1
                          ? '~2 min'
                          : count === 3
                          ? '~6 min'
                          : count === 5
                          ? '~10 min'
                          : '~20 min'}
                        )
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="caption">
                    💡 Batch generates {batchCount} videos with slight variations. Each uses the same pattern but
                    different visual content.
                  </Typography>
                </Alert>

                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={generateBatchVideos}
                  disabled={loading || !topic || !hook}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generate Batch'}
                </Button>
              </CardContent>
            </Card>

            {/* Pattern Info */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  ✨ {SCRIPT_TEMPLATES[selectedPattern].pattern}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {SCRIPT_TEMPLATES[selectedPattern].description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* Tab 2: Category Guides */}
      <CustomTabPanel value={activeTab} index={1}>
        <Grid container spacing={2}>
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                    {category.description}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Best Patterns:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {category.viralPatterns.map(pattern => (
                      <Chip key={pattern} label={pattern} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    📊 {category.templateCount}+ template combinations available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>

      {/* Tab 3: Generated Videos */}
      <CustomTabPanel value={activeTab} index={2}>
        {generatedVideos.length === 0 ? (
          <Alert severity="info">No videos generated yet. Create your first script above!</Alert>
        ) : (
          <Grid container spacing={2}>
            {generatedVideos.map(video => (
              <Grid item xs={12} key={video.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{video.topic}</Typography>
                        <Chip
                          label={video.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 1, mt: 1 }}
                        />
                        <Chip
                          label={video.status}
                          size="small"
                          color={getStatusColor(video.status) as any}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {video.status === 'ready' && (
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              onClick={() => downloadVideo(video.id)}
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => deleteVideo(video.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {video.status === 'processing' && <LinearProgress sx={{ mt: 2 }} />}

                    <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                      ID: {video.id} | Created: {new Date(video.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CustomTabPanel>

      {/* Tab 4: Viral Patterns */}
      <CustomTabPanel value={activeTab} index={3}>
        <Grid container spacing={2}>
          {Object.entries(SCRIPT_TEMPLATES).map(([key, template]) => (
            <Grid item xs={12} md={6} key={key}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {template.pattern}
                    </Typography>
                    <Tooltip title="Use this pattern">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedPattern(key);
                          setActiveTab(0);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Examples:
                  </Typography>
                  <List dense>
                    {template.examples.slice(0, 3).map((example, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemText
                          primary={example}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      ✅ Great for creating{' '}
                      <strong>
                        {template.pattern === 'Problem-Solution'
                          ? 'solution-based content'
                          : template.pattern === 'Myth-Truth'
                          ? 'educational & fact-checking'
                          : template.pattern === 'Transformation'
                          ? 'motivational & before-after content'
                          : template.pattern === 'Tutorial-Hacks'
                          ? 'how-to & quick tips'
                          : 'personal & relatable content'}
                      </strong>
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>

      {/* Script Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📋 Script Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {previewScript.map((scene, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Scene {idx + 1}:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2">{scene.text}</Typography>
                </Paper>
                <Typography variant="caption" color="textSecondary">
                  Search terms: {scene.searchTerms.join(', ')}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setPreviewOpen(false);
              generateBatchVideos();
            }}
            disabled={loading}
          >
            Start Generation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProScriptGenerator;
