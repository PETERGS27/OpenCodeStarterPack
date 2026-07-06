---
name: web-extract
description: Extract content from web pages and YouTube videos with transcription — save to vault
---

## What it does

Takes a URL (web page or YouTube) or a local video/audio file, extracts the content, transcribes if needed, analyzes it, and saves it as a formatted note in the vault. Can process a single URL or the entire reading list.

## When to use

- User shares a link to save in the vault
- User shares a YouTube link — check for subtitles first (`yt-dlp --list-subs`), if available download them, otherwise transcribe via Whisper
- User provides a local video/audio file — transcribe via Whisper
- On command **"process reading list"** — read `INDEXES/Reading List.md`, process all URLs one by one, remove processed links

## Available tools

- **webfetch** — fetch web page content as markdown
- **yt-dlp** — download YouTube audio and check/list subtitles
- **whisper** — local AI transcription (model `large-v3`)
- **ffmpeg** — extract audio from video files
- **obsidian_vault_read** — read vault files
- **obsidian_vault_write** — create/update vault files
- **obsidian_vault_patch** — surgical edits

## Algorithm

### 0. If command is "process reading list"

- Read `INDEXES/Reading List.md` via `obsidian_vault_read`
- Extract all lines containing URLs (http://, https://)
- For each URL run steps 1-5
- After each successful URL — remove its line from the file

### 0a. If command is "transcribe: <filename>"

- Full path: `INBOX/RAW/<filename>`
- Detect format: video (mp4, mov, mkv, avi, webm) or audio (mp3, wav, m4a, ogg, flac)
- If file does not exist — report error and exit
- Go to step 3 (transcription) for local file

### 0b. If local file provided directly

- Detect format
- Skip step 2 (content extraction) — go directly to step 3

### 1. Determine content type

- URL contains `youtube.com/watch`, `youtu.be`, `youtube.com/embed`, `youtube.com/shorts` → **YouTube**
- Local file → **Local file**
- Otherwise → **Web page**

### 2. Extract content

**For web page:**
- Use `webfetch` with format `markdown`
- Extract: title, author (if any), main content
- Clean: remove ads, navigation, sidebars, footers — keep only informational text

**For YouTube:**
- Get title, author, and language via oEmbed: `curl -s "https://www.youtube.com/oembed?url=URL&format=json"`
- Extract video ID from URL
- Check subtitles via `yt-dlp --list-subs "URL"`
  - If subtitles exist (ru/en) — download: `yt-dlp --write-auto-subs --sub-langs ru,ru-orig,en --skip-download --convert-subs srt "URL" -o "/tmp/yt_SUBS_VIDEO_ID" --quiet`
  - Clean SRT: `awk '!/^[0-9]+$|^[0-9]{2}:[0-9]{2}:/ && NF' /tmp/yt_SUBS_VIDEO_ID.ru.srt | awk '!seen[$0]++' > /tmp/yt_SUBS_VIDEO_ID.txt`
  - Read result: `/tmp/yt_SUBS_VIDEO_ID.txt`
  - If no subtitles — go to step 2a (Whisper)

#### 2a. YouTube transcription via Whisper

Only if no subtitles are available:

1. Download audio: `yt-dlp -x --audio-format wav "URL" -o "/tmp/yt_audio_VIDEO_ID.wav" --quiet`
2. Transcribe: `whisper "/tmp/yt_audio_VIDEO_ID.wav" --model large-v3 --language ru --output_dir /tmp/ --output_format txt --verbose False`
3. Read result: `/tmp/yt_audio_VIDEO_ID.txt`
4. Clean temp files: `rm -f /tmp/yt_audio_VIDEO_ID.* /tmp/yt_SUBS_VIDEO_ID.*`

**For local file:**
- If video (mp4, mov, mkv, etc.) — extract audio: `ffmpeg -i "<path>" -vn -acodec pcm_s16le -ar 16000 -ac 1 "/tmp/loc_audio.wav" -y -loglevel error`
- If audio — use directly
- Transcribe: `whisper "/tmp/loc_audio.wav" --model large-v3 --language ru --output_dir /tmp/ --output_format txt --verbose False`
- Read result: `/tmp/loc_audio.txt`
- Cleanup

### 3. Analyze

- Understand the topic and key concepts
- Find connections to existing vault topics (search via `obsidian_search_query` by keywords)
- Structure: identify main sections/ideas

### 4. Create note

**Path:** `INBOX/AI_READED/<name>.md`

**Name:** Based on page title, video title, or original filename

**Frontmatter:**
```yaml
---
Source: <full URL or file path>
Date: <YYYY-MM-DD>
Author: <author or channel name>
Tags: <comma-separated tags>
---
```

**Content:**
- For web page — cleaned markdown text
- For YouTube — transcription with source attribution
- For local file — full transcription
- At the end — section `## Related Notes` with `[[wikilinks]]` to relevant vault pages

### 5. Remove processed link

- Read current `INDEXES/Reading List.md`
- Remove the line containing the processed URL
- Write file back
- If no links remain — set status to completed

### 6. Report

- Which URLs were processed
- Which notes were created
- Which tags and connections were established
- Processing duration if transcription took long
