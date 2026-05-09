#!/usr/bin/env python3
"""
GitHub Trending Projects CLI Tool — v3.0
New in v3: Persistent seen-projects history with deduplication.
Every run saves results and skips already-seen projects on next run.

Usage:
    python github_trending.py
    python github_trending.py --language python --since weekly
    python github_trending.py --search "machine learning"
    python github_trending.py --search hacking -l python --stars 1000
    python github_trending.py --search devops --export json
    python github_trending.py --history           # view seen projects
    python github_trending.py --clear-history     # reset seen list
    python github_trending.py --no-skip           # show all (ignore history)

Author: DevSpireHub
"""

import argparse
import csv
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import quote_plus

import requests
from bs4 import BeautifulSoup

# ─────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────
GITHUB_TRENDING_URL  = "https://github.com/trending"
GITHUB_SEARCH_API    = "https://api.github.com/search/repositories"
CACHE_DIR            = Path(".github_trending_cache")
HISTORY_FILE         = Path(".github_trending_cache") / "seen_projects.json"
OUTPUT_DIR           = Path("github_trending_output")
CACHE_EXPIRY_MINUTES = 30

SUPPORTED_LANGUAGES = [
    "python", "javascript", "typescript", "go", "rust",
    "java", "c", "c++", "c#", "html", "css", "ruby",
    "kotlin", "swift", "php", "shell", "dart", "r",
]

SINCE_OPTIONS = ["daily", "weekly", "monthly"]
SORT_OPTIONS  = ["stars", "forks", "updated", "help-wanted-issues"]

TECH_PRESETS = {
    "ai":          "artificial intelligence machine learning",
    "ml":          "machine learning deep learning",
    "security":    "cybersecurity ethical hacking penetration testing",
    "hacking":     "ethical hacking security tools exploit",
    "web":         "web development frontend backend",
    "devops":      "devops docker kubernetes CI/CD",
    "networking":  "networking protocols packet analysis",
    "blockchain":  "blockchain cryptocurrency smart contracts",
    "data":        "data science analytics visualization",
    "automation":  "automation workflow scripting tools",
    "cloud":       "cloud infrastructure aws azure gcp",
    "linux":       "linux system administration tools",
    "database":    "database sql nosql orm query",
    "api":         "REST API microservices backend",
    "nlp":         "natural language processing text NLP",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/122.0 Safari/537.36"
    ),
    "Accept": "application/vnd.github+json",
    "Accept-Language": "en-US,en;q=0.9",
    "X-GitHub-Api-Version": "2022-11-28",
}

# ─────────────────────────────────────────────
# ANSI COLORS
# ─────────────────────────────────────────────
class Color:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    CYAN    = "\033[36m"
    GREEN   = "\033[32m"
    YELLOW  = "\033[33m"
    BLUE    = "\033[34m"
    MAGENTA = "\033[35m"
    RED     = "\033[31m"
    DIM     = "\033[2m"
    WHITE   = "\033[97m"
    TEAL    = "\033[96m"

def colorize(text: str, *codes: str) -> str:
    return "".join(codes) + str(text) + Color.RESET

def fmt_num(n) -> str:
    try:
        n = int(str(n).replace(",", "").strip())
        if n >= 1_000_000: return f"{n/1_000_000:.1f}m"
        if n >= 1_000:     return f"{n/1_000:.1f}k"
        return str(n)
    except (ValueError, TypeError):
        return str(n)


