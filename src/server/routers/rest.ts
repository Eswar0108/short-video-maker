import express from "express";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import fs from "fs-extra";
import path from "path";

import { validateCreateShortInput } from "../validator";
import { ShortCreator } from "../../short-creator/ShortCreator";
import { logger } from "../../logger";
import { Config } from "../../config";
import { generateScript, getTrendingTopics } from "../utils/scriptGenerator";
import type { VoiceEnum, MusicMoodEnum, CaptionPositionEnum, MusicVolumeEnum, OrientationEnum } from "../../types/shorts";
import { VoiceEnum as VoiceEnumValues, MusicMoodEnum as MusicMoodEnumValues, CaptionPositionEnum as CaptionPositionEnumValues, MusicVolumeEnum as MusicVolumeEnumValues, OrientationEnum as OrientationEnumValues } from "../../types/shorts";

// Utility function to generate hashtags
function generateHashtags(topic: string, category: string): string[] {
  const baseHashtags = [
    '#Shorts', '#Viral', '#TikTok', '#Instagram', '#YouTubeShorts',
    '#Learn', '#Tips', '#Hacks', '#Tutorial', '#Guide'
  ];

  const categoryHashtags: Record<string, string[]> = {
    'Productivity': ['#Productivity', '#TimeManagement', '#Focus', '#Efficiency', '#WorkHacks'],
    'Health & Fitness': ['#Health', '#Fitness', '#Wellness', '#Workout', '#HealthyLiving'],
    'Technology': ['#Tech', '#Technology', '#AI', '#Innovation', '#Digital'],
    'Business': ['#Business', '#Entrepreneur', '#Success', '#Money', '#Marketing'],
    'Lifestyle': ['#Lifestyle', '#LifeHacks', '#DailyLife', '#Motivation', '#Inspiration']
  };

  const topicWords = topic.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 2)
    .map(word => `#${word.charAt(0).toUpperCase() + word.slice(1)}`);

  const categoryTags = categoryHashtags[category] || ['#Content'];

  return [...baseHashtags.slice(0, 3), ...categoryTags.slice(0, 3), ...topicWords.slice(0, 2)];
}

// todo abstract class
export class APIRouter {
  public router: express.Router;
  private shortCreator: ShortCreator;
  private config: Config;

