# Render Environment Setup

## Required System Dependencies

| Dependency             | Purpose                              | Install (Ubuntu/Debian)                     |
|------------------------|--------------------------------------|---------------------------------------------|
| Node.js v22+           | Remotion runtime                     | `nvm install 22` or see `.nvmrc`            |
| Python 3.10+           | Voiceover generation scripts         | Usually pre-installed                       |
| ffmpeg                 | Audio processing (pydub)             | `sudo apt-get install ffmpeg`               |
| fonts-noto-color-emoji | Emoji rendering in headless Chromium | `sudo apt-get install fonts-noto-color-emoji` |

## Python Packages

```bash
pip install edge-tts pydub
```

## Full Setup (one-liner for CI/Docker)

```bash
sudo apt-get update && sudo apt-get install -y fonts-noto-color-emoji ffmpeg && fc-cache -f && npm install && pip install edge-tts pydub
```

## Docker / CI Notes

If running renders in Docker or CI pipelines, the Dockerfile must include:

```dockerfile
RUN apt-get update && apt-get install -y \
    fonts-noto-color-emoji \
    ffmpeg \
    && fc-cache -f \
    && rm -rf /var/lib/apt/lists/*
```

## Verification

After setup, verify everything works:

```bash
# Check Node.js
node --version   # should be v22+

# Check Python deps
python3 -c "import edge_tts; import pydub; print('OK')"

# Check ffmpeg
ffmpeg -version | head -1

# Check emoji font
fc-list | grep -i "noto color emoji"

# Test render (renders 6 frames)
npx remotion render src/index.js LLMReel --frames=0-5 --output=out/test.mp4
```

## Common Environment Issues

### `GLIBC` errors on older Linux

Remotion requires a recent Chromium, which needs glibc >= 2.28. Use Ubuntu 20.04+ or Debian 11+.

### Render fails in WSL with no display

Remotion uses headless Chromium — no display/X server needed. If you see display errors, ensure you're using Remotion v4+ which defaults to headless mode.

### Out of memory during render

Reduce concurrency: `npx remotion render ... --concurrency=1`. Default concurrency uses all CPU cores, which may exhaust memory for 1080x1920 frames.
