Drop the session video here as `our-story.mp4`.

No poster image is used — the video's own first frame is what shows before
playback, so make sure the clip opens on a frame worth looking at.

Encode for web before committing:
  ffmpeg -i input.mp4 -vf "scale=-2:1280" -c:v libx264 -crf 26 -preset slow \
         -profile:v high -pix_fmt yuv420p -movflags +faststart -an our-story.mp4

  -an                   strips audio (it autoplays muted, so audio is dead weight)
  -movflags +faststart  moves the index to the front so playback can start
                        before the whole file has downloaded

GitHub warns at 50MB per file and rejects at 100MB. Keep it well under.

If the clip is landscape rather than portrait, set `video.aspect` in
lib/storyContent.ts to "16 / 9" so the sides don't get cropped.