  constructor(config: Config, shortCreator: ShortCreator) {
    this.config = config;
    this.router = express.Router();
    this.shortCreator = shortCreator;

    this.router.use(express.json());

    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/short-video",
      async (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const input = validateCreateShortInput(req.body);

          logger.info({ input }, "Creating short video");

          const videoId = this.shortCreator.addToQueue(
            input.scenes,
            input.config,
          );

          res.status(201).json({
            videoId,
          });
        } catch (error: unknown) {
          logger.error(error, "Error validating input");

          // Handle validation errors specifically
          if (error instanceof Error && error.message.startsWith("{")) {
            try {
              const errorData = JSON.parse(error.message);
              res.status(400).json({
                error: "Validation failed",
                message: errorData.message,
                missingFields: errorData.missingFields,
              });
              return;
            } catch (parseError: unknown) {
              logger.error(parseError, "Error parsing validation error");
            }
          }

          // Fallback for other errors
          res.status(400).json({
            error: "Invalid input",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },
    );

    this.router.get(
      "/short-video/:videoId/status",
      async (req: ExpressRequest, res: ExpressResponse) => {
        const { videoId } = req.params;
        if (!videoId) {
          res.status(400).json({
            error: "videoId is required",
          });
          return;
        }
        const status = this.shortCreator.status(videoId);
        res.status(200).json({
          status,
        });
      },
    );

    this.router.get(
      "/music-tags",
      (req: ExpressRequest, res: ExpressResponse) => {
        res.status(200).json(this.shortCreator.ListAvailableMusicTags());
      },
    );

    this.router.get("/voices", (req: ExpressRequest, res: ExpressResponse) => {
      res.status(200).json(this.shortCreator.ListAvailableVoices());
    });

    this.router.get(
      "/short-videos",
      (req: ExpressRequest, res: ExpressResponse) => {
        const videos = this.shortCreator.listAllVideos();
        res.status(200).json({
          videos,
        });
      },
    );

    this.router.delete(
      "/short-video/:videoId",
      (req: ExpressRequest, res: ExpressResponse) => {
        const { videoId } = req.params;
        if (!videoId) {
          res.status(400).json({
            error: "videoId is required",
          });
          return;
        }
        this.shortCreator.deleteVideo(videoId);
        res.status(200).json({
          success: true,
        });
      },
    );

    this.router.get(
      "/tmp/:tmpFile",
      (req: ExpressRequest, res: ExpressResponse) => {
        const { tmpFile } = req.params;
        if (!tmpFile) {
          res.status(400).json({
            error: "tmpFile is required",
          });
          return;
        }
        const tmpFilePath = path.join(this.config.tempDirPath, tmpFile);
        if (!fs.existsSync(tmpFilePath)) {
          res.status(404).json({
            error: "tmpFile not found",
          });
          return;
        }

        if (tmpFile.endsWith(".mp3")) {
          res.setHeader("Content-Type", "audio/mpeg");
        }
        if (tmpFile.endsWith(".wav")) {
          res.setHeader("Content-Type", "audio/wav");
        }
        if (tmpFile.endsWith(".mp4")) {
          res.setHeader("Content-Type", "video/mp4");
        }

        const tmpFileStream = fs.createReadStream(tmpFilePath);
        tmpFileStream.on("error", (error) => {
          logger.error(error, "Error reading tmp file");
          res.status(500).json({
            error: "Error reading tmp file",
            tmpFile,
          });
        });
        tmpFileStream.pipe(res);
      },
    );

    this.router.get(
      "/music/:fileName",
      (req: ExpressRequest, res: ExpressResponse) => {
        const { fileName } = req.params;
        if (!fileName) {
          res.status(400).json({
            error: "fileName is required",
          });
          return;
        }
        const musicFilePath = path.join(this.config.musicDirPath, fileName);
        if (!fs.existsSync(musicFilePath)) {
          res.status(404).json({
            error: "music file not found",
          });
          return;
        }
        const musicFileStream = fs.createReadStream(musicFilePath);
        musicFileStream.on("error", (error) => {
          logger.error(error, "Error reading music file");
          res.status(500).json({
            error: "Error reading music file",
            fileName,
          });
        });
        musicFileStream.pipe(res);
      },
    );

    this.router.get(
      "/short-video/:videoId",
      (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const { videoId } = req.params;
          if (!videoId) {
            res.status(400).json({
              error: "videoId is required",
            });
            return;
          }
          const video = this.shortCreator.getVideo(videoId);
          res.setHeader("Content-Type", "video/mp4");
          res.setHeader(
            "Content-Disposition",
            `inline; filename=${videoId}.mp4`,
          );
          res.send(video);
        } catch (error: unknown) {
          logger.error(error, "Error getting video");
          res.status(404).json({
            error: "Video not found",
          });
        }
      },
    );

    // Trending topics endpoint
    this.router.get(
      "/trending-topics",
      (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const count = parseInt(req.query.count as string) || 10;
          const topics = getTrendingTopics(count);
          res.status(200).json(topics);
        } catch (error: unknown) {
          logger.error(error, "Error fetching trending topics");
          res.status(500).json({
            error: "Failed to fetch trending topics",
          });
        }
      },
    );