# ─────────────────────────────────────────────
# HISTORY MANAGER  ← NEW in v3
# ─────────────────────────────────────────────
class HistoryManager:
    """
    Tracks every project ever shown across all runs.
    Persists to .github_trending_cache/seen_projects.json.

    Structure of seen_projects.json:
    {
      "last_updated": "2026-04-24T10:00:00",
      "total_seen": 142,
      "projects": {
        "huggingface/transformers": {
          "first_seen": "2026-04-24T09:30:00",
          "last_seen":  "2026-04-24T09:30:00",
          "times_seen": 1,
          "source":     "trending"
        },
        ...
      }
    }
    """

    def __init__(self, history_file: Path = HISTORY_FILE):
        self.file = history_file
        self.file.parent.mkdir(parents=True, exist_ok=True)
        self._data = self._load()

    def _load(self) -> dict:
        """Load history from disk, or create a blank history."""
        if self.file.exists():
            try:
                with open(self.file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, KeyError):
                pass
        return {"last_updated": "", "total_seen": 0, "projects": {}}

    def _save(self) -> None:
        """Persist current history to disk."""
        self._data["last_updated"] = datetime.now().isoformat()
        self._data["total_seen"]   = len(self._data["projects"])
        with open(self.file, "w", encoding="utf-8") as f:
            json.dump(self._data, f, indent=2, ensure_ascii=False)

    def has_seen(self, full_name: str) -> bool:
        """Return True if this repo was shown in any previous run."""
        return full_name in self._data["projects"]

    def mark_seen(self, full_name: str, source: str = "trending") -> None:
        """Record a repo as seen (updates count if already exists)."""
        now = datetime.now().isoformat()
        if full_name in self._data["projects"]:
            self._data["projects"][full_name]["last_seen"]  = now
            self._data["projects"][full_name]["times_seen"] += 1
        else:
            self._data["projects"][full_name] = {
                "first_seen": now,
                "last_seen":  now,
                "times_seen": 1,
                "source":     source,
            }

    def filter_new(self, projects: list[dict]) -> tuple[list[dict], list[dict]]:
        """
        Split a project list into (new_projects, already_seen_projects).

        Args:
            projects: Full list of fetched projects.

        Returns:
            Tuple of (new_list, skipped_list).
        """
        new_projects  = []
        seen_projects = []
        for p in projects:
            if self.has_seen(p["full_name"]):
                seen_projects.append(p)
            else:
                new_projects.append(p)
        return new_projects, seen_projects

    def save_batch(self, projects: list[dict]) -> None:
        """Mark all projects in a list as seen and persist."""
        for p in projects:
            self.mark_seen(p["full_name"], p.get("source", "trending"))
        self._save()

    def total(self) -> int:
        """Total number of unique projects ever seen."""
        return len(self._data["projects"])

    def clear(self) -> None:
        """Wipe the full history."""
        self._data = {"last_updated": "", "total_seen": 0, "projects": {}}
        self._save()
        print(colorize("✓ History cleared. All projects will appear fresh on next run.", Color.YELLOW))

    def print_history(self, limit: int = 50) -> None:
        """Print a summary table of previously seen projects."""
        projects = self._data["projects"]
        if not projects:
            print(colorize("\n  No history yet. Run the tool to start tracking.\n", Color.YELLOW))
            return

        items = sorted(projects.items(), key=lambda x: x[1]["last_seen"], reverse=True)
        width = 72
        print()
        print(colorize("═" * width, Color.MAGENTA))
        print(colorize(f"  📖  SEEN PROJECTS HISTORY  ·  {len(projects)} total unique repos".center(width), Color.MAGENTA, Color.BOLD))
        print(colorize("═" * width, Color.MAGENTA))
        print()
        header = f"{'Repository':<45} {'Seen':>5} {'Source':<10} {'Last Seen'}"
        sep    = "─" * len(header)
        print(colorize(sep, Color.DIM))
        print(colorize(header, Color.BOLD, Color.WHITE))
        print(colorize(sep, Color.DIM))
        for name, info in items[:limit]:
            ts = info["last_seen"][:16].replace("T", " ")
            print(f"{name:<45} {info['times_seen']:>5} {info['source']:<10} {ts}")
        print(colorize(sep, Color.DIM))
        if len(items) > limit:
            print(colorize(f"  ... and {len(items)-limit} more. History file: {self.file}", Color.DIM))
        print()


