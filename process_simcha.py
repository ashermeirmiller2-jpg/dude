#!/usr/bin/env python3
"""
Process Simcha lecture transcripts using Gemini Flash via OpenRouter.
Cleans raw transcriptions into bilingual Hebrew/English output,
then saves results back to Google Drive as Google Docs.
"""

import json
import os
import time
import urllib.request
import urllib.error

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
MODEL = "google/gemini-flash-1.5"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT = """You are a skilled bilingual editor specializing in Jewish Torah content (shiurim/lectures).
You will receive a raw auto-transcription of a Torah lecture that mixes English and Hebrew/Yiddish words and phrases.

Your task:
1. Clean up the transcription — fix obvious errors, improve readability, add proper punctuation and paragraph breaks.
2. Hebrew and Yiddish words/phrases must appear in Hebrew script, NOT in transliteration.
   Examples of conversions needed:
   - Simcha → שִׂמְחָה  |  Torah → תּוֹרָה  |  Hashem → ה'  |  Mitzvah → מִצְוָה
   - Avodah → עֲבוֹדָה  |  Emunah → אֱמוּנָה  |  Bitachon → בִּטָּחוֹן
   - Yetzer Hara → יֵצֶר הָרַע  |  Tzaddik → צַדִּיק  |  Talmid → תַּלְמִיד
   - Gemara → גְּמָרָא  |  Pasuk → פָּסוּק  |  Chazal → חֲזַ"ל
   - Baruch Hashem → בָּרוּךְ ה'  |  Bezras Hashem → בְּעֶזְרַת ה'
   - Keep actual Hebrew/Yiddish quotations in Hebrew script
3. Keep the main lecture flow in English — only convert Hebrew/Yiddish terms to Hebrew script inline.
4. Format with clear paragraphs. Use line breaks between major ideas.
5. At the very top, add a bilingual header: English title on one line, Hebrew equivalent below it.
6. Do NOT add commentary, summaries, or explanations — only clean the existing content.
7. Preserve the speaker's voice and all content.

Output structure:
[English Title]
[Hebrew Title]
---
[Cleaned bilingual transcript with Hebrew terms in Hebrew script inline within English text]
"""


def call_openrouter(text: str, title: str) -> str:
    prompt = f"Title: {title}\n\nRaw transcript to clean:\n\n{text}"
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
        "max_tokens": 8192,
    }).encode("utf-8")

    req = urllib.request.Request(
        OPENROUTER_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/ashermeirmiller2-jpg/dude",
            "X-Title": "Simcha Torah Transcription",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    if "error" in data:
        raise RuntimeError(f"API error: {data['error']}")
    return data["choices"][0]["message"]["content"]


# All 7 parts with their content
PARTS = [
    {
        "title": "Simcha Part One - The Essence of Joy - Adar 1 5782",
        "content": open("/home/user/dude/drive_cache/193uEiyKNoF8cQsJsEOPFdsyXvx0JGcFH.txt").read(),
    },
]

# We'll load the rest from files if they exist
import os

FILE_MAP = {
    "Simcha Part Two - To Serve Him with Joy - Adar 1 5782": "11hdsX0mHf7HP4XcVNuZpgw4iav9ejcem",
    "Simcha Part Three - Joy of Life - Adar 1 5782": "1yzH8lduqg3zyb2zlUSViF8KMn0lFY2uI",
    "Simcha Part Four - Happy Eyes - Adar 1 5782": "1bcGgeyOIQmKyMUrk-Ojl0AM748A_1Vj8",
    "Simcha Part Five - Resolution of Doubt Vol 1 - Adar 1 5782": "1RS_nPtZ8GnELr6hPfIrD_ormh1a7vJzp",
    "Simcha Part Six - Resolution of Doubt Vol 2 - Adar 2 5782": "1bDhk4vAdeUNq0snz6T5SdhKqtcniwpQi",
    "Simcha Part Seven - Joy that Lasts - Adar 2 5782": "1jJ5VHuJGmtEus6TL0cVW0PSjTHUCijPW",
}

for title, fid in FILE_MAP.items():
    path = f"/home/user/dude/drive_cache/{fid}.txt"
    if os.path.exists(path):
        PARTS.append({"title": title, "content": open(path).read()})


def main():
    os.makedirs("/home/user/dude/output", exist_ok=True)

    for part in PARTS:
        title = part["title"]
        content = part["content"].strip()
        print(f"\n{'='*60}")
        print(f"Processing: {title}")
        print(f"Input length: {len(content)} chars")

        try:
            result = call_openrouter(content, title)
            out_path = f"/home/user/dude/output/{title}.txt"
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(result)
            print(f"✓ Saved: {out_path}")
            print(f"Preview:\n{result[:400]}\n...")
        except Exception as e:
            print(f"✗ Error: {e}")

        time.sleep(3)


if __name__ == "__main__":
    main()