    // Bulk generate endpoint
    this.router.post(
      "/bulk-generate",
      async (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const {
            topic,
            style = "Problem-Solution",
            voice = VoiceEnumValues.af_nova,
            music = "hopeful",
            minDuration = 30000,
          } = req.body;

          if (!topic) {
            res.status(400).json({
              error: "topic is required",
            });
            return;
          }

          // Generate script from topic
          const scriptData = generateScript({
            topic,
            style: style as "Problem-Solution" | "Myth-Truth" | "Tutorial" | "Motivation",
            minDuration,
          });

          // Create config for video
          const config: {
            orientation: OrientationEnum;
            music: MusicMoodEnum;
            musicVolume: MusicVolumeEnum;
            captionPosition: CaptionPositionEnum;
            voice: VoiceEnum;
            paddingBack: number;
          } = {
            orientation: OrientationEnumValues.portrait,
            music: music as MusicMoodEnum,
            musicVolume: MusicVolumeEnumValues.high,
            captionPosition: CaptionPositionEnumValues.bottom,
            voice: voice as VoiceEnum,
            paddingBack: 2000,
          };

          // Convert search terms from strings to arrays
          const scenes = scriptData.scenes.map((scene) => ({
            text: scene.text,
            searchTerms: scene.searchTerms,
          }));

          logger.info({ topic, style, scenes }, "Generating bulk video");

          // Add to queue and return video ID
          const videoId = this.shortCreator.addToQueue(scenes, config);

          res.status(201).json({
            id: `bulk-${videoId}`,
            videoId,
            topic,
            style,
          });
        } catch (error: unknown) {
          logger.error(error, "Error in bulk generate");
          res.status(400).json({
            error: "Failed to generate video",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },
    );

    // Workflow endpoints
    this.router.post(
      "/workflow/generate-scripts",
      async (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const { category, topics, style = "Problem-Solution", count = 5 } = req.body;

          if (!category || !topics || !Array.isArray(topics) || topics.length === 0) {
            res.status(400).json({
              error: "category and topics array are required",
            });
            return;
          }

          logger.info({ category, topics, style, count }, "Generating workflow scripts");

          // Generate scripts for each topic
          const scripts = topics.slice(0, count).map((topic: string) => {
            const scriptData = generateScript({
              topic,
              style: style as "Problem-Solution" | "Myth-Truth" | "Tutorial" | "Motivation",
              minDuration: 30000,
            });

            return {
              topic,
              category,
              style,
              scenes: scriptData.scenes,
              searchTerms: scriptData.scenes.flatMap(scene => scene.searchTerms),
            };
          });

          res.status(200).json(scripts);
        } catch (error: unknown) {
          logger.error(error, "Error generating workflow scripts");
          res.status(500).json({
            error: "Failed to generate scripts",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },
    );

    this.router.post(
      "/workflow/generate-video",
      async (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const { script, voice = VoiceEnumValues.af_nova, music = "hopeful", category } = req.body;

          if (!script || !script.scenes) {
            res.status(400).json({
              error: "script with scenes is required",
            });
            return;
          }

          // Validate voice and map friendly names to valid voices
          const voiceMap: Record<string, VoiceEnum> = {
            'male-professional': VoiceEnumValues.bm_george,
            'female-energetic': VoiceEnumValues.bf_emma,
            'male-tech': VoiceEnumValues.am_liam,
            'female-friendly': VoiceEnumValues.bf_lily,
            'default': VoiceEnumValues.af_nova,
          };

          const resolvedVoice =
            (voice && (VoiceEnumValues as any)[voice]) ||
            (voiceMap as any)[voice] ||
            VoiceEnumValues.af_nova;

          // Create config for video
          const config: {
            orientation: OrientationEnum;
            music: MusicMoodEnum;
            musicVolume: MusicVolumeEnum;
            captionPosition: CaptionPositionEnum;
            voice: VoiceEnum;
            paddingBack: number;
          } = {
            orientation: OrientationEnumValues.portrait,
            music: (music as MusicMoodEnum),
            musicVolume: MusicVolumeEnumValues.high,
            captionPosition: CaptionPositionEnumValues.bottom,
            voice: resolvedVoice,
            paddingBack: 2000,
          };

          // Convert scenes to proper format
          const scenes = script.scenes.map((scene: any) => ({
            text: scene.text,
            searchTerms: scene.searchTerms,
          }));

          logger.info({ topic: script.topic, category, voice, music }, "Generating workflow video");

          // Add to queue and return video ID
          const videoId = this.shortCreator.addToQueue(scenes, config);

          // Generate captions and hashtags
          const captions = scenes.map((scene: any, index: number) => ({
            timestamp: index * 5, // Approximate timestamp
            text: scene.text,
            duration: 5,
          }));

          const hashtags = generateHashtags(script.topic, category);

          res.status(201).json({
            id: `workflow-${videoId}`,
            videoId,
            topic: script.topic,
            category,
            voice,
            music,
            duration: scenes.length * 5, // Approximate duration
            captions,
            hashtags,
          });
        } catch (error: unknown) {
          logger.error(error, "Error generating workflow video");
          res.status(500).json({
            error: "Failed to generate video",
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },
    );

    // Get captions for a video
    this.router.get(
      "/video/:videoId/captions",
      (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const { videoId } = req.params;
          if (!videoId) {
            res.status(400).json({
              error: "videoId is required",
            });
            return;
          }

          // For now, return mock captions - in a real implementation,
          // you'd extract these from the video generation process
          const mockCaptions = [
            { timestamp: 0, text: "Welcome to this amazing video!", duration: 3 },
            { timestamp: 3, text: "Let's dive into the topic", duration: 2 },
            { timestamp: 5, text: "Here's what you need to know", duration: 3 },
          ];

          res.status(200).json({
            videoId,
            captions: mockCaptions,
            format: "SRT",
          });
        } catch (error: unknown) {
          logger.error(error, "Error getting captions");
          res.status(500).json({
            error: "Failed to get captions",
          });
        }
      },
    );

    // Get hashtags for a topic
    this.router.get(
      "/hashtags",
      (req: ExpressRequest, res: ExpressResponse) => {
        try {
          const { topic, category } = req.query;

          if (!topic || typeof topic !== 'string') {
            res.status(400).json({
              error: "topic parameter is required",
            });
            return;
          }

          const hashtags = generateHashtags(topic, category as string || 'General');

          res.status(200).json({
            topic,
            category: category || 'General',
            hashtags,
            count: hashtags.length,
          });
        } catch (error: unknown) {
          logger.error(error, "Error generating hashtags");
          res.status(500).json({
            error: "Failed to generate hashtags",
          });
        }
      },
    );
  }
}