# ─────────────────────────────────────────────
# OUTPUT SAVER  ← NEW in v3
# ─────────────────────────────────────────────
class OutputSaver:
    """
    Saves every run's NEW results to the output/ directory.

    Files created per run:
        output/
            github_trending_python_daily_20260424_1001.json
            github_trending_python_daily_20260424_1001.csv
            github_search_hacking_20260424_1001.json
            github_search_hacking_20260424_1001.csv
    """

    def __init__(self, output_dir: Path = OUTPUT_DIR):
        self.output_dir = output_dir
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def _base_name(self, label: str) -> str:
        ts    = datetime.now().strftime("%Y%m%d_%H%M%S")
        clean = label.replace(" ", "_").replace("/", "_")[:50]
        return str(self.output_dir / f"{clean}_{ts}")

    def save(self, projects: list[dict], label: str, skipped: list[dict] = None) -> str:
        """
        Save new projects to both JSON and CSV.

        Args:
            projects: New (unseen) projects to save.
            label:    Descriptive filename prefix.
            skipped:  Already-seen projects (logged in JSON only).

        Returns:
            Base filename (without extension) for display.
        """
        if not projects:
            return ""

        base = self._base_name(label)
        ts   = datetime.now().isoformat()

        # ── JSON ─────────────────────────────────────
        payload = {
            "saved_at":      ts,
            "label":         label,
            "new_count":     len(projects),
            "skipped_count": len(skipped) if skipped else 0,
            "new_projects":  projects,
        }
        if skipped:
            payload["skipped_projects"] = [
                {"full_name": p["full_name"], "url": p["url"]} for p in skipped
            ]

        with open(f"{base}.json", "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)

        # ── CSV ──────────────────────────────────────
        is_search = projects[0].get("source") == "search"
        fields    = (
            ["rank","full_name","description","language","total_stars",
             "forks","open_issues","license","last_updated","topics","url"]
            if is_search else
            ["rank","full_name","description","language","total_stars",
             "stars_today","forks","url"]
        )
        with open(f"{base}.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
            writer.writeheader()
            for p in projects:
                row = dict(p)
                if "topics" in row and isinstance(row["topics"], list):
                    row["topics"] = ", ".join(row["topics"])
                writer.writerow(row)

        return base

    def list_saved(self) -> None:
        """Print all saved output files."""
        files = sorted(self.output_dir.glob("*.*"))
        if not files:
            print(colorize("\n  No saved output files yet.\n", Color.YELLOW))
            return
        print(colorize(f"\n📁 Saved output files in {self.output_dir}/:", Color.CYAN, Color.BOLD))
        for f in files:
            size = f.stat().st_size
            size_str = f"{size/1024:.1f}KB" if size >= 1024 else f"{size}B"
            print(f"  {colorize(f.name, Color.WHITE)}  {colorize(size_str, Color.DIM)}")
        print()


# ─────────────────────────────────────────────
# CACHE MANAGER
# ─────────────────────────────────────────────
class CacheManager:
    """Short-lived fetch cache (30 min) to avoid hammering GitHub."""

    def __init__(self, cache_dir=CACHE_DIR, expiry_minutes=CACHE_EXPIRY_MINUTES):
        self.cache_dir      = cache_dir
        self.expiry_seconds = expiry_minutes * 60
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _slug(self, key):
        return (key.lower()
                   .replace(" ","_").replace("/","_")
                   .replace("+","pp").replace("#","sharp")
                   .replace('"','')[:80])

    def _path(self, key):
        return self.cache_dir / f"cache_{self._slug(key)}.json"

    def get(self, key):
        path = self._path(key)
        if not path.exists(): return None
        try:
            with open(path,"r",encoding="utf-8") as f:
                c = json.load(f)
            if datetime.now() - datetime.fromisoformat(c["cached_at"]) < timedelta(seconds=self.expiry_seconds):
                return c["data"]
        except Exception:
            pass
        return None

    def set(self, key, data):
        path = self._path(key)
        with open(path,"w",encoding="utf-8") as f:
            json.dump({"cached_at": datetime.now().isoformat(), "data": data}, f, indent=2)

    def clear(self):
        removed = sum(1 for f in self.cache_dir.glob("cache_*.json") if f.unlink() or True)
        print(colorize(f"✓ Fetch cache cleared ({removed} files).", Color.YELLOW))


# ─────────────────────────────────────────────
# TRENDING SCRAPER
# ─────────────────────────────────────────────
class GitHubTrendingScraper:
    """Scrapes github.com/trending for daily/weekly/monthly top repos."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)

    def build_url(self, language="", since="daily"):
        lang = (language.strip().lower()
                        .replace(" ","-").replace("+","pp").replace("#","sharp"))
        base = GITHUB_TRENDING_URL
        url  = f"{base}/{lang}" if lang else base
        return f"{url}?since={since}"

    def fetch_page(self, url):
        try:
            r = self.session.get(url, timeout=15)
            r.raise_for_status()
            return BeautifulSoup(r.text, "html.parser")
        except requests.exceptions.ConnectionError:
            print(colorize("\n[ERROR] No internet connection.", Color.RED, Color.BOLD))
        except requests.exceptions.Timeout:
            print(colorize("\n[ERROR] Request timed out.", Color.RED))
        except requests.exceptions.HTTPError as e:
            code = e.response.status_code
            msgs = {429:"Rate limited. Wait a few minutes.", 404:"Page not found — invalid language?"}
            print(colorize(f"\n[ERROR] HTTP {code}: {msgs.get(code, str(e))}", Color.RED))
        except requests.exceptions.RequestException as e:
            print(colorize(f"\n[ERROR] {e}", Color.RED))
        return None

    def parse(self, soup):
        projects = []
        articles = soup.select("article.Box-row")
        if not articles:
            print(colorize("[WARN] No trending projects found. GitHub layout may have changed.", Color.YELLOW))
            return projects
        for rank, article in enumerate(articles, 1):
            try:
                name_tag = article.select_one("h2 a")
                if not name_tag: continue
                repo_path   = name_tag.get("href","").strip("/")
                parts       = repo_path.split("/")
                owner       = parts[0] if parts else "unknown"
                repo        = parts[1] if len(parts)>1 else "unknown"
                desc_tag    = article.select_one("p")
                desc        = desc_tag.get_text(strip=True) if desc_tag else "No description"
                lang_tag    = article.select_one("[itemprop=\'programmingLanguage\']")
                language    = lang_tag.get_text(strip=True) if lang_tag else "Unknown"
                star_links  = article.select("a.Link--muted")
                total_stars = star_links[0].get_text(strip=True).replace(",","") if star_links else "N/A"
                forks       = star_links[1].get_text(strip=True).replace(",","") if len(star_links)>1 else "N/A"
                today_tag   = article.select_one("span.d-inline-block.float-sm-right")
                stars_today = "N/A"
                if today_tag:
                    stars_today = (today_tag.get_text(strip=True)
                                           .replace("stars today","").replace("star today","")
                                           .strip().replace(",",""))
                projects.append({
                    "rank": rank, "full_name": f"{owner}/{repo}",
                    "owner": owner, "repo": repo, "description": desc,
                    "language": language, "total_stars": total_stars,
                    "stars_today": stars_today, "forks": forks,
                    "topics": [], "url": f"https://github.com/{repo_path}",
                    "source": "trending",
                })
            except Exception:
                continue
        return projects

    def get_trending(self, language="", since="daily", use_cache=True, cache=None):
        key = f"trending_{language}_{since}"
        if use_cache and cache:
            hit = cache.get(key)
            if hit:
                print(colorize("[CACHE] Serving trending results from cache.", Color.DIM))
                return hit
        url  = self.build_url(language, since)
        print(colorize(f"[FETCH] {url}", Color.DIM))
        soup = self.fetch_page(url)
        if soup is None: return []
        data = self.parse(soup)
        if use_cache and cache and data:
            cache.set(key, data)
        return data


# ─────────────────────────────────────────────
# TECH SEARCH
# ─────────────────────────────────────────────
class TechSearcher:
    """Searches GitHub API for trusted open-source projects by technology keyword."""

    def __init__(self, token=""):
        self.session = requests.Session()
        hdrs = dict(HEADERS)
        if token:
            hdrs["Authorization"] = f"Bearer {token}"
        self.session.headers.update(hdrs)

    def build_query(self, keyword, language="", min_stars=500):
        expanded = TECH_PRESETS.get(keyword.lower().strip(), keyword)
        q = f"{expanded} fork:false stars:>={min_stars} has:description"
        if language:
            lang_q = language.replace("+","pp").replace("#","sharp").replace(" ","-")
            q += f" language:{lang_q}"
        return q

    def search(self, keyword, language="", min_stars=500, sort="stars",
               limit=25, use_cache=True, cache=None):
        key = f"search_{keyword}_{language}_{min_stars}_{sort}"
        if use_cache and cache:
            hit = cache.get(key)
            if hit:
                print(colorize("[CACHE] Serving search results from cache.", Color.DIM))
                return hit

        query    = self.build_query(keyword, language, min_stars)
        per_page = min(limit, 100)
        url      = (f"{GITHUB_SEARCH_API}?q={quote_plus(query)}"
                    f"&sort={sort}&order=desc&per_page={per_page}")
        print(colorize(f"[SEARCH] q={query}", Color.DIM))

        try:
            r = self.session.get(url, timeout=20)
            if r.status_code == 403:
                reset_ts = r.headers.get("X-RateLimit-Reset","")
                reset_str = datetime.fromtimestamp(int(reset_ts)).strftime("%H:%M:%S") if reset_ts else "unknown"
                print(colorize(f"\n[ERROR] GitHub API rate limit hit. Resets at: {reset_str}\n"
                               f"         Tip: add --token YOUR_PAT to raise limit to 5,000/hr.", Color.RED, Color.BOLD))
                return []
            if r.status_code == 422:
                print(colorize("\n[ERROR] Invalid search query.", Color.RED))
                return []
            r.raise_for_status()
            items = r.json().get("items", [])
        except requests.exceptions.ConnectionError:
            print(colorize("\n[ERROR] No internet connection.", Color.RED, Color.BOLD)); return []
        except requests.exceptions.Timeout:
            print(colorize("\n[ERROR] Request timed out.", Color.RED)); return []
        except requests.exceptions.RequestException as e:
            print(colorize(f"\n[ERROR] {e}", Color.RED)); return []

        results = []
        for rank, item in enumerate(items, 1):
            results.append({
                "rank":         rank,
                "full_name":    item.get("full_name",""),
                "owner":        (item.get("owner") or {}).get("login",""),
                "repo":         item.get("name",""),
                "description":  item.get("description") or "No description",
                "language":     item.get("language") or "Unknown",
                "total_stars":  str(item.get("stargazers_count",0)),
                "stars_today":  "N/A",
                "forks":        str(item.get("forks_count",0)),
                "open_issues":  str(item.get("open_issues_count",0)),
                "topics":       item.get("topics",[]),
                "license":      (item.get("license") or {}).get("spdx_id","N/A"),
                "last_updated": item.get("updated_at","")[:10],
                "url":          item.get("html_url",""),
                "source":       "search",
            })

        if use_cache and cache and results:
            cache.set(key, results)
        return results


# ─────────────────────────────────────────────
# DISPLAY
# ─────────────────────────────────────────────
class Display:
    """Rich CLI output — adapts columns for trending vs search results."""

    @staticmethod
    def print_trending_banner(language, since, total, new_count, skipped_count):
        since_map = {"daily":"Today","weekly":"This Week","monthly":"This Month"}
        lang_str  = language.upper() if language else "ALL LANGUAGES"
        w = 72
        print()
        print(colorize("═"*w, Color.CYAN))
        print(colorize(f"  🔥  GITHUB TRENDING — {lang_str}  ·  {since_map.get(since,since)}".center(w), Color.CYAN, Color.BOLD))
        print(colorize(f"  ✨ {new_count} NEW  ·  ⏭  {skipped_count} already seen  ·  {total} fetched total".center(w), Color.GREEN))
        print(colorize(f"  {datetime.now().strftime('%Y-%m-%d %H:%M')}".center(w), Color.DIM))
        print(colorize("═"*w, Color.CYAN))
        print()

    @staticmethod
    def print_search_banner(keyword, language, min_stars, sort, total, new_count, skipped_count):
        lang_str = f" · {language.upper()}" if language else ""
        w = 72
        print()
        print(colorize("═"*w, Color.TEAL))
        print(colorize(f"  🔍  TECH SEARCH: \"{keyword.upper()}\"{lang_str}".center(w), Color.TEAL, Color.BOLD))
        print(colorize(f"  ✨ {new_count} NEW  ·  ⏭  {skipped_count} already seen  ·  Stars ≥ {fmt_num(min_stars)}  ·  Sort: {sort}".center(w), Color.GREEN))
        print(colorize(f"  {datetime.now().strftime('%Y-%m-%d %H:%M')}".center(w), Color.DIM))
        print(colorize("═"*w, Color.TEAL))
        print()

    @staticmethod
    def print_card(p: dict, is_new: bool = True) -> None:
        is_search = p.get("source") == "search"
        badge     = colorize(" NEW ", Color.GREEN, Color.BOLD) if is_new else colorize(" SEEN", Color.DIM)
        rank_tag  = colorize(f" #{p['rank']:>2} ", Color.BOLD, Color.MAGENTA)
        title     = colorize(p["full_name"], Color.WHITE, Color.BOLD)
        print(f"{rank_tag} {badge}  {title}")
        desc = (p["description"][:82]+"…") if len(p["description"])>82 else p["description"]
        print(f"            {colorize(desc, Color.DIM)}")
        lang_tag  = colorize(f"[{p['language']}]", Color.BLUE, Color.BOLD) if p["language"]!="Unknown" else colorize("[Unknown]",Color.DIM)
        stars_tag = colorize(f"★ {fmt_num(p['total_stars'])}", Color.YELLOW)
        forks_tag = colorize(f"⑂ {fmt_num(p['forks'])}", Color.DIM)
        if is_search:
            lic_tag  = colorize(f"⚖ {p.get('license','N/A')}", Color.DIM)
            upd_tag  = colorize(f"↺ {p.get('last_updated','')}", Color.DIM)
            iss_tag  = colorize(f"✦ {p.get('open_issues','0')} issues", Color.DIM)
            print(f"            {lang_tag}  {stars_tag}  {forks_tag}  {iss_tag}  {lic_tag}  {upd_tag}")
            topics = p.get("topics",[])[:6]
            if topics:
                print(f"            " + "  ".join(colorize(f"#{t}", Color.TEAL) for t in topics))
        else:
            today_tag = colorize(f"(+{p['stars_today']} today)", Color.GREEN) if p["stars_today"]!="N/A" else ""
            print(f"            {lang_tag}  {stars_tag} {today_tag}  {forks_tag}")
        print(f"            {colorize(p['url'], Color.CYAN)}")
        print()

    @staticmethod
    def print_table(projects: list[dict], mark_new: set) -> None:
        if not projects:
            print(colorize("No results.", Color.YELLOW)); return
        is_search = projects[0].get("source") == "search"
        if is_search:
            hdr = f"{'':5} {'#':<4} {'Repository':<38} {'Language':<14} {'Stars':>8} {'Forks':>7} {'License':<10} {'Updated'}"
        else:
            hdr = f"{'':5} {'#':<4} {'Repository':<38} {'Language':<14} {'Stars':>8} {'+Today':>8} {'Forks':>7}"
        sep = "─" * (len(hdr)+2)
        print(colorize(sep, Color.DIM))
        print(colorize(hdr, Color.BOLD, Color.WHITE))
        print(colorize(sep, Color.DIM))
        for p in projects:
            flag = colorize("  NEW", Color.GREEN, Color.BOLD) if p["full_name"] in mark_new else colorize(" SEEN", Color.DIM)
            name = p["full_name"][:37]
            lang = p["language"][:13]
            if is_search:
                print(f"{flag} {p['rank']:<4} {name:<38} {lang:<14} {fmt_num(p['total_stars']):>8} "
                      f"{fmt_num(p['forks']):>7} {p.get('license','N/A'):<10} {p.get('last_updated','')}")
            else:
                today = p["stars_today"] if p["stars_today"]!="N/A" else "-"
                print(f"{flag} {p['rank']:<4} {name:<38} {lang:<14} {fmt_num(p['total_stars']):>8} "
                      f"{today:>8} {fmt_num(p['forks']):>7}")
        print(colorize(sep, Color.DIM))

    @staticmethod
    def render(new_projects, skipped_projects, table_mode=False, show_seen=False, limit=25):
        """
        Render results — NEW projects first, optionally SEEN ones after.

        Args:
            new_projects:     Unseen repos (will be displayed prominently).
            skipped_projects: Already-seen repos.
            table_mode:       Compact table vs. rich cards.
            show_seen:        Whether to also display skipped repos.
            limit:            Max items to show.
        """
        all_projects = new_projects + (skipped_projects if show_seen else [])
        display_list = all_projects[:limit]
        if not display_list:
            print(colorize("\n  No new results found this run. All projects already seen.\n"
                           "  Use --no-skip to show all results regardless.\n", Color.YELLOW))
            return

        new_names = {p["full_name"] for p in new_projects}

        if table_mode:
            Display.print_table(display_list, mark_new=new_names)
        else:
            for p in display_list:
                Display.print_card(p, is_new=(p["full_name"] in new_names))


# ─────────────────────────────────────────────
# CLI PARSER
# ─────────────────────────────────────────────
def build_parser():
    parser = argparse.ArgumentParser(
        prog="github_trending",
        description="🔥 GitHub Trending + 🔍 Tech Search + 📖 History Deduplication",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TRENDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  python github_trending.py
  python github_trending.py -l python -s weekly
  python github_trending.py -l rust -s monthly -t -e csv

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TECH SEARCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  python github_trending.py --search "machine learning"
  python github_trending.py --search hacking -l python
  python github_trending.py --search devops --stars 5000
  python github_trending.py --search nlp --sort updated -n 10 -e json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HISTORY & OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  python github_trending.py --history        # view all seen projects
  python github_trending.py --show-seen      # display seen ones too
  python github_trending.py --no-skip        # ignore history (show all)
  python github_trending.py --clear-history  # reset history
  python github_trending.py --list-output    # list saved output files
  python github_trending.py --presets        # list search aliases
  python github_trending.py --clear-cache    # clear fetch cache
        """,
    )

    t = parser.add_argument_group("📈 Trending")
    t.add_argument("--language","-l", type=str, default="", help="Language filter (e.g. python, rust).")
    t.add_argument("--since","-s",    type=str, default="daily", choices=SINCE_OPTIONS,
                   help="Time range: daily | weekly | monthly.")

    s = parser.add_argument_group("🔍 Tech Search")
    s.add_argument("--search","-q",  type=str, default="", metavar="KEYWORD",
                   help="Search trusted open-source projects by technology keyword or preset alias.")
    s.add_argument("--stars",        type=int, default=500, metavar="N",
                   help="Min star count trust filter. Default: 500.")
    s.add_argument("--sort",         type=str, default="stars", choices=SORT_OPTIONS,
                   help="Sort: stars | forks | updated | help-wanted-issues.")
    s.add_argument("--token",        type=str, default="", metavar="PAT",
                   help="GitHub Personal Access Token for 5,000 req/hr rate limit.")

    h = parser.add_argument_group("📖 History & Deduplication")
    h.add_argument("--history",       action="store_true", help="Print all previously seen projects and exit.")
    h.add_argument("--clear-history", action="store_true", help="Wipe all history and exit.")
    h.add_argument("--show-seen",     action="store_true", help="Also show already-seen projects (greyed out).")
    h.add_argument("--no-skip",       action="store_true", help="Ignore history — show all results as if fresh.")
    h.add_argument("--list-output",   action="store_true", help="List all saved output files and exit.")

    o = parser.add_argument_group("⚙️  Output")
    o.add_argument("--limit","-n",   type=int, default=25, help="Max results to show. Default: 25.")
    o.add_argument("--table","-t",   action="store_true", help="Compact table instead of cards.")
    o.add_argument("--export","-e",  type=str, choices=["json","csv"], help="Also export to JSON or CSV.")
    o.add_argument("--no-cache",     action="store_true", help="Skip fetch cache — always request fresh data.")
    o.add_argument("--clear-cache",  action="store_true", help="Clear fetch cache files and exit.")
    o.add_argument("--languages",    action="store_true", help="List supported language filters and exit.")
    o.add_argument("--presets",      action="store_true", help="List --search preset aliases and exit.")

    return parser


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def main():
    parser  = build_parser()
    args    = parser.parse_args()
    cache   = CacheManager()
    history = HistoryManager()
    saver   = OutputSaver()

    # ── Utility exits ────────────────────────────────
    if args.clear_cache:
        cache.clear(); sys.exit(0)

    if args.clear_history:
        history.clear(); sys.exit(0)

    if args.history:
        history.print_history(limit=args.limit); sys.exit(0)

    if args.list_output:
        saver.list_saved(); sys.exit(0)

    if args.languages:
        print(colorize("\nSupported --language values:", Color.CYAN, Color.BOLD))
        rows = [SUPPORTED_LANGUAGES[i:i+6] for i in range(0,len(SUPPORTED_LANGUAGES),6)]
        for row in rows:
            print("  " + "  ".join(colorize(f"{l:<14}", Color.WHITE) for l in row))
        print(); sys.exit(0)

    if args.presets:
        print(colorize("\n--search preset aliases:", Color.TEAL, Color.BOLD))
        print()
        for alias, expanded in TECH_PRESETS.items():
            print(f"  {colorize(f'{alias:<16}', Color.YELLOW, Color.BOLD)} → {colorize(expanded, Color.DIM)}")
        print(); sys.exit(0)

    use_cache = not args.no_cache
    language  = args.language.strip().lower()

    # ── Fetch ────────────────────────────────────────
    if args.search:
        searcher = TechSearcher(token=args.token)
        projects = searcher.search(
            keyword=args.search, language=language, min_stars=args.stars,
            sort=args.sort, limit=args.limit, use_cache=use_cache, cache=cache,
        )
        label = f"search_{args.search.replace(' ','_')}"
    else:
        if language and language not in SUPPORTED_LANGUAGES:
            print(colorize(f"\n[WARN] \"{language}\" not in default list — trying anyway.", Color.YELLOW))
        scraper  = GitHubTrendingScraper()
        projects = scraper.get_trending(
            language=language, since=args.since, use_cache=use_cache, cache=cache,
        )
        label = f"trending_{language or 'all'}_{args.since}"

    if not projects:
        sys.exit(1)

    # ── Deduplicate via history ──────────────────────
    if args.no_skip:
        new_projects  = projects
        seen_projects = []
        print(colorize("[INFO] --no-skip: showing all results (history ignored).", Color.DIM))
    else:
        new_projects, seen_projects = history.filter_new(projects)

    # ── Display banner ───────────────────────────────
    if args.search:
        Display.print_search_banner(
            args.search, language, args.stars, args.sort,
            len(projects), len(new_projects), len(seen_projects)
        )
    else:
        Display.print_trending_banner(
            language, args.since,
            len(projects), len(new_projects), len(seen_projects)
        )

    # ── Render ───────────────────────────────────────
    Display.render(
        new_projects, seen_projects,
        table_mode=args.table, show_seen=args.show_seen, limit=args.limit
    )

    # ── Save new projects to history + output files ──
    if new_projects:
        history.save_batch(new_projects)
        saved_base = saver.save(new_projects, label, skipped=seen_projects)

        print(colorize(
            f"  ✅  {len(new_projects)} new projects saved → {saved_base}.json / .csv",
            Color.GREEN, Color.BOLD
        ))
        print(colorize(
            f"  📖  History: {history.total()} unique projects tracked in {HISTORY_FILE}",
            Color.DIM
        ))
    else:
        print(colorize(
            f"  ⏭   All {len(seen_projects)} fetched projects were already seen. Nothing new saved.",
            Color.YELLOW
        ))
        print(colorize(f"  📖  Total tracked: {history.total()} projects.", Color.DIM))

    # ── Optional extra export ────────────────────────
    if args.export and new_projects:
        from pathlib import Path as _P
        ts   = datetime.now().strftime("%Y%m%d_%H%M%S")
        base = f"{label}_{ts}"
        if args.export == "json":
            with open(f"{base}.json","w",encoding="utf-8") as f:
                json.dump({"exported_at": datetime.now().isoformat(),
                           "count": len(new_projects), "projects": new_projects},
                          f, indent=2, ensure_ascii=False)
            print(colorize(f"  📤  Exported → {base}.json", Color.GREEN))
        elif args.export == "csv":
            is_search = new_projects[0].get("source") == "search"
            fields    = (["rank","full_name","description","language","total_stars",
                          "forks","open_issues","license","last_updated","topics","url"]
                         if is_search else
                         ["rank","full_name","description","language","total_stars",
                          "stars_today","forks","url"])
            with open(f"{base}.csv","w",newline="",encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
                writer.writeheader()
                for p in new_projects:
                    row = dict(p)
                    if "topics" in row and isinstance(row["topics"],list):
                        row["topics"] = ", ".join(row["topics"])
                    writer.writerow(row)
            print(colorize(f"  📤  Exported → {base}.csv", Color.GREEN))

    print()


if __name__ == "__main__":
    main()
