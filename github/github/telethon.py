import re
import json
import os
from datetime import datetime
from telethon import TelegramClient
from dotenv import load_dotenv

# Load env
load_dotenv()

API_ID = int(os.getenv("API_ID"))
API_HASH = os.getenv("API_HASH")
PHONE = os.getenv("PHONE")

CHANNEL = "github_repos"

START_DATE = datetime(2026, 4, 1)
END_DATE = datetime(2026, 4, 24, 23, 59, 59)

OUTPUT_FILE = "repos.js"

GITHUB_REGEX = r"https://github\.com/([\w\-\.]+)/([\w\-\.]+)"
TAG_REGEX = r"#(\w+)"

def format_date(dt):
    return dt.strftime("%d %B %Y")

def categorize(tags):
    tags = [t.lower() for t in tags]

    if "ai" in tags or "ml" in tags:
        return "ai"
    if "security" in tags or "hack" in tags:
        return "security"
    if "web" in tags or "frontend" in tags:
        return "web"
    return "dev"

async def main():
    client = TelegramClient("session", API_ID, API_HASH)
    await client.start(phone=PHONE)

    print("[+] Connected")

    repos = []
    seen = set()

    async for message in client.iter_messages(CHANNEL):
        if not message.text:
            continue

        msg_date = message.date.replace(tzinfo=None)

        if msg_date < START_DATE:
            break
        if msg_date > END_DATE:
            continue

        text = message.text

        matches = re.findall(GITHUB_REGEX, text)
        if not matches:
            continue

        for owner, repo in matches:
            repo_name = f"{owner}/{repo}"

            if repo_name in seen:
                continue
            seen.add(repo_name)

            github_url = f"https://github.com/{repo_name}"

            tags = re.findall(TAG_REGEX, text)

            # Clean description
            desc = re.sub(GITHUB_REGEX, "", text)
            desc = re.sub(TAG_REGEX, "", desc).strip()
            desc = desc.split("\n")[0]  # first line only

            repo_data = {
                "owner": owner,
                "name": repo,
                "url": github_url,
                "cat": categorize(tags),
                "desc": desc if desc else "No description available",
                "language": None,
                "topics": tags if tags else [],
                "updated": format_date(msg_date),
                "isNew": (END_DATE - msg_date).days <= 3
            }

            repos.append(repo_data)

    # Sort newest first
    repos.sort(key=lambda x: x["updated"], reverse=True)

    # Save as JS file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("export const repos = ")
        json.dump(repos, f, indent=4)

    print(f"[+] Saved {len(repos)} repos to {OUTPUT_FILE}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())