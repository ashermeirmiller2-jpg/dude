#!/usr/bin/env python3
"""
Transcribe Simcha series files using Gemini Flash via OpenRouter.
Reads raw transcriptions from Google Drive, cleans them into Hebrew+English output,
and saves results back to Google Drive.
"""

import os
import json
import time
import urllib.request
import urllib.error

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
MODEL = "google/gemini-flash-1.5"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Simcha series: (title, txt_drive_id)
SIMCHA_FILES = [
    ("Simcha Part One - The essence of joy - Adar 1 5782", "193uEiyKNoF8cQsJsEOPFdsyXvx0JGcFH"),
    ("Simcha Part Two - To serve Him with joy - Adar 1 5782", "11hdsX0mHf7HP4XcVNuZpgw4iav9ejcem"),
    ("Simcha Part Three - Joy of life - Adar 1 5782", "1yzH8lduqg3zyb2zlUSViF8KMn0lFY2uI"),
    ("Simcha Part Four - Happy Eyes - Adar 1 5782", "1bcGgeyOIQmKyMUrk-Ojl0AM748A_1Vj8"),
    ("Simcha Part Five - Resolution of doubt Vol 1 - Adar 1 5782", "1RS_nPtZ8GnELr6hPfIrD_ormh1a7vJzp"),
    ("Simcha Part Six - Resolution of doubt Vol 2 - Adar 2 5782", "1bDhk4vAdeUNq0snz6T5SdhKqtcniwpQi"),
    ("Simcha Part Seven - Joy that lasts - Adar 2 5782", "1jJ5VHuJGmtEus6TL0cVW0PSjTHUCijPW"),
]

SYSTEM_PROMPT = """You are a skilled bilingual editor specializing in Jewish Torah content.
You will receive a raw auto-transcription of a Torah lecture that mixes English and Hebrew.

Your task:
1. Clean up the transcription - fix obvious errors, improve readability, correct punctuation.
2. Hebrew words and phrases must be written in Hebrew script (not transliteration).
   For example: "Simcha" → שמחה, "Torah" → תורה, "Hashem" → ה', "Avodah" → עבודה, etc.
3. Keep the English portions in clear, readable English.
4. Format the output as a clean, flowing transcript with paragraph breaks where natural.
5. At the top, add a bilingual title: the English title and its Hebrew equivalent.
6. Do NOT add commentary or explanations — only clean up what is there.

Output format:
- Start with: [English Title] | [Hebrew Title]
- Then the cleaned bilingual transcript
- Hebrew phrases should appear inline within the English flow (do not separate into columns)
"""


def call_openrouter(text: str, title: str) -> str:
    prompt = f"Title: {title}\n\nRaw transcript:\n\n{text}"
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.3,
        "max_tokens": 8192,
    }).encode("utf-8")

    req = urllib.request.Request(
        OPENROUTER_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/ashermeirmiller2-jpg/dude",
            "X-Title": "Simcha Transcription",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]


def read_drive_file(file_id: str) -> str:
    """Read a plain text file from Google Drive via its export/download URL."""
    url = f"https://www.googleapis.com/drive/v3/files/{file_id}?alt=media"
    # We rely on the MCP credentials being in the environment — but for a standalone
    # script we fall back to reading pre-downloaded files from ./drive_cache/
    cache_path = f"./drive_cache/{file_id}.txt"
    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            return f.read()
    raise FileNotFoundError(f"File {file_id} not in cache. Run fetch_drive_files.py first.")


def main():
    os.makedirs("./drive_cache", exist_ok=True)
    os.makedirs("./output", exist_ok=True)

    for title, file_id in SIMCHA_FILES:
        print(f"\n{'='*60}")
        print(f"Processing: {title}")
        print(f"{'='*60}")

        cache_path = f"./drive_cache/{file_id}.txt"
        if not os.path.exists(cache_path):
            print(f"  [SKIP] No cached content for {file_id}. Run fetch first.")
            continue

        with open(cache_path, "r", encoding="utf-8") as f:
            raw_text = f.read().strip()

        if not raw_text:
            print("  [SKIP] Empty file.")
            continue

        print(f"  Input: {len(raw_text)} chars")
        print(f"  Sending to {MODEL} via OpenRouter...")

        try:
            cleaned = call_openrouter(raw_text, title)
            out_path = f"./output/{title}.txt"
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(cleaned)
            print(f"  Saved → {out_path}")
            print(f"  Output preview:\n{cleaned[:300]}...")
        except Exception as e:
            print(f"  [ERROR] {e}")

        time.sleep(2)  # rate limiting


if __name__ == "__main__":
    main()
