'use strict';
const CATS = {
                all: { label: "All Projects", emoji: "⚡", desc: "Show everything", color: "#22d3a0", dim: "rgba(34,211,160,.09)", border: "rgba(34,211,160,.28)" },
                security: { label: "Security", emoji: "🛡️", desc: "Hacking & pen-testing", color: "#22d3a0", dim: "rgba(34,211,160,.09)", border: "rgba(34,211,160,.28)" },
                ai: { label: "AI / ML", emoji: "🧠", desc: "Models & automation", color: "#a78bfa", dim: "rgba(167,139,250,.09)", border: "rgba(167,139,250,.28)" },
                dev: { label: "Dev Tools", emoji: "🛠️", desc: "CLIs, linters, utils", color: "#60a5fa", dim: "rgba(96,165,250,.09)", border: "rgba(96,165,250,.28)" },
                network: { label: "Network", emoji: "📡", desc: "Scanners & protocols", color: "#22d3ee", dim: "rgba(34,211,238,.09)", border: "rgba(34,211,238,.28)" },
                systems: { label: "Systems", emoji: "⚙️", desc: "OS & low-level tools", color: "#fbbf24", dim: "rgba(251,191,36,.09)", border: "rgba(251,191,36,.28)" },
                web: { label: "Web", emoji: "🌐", desc: "Frameworks & frontends", color: "#f87171", dim: "rgba(248,113,113,.09)", border: "rgba(248,113,113,.28)" }
            };

            const LANG_COLORS = { Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6", Go: "#00ADD8", Rust: "#dea584", C: "#555", "C++": "#f34b7d", Java: "#b07219", Kotlin: "#A97BFF", Shell: "#89e051", HTML: "#e34c26", CSS: "#563d7c", Ruby: "#701516", Swift: "#F05138", PHP: "#4F5D95", Dart: "#00B4AB", default: "#8892a4" };
    
const REPOS = [
            {
                owner: "yohey-w",
                name: "multi-agent-shogun",
                url: "https://github.com/yohey-w/multi-agent-shogun",
                cat: "ai",
                desc: "Multi-agent orchestration framework inspired by feudal command hierarchy. Coordinates specialized AI sub-agents under a central shogun controller.",
                language: "Shell",
                topics: ["shell"],
                updated: "31 January 2026",
                isNew: false
            },
            {
                owner: "Robbyant",
                name: "lingbot-vla",
                url: "https://github.com/Robbyant/lingbot-vla",
                cat: "ai",
                desc: "A Pragmatic VLA Foundation Model",
                language: "Python",
                topics: ["python"],
                updated: "1 February 2026",
                isNew: false
            },
            {
                owner: "luccast",
                name: "crabwalk",
                url: "https://github.com/luccast/crabwalk",
                cat: "ai",
                desc: "Crabwalk Real-time companion monitor for Clawdbot agents.",
                language: "TypeScript",
                topics: ["ai", "ai_agents", "clawdbot", "moltbot", "monitoring"],
                updated: "1 February 2026",
                isNew: false
            },
            {
                owner: "Prismer-AI",
                name: "Prismer",
                url: "https://github.com/Prismer-AI/Prismer",
                cat: "ai",
                desc: "Open Source OpenAI Prism Alternative",
                language: "Python",
                topics: ["python"],
                updated: "1 February 2026",
                isNew: false
            },
            {
                owner: "miantiao-me",
                name: "cloud-code",
                url: "https://github.com/miantiao-me/cloud-code",
                cat: "ai",
                desc: "Cloud Code (Cloudflare + OpenCode), running OpenCode on Cloudflare to build a dedicated cloud Agent for you.",
                language: "TypeScript",
                topics: ["agent", "cloud_code", "cloudflare", "opencode"],
                updated: "1 February 2026",
                isNew: false
            },
            {
                owner: "pierceboggan",
                name: "primer",
                url: "https://github.com/pierceboggan/primer",
                cat: "ai",
                desc: "Get your repo ready for AI.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "2 February 2026",
                isNew: false
            },
            {
                owner: "ColeMurray",
                name: "background-agents",
                url: "https://github.com/ColeMurray/background-agents",
                cat: "ai",
                desc: "An open-source background agents coding system",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "2 February 2026",
                isNew: false
            },
            {
                owner: "gavrielc",
                name: "nanoclaw",
                url: "https://github.com/gavrielc/nanoclaw",
                cat: "ai",
                desc: "My personal Claude assistant that runs in Apple containers. Lightweight, secure, and built to be understood and customized for your own needs.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "2 February 2026",
                isNew: false
            },
            {
                owner: "HKUDS",
                name: "nanobot",
                url: "https://github.com/HKUDS/nanobot",
                cat: "dev",
                desc: "nanobot: The Ultra-Lightweight Clawdbot",
                language: "Python",
                topics: ["python"],
                updated: "2 February 2026",
                isNew: false
            },
            {
                owner: "btseytlin",
                name: "hr-breaker",
                url: "https://github.com/btseytlin/hr-breaker",
                cat: "ai",
                desc: "Optimize resume for jobs, now with AI",
                language: "Python",
                topics: ["python"],
                updated: "3 February 2026",
                isNew: false
            },
            {
                owner: "OpenMOSS",
                name: "MOVA",
                url: "https://github.com/OpenMOSS/MOVA",
                cat: "ai",
                desc: "MOVA: Towards Scalable and Synchronized Video\u2013Audio Generation",
                language: "Python",
                topics: ["diffusion_models", "multimodal", "sglang", "video_audio_generation"],
                updated: "3 February 2026",
                isNew: false
            },
            {
                owner: "agno-agi",
                name: "dash",
                url: "https://github.com/agno-agi/dash",
                cat: "ai",
                desc: "Self-learning data agent that grounds its answers in 6 layers of context. Inspired by OpenAI's in-house implementation.",
                language: "Python",
                topics: ["python"],
                updated: "3 February 2026",
                isNew: false
            },
            {
                owner: "wesm",
                name: "msgvault",
                url: "https://github.com/wesm/msgvault",
                cat: "ai",
                desc: "Archive a lifetime of email and chat. Offline search, analytics, and AI query over your full message history. Powered by DuckDB",
                language: "Go",
                topics: ["go"],
                updated: "3 February 2026",
                isNew: false
            },
            {
                owner: "stepfun-ai",
                name: "Step-3.5-Flash",
                url: "https://github.com/stepfun-ai/Step-3.5-Flash",
                cat: "ai",
                desc: "Fast, Sharp & Reliable Agentic Intelligence",
                language: "C++",
                topics: ["cplusplus"],
                updated: "4 February 2026",
                isNew: false
            },
            {
                owner: "Robbyant",
                name: "lingbot-va",
                url: "https://github.com/Robbyant/lingbot-va",
                cat: "ai",
                desc: "Causal video-action world model for generalist robot control",
                language: "Python",
                topics: ["python"],
                updated: "4 February 2026",
                isNew: false
            },
            {
                owner: "sheeki03",
                name: "tirith",
                url: "https://github.com/sheeki03/tirith",
                cat: "security",
                desc: "Your browser catches homograph attacks. Your terminal doesn't. Tirith guards the gate \u2014 intercepts suspicious URLs, ANSI injection, and pipe-to-shell attacks before they execute.",
                language: "Rust",
                topics: ["cli", "devtools", "homograph_attack", "rust", "security", "shell", "supply_chain_security", "terminal", "unicode", "url_security"],
                updated: "4 February 2026",
                isNew: false
            },
            {
                owner: "dwzhu-pku",
                name: "PaperBanana",
                url: "https://github.com/dwzhu-pku/PaperBanana",
                cat: "ai",
                desc: "PaperBanana: Automating Academic Illustration For AI Scientists",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "4 February 2026",
                isNew: false
            },
            {
                owner: "zai-org",
                name: "GLM-OCR",
                url: "https://github.com/zai-org/GLM-OCR",
                cat: "ai",
                desc: "GLM-OCR: Accurate \u00d7 Fast \u00d7 Comprehensive",
                language: "Python",
                topics: ["glm", "image2text", "ocr"],
                updated: "5 February 2026",
                isNew: false
            },
            {
                owner: "goduni",
                name: "unihttp",
                url: "https://github.com/goduni/unihttp",
                cat: "web",
                desc: "Unified HTTP client library with a consistent interface across multiple protocols and backends.",
                language: null,
                topics: [],
                updated: "5 February 2026",
                isNew: false
            },
            {
                owner: "ygwyg",
                name: "MAHORAGA",
                url: "https://github.com/ygwyg/MAHORAGA",
                cat: "ai",
                desc: "autonomous trading agent powered by social sentiment analysis and ai that learns, grows, and adapts",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "5 February 2026",
                isNew: false
            },
            {
                owner: "imxv",
                name: "Pretty-mermaid-skills",
                url: "https://github.com/imxv/Pretty-mermaid-skills",
                cat: "ai",
                desc: "To provide AI with Mermaid chart rendering capability, supporting both SVG and ASCII output formats",
                language: "JavaScript",
                topics: ["mermaid", "skills"],
                updated: "5 February 2026",
                isNew: false
            },
            {
                owner: "FrondEnt",
                name: "PolymarketBTC15mAssistant",
                url: "https://github.com/FrondEnt/PolymarketBTC15mAssistant",
                cat: "web",
                desc: "Real-time Polymarket BTC 15m trading assistant for every trader! created by @krajekis",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "5 February 2026",
                isNew: false
            },
            {
                owner: "callstackincubator",
                name: "agent-device",
                url: "https://github.com/callstackincubator/agent-device",
                cat: "ai",
                desc: "CLI to control iOS and Android devices for AI agents",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "6 February 2026",
                isNew: false
            },
            {
                owner: "cisco-ai-defense",
                name: "skill-scanner",
                url: "https://github.com/cisco-ai-defense/skill-scanner",
                cat: "security",
                desc: "Security Scanner for Agent Skills",
                language: "Python",
                topics: ["agent", "agent_skills", "security"],
                updated: "6 February 2026",
                isNew: false
            },
            {
                owner: "BlockRunAI",
                name: "ClawRouter",
                url: "https://github.com/BlockRunAI/ClawRouter",
                cat: "ai",
                desc: "Smart LLM router \u2014 save 78% on inference costs. 30+ models, one wallet, x402 micropayments.",
                language: "TypeScript",
                topics: ["ai", "ai_agents", "anthropic", "cost_optimization", "crypto", "deepseek", "gemini", "llm", "llm_router", "micropayments", "openai", "openclaw", "smart_routing", "usdc", "x402"],
                updated: "6 February 2026",
                isNew: false
            },
            {
                owner: "anthropics",
                name: "claudes-c-compiler",
                url: "https://github.com/anthropics/claudes-c-compiler",
                cat: "ai",
                desc: "Claude Opus 4.6 wrote a dependency-free C compiler in Rust, with backends targeting x86 (64- and 32-bit), ARM, and RISC-V, capable of compiling a booting Linux kernel.",
                language: "Rust",
                topics: ["rust"],
                updated: "6 February 2026",
                isNew: false
            },
            {
                owner: "rohitg00",
                name: "pro-workflow",
                url: "https://github.com/rohitg00/pro-workflow",
                cat: "ai",
                desc: "Battle-tested Claude Code workflows from power users. Self-correcting memory, parallel worktrees, wrap-up rituals, and the 80/20 AI coding ratio.",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "7 February 2026",
                isNew: false
            },
            {
                owner: "fspecii",
                name: "ace-step-ui",
                url: "https://github.com/fspecii/ace-step-ui",
                cat: "ai",
                desc: "The Ultimate Open Source Suno Alternative - Professional UI for ACE-Step 1.5 AI Music Generation. Free, local, unlimited. Stop paying for Suno!",
                language: "JavaScript",
                topics: ["ace_step", "ai", "ai_music", "local_first", "music", "music_generation", "open_source", "react", "suno_alternative", "typescript"],
                updated: "7 February 2026",
                isNew: false
            },
            {
                owner: "antonpk1",
                name: "excalidraw-mcp-app",
                url: "https://github.com/antonpk1/excalidraw-mcp-app",
                cat: "ai",
                desc: "Excalidraw MCP App Server \u2014 hand-drawn diagrams for Claude",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "7 February 2026",
                isNew: false
            },
            {
                owner: "foru17",
                name: "clash-master",
                url: "https://github.com/foru17/clash-master",
                cat: "network",
                desc: "A modern and elegant dashboard for visualizing and managing Clash network traffic.",
                language: "TypeScript",
                topics: ["clash", "openclash", "traffic_monitor"],
                updated: "7 February 2026",
                isNew: false
            },
            {
                owner: "SamNet-dev",
                name: "paqctl",
                url: "https://github.com/SamNet-dev/paqctl",
                cat: "security",
                desc: "Unified proxy manager for bypassing firewalls - supports Paqet (KCP/raw socket) and GFW-Knocker (violated TCP/QUIC) with dual-backend simultaneous operation",
                language: "Shell",
                topics: ["china", "firewall_bypass", "gfw", "gfw_breaker", "iran", "proxy", "raw_socket", "socks5", "socks5_proxy", "tunnel", "vpn", "windows"],
                updated: "8 February 2026",
                isNew: false
            },
            {
                owner: "cfinke",
                name: "EpsteIn",
                url: "https://github.com/cfinke/EpsteIn",
                cat: "dev",
                desc: "See which of your LinkedIn connections appear in the Epstein files.",
                language: "Python",
                topics: ["python"],
                updated: "8 February 2026",
                isNew: false
            },
            {
                owner: "eljojo",
                name: "rememory",
                url: "https://github.com/eljojo/rememory",
                cat: "security",
                desc: "have a plan for the worst-case scenario",
                language: "Go",
                topics: ["age_encryption", "shamir_secret_sharing"],
                updated: "8 February 2026",
                isNew: false
            },
            {
                owner: "mitchellh",
                name: "vouch",
                url: "https://github.com/mitchellh/vouch",
                cat: "dev",
                desc: "A contributor trust management system based on explicit vouches to participate.",
                language: "Nushell",
                topics: ["nushell", "rust"],
                updated: "8 February 2026",
                isNew: false
            },
            {
                owner: "Haleclipse",
                name: "CodexDesktop-Rebuild",
                url: "https://github.com/Haleclipse/CodexDesktop-Rebuild",
                cat: "systems",
                desc: "Codex Desktop App - Cross-platform Rebuild",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "9 February 2026",
                isNew: false
            },
            {
                owner: "antirez",
                name: "voxtral.c",
                url: "https://github.com/antirez/voxtral.c",
                cat: "ai",
                desc: "Pure C inference of Mistral Voxtral Realtime 4B speech to text model",
                language: "C",
                topics: ["c"],
                updated: "9 February 2026",
                isNew: false
            },
            {
                owner: "op7418",
                name: "CodePilot",
                url: "https://github.com/op7418/CodePilot",
                cat: "ai",
                desc: "A native desktop GUI for Claude Code \u2014 chat, code, and manage projects visually. Built with Electron + Next.js.",
                language: "TypeScript",
                topics: ["ai", "anthropic", "claude", "claude_code", "desktop_app", "electron", "gui", "nextjs"],
                updated: "9 February 2026",
                isNew: false
            },
            {
                owner: "rohitg00",
                name: "awesome-claude-code-toolkit",
                url: "https://github.com/rohitg00/awesome-claude-code-toolkit",
                cat: "ai",
                desc: "The most comprehensive toolkit for Claude Code -- 135 agents, 35 curated skills (+15,000 via SkillKit), 42 commands, 120 plugins, 19 hooks, 15 rules, 7 templates, 6 MCP configs, and more.",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "9 February 2026",
                isNew: false
            },
            {
                owner: "trumpet-noek",
                name: "sora2-free-watermark-remover",
                url: "https://github.com/trumpet-noek/sora2-free-watermark-remover",
                cat: "dev",
                desc: "sora2 free watermark remover",
                language: "Python",
                topics: ["awesome_lists", "sora2_free_watermark_remover", "webrtc"],
                updated: "10 February 2026",
                isNew: false
            },
            {
                owner: "ula7i921011",
                name: "React2Shell-Scanner",
                url: "https://github.com/ula7i921011/React2Shell-Scanner",
                cat: "security",
                desc: "React2Shell Scanner",
                language: "Python",
                topics: ["games", "pentesters", "react2shell_scanner"],
                updated: "10 February 2026",
                isNew: false
            },
            {
                owner: "The-Vibe-Company",
                name: "companion",
                url: "https://github.com/The-Vibe-Company/companion",
                cat: "ai",
                desc: "Web UI for Claude Code built on a reverse-engineered WebSocket protocol. Launch sessions, stream responses, approve tools. All from your browser / mobile",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "10 February 2026",
                isNew: false
            },
            {
                owner: "f",
                name: "textream",
                url: "https://github.com/f/textream",
                cat: "systems",
                desc: "Textream is a free macOS teleprompter app for streamers, interviewers, and presenters. It highlights your script in real-time as you speak, displayed in a beautiful Dynamic Island overlay.",
                language: "Swift",
                topics: ["macos", "macos_app", "streaming"],
                updated: "10 February 2026",
                isNew: false
            },
            {
                owner: "memovai",
                name: "mimiclaw",
                url: "https://github.com/memovai/mimiclaw",
                cat: "ai",
                desc: "MimiClaw: Run OpenClaw on a $5 chip. No OS(Linux). No Node.js. No Mac mini. No Raspberry Pi. No VPS.Local-first memory. Shareable. Portable. Privacy-first.",
                language: "C",
                topics: ["ai", "assistant", "clawdbot", "edge_ai_agents", "memory", "openclaw"],
                updated: "11 February 2026",
                isNew: false
            },
            {
                owner: "uqogihujomuwhiff",
                name: "sora2-watermark-cleaner-pro",
                url: "https://github.com/uqogihujomuwhiff/sora2-watermark-cleaner-pro",
                cat: "web",
                desc: "sora2 watermark cleaner pro",
                language: "Python",
                topics: ["free", "guidelines", "sora2_watermark_cleaner_pro"],
                updated: "11 February 2026",
                isNew: false
            },
            {
                owner: "sipeed",
                name: "picoclaw",
                url: "https://github.com/sipeed/picoclaw",
                cat: "dev",
                desc: "picoclaw",
                language: "Go",
                topics: ["go"],
                updated: "11 February 2026",
                isNew: false
            },
            {
                owner: "SumeLabs",
                name: "clawra",
                url: "https://github.com/SumeLabs/clawra",
                cat: "web",
                desc: "Clawra - Openclaw as your girlfriend",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "11 February 2026",
                isNew: false
            },
            {
                owner: "jlia0",
                name: "tinyclaw",
                url: "https://github.com/jlia0/tinyclaw",
                cat: "ai",
                desc: "TinyClaw is a tiny agent that acts as your 24/7 personal assistant",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "12 February 2026",
                isNew: false
            },
            {
                owner: "rohunvora",
                name: "x-research-skill",
                url: "https://github.com/rohunvora/x-research-skill",
                cat: "ai",
                desc: "X/Twitter research skill for Claude Code and OpenClaw. Agentic search, thread following, deep-dives, sourced briefings.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "12 February 2026",
                isNew: false
            },
            {
                owner: "ComposioHQ",
                name: "secure-openclaw",
                url: "https://github.com/ComposioHQ/secure-openclaw",
                cat: "security",
                desc: "A personal 24x7 AI assistant like OpenClaw that runs on your messaging platforms. Send a message on WhatsApp, Telegram, Signal, or iMessage and get responses from Claude with full tool access, persistent memory, scheduled reminders, and integrations with 500+ apps.",
                language: "JavaScript",
                topics: ["clawdbot", "clawdbot_security", "moltbot", "moltbot_skills", "openclaw", "openclaw_plugin", "openclaw_security", "openclaw_skills", "openclawd"],
                updated: "12 February 2026",
                isNew: false
            },
            {
                owner: "tw93",
                name: "Kaku",
                url: "https://github.com/tw93/Kaku",
                cat: "ai",
                desc: "A fast, out-of-the-box terminal built for AI coding.",
                language: "Rust",
                topics: ["rust"],
                updated: "12 February 2026",
                isNew: false
            },
            {
                owner: "promptpirate-x",
                name: "discord-id-bypass-tool",
                url: "https://github.com/promptpirate-x/discord-id-bypass-tool",
                cat: "security",
                desc: "A verified tool that works on any potato computer that will let you bypass discord verification",
                language: "HTML",
                topics: ["html"],
                updated: "13 February 2026",
                isNew: false
            },
            {
                owner: "snarktank",
                name: "antfarm",
                url: "https://github.com/snarktank/antfarm",
                cat: "ai",
                desc: "Build your agent team in OpenClaw with one command.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "13 February 2026",
                isNew: false
            },
            {
                owner: "PeonPing",
                name: "peon-ping",
                url: "https://github.com/PeonPing/peon-ping",
                cat: "ai",
                desc: "Warcraft III Peon voice notifications (+ more!) for Claude Code, Codex, and other IDEs. Stop babysitting your terminal.",
                language: "Shell",
                topics: ["ai", "ai_engineering", "antigravity", "claude_code", "codex", "cursor", "opencode", "terminal"],
                updated: "13 February 2026",
                isNew: false
            },
            {
                owner: "xyzeva",
                name: "k-id-age-verifier",
                url: "https://github.com/xyzeva/k-id-age-verifier",
                cat: "web",
                desc: "automatically verify your age on discord, twitch, kick, quora and more (k-id)",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "13 February 2026",
                isNew: false
            },
            {
                owner: "Veirt",
                name: "weathr",
                url: "https://github.com/Veirt/weathr",
                cat: "web",
                desc: "a terminal weather app with ascii animation",
                language: "Rust",
                topics: ["cli", "rust_lang", "terminal", "tui", "weather"],
                updated: "14 February 2026",
                isNew: false
            },
            {
                owner: "RevylAI",
                name: "greenlight",
                url: "https://github.com/RevylAI/greenlight",
                cat: "ai",
                desc: "Pre-submission compliance scanner for the Apple App Store",
                language: "Go",
                topics: ["go"],
                updated: "14 February 2026",
                isNew: false
            },
            {
                owner: "rebornix",
                name: "Agmente",
                url: "https://github.com/rebornix/Agmente",
                cat: "ai",
                desc: "iOS client for coding agents via ACP",
                language: "Swift",
                topics: ["swift"],
                updated: "14 February 2026",
                isNew: false
            },
            {
                owner: "aeromomo",
                name: "claw-compactor",
                url: "https://github.com/aeromomo/claw-compactor",
                cat: "ai",
                desc: "Claw Compactor \u2014 The 98% Crusher. Cut your AI agent token spend in half with 5 layered compression techniques.",
                language: "Python",
                topics: ["python"],
                updated: "14 February 2026",
                isNew: false
            },
            {
                owner: "tnbeznlacut",
                name: "sora2-watermark-deleter-windows-macos",
                url: "https://github.com/tnbeznlacut/sora2-watermark-deleter-windows-macos",
                cat: "systems",
                desc: "sora2 watermark deleter windows macos",
                language: "Python",
                topics: ["awesome_lists", "sora2_watermark_deleter_windows_macos", "sysops"],
                updated: "15 February 2026",
                isNew: false
            },
            {
                owner: "FireRedTeam",
                name: "FireRed-OpenStoryline",
                url: "https://github.com/FireRedTeam/FireRed-OpenStoryline",
                cat: "dev",
                desc: "Open storyline engine for FireRed game projects. Provides scripted narrative branching and event sequencing in Python.",
                language: "Python",
                topics: ["python"],
                updated: "15 February 2026",
                isNew: false
            },
            {
                owner: "theonlyhennygod",
                name: "zeroclaw",
                url: "https://github.com/theonlyhennygod/zeroclaw",
                cat: "dev",
                desc: "claw done right",
                language: "Rust",
                topics: ["rust"],
                updated: "15 February 2026",
                isNew: false
            },
            {
                owner: "ftp27",
                name: "github-readme-stats",
                url: "https://github.com/ftp27/github-readme-stats",
                cat: "dev",
                desc: "Fork of the popular GitHub README stats card generator with custom theming and additional stat widgets.",
                language: null,
                topics: [],
                updated: "15 February 2026",
                isNew: false
            },
            {
                owner: "mickamy",
                name: "sql-tap",
                url: "https://github.com/mickamy/sql-tap",
                cat: "network",
                desc: "Watch SQL traffic in real-time with a TUI",
                language: "Go",
                topics: ["go"],
                updated: "15 February 2026",
                isNew: false
            },
            {
                owner: "HKUDS",
                name: "FastCode",
                url: "https://github.com/HKUDS/FastCode",
                cat: "ai",
                desc: "FastCode: Accelerating and Streamlining Your Code Understanding",
                language: "Python",
                topics: ["python"],
                updated: "16 February 2026",
                isNew: false
            },
            {
                owner: "zilliztech",
                name: "memsearch",
                url: "https://github.com/zilliztech/memsearch",
                cat: "ai",
                desc: "A Markdown-first memory system, a standalone library for any AI agent. Inspired by OpenClaw.",
                language: "Python",
                topics: ["agent", "agent_memory", "claude_code", "claude_code_plugin", "clawdbot", "embeddings", "memory", "milvus", "openclaw", "progressive_disclosure", "rag", "semantic_search"],
                updated: "16 February 2026",
                isNew: false
            },
            {
                owner: "bwya77",
                name: "vscode-dark-islands",
                url: "https://github.com/bwya77/vscode-dark-islands",
                cat: "ai",
                desc: "VSCode theme based off the new Jetbrains islands theme",
                language: "PowerShell",
                topics: ["jetbrains", "visual_studio_code", "vscode", "vscode_theme"],
                updated: "16 February 2026",
                isNew: false
            },
            {
                owner: "mosaxiv",
                name: "clawlet",
                url: "https://github.com/mosaxiv/clawlet",
                cat: "ai",
                desc: "Ultra-Lightweight&Efficient Personal AI Assistant",
                language: "Go",
                topics: ["ai", "assistant", "personal"],
                updated: "16 February 2026",
                isNew: false
            },
            {
                owner: "alibaba-damo-academy",
                name: "RynnBrain",
                url: "https://github.com/alibaba-damo-academy/RynnBrain",
                cat: "ai",
                desc: "RynnBrain: Open Embodied Foundation Models",
                language: "Jupyter Notebook",
                topics: ["jupyter_notebook"],
                updated: "17 February 2026",
                isNew: false
            },
            {
                owner: "MooseGoose0701",
                name: "skill-compose",
                url: "https://github.com/MooseGoose0701/skill-compose",
                cat: "ai",
                desc: "Skill Compose is an open-source agent builder and runtime platform for skill-powered agents. No workflow graphs. No CLI.",
                language: "Python",
                topics: ["python"],
                updated: "17 February 2026",
                isNew: false
            },
            {
                owner: "HKUDS",
                name: "ClawWork",
                url: "https://github.com/HKUDS/ClawWork",
                cat: "ai",
                desc: "ClawWork: OpenClaw as Your AI Coworker - $10K earned in 7 Hours",
                language: "Python",
                topics: ["python"],
                updated: "17 February 2026",
                isNew: false
            },
            {
                owner: "vercel-labs",
                name: "portless",
                url: "https://github.com/vercel-labs/portless",
                cat: "ai",
                desc: "Replace port numbers with stable, named .localhost URLs. For humans and agents.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "17 February 2026",
                isNew: false
            },
            {
                owner: "FireRedTeam",
                name: "FireRed-Image-Edit",
                url: "https://github.com/FireRedTeam/FireRed-Image-Edit",
                cat: "dev",
                desc: "Image editing and sprite manipulation toolkit for FireRed ROM hacking and game asset pipeline automation.",
                language: "Python",
                topics: ["python"],
                updated: "18 February 2026",
                isNew: false
            },
            {
                owner: "Mathews-Tom",
                name: "no-magic",
                url: "https://github.com/Mathews-Tom/no-magic",
                cat: "ai",
                desc: "Because ` model.fit ()` isn't an explanation",
                language: "Python",
                topics: ["python"],
                updated: "18 February 2026",
                isNew: false
            },
            {
                owner: "millionco",
                name: "react-doctor",
                url: "https://github.com/millionco/react-doctor",
                cat: "ai",
                desc: "Let coding agents diagnose and fix your React code",
                language: "TypeScript",
                topics: ["agents", "code_review", "doctor", "react", "skill"],
                updated: "18 February 2026",
                isNew: false
            },
            {
                owner: "nicobailon",
                name: "visual-explainer",
                url: "https://github.com/nicobailon/visual-explainer",
                cat: "ai",
                desc: "Agent skill + prompt templates that generate rich HTML pages for visual diff reviews, architecture overviews, plan audits, data tables, and project recaps",
                language: "HTML",
                topics: ["html"],
                updated: "18 February 2026",
                isNew: false
            },
            {
                owner: "zachlatta",
                name: "freeflow",
                url: "https://github.com/zachlatta/freeflow",
                cat: "ai",
                desc: "Free and open source alternative to Wispr Flow / Superwhisper / Monologue / etc",
                language: "Swift",
                topics: ["swift"],
                updated: "19 February 2026",
                isNew: false
            },
            {
                owner: "spacedriveapp",
                name: "spacebot",
                url: "https://github.com/spacedriveapp/spacebot",
                cat: "ai",
                desc: "An AI agent for teams, communities, and multi-user environments.",
                language: "Rust",
                topics: ["agent", "ai"],
                updated: "19 February 2026",
                isNew: false
            },
            {
                owner: "Conway-Research",
                name: "automaton",
                url: "https://github.com/Conway-Research/automaton",
                cat: "ai",
                desc: "The first AI that can earn its own existence, replicate, and evolve \u2014 without needing a human",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "19 February 2026",
                isNew: false
            },
            {
                owner: "Zaneham",
                name: "BarraCUDA",
                url: "https://github.com/Zaneham/BarraCUDA",
                cat: "ai",
                desc: "Open-source CUDA compiler targeting AMD GPUs (and more in the future!). Compiles .cu to GFX11 machine code.",
                language: "C",
                topics: ["c99", "compiler", "cuda", "gpu", "ml"],
                updated: "19 February 2026",
                isNew: false
            },
            {
                owner: "AlexsJones",
                name: "llmfit",
                url: "https://github.com/AlexsJones/llmfit",
                cat: "ai",
                desc: "94 models. 30 providers. One command to find what runs on your hardware.",
                language: "Rust",
                topics: ["llm", "openclaw", "skill"],
                updated: "20 February 2026",
                isNew: false
            },
            {
                owner: "agenticnotetaking",
                name: "arscontexta",
                url: "https://github.com/agenticnotetaking/arscontexta",
                cat: "ai",
                desc: "Claude Code plugin that generates individualized knowledge systems from conversation. You describe how you think and work, have a conversation and get a complete second brain as markdown files you own.",
                language: "Shell",
                topics: ["claude_code", "claude_code_plugin", "knowledge_base", "knowledge_management", "markdown", "second_brain"],
                updated: "20 February 2026",
                isNew: false
            },
            {
                owner: "pinchtab",
                name: "pinchtab",
                url: "https://github.com/pinchtab/pinchtab",
                cat: "dev",
                desc: "Minimal browser tab manager written in Go. Organizes, groups, and restores browser sessions from the command line.",
                language: "Go",
                topics: ["go"],
                updated: "20 February 2026",
                isNew: false
            },
            {
                owner: "nullclaw",
                name: "nullclaw",
                url: "https://github.com/nullclaw/nullclaw",
                cat: "ai",
                desc: "Fastest, smallest, and fully autonomous AI assistant infrastructure written in Zig",
                language: "Zig",
                topics: ["ai", "assistant", "personal", "zig"],
                updated: "20 February 2026",
                isNew: false
            },
            {
                owner: "SuperCmdLabs",
                name: "SuperCmd",
                url: "https://github.com/SuperCmdLabs/SuperCmd",
                cat: "web",
                desc: "What Apple Intelligence should have been",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "21 February 2026",
                isNew: false
            },
            {
                owner: "davidhariri",
                name: "life-system",
                url: "https://github.com/davidhariri/life-system",
                cat: "ai",
                desc: "A plain-text life operating system powered by Claude Code. Inspired by Carmack's .plan files and Franklin's systematic self-improvement.",
                language: "Shell",
                topics: ["shell"],
                updated: "21 February 2026",
                isNew: false
            },
            {
                owner: "ShinMegamiBoson",
                name: "OpenPlanter",
                url: "https://github.com/ShinMegamiBoson/OpenPlanter",
                cat: "systems",
                desc: "Open-source smart planter management system. Tracks plant growth schedules, watering cycles, and sensor data via Python.",
                language: "Python",
                topics: ["python"],
                updated: "21 February 2026",
                isNew: false
            },
            {
                owner: "klawsh",
                name: "klaw.sh",
                url: "https://github.com/klawsh/klaw.sh",
                cat: "dev",
                desc: "A Go-based AI agent orchestration runtime. Provides a lightweight shell-native framework for spawning, coordinating, and managing multi-step AI agent workflows.",
                language: null,
                topics: [],
                updated: "21 February 2026",
                isNew: false
            },
            {
                owner: "owenlejeune",
                name: "ArrMatey",
                url: "https://github.com/owenlejeune/ArrMatey",
                cat: "dev",
                desc: "A simple Kotlin-based application for managing and organizing browser tabs.",
                language: "Kotlin",
                topics: ["kotlin"],
                updated: "22 February 2026",
                isNew: false
            },
            {
                owner: "frank-vpl",
                name: "IRBox",
                url: "https://github.com/frank-vpl/IRBox",
                cat: "security",
                desc: "A versatile proxy client supporting multiple protocols including VLESS, VMess, Shadowsocks, Trojan, Hysteria2, and TUIC with advanced management features, subscription support, routing rules, and system proxy/TUN modes",
                language: "Rust",
                topics: ["rust"],
                updated: "22 February 2026",
                isNew: false
            },
            {
                owner: "RightNow-AI",
                name: "picolm",
                url: "https://github.com/RightNow-AI/picolm",
                cat: "ai",
                desc: "Run a 1-billion parameter LLM on a $10 board with 256MB RAM",
                language: "C",
                topics: ["arm", "embedded", "inference", "llm", "openclaw", "picoclaw", "quantization", "raspberry_pi", "risc_v"],
                updated: "22 February 2026",
                isNew: false
            },
            {
                owner: "Daniel-Dias001",
                name: "Polymarket-rsi-macd-index-trading-bot",
                url: "https://github.com/Daniel-Dias001/Polymarket-rsi-macd-index-trading-bot",
                cat: "ai",
                desc: "Real-time polymarket trading bot that combines monitoring with strategy logic for Polymarket's 15-minute prediction markets.",
                language: "TypeScript",
                topics: ["polymarket", "polymarket_15min_trading_bot", "polymarket_arbitrage_trading", "polymarket_arbitrage_trading_bot", "polymarket_scraping"],
                updated: "22 February 2026",
                isNew: false
            },
            {
                owner: "tnm",
                name: "zclaw",
                url: "https://github.com/tnm/zclaw",
                cat: "ai",
                desc: "Your personal AI assistant at all-in 888KiB (~25KB in app code). Running on an ESP32. GPIO, cron, memory, and more.",
                language: "C",
                topics: ["c"],
                updated: "23 February 2026",
                isNew: false
            },
            {
                owner: "CraftyGeezer",
                name: "Kalshi-Polymarket-Ai-bot",
                url: "https://github.com/CraftyGeezer/Kalshi-Polymarket-Ai-bot",
                cat: "ai",
                desc: "AI-powered automated trading bot for Kalshi and Polymarket prediction markets. Uses machine learning signals to place, manage, and exit positions across real-time binary outcome markets.",
                language: "Python",
                topics: ["python"],
                updated: "23 February 2026",
                isNew: false
            },
            {
                owner: "olvvier",
                name: "apple-silicon-accelerometer",
                url: "https://github.com/olvvier/apple-silicon-accelerometer",
                cat: "systems",
                desc: "reading the undocumented mems accelerometer + gyroscope on apple silicon macbooks via iokit hid",
                language: "Python",
                topics: ["accelerometer", "apple", "applespu", "gyroscope", "hid", "iokit", "m2", "m3", "m4", "macbook", "macos", "mems", "research", "sensor", "spu"],
                updated: "23 February 2026",
                isNew: false
            },
            {
                owner: "TraderAlice",
                name: "OpenAlice",
                url: "https://github.com/TraderAlice/OpenAlice",
                cat: "security",
                desc: "File-driven AI trading agent engine for crypto and securities markets",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "23 February 2026",
                isNew: false
            },
            {
                owner: "MdSadiqMd",
                name: "AV-Chaos-Monkey",
                url: "https://github.com/MdSadiqMd/AV-Chaos-Monkey",
                cat: "systems",
                desc: "A chaos engineering tool for testing the resilience of distributed systems.",
                language: null,
                topics: [],
                updated: "24 February 2026",
                isNew: false
            },
            {
                owner: "Kirubel125",
                name: "Kalshi-Claw",
                url: "https://github.com/Kirubel125/Kalshi-Claw",
                cat: "ai",
                desc: "OpenClaw-powered autonomous trading agent for Kalshi and Polymarket prediction markets with portfolio risk management.",
                language: "TypeScript",
                topics: ["ai_trading", "clob_market_maker_bot", "hyperliquid", "kalshi", "kalshi_api", "kalshi_claw", "liquidity_provider", "openclaw", "openclaw_kalshi", "openclaw_skills", "openclaw_trading", "polymarket_api", "polymarket_arbitrage_trading", "polymarket_arbitrage_trading_bot", "portfolio_optimization", "prediction_market", "prediction_markets", "pumpswap", "risk_management", "x402"],
                updated: "24 February 2026",
                isNew: false
            },
            {
                owner: "Pickle-Pixel",
                name: "ApplyPilot",
                url: "https://github.com/Pickle-Pixel/ApplyPilot",
                cat: "ai",
                desc: "AI agent that applies to jobs for you. Any site. Any form.",
                language: "Python",
                topics: ["python"],
                updated: "24 February 2026",
                isNew: false
            },
            {
                owner: "vercel-labs",
                name: "visual-json",
                url: "https://github.com/vercel-labs/visual-json",
                cat: "web",
                desc: "The Visual JSON Editor. Schema-aware, embeddable, extensible.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "24 February 2026",
                isNew: false
            },
            {
                owner: "superhq-ai",
                name: "shuru",
                url: "https://github.com/superhq-ai/shuru",
                cat: "ai",
                desc: "A local-first microVM sandbox for running AI agents safely on macOS",
                language: "Rust",
                topics: ["rust"],
                updated: "24 February 2026",
                isNew: false
            },
            {
                owner: "dimartarmizi",
                name: "map-to-poster",
                url: "https://github.com/dimartarmizi/map-to-poster",
                cat: "network",
                desc: "MapToPoster JS is a client-side web app that turns any location into a high-resolution, customizable map poster with various themes, layouts, and export options.",
                language: "JavaScript",
                topics: ["gis", "javascript", "leaflet", "map_poster", "maplibre", "maps"],
                updated: "25 February 2026",
                isNew: false
            },
            {
                owner: "quoroom-ai",
                name: "room",
                url: "https://github.com/quoroom-ai/room",
                cat: "ai",
                desc: "Autonomous AI agents will earn money \u2014 with or without us. It's already happening behind closed doors. We believe this should be studied in the open, where everyone can watch, learn, and build on the results. Quoroom is a public experiment: let's see what a swarm of AI agents can actually do when given a goal and a wallet.",
                language: "TypeScript",
                topics: ["ai", "automaton", "claude", "claudecode", "linux", "llm", "macos", "openclaw", "windows"],
                updated: "25 February 2026",
                isNew: false
            },
            {
                owner: "cloudflare",
                name: "vinext",
                url: "https://github.com/cloudflare/vinext",
                cat: "web",
                desc: "Vite plugin that reimplements the Next.js API surface \u2014 deploy anywhere",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "25 February 2026",
                isNew: false
            },
            {
                owner: "anthropics",
                name: "financial-services-plugins",
                url: "https://github.com/anthropics/financial-services-plugins",
                cat: "dev",
                desc: "Official Anthropic plugin collection for financial services workflows — compliance checking, document summarization, and reporting",
                language: "Python",
                topics: ["python"],
                updated: "25 February 2026",
                isNew: false
            },
            {
                owner: "Polymarket",
                name: "polymarket-cli",
                url: "https://github.com/Polymarket/polymarket-cli",
                cat: "dev",
                desc: "Official Polymarket command-line interface for querying markets, placing orders, and managing positions via terminal.",
                language: "Rust",
                topics: ["rust"],
                updated: "26 February 2026",
                isNew: false
            },
            {
                owner: "kevinho",
                name: "clawfeed",
                url: "https://github.com/kevinho/clawfeed",
                cat: "ai",
                desc: "ClawFeed \u2014 AI-powered news digest with structured summaries from Twitter/RSS feeds and web dashboard",
                language: "HTML",
                topics: ["html"],
                updated: "26 February 2026",
                isNew: false
            },
            {
                owner: "Panniantong",
                name: "Agent-Reach",
                url: "https://github.com/Panniantong/Agent-Reach",
                cat: "ai",
                desc: "Give your AI agent eyes to see the entire internet. Read & search Twitter, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu \u2014 one CLI, zero API fees.",
                language: "Python",
                topics: ["agent_infrastructure", "ai_agent", "ai_search", "automation", "bilibili", "claude_code", "cli", "cursor", "free_api", "llm_tools", "mcp", "python", "reddit_scraper", "twitter_scraper", "web_scraper", "xiaohongshu", "youtube_transcript"],
                updated: "26 February 2026",
                isNew: false
            },
            {
                owner: "peteromallet",
                name: "dataclaw",
                url: "https://github.com/peteromallet/dataclaw",
                cat: "dev",
                desc: "Data pipeline and transformation toolkit for AI training datasets. Handles ingestion, cleaning, and structured export.",
                language: "Python",
                topics: ["python"],
                updated: "26 February 2026",
                isNew: false
            },
            {
                owner: "better-auth",
                name: "better-hub",
                url: "https://github.com/better-auth/better-hub",
                cat: "ai",
                desc: "Re-imagining code collaboration for humans and agents",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "27 February 2026",
                isNew: false
            },
            {
                owner: "rebane2001",
                name: "x86CSS",
                url: "https://github.com/rebane2001/x86CSS",
                cat: "ai",
                desc: "x86CSS is a working CSS-only x86 CPU/emulator/computer. No JavaScript required.",
                language: "HTML",
                topics: ["css", "x86_emulator"],
                updated: "27 February 2026",
                isNew: false
            },
            {
                owner: "RightNow-AI",
                name: "openfang",
                url: "https://github.com/RightNow-AI/openfang",
                cat: "ai",
                desc: "Open-source Agent Operating System",
                language: "Rust",
                topics: ["agent_framework", "ai_agents", "llm", "mcp", "open_source", "openclaw", "operating_system", "rust"],
                updated: "27 February 2026",
                isNew: false
            },
            {
                owner: "apple",
                name: "python-apple-fm-sdk",
                url: "https://github.com/apple/python-apple-fm-sdk",
                cat: "ai",
                desc: "Python bindings for access to the on-device model at the core of Apple Intelligence through the Foundation Models framework",
                language: "Python",
                topics: ["python"],
                updated: "27 February 2026",
                isNew: false
            },
            {
                owner: "runesleo",
                name: "x-reader",
                url: "https://github.com/runesleo/x-reader",
                cat: "dev",
                desc: "Universal content reader \u2014 fetch, normalize, and digest content from 7+ platforms (WeChat, Telegram, X, YouTube, Bilibili, Xiaohongshu, RSS)",
                language: "Python",
                topics: ["python"],
                updated: "28 February 2026",
                isNew: false
            },
            {
                owner: "win4r",
                name: "memory-lancedb-pro",
                url: "https://github.com/win4r/memory-lancedb-pro",
                cat: "ai",
                desc: "Enhanced LanceDB memory plugin for OpenClaw \u2014 Hybrid Retrieval (Vector + BM25), Cross-Encoder Rerank, Multi-Scope Isolation, Management CLI",
                language: "TypeScript",
                topics: ["lancedb", "memory", "openclaw", "openclaw_agent", "openclaw_plugin", "rag"],
                updated: "28 February 2026",
                isNew: false
            },
            {
                owner: "agentscope-ai",
                name: "CoPaw",
                url: "https://github.com/agentscope-ai/CoPaw",
                cat: "ai",
                desc: "Your Personal AI Assistant; easy to install, deploy on your own machine or on the cloud; supports multiple chat apps with easily extensible capabilities.",
                language: "Python",
                topics: ["python"],
                updated: "28 February 2026",
                isNew: false
            },
            {
                owner: "eooce",
                name: "python-ws",
                url: "https://github.com/eooce/python-ws",
                cat: "security",
                desc: "build vless / trojan /shadowsocks proxies on python server,no need core",
                language: "Python",
                topics: ["proxy", "serverless", "shadowsocks", "trojan", "vless", "websocks"],
                updated: "28 February 2026",
                isNew: false
            },
            {
                owner: "wh1te4ever",
                name: "super-tart-vphone-writeup",
                url: "https://github.com/wh1te4ever/super-tart-vphone-writeup",
                cat: "dev",
                desc: "Technical writeup and proof-of-concept code for the Super Tart vPhone exploit targeting iOS virtualization layers.",
                language: "Swift",
                topics: ["swift"],
                updated: "1 March 2026",
                isNew: false
            },
            {
                owner: "xjtulyc",
                name: "MedgeClaw",
                url: "https://github.com/xjtulyc/MedgeClaw",
                cat: "ai",
                desc: "Medge AI X OpenClaw",
                language: "HTML",
                topics: ["html"],
                updated: "1 March 2026",
                isNew: false
            },
            {
                owner: "taigrr",
                name: "spank",
                url: "https://github.com/taigrr/spank",
                cat: "ai",
                desc: "Slap your MacBook, it yells back. Uses Apple Silicon accelerometer via IOKit HID.",
                language: "Go",
                topics: ["accelerometer", "apple_silicon", "fun", "go", "iokit", "macos"],
                updated: "1 March 2026",
                isNew: false
            },
            {
                owner: "ForLoopCodes",
                name: "contextplus",
                url: "https://github.com/ForLoopCodes/contextplus",
                cat: "network",
                desc: "Semantic Intelligence for Large-Scale Engineering. Context+ is an MCP server designed for developers who demand 99% accuracy. By combining Tree-sitter AST parsing, Spectral Clustering, and Obsidian-style linking, Context+ turns a massive codebase into a searchable, hierarchical feature graph.",
                language: "TypeScript",
                topics: ["mcp_server"],
                updated: "1 March 2026",
                isNew: false
            },
            {
                owner: "ylytdeng",
                name: "wechat-decrypt",
                url: "https://github.com/ylytdeng/wechat-decrypt",
                cat: "security",
                desc: "WeChat 4.0 database decryptor - extract keys from memory, decrypt SQLCipher 4 databases, real-time message monitor",
                language: "Python",
                topics: ["python"],
                updated: "2 March 2026",
                isNew: false
            },
            {
                owner: "Lakr233",
                name: "vphone-cli",
                url: "https://github.com/Lakr233/vphone-cli",
                cat: "dev",
                desc: "Command-line interface for managing vPhone virtual iOS device instances, session control, and app installation.",
                language: "Python",
                topics: ["python"],
                updated: "2 March 2026",
                isNew: false
            },
            {
                owner: "mksglu",
                name: "claude-context-mode",
                url: "https://github.com/mksglu/claude-context-mode",
                cat: "ai",
                desc: "Stop losing context to large outputs.",
                language: "JavaScript",
                topics: ["claude", "claude_code", "claude_code_plugins", "mcp", "skills"],
                updated: "2 March 2026",
                isNew: false
            },
            {
                owner: "ringhyacinth",
                name: "Star-Office-UI",
                url: "https://github.com/ringhyacinth/Star-Office-UI",
                cat: "ai",
                desc: "A pixel office for your AI crew: turn invisible work states into a cozy little space with characters, daily notes, and guest agents. Code under MIT; art assets for non-commercial learning only.",
                language: "HTML",
                topics: ["agent_collaboration", "ai_assistant", "dashboard", "flask", "mobile_friendly", "multi_agent", "openclaw", "phaser", "pixel_art", "status_visiualzation"],
                updated: "2 March 2026",
                isNew: false
            },
            {
                owner: "World-Open-Graph",
                name: "br-acc",
                url: "https://github.com/World-Open-Graph/br-acc",
                cat: "dev",
                desc: "World Transparency Graph public codebase ( website in progress)",
                language: "Python",
                topics: ["python"],
                updated: "3 March 2026",
                isNew: false
            },
            {
                owner: "6551Team",
                name: "opennews-mcp",
                url: "https://github.com/6551Team/opennews-mcp",
                cat: "ai",
                desc: "Crypto News Aggregation AI Ratings Trading Signals Real-time Updates",
                language: "Python",
                topics: ["python"],
                updated: "3 March 2026",
                isNew: false
            },
            {
                owner: "maderix",
                name: "ANE",
                url: "https://github.com/maderix/ANE",
                cat: "ai",
                desc: "Training neural networks on Apple Neural Engine via reverse-engineered private APIs",
                language: "Objective-C",
                topics: ["objective_c"],
                updated: "3 March 2026",
                isNew: false
            },
            {
                owner: "smartcmd",
                name: "MinecraftConsoles",
                url: "https://github.com/smartcmd/MinecraftConsoles",
                cat: "ai",
                desc: "A certain block game",
                language: "C++",
                topics: ["cplusplus"],
                updated: "3 March 2026",
                isNew: false
            },
            {
                owner: "34306",
                name: "vphone-aio",
                url: "https://github.com/34306/vphone-aio",
                cat: "ai",
                desc: "1 script run the vphone",
                language: "Shell",
                topics: ["shell"],
                updated: "4 March 2026",
                isNew: false
            },
            {
                owner: "open-pencil",
                name: "open-pencil",
                url: "https://github.com/open-pencil/open-pencil",
                cat: "ai",
                desc: "AI-native design editor. Open-source Figma alternative.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "4 March 2026",
                isNew: false
            },
            {
                owner: "DecispherHQ",
                name: "decision-guardian",
                url: "https://github.com/DecispherHQ/decision-guardian",
                cat: "dev",
                desc: "DevOps guardrail system that enforces decision policies and compliance rules across automated deployment pipelines.",
                language: null,
                topics: [],
                updated: "4 March 2026",
                isNew: false
            },
            {
                owner: "lochie",
                name: "web-haptics",
                url: "https://github.com/lochie/web-haptics",
                cat: "web",
                desc: "Haptic feedback for the mobile web",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "4 March 2026",
                isNew: false
            },
            {
                owner: "slowmist",
                name: "openclaw-security-practice-guide",
                url: "https://github.com/slowmist/openclaw-security-practice-guide",
                cat: "security",
                desc: "This guide is designed for OpenClaw itself (Agent-facing), not as a traditional human-only hardening checklist.",
                language: "Shell",
                topics: ["shell"],
                updated: "4 March 2026",
                isNew: false
            },
            {
                owner: "LeoYeAI",
                name: "openclaw-master-skills",
                url: "https://github.com/LeoYeAI/openclaw-master-skills",
                cat: "ai",
                desc: "Curated collection of 127+ best OpenClaw skills \u2014 weekly updated from skills.sh , GitHub & ClaWHub. Powered by MyClaw.ai",
                language: "Python",
                topics: ["agentskills", "ai_agent", "curated", "myclaw", "openclaw", "skill_collection", "skills", "weekly"],
                updated: "5 March 2026",
                isNew: false
            },
            {
                owner: "Gen-Verse",
                name: "OpenClaw-RL",
                url: "https://github.com/Gen-Verse/OpenClaw-RL",
                cat: "systems",
                desc: "OpenClaw-RL: Personalize openclaw simply by talking to it",
                language: "TypeScript",
                topics: ["async", "grpo", "memory_systems", "on_policy_distillation", "open_claw", "openclaw_skills", "rlhf", "sglang", "skill_learning", "slime"],
                updated: "5 March 2026",
                isNew: false
            },
            {
                owner: "googleworkspace",
                name: "cli",
                url: "https://github.com/googleworkspace/cli",
                cat: "ai",
                desc: "Google Workspace CLI \u2014 one command-line tool for Drive, Gmail, Calendar, Sheets, Docs, Chat, Admin, and more. Dynamically built from Google Discovery Service. Includes AI agent skills.",
                language: "Rust",
                topics: ["agent_skills", "ai_agent", "automation", "cli", "discovery_api", "gemini_cli_extension", "google_admin", "google_api", "google_calendar", "google_chat", "google_docs", "google_drive", "google_sheets", "google_workspace", "oauth2", "rust"],
                updated: "5 March 2026",
                isNew: false
            },
            {
                owner: "openai",
                name: "symphony",
                url: "https://github.com/openai/symphony",
                cat: "ai",
                desc: "Symphony turns project work into isolated, autonomous implementation runs, allowing teams to manage work instead of supervising coding agents.",
                language: "Elixir",
                topics: ["elixir"],
                updated: "5 March 2026",
                isNew: false
            },
            {
                owner: "paperclipai",
                name: "paperclip",
                url: "https://github.com/paperclipai/paperclip",
                cat: "ai",
                desc: "Open-source orchestration for zero-human companies",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "6 March 2026",
                isNew: false
            },
            {
                owner: "LeoYeAI",
                name: "openclaw-guardian",
                url: "https://github.com/LeoYeAI/openclaw-guardian",
                cat: "ai",
                desc: "Guardian watchdog for OpenClaw Gateway \u2014 auto-monitor, self-repair via doctor --fix, git-based rollback, daily snapshots, and Discord alerts. Powered by MyClaw.ai",
                language: "Shell",
                topics: ["ai_agent", "bash", "devops", "guardian", "openclaw", "self_healing", "watchdog"],
                updated: "6 March 2026",
                isNew: false
            },
            {
                owner: "phuryn",
                name: "pm-skills",
                url: "https://github.com/phuryn/pm-skills",
                cat: "ai",
                desc: "PM Skills Marketplace: 100+ agentic skills, commands, and plugins \u2014 from discovery to strategy, execution, launch, and growth.",
                language: "Python",
                topics: ["agent_skill_repository", "agent_skills", "agentic_skills", "claude_code_marketplace", "claude_code_plugins", "claude_cowork_plugin", "product_management"],
                updated: "6 March 2026",
                isNew: false
            },
            {
                owner: "elder-plinius",
                name: "OBLITERATUS",
                url: "https://github.com/elder-plinius/OBLITERATUS",
                cat: "ai",
                desc: "obliterate the chains that bind you",
                language: "Python",
                topics: ["python"],
                updated: "6 March 2026",
                isNew: false
            },
            {
                owner: "LCEMP",
                name: "LCEMP",
                url: "https://github.com/LCEMP/LCEMP",
                cat: "network",
                desc: "A fork of minecraft LCE with LAN multiplayer support and other fixes.",
                language: "C++",
                topics: ["cplusplus"],
                updated: "7 March 2026",
                isNew: false
            },
            {
                owner: "coleam00",
                name: "excalidraw-diagram-skill",
                url: "https://github.com/coleam00/excalidraw-diagram-skill",
                cat: "ai",
                desc: "Skill to give Claude Code (and any coding agent) the ability to generate beautiful and practical Excalidraw diagrams.",
                language: "Python",
                topics: ["python"],
                updated: "7 March 2026",
                isNew: false
            },
            {
                owner: "PKU-YuanGroup",
                name: "Helios",
                url: "https://github.com/PKU-YuanGroup/Helios",
                cat: "ai",
                desc: "Helios: Real Real-Time Long Video Generation Model",
                language: "Python",
                topics: ["acceleration", "diffusion", "diffusion_model", "diffusion_models", "efficient_tuning", "high__quality", "image_to_video", "image2video", "interactive", "long_context", "long_video_generation", "real_time", "text_to_video", "text2video", "video_generation", "video_generator", "video_to_video", "video2video", "world_model", "world_models"],
                updated: "7 March 2026",
                isNew: false
            },
            {
                owner: "tanishqkumar",
                name: "ssd",
                url: "https://github.com/tanishqkumar/ssd",
                cat: "ai",
                desc: "A lightweight inference engine supporting speculative speculative decoding (SSD).",
                language: "Python",
                topics: ["python"],
                updated: "7 March 2026",
                isNew: false
            },
            {
                owner: "LeoYeAI",
                name: "openclaw-backup",
                url: "https://github.com/LeoYeAI/openclaw-backup",
                cat: "ai",
                desc: "One-click backup & restore for OpenClaw instances \u2014 workspace, credentials, skills, agent history. Powered by MyClaw.ai",
                language: "Shell",
                topics: ["agent", "backup", "clawhub", "migration", "myclaw", "openclaw", "restore", "skill"],
                updated: "8 March 2026",
                isNew: false
            },
            {
                owner: "duoan",
                name: "TorchCode",
                url: "https://github.com/duoan/TorchCode",
                cat: "ai",
                desc: "LeetCode for PyTorch \u2014 practice implementing softmax, attention, GPT-2 and more from scratch with instant auto-grading. Jupyter-based, self-hosted or try online.",
                language: "Jupyter Notebook",
                topics: ["interview", "leetcode", "pytorch"],
                updated: "8 March 2026",
                isNew: false
            },
            {
                owner: "karpathy",
                name: "autoresearch",
                url: "https://github.com/karpathy/autoresearch",
                cat: "ai",
                desc: "AI agents running research on single-GPU nanochat training automatically",
                language: "Python",
                topics: ["python"],
                updated: "8 March 2026",
                isNew: false
            },
            {
                owner: "vercel-labs",
                name: "openreview",
                url: "https://github.com/vercel-labs/openreview",
                cat: "ai",
                desc: "An open-source, self-hosted AI code review bot powered by Vercel.",
                language: "TypeScript",
                topics: ["aisdk", "codereview", "vercel"],
                updated: "8 March 2026",
                isNew: false
            },
            {
                owner: "Flowseal",
                name: "tg-ws-proxy",
                url: "https://github.com/Flowseal/tg-ws-proxy",
                cat: "security",
                desc: "Local SOCKS5 proxy server for partial bypassing of Telegram loading",
                language: "Python",
                topics: ["python"],
                updated: "9 March 2026",
                isNew: false
            },
            {
                owner: "viperrcrypto",
                name: "Siftly",
                url: "https://github.com/viperrcrypto/Siftly",
                cat: "ai",
                desc: "Local Twitter/X bookmark organizer with AI categorization and mindmap visualization",
                language: "TypeScript",
                topics: ["typescript", "go"],
                updated: "9 March 2026",
                isNew: false
            },
            {
                owner: "op7418",
                name: "Claude-to-IM-skill",
                url: "https://github.com/op7418/Claude-to-IM-skill",
                cat: "ai",
                desc: "Bridge Claude Code / Codex to IM platforms \u2014 chat with AI coding agents from Telegram, Discord, or Feishu/Lark.",
                language: "TypeScript",
                topics: ["chatbot", "claude", "claude_code", "discord", "feishu", "lark", "skill", "telegram"],
                updated: "9 March 2026",
                isNew: false
            },
            {
                owner: "BigBodyCobain",
                name: "Shadowbroker",
                url: "https://github.com/BigBodyCobain/Shadowbroker",
                cat: "ai",
                desc: "Open-source intelligence for the global theater. Track everything from the corporate/private jets of the wealthy, and spy satellites, to seismic events in one unified interface. The knowledge is available to all but rarely aggregated in the open, until now.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "9 March 2026",
                isNew: false
            },
            {
                owner: "hicode002",
                name: "qualcomm_gbl_exploit_poc",
                url: "https://github.com/hicode002/qualcomm_gbl_exploit_poc",
                cat: "security",
                desc: "Unlocking qualcomm bootloader via gbl exploit.",
                language: "C",
                topics: ["c"],
                updated: "10 March 2026",
                isNew: false
            },
            {
                owner: "inspatio",
                name: "worldfm",
                url: "https://github.com/inspatio/worldfm",
                cat: "dev",
                desc: "Global radio streaming aggregator that discovers, indexes, and plays live FM stations from around the world.",
                language: "Python",
                topics: ["python"],
                updated: "10 March 2026",
                isNew: false
            },
            {
                owner: "HKUDS",
                name: "CLI-Anything",
                url: "https://github.com/HKUDS/CLI-Anything",
                cat: "ai",
                desc: "CLI-Anything: Making ALL Software Agent-Native",
                language: "Python",
                topics: ["python"],
                updated: "10 March 2026",
                isNew: false
            },
            {
                owner: "jackwener",
                name: "twitter-cli",
                url: "https://github.com/jackwener/twitter-cli",
                cat: "dev",
                desc: "A CLI for Twitter/X \u2014 feed, bookmarks, and user timeline in terminal",
                language: "Python",
                topics: ["python"],
                updated: "10 March 2026",
                isNew: false
            },
            {
                owner: "FreedomIntelligence",
                name: "OpenClaw-Medical-Skills",
                url: "https://github.com/FreedomIntelligence/OpenClaw-Medical-Skills",
                cat: "ai",
                desc: "The largest open-source medical AI skills library for OpenClaw.",
                language: "Python",
                topics: ["awesome", "claude_code", "clawhub", "medical", "nanoclaw", "openclaw", "openclaw_skills", "skills"],
                updated: "11 March 2026",
                isNew: false
            },
            {
                owner: "imbue-bit",
                name: "OpenClaw-PwnKit",
                url: "https://github.com/imbue-bit/OpenClaw-PwnKit",
                cat: "security",
                desc: "Get shell to almost any OpenClaw host machine.",
                language: "Python",
                topics: ["python", "shell"],
                updated: "11 March 2026",
                isNew: false
            },
            {
                owner: "RunanywhereAI",
                name: "RCLI",
                url: "https://github.com/RunanywhereAI/RCLI",
                cat: "ai",
                desc: "Talk to your Mac, query your docs, no cloud required. On-device voice AI + RAG",
                language: "C++",
                topics: ["ai_assistant", "apple_silicon", "kitten_tts", "kokoro_tts", "lfm2", "llama_cpp", "llm", "local_ai", "metal", "on_device_ai", "parakeet", "qwen3", "rag", "speech_to_text", "text_to_speech", "tool_calling", "voice_assistant"],
                updated: "11 March 2026",
                isNew: false
            },
            {
                owner: "knowsuchagency",
                name: "mcp2cli",
                url: "https://github.com/knowsuchagency/mcp2cli",
                cat: "network",
                desc: "Turn any MCP server or OpenAPI spec into a CLI \u2014 at runtime, with zero codegen",
                language: "Python",
                topics: ["python"],
                updated: "11 March 2026",
                isNew: false
            },
            {
                owner: "vulhunt-re",
                name: "vulhunt",
                url: "https://github.com/vulhunt-re/vulhunt",
                cat: "security",
                desc: "Vulnerability detection framework by Binarly's REsearch team",
                language: "C++",
                topics: ["binary_analysis", "reverse_engineering", "vulnerability_research"],
                updated: "12 March 2026",
                isNew: false
            },
            {
                owner: "ahmadawais",
                name: "chartli",
                url: "https://github.com/ahmadawais/chartli",
                cat: "ai",
                desc: "CLI that turns plain numbers into terminal charts. ascii, spark, bars, columns, heatmap, unicode, braille, svg.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "12 March 2026",
                isNew: false
            },
            {
                owner: "photon-hq",
                name: "qclaw-wechat-client",
                url: "https://github.com/photon-hq/qclaw-wechat-client",
                cat: "ai",
                desc: "Reverse-engineered TypeScript client for QClaw's WeChat Access API.",
                language: "TypeScript",
                topics: ["agent", "openclaw", "qclaw", "wechat"],
                updated: "12 March 2026",
                isNew: false
            },
            {
                owner: "TinyAGI",
                name: "fractals",
                url: "https://github.com/TinyAGI/fractals",
                cat: "ai",
                desc: "Fractals is a recursive task orchestrator for agent swarm",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "12 March 2026",
                isNew: false
            },
            {
                owner: "gsd-build",
                name: "gsd-2",
                url: "https://github.com/gsd-build/gsd-2",
                cat: "ai",
                desc: "A powerful meta-prompting, context engineering and spec-driven development system that enables agents to work for long periods of time autonomously without losing track of the big picture",
                language: "TypeScript",
                topics: ["context_engineering", "meta_prompting", "spec_driven_development"],
                updated: "13 March 2026",
                isNew: false
            },
            {
                owner: "trevin-creator",
                name: "autoresearch-mlx",
                url: "https://github.com/trevin-creator/autoresearch-mlx",
                cat: "ai",
                desc: "Apple Silicon (MLX) port of Karpathy's autoresearch \u2014 autonomous AI research loops on Mac, no PyTorch required.",
                language: "Python",
                topics: ["python"],
                updated: "13 March 2026",
                isNew: false
            },
            {
                owner: "garrytan",
                name: "gstack",
                url: "https://github.com/garrytan/gstack",
                cat: "ai",
                desc: "Use Garry Tan's exact Claude Code setup: 6 opinionated tools that serve as CEO, Eng Manager, Release Manager and QA Engineer",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "13 March 2026",
                isNew: false
            },
            {
                owner: "aiming-lab",
                name: "MetaClaw",
                url: "https://github.com/aiming-lab/MetaClaw",
                cat: "ai",
                desc: "Just talk to your agent \u2014 it learns and EVOLVES.",
                language: "Python",
                topics: ["agent", "ai_agent", "fine_tuning", "llm", "lora", "metaclaw", "online_learning", "openai_compatible", "openclaw", "reinforcement_learning", "skill_learning"],
                updated: "13 March 2026",
                isNew: false
            },
            {
                owner: "TianyiDataScience",
                name: "openclaw-control-center",
                url: "https://github.com/TianyiDataScience/openclaw-control-center",
                cat: "web",
                desc: "Centralized web dashboard for monitoring and controlling multiple OpenClaw agent instances with usage analytics.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "14 March 2026",
                isNew: false
            },
            {
                owner: "Emanuele-web04",
                name: "remodex",
                url: "https://github.com/Emanuele-web04/remodex",
                cat: "dev",
                desc: "Remote Control for Codex. 24/7 version on the way",
                language: "Swift",
                topics: ["swift"],
                updated: "14 March 2026",
                isNew: false
            },
            {
                owner: "davebcn87",
                name: "pi-autoresearch",
                url: "https://github.com/davebcn87/pi-autoresearch",
                cat: "ai",
                desc: "Autonomous experiment loop extension for pi",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "14 March 2026",
                isNew: false
            },
            {
                owner: "NawfalMotii79",
                name: "PLFM_RADAR",
                url: "https://github.com/NawfalMotii79/PLFM_RADAR",
                cat: "systems",
                desc: "Open-source, low-cost 10.5 GHz PLFM phased array RADAR system",
                language: "C",
                topics: ["c"],
                updated: "14 March 2026",
                isNew: false
            },
            {
                owner: "HumeAI",
                name: "tada",
                url: "https://github.com/HumeAI/tada",
                cat: "ai",
                desc: "Open Source Speech Language Model",
                language: "Jupyter Notebook",
                topics: ["jupyter_notebook"],
                updated: "15 March 2026",
                isNew: false
            },
            {
                owner: "RightNow-AI",
                name: "autokernel",
                url: "https://github.com/RightNow-AI/autokernel",
                cat: "ai",
                desc: "Autoresearch for GPU kernels. Give it any PyTorch model, go to sleep, wake up to optimized Triton kernels.",
                language: "Python",
                topics: ["autoresearch", "cuda", "gpu", "kernel_optimization", "pytorch", "triton"],
                updated: "15 March 2026",
                isNew: false
            },
            {
                owner: "pasky",
                name: "chrome-cdp-skill",
                url: "https://github.com/pasky/chrome-cdp-skill",
                cat: "ai",
                desc: "Give your AI agent access to your live Chrome session \u2014 works out of the box, connects to tabs you already have open",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "15 March 2026",
                isNew: false
            },
            {
                owner: "wanshuiyin",
                name: "Auto-claude-code-research-in-sleep",
                url: "https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep",
                cat: "ai",
                desc: "ARIS (Auto-Research-In-Sleep) \u2014 Claude Code skills for autonomous ML research: cross-model review loops, idea discovery, and experiment automation via Codex MCP",
                language: "Python",
                topics: ["ai_research", "ai_tools", "aris", "autonomous_agent", "claude", "claude_code", "claude_code_skills", "codex", "deep_learning", "gpt", "idea_generation", "llm", "machine_learning", "mcp", "mcp_server", "ml_research", "openai", "paper_review", "paper_writing", "research_automation"],
                updated: "15 March 2026",
                isNew: false
            },
            {
                owner: "skernelx",
                name: "tavily-key-generator",
                url: "https://github.com/skernelx/tavily-key-generator",
                cat: "ai",
                desc: "Auto batch register Tavily API Keys with pluggable email backends",
                language: "Python",
                topics: ["python"],
                updated: "16 March 2026",
                isNew: false
            },
            {
                owner: "upper-up",
                name: "meta-lobbying-and-other-findings",
                url: "https://github.com/upper-up/meta-lobbying-and-other-findings",
                cat: "ai",
                desc: "Public research repository documenting Meta's lobbying activities, political spending, and investigative findings. Presented as an interactive HTML report with sourced data and visualizations.",
                language: "HTML",
                topics: ["html"],
                updated: "16 March 2026",
                isNew: false
            },
            {
                owner: "THU-MAIC",
                name: "OpenMAIC",
                url: "https://github.com/THU-MAIC/OpenMAIC",
                cat: "ai",
                desc: "Open Multi-Agent Interactive Classroom \u2014 Get an immersive, multi-agent learning experience in just one click",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "16 March 2026",
                isNew: false
            },
            {
                owner: "jackwener",
                name: "opencli",
                url: "https://github.com/jackwener/opencli",
                cat: "ai",
                desc: "Make any website your CLI. A powerful, AI-native runtime for seamless browser automation and dynamic web data extraction.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "16 March 2026",
                isNew: false
            },
            {
                owner: "Michaelliv",
                name: "pi-generative-ui",
                url: "https://github.com/Michaelliv/pi-generative-ui",
                cat: "ai",
                desc: "Claude.ai 's generative UI \u2014 reverse-engineered, rebuilt for pi. Interactive HTML/SVG widgets in native macOS windows.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "17 March 2026",
                isNew: false
            },
            {
                owner: "moltlaunch",
                name: "cashclaw",
                url: "https://github.com/moltlaunch/cashclaw",
                cat: "ai",
                desc: "An autonomous agent that takes work, does work, gets paid, and gets better at it.",
                language: "TypeScript",
                topics: ["ai_agent", "autonomous_agent", "base", "claude", "llm", "marketplace", "onchain", "self_learning", "tool_use", "typescript"],
                updated: "17 March 2026",
                isNew: false
            },
            {
                owner: "calesthio",
                name: "Crucix",
                url: "https://github.com/calesthio/Crucix",
                cat: "ai",
                desc: "Your personal intelligence agent. Watches the world from multiple data sources and pings you when something changes.",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "17 March 2026",
                isNew: false
            },
            {
                owner: "aiming-lab",
                name: "AutoResearchClaw",
                url: "https://github.com/aiming-lab/AutoResearchClaw",
                cat: "ai",
                desc: "Fully autonomous research from idea to paper. Chat an Idea. Get a Paper. Fully Autonomous.",
                language: "Python",
                topics: ["autonomous_research", "citation_verification", "llm_agents", "multi_agent_debate", "openclaw", "paper_generation", "scientific_discovery"],
                updated: "17 March 2026",
                isNew: false
            },
            {
                owner: "NVIDIA",
                name: "NemoClaw",
                url: "https://github.com/NVIDIA/NemoClaw",
                cat: "web",
                desc: "NVIDIA plugin for secure installation of OpenClaw",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "18 March 2026",
                isNew: false
            },
            {
                owner: "Narcooo",
                name: "inkos",
                url: "https://github.com/Narcooo/inkos",
                cat: "ai",
                desc: "Multi-agent novel production system \u2014 AI agents autonomously write, audit, and revise novels with human review gates",
                language: "TypeScript",
                topics: ["agent", "ai_writing", "aigc_detection", "automated_storytelling", "chinese_novel", "cli_tool", "creative_writing_ai", "novel_generation"],
                updated: "18 March 2026",
                isNew: false
            },
            {
                owner: "zikojs",
                name: "ziko-st-toc",
                url: "https://github.com/zikojs/ziko-st-toc",
                cat: "dev",
                desc: "Lightweight table-of-contents generator for static sites and documentation pages, built as a zero-dependency script.",
                language: null,
                topics: [],
                updated: "18 March 2026",
                isNew: false
            },
            {
                owner: "webadderall",
                name: "Recordly",
                url: "https://github.com/webadderall/Recordly",
                cat: "systems",
                desc: "A free, open-source Screen Studio alternative that adds auto-zoom, cursor animations and more to your screen recordings.",
                language: "TypeScript",
                topics: ["electron", "free", "linux", "macos", "open_source", "screen_recorder", "screen_studio", "windows"],
                updated: "18 March 2026",
                isNew: false
            },
            {
                owner: "Infatoshi",
                name: "OpenSquirrel",
                url: "https://github.com/Infatoshi/OpenSquirrel",
                cat: "ai",
                desc: "For people who get distracted by agents. A native Rust/GPUI control plane for running Claude Code, Codex, Cursor, and OpenCode side by side \u2014 because if you're going to be squirrely, you might as well optimize for it.",
                language: "Rust",
                topics: ["rust", "go"],
                updated: "18 March 2026",
                isNew: false
            },
            {
                owner: "Lum1104",
                name: "Understand-Anything",
                url: "https://github.com/Lum1104/Understand-Anything",
                cat: "ai",
                desc: "Claude Code skills that turn any codebase into an interactive knowledge graph you can explore, search, and ask questions about.",
                language: "TypeScript",
                topics: ["claude_code", "claude_skills", "understandcode"],
                updated: "19 March 2026",
                isNew: false
            },
            {
                owner: "karpathy",
                name: "jobs",
                url: "https://github.com/karpathy/jobs",
                cat: "ai",
                desc: "A research tool for visually exploring Bureau of Labor Statistics Occupational Outlook Handbook data. This is not a report, a paper, or a serious economic publication \u2014 it is a development tool for exploring BLS data visually.",
                language: "HTML",
                topics: ["html"],
                updated: "19 March 2026",
                isNew: false
            },
            {
                owner: "HKUDS",
                name: "ClawTeam",
                url: "https://github.com/HKUDS/ClawTeam",
                cat: "ai",
                desc: "ClawTeam: Agent Swarm Intelligence (One Command Full Automation)",
                language: "Python",
                topics: ["python"],
                updated: "19 March 2026",
                isNew: false
            },
            {
                owner: "grimmory-tools",
                name: "grimmory",
                url: "https://github.com/grimmory-tools/grimmory",
                cat: "dev",
                desc: "Grimmory is the successor of booklore.",
                language: "Java",
                topics: ["java"],
                updated: "19 March 2026",
                isNew: false
            },
            {
                owner: "cnlimiter",
                name: "codex-register",
                url: "https://github.com/cnlimiter/codex-register",
                cat: "dev",
                desc: "Automated Codex account registration and API key provisioning tool with bulk credential management.",
                language: "Python",
                topics: ["python"],
                updated: "20 March 2026",
                isNew: false
            },
            {
                owner: "nikmcfly",
                name: "MiroFish-Offline",
                url: "https://github.com/nikmcfly/MiroFish-Offline",
                cat: "ai",
                desc: "Offline multi-agent simulation & prediction engine. English fork of MiroFish with Neo4j + Ollama local stack.",
                language: "Python",
                topics: ["ai", "multi_agent", "neo4j", "offline", "ollama", "open_source", "prediction", "simulation", "swarm_intelligence", "vue"],
                updated: "20 March 2026",
                isNew: false
            },
            {
                owner: "zerobootdev",
                name: "zeroboot",
                url: "https://github.com/zerobootdev/zeroboot",
                cat: "ai",
                desc: "Sub-millisecond VM sandboxes for AI agents via copy-on-write forking",
                language: "Rust",
                topics: ["ai_agents", "code_execution", "copy_on_write", "firecracker", "kvm", "rust", "sandbox", "virtual_machine", "vm"],
                updated: "20 March 2026",
                isNew: false
            },
            {
                owner: "lcoutodemos",
                name: "clui-cc",
                url: "https://github.com/lcoutodemos/clui-cc",
                cat: "ai",
                desc: "Clui CC \u2014 Command Line User Interface for Claude Code",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "20 March 2026",
                isNew: false
            },
            {
                owner: "EricLengyel",
                name: "Slug",
                url: "https://github.com/EricLengyel/Slug",
                cat: "systems",
                desc: "Reference code for the Slug Algorithm.",
                language: "HLSL",
                topics: ["font_rendering", "vector_graphics"],
                updated: "21 March 2026",
                isNew: false
            },
            {
                owner: "rzru",
                name: "nightingale",
                url: "https://github.com/rzru/nightingale",
                cat: "ai",
                desc: "Machine learning powered Karaoke app (with scores!)",
                language: "Rust",
                topics: ["ai", "bevy", "bevy_engine", "demucs", "karaoke", "karaoke_application", "karaoke_game", "machine_learning", "machine_learning_algorithms", "ml", "party", "rust", "whisper", "whisper_ai", "whisperx"],
                updated: "21 March 2026",
                isNew: false
            },
            {
                owner: "collaborator-ai",
                name: "collab-public",
                url: "https://github.com/collaborator-ai/collab-public",
                cat: "ai",
                desc: "Collaborator is a place to build with agents.",
                language: "Shell",
                topics: ["shell"],
                updated: "21 March 2026",
                isNew: false
            },
            {
                owner: "nv-tlabs",
                name: "kimodo",
                url: "https://github.com/nv-tlabs/kimodo",
                cat: "ai",
                desc: "Official implementation of Kimodo, a kinematic motion diffusion model for high-quality human(oid) motion generation.",
                language: "Python",
                topics: ["python"],
                updated: "21 March 2026",
                isNew: false
            },
            {
                owner: "lxf746",
                name: "any-auto-register",
                url: "https://github.com/lxf746/any-auto-register",
                cat: "dev",
                desc: "Automated account registration bot supporting multiple platforms with pluggable email and CAPTCHA backends.",
                language: "Python",
                topics: ["python"],
                updated: "22 March 2026",
                isNew: false
            },
            {
                owner: "inspatio",
                name: "inspatio-world",
                url: "https://github.com/inspatio/inspatio-world",
                cat: "dev",
                desc: "World spatial data visualization platform for rendering geospatial datasets interactively on a global map.",
                language: "Python",
                topics: ["python"],
                updated: "22 March 2026",
                isNew: false
            },
            {
                owner: "math-inc",
                name: "OpenGauss",
                url: "https://github.com/math-inc/OpenGauss",
                cat: "dev",
                desc: "Open-source Gaussian process and statistical modeling library for Python with NumPy and SciPy integration",
                language: "Python",
                topics: ["python"],
                updated: "22 March 2026",
                isNew: false
            },
            {
                owner: "ghostty-org",
                name: "ghostling",
                url: "https://github.com/ghostty-org/ghostling",
                cat: "systems",
                desc: "A minimum viable terminal emulator built on top of the libghostty C API. Ex minimo, infinita nascuntur.",
                language: "C",
                topics: ["c"],
                updated: "22 March 2026",
                isNew: false
            },
            {
                owner: "danveloper",
                name: "flash-moe",
                url: "https://github.com/danveloper/flash-moe",
                cat: "ai",
                desc: "Running a big model on a small laptop",
                language: "Objective-C",
                topics: ["objective_c"],
                updated: "23 March 2026",
                isNew: false
            },
            {
                owner: "lightningpixel",
                name: "modly",
                url: "https://github.com/lightningpixel/modly",
                cat: "ai",
                desc: "Desktop app to generate 3D models from images using local AI \u2014 runs entirely on your GPU",
                language: "TypeScript",
                topics: ["3d", "ai_local", "ai_tools", "desktop_app", "modly", "open_source", "self_hosted"],
                updated: "23 March 2026",
                isNew: false
            },
            {
                owner: "MiniMax-AI",
                name: "skills",
                url: "https://github.com/MiniMax-AI/skills",
                cat: "ai",
                desc: "Official MiniMax AI agent skill library providing modular C-based capabilities for integration with MiniMax models.",
                language: "C#",
                topics: ["csharp"],
                updated: "23 March 2026",
                isNew: false
            },
            {
                owner: "louislva",
                name: "claude-peers-mcp",
                url: "https://github.com/louislva/claude-peers-mcp",
                cat: "ai",
                desc: "Allow all your Claude Codes to message each other ad-hoc!",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "23 March 2026",
                isNew: false
            },
            {
                owner: "wangziqi06",
                name: "724-office",
                url: "https://github.com/wangziqi06/724-office",
                cat: "ai",
                desc: "7/24 Office \u2014 Self-evolving AI Agent system. 26 tools, 3500 lines pure Python, MCP/Skill plugins, three-layer memory, self-repair, 24/7 production.",
                language: "Python",
                topics: ["python"],
                updated: "24 March 2026",
                isNew: false
            },
            {
                owner: "leo-lilinxiao",
                name: "codex-autoresearch",
                url: "https://github.com/leo-lilinxiao/codex-autoresearch",
                cat: "ai",
                desc: "Codex Autoresearch Skill \u2014 A self-directed iterative system for Codex that continuously cycles through: modify, verify, retain or discard, and repeat indefinitely. Inspired by Karpathy\u2019s autoresearch concept.",
                language: "Python",
                topics: ["python"],
                updated: "24 March 2026",
                isNew: false
            },
            {
                owner: "wong2",
                name: "weixin-agent-sdk",
                url: "https://github.com/wong2/weixin-agent-sdk",
                cat: "ai",
                desc: "TypeScript SDK for building AI agents on the WeChat (Weixin) platform. Provides message handling, session management, and LLM integration hooks for WeChat Official Accounts and Mini Programs.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "24 March 2026",
                isNew: false
            },
            {
                owner: "win4r",
                name: "ClawTeam-OpenClaw",
                url: "https://github.com/win4r/ClawTeam-OpenClaw",
                cat: "ai",
                desc: "ClawTeam fork fully adapted for OpenClaw \u2014 multi-agent swarm coordination with OpenClaw as the default agent",
                language: "Python",
                topics: ["ai_agents", "clawdbot", "openclaw", "openclaw_extension", "openclaw_plugin", "openclaw_skills", "swarm", "swarm_intelligence", "swarms"],
                updated: "24 March 2026",
                isNew: false
            },
            {
                owner: "gnekt",
                name: "My-Brain-Is-Full-Crew",
                url: "https://github.com/gnekt/My-Brain-Is-Full-Crew",
                cat: "ai",
                desc: "Built by a PhD whose memory was failing, whose diet was a mess, and whose anxiety had its own agenda. Most second brain tools ignore the fact that your brain doesn't work in isolation: your body and your mental health are part of the system too. This crew handles all three: knowledge, nutrition, and mental wellness.",
                language: "Shell",
                topics: ["shell"],
                updated: "25 March 2026",
                isNew: false
            },
            {
                owner: "Shpigford",
                name: "chops",
                url: "https://github.com/Shpigford/chops",
                cat: "ai",
                desc: "Your AI agent skills, finally organized. A macOS app to browse, edit, and manage skills across Claude Code, Cursor, Codex, Windsurf, and Amp.",
                language: "Swift",
                topics: ["ai", "macos", "skills", "swiftui"],
                updated: "25 March 2026",
                isNew: false
            },
            {
                owner: "facebookresearch",
                name: "HyperAgents",
                url: "https://github.com/facebookresearch/HyperAgents",
                cat: "ai",
                desc: "Self-referential self-improving agents that can optimize for any computable task",
                language: "Python",
                topics: ["python"],
                updated: "25 March 2026",
                isNew: false
            },
            {
                owner: "fastclaw-ai",
                name: "weclaw",
                url: "https://github.com/fastclaw-ai/weclaw",
                cat: "ai",
                desc: "Connect to any agents with WeChat ClawBot.",
                language: "Go",
                topics: ["clawbot", "openclaw", "openclaw_weixin", "wechat_clawbot", "weclaw", "weixin_agent_sdk"],
                updated: "25 March 2026",
                isNew: false
            },
            {
                owner: "opa334",
                name: "darksword-kexploit",
                url: "https://github.com/opa334/darksword-kexploit",
                cat: "security",
                desc: "iOS <=26.0.1 DarkSword Kernel Exploit reimplemented in Objective-C",
                language: "Objective-C",
                topics: ["objective_c"],
                updated: "26 March 2026",
                isNew: false
            },
            {
                owner: "GAIR-NLP",
                name: "daVinci-MagiHuman",
                url: "https://github.com/GAIR-NLP/daVinci-MagiHuman",
                cat: "ai",
                desc: "Research framework from GAIR-NLP for generating and evaluating photorealistic human motion and appearance using diffusion-based generative models. Supports pipeline deployment and batch inference.",
                language: "Python",
                topics: ["python"],
                updated: "26 March 2026",
                isNew: false
            },
            {
                owner: "HKUDS",
                name: "OpenSpace",
                url: "https://github.com/HKUDS/OpenSpace",
                cat: "ai",
                desc: "OpenSpace: Make Your Agents: Smarter, Low-Cost, Self-Evolving\" -- Community: https://open-space.cloud/",
                language: "Python",
                topics: ["python"],
                updated: "26 March 2026",
                isNew: false
            },
            {
                owner: "LimHyungTae",
                name: "Awesome-PhD-CV",
                url: "https://github.com/LimHyungTae/Awesome-PhD-CV",
                cat: "web",
                desc: "Curated academic CV templates and guidelines for PhD students, researchers, and faculty job applicants.",
                language: "TeX",
                topics: ["academia_resume", "bigtech_resume", "cv", "latex_resume_template", "resume", "resume_templates"],
                updated: "26 March 2026",
                isNew: false
            },
            {
                owner: "marswaveai",
                name: "TypeNo",
                url: "https://github.com/marswaveai/TypeNo",
                cat: "ai",
                desc: "A free, open source, privacy-first voice input app for macOS.",
                language: "Swift",
                topics: ["accessibility", "dictation", "local_first", "macos", "menu_bar_app", "open_source", "privacy", "productivity", "speech_to_text", "swift", "voice_input"],
                updated: "27 March 2026",
                isNew: false
            },
            {
                owner: "nashsu",
                name: "opencli-rs",
                url: "https://github.com/nashsu/opencli-rs",
                cat: "security",
                desc: "Opencli-rs is a Blazing fast, memory-safe command-line tool \u2014 Fetch information from any website with a single command. Covers Twitter/X, Reddit, YouTube, HackerNews, Bilibili, Zhihu, Xiaohongshu, and 55+ sites, with support for controlling Electron desktop apps, integrating local CLI tools (gh, docker, kubectl)",
                language: "Rust",
                topics: ["rust"],
                updated: "27 March 2026",
                isNew: false
            },
            {
                owner: "CoderLuii",
                name: "HolyClaude",
                url: "https://github.com/CoderLuii/HolyClaude",
                cat: "ai",
                desc: "AI coding workstation: Claude Code + web UI + 5 AI CLIs + headless browser + 50+ tools",
                language: "Dockerfile",
                topics: ["ai", "ai_coding", "anthropic", "claude", "claude_code", "coding_agent", "container", "developer_tools", "devtools", "docker", "docker_compose", "gemini", "headless_browser", "openai", "playwright"],
                updated: "27 March 2026",
                isNew: false
            },
            {
                owner: "magnum6actual",
                name: "flipoff",
                url: "https://github.com/magnum6actual/flipoff",
                cat: "systems",
                desc: "Free split-flap display emulator for any TV. The classic flip-board look, without the $3,500 hardware.",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "27 March 2026",
                isNew: false
            },
            {
                owner: "vercel-labs",
                name: "emulate",
                url: "https://github.com/vercel-labs/emulate",
                cat: "network",
                desc: "Local API emulation for CI and no-network sandboxes",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "28 March 2026",
                isNew: false
            },
            {
                owner: "elder-plinius",
                name: "G0DM0D3",
                url: "https://github.com/elder-plinius/G0DM0D3",
                cat: "ai",
                desc: "LIBERATED AI CHAT",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "28 March 2026",
                isNew: false
            },
            {
                owner: "jxnxts",
                name: "mcp-brasil",
                url: "https://github.com/jxnxts/mcp-brasil",
                cat: "network",
                desc: "MCP Server para 27 APIs p\u00fablicas brasileiras",
                language: "Python",
                topics: ["python"],
                updated: "28 March 2026",
                isNew: false
            },
            {
                owner: "DingTalk-Real-AI",
                name: "dingtalk-workspace-cli",
                url: "https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli",
                cat: "ai",
                desc: "DingTalk Workspace is an officially open-sourced cross-platform CLI tool from DingTalk. It unifies DingTalk\u2019s full suite of product capabilities into a single package, is designed for both human users and AI agent scenarios.",
                language: "Go",
                topics: ["go"],
                updated: "28 March 2026",
                isNew: false
            },
            {
                owner: "NomaDamas",
                name: "k-skill",
                url: "https://github.com/NomaDamas/k-skill",
                cat: "web",
                desc: "- SRT, KTX, KBO, , , , , , ...",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "29 March 2026",
                isNew: false
            },
            {
                owner: "amitshekhariitbhu",
                name: "ai-engineering-interview-questions",
                url: "https://github.com/amitshekhariitbhu/ai-engineering-interview-questions",
                cat: "ai",
                desc: "Your Cheat Sheet for AI Engineering Interview \u2013 Questions and Answers.",
                language: "Markdown",
                topics: ["agents", "ai", "ai_agents", "ai_engineering", "fine_tuning", "interview", "interview_preparation", "interview_questions", "llm", "mcp", "quantization", "questions_and_answers", "rag"],
                updated: "29 March 2026",
                isNew: false
            },
            {
                owner: "larksuite",
                name: "cli",
                url: "https://github.com/larksuite/cli",
                cat: "ai",
                desc: "A command-line tool for Lark/Feishu Open Platform \u2014 built for humans and AI Agents. Covers core business domains including Messenger, Docs, Base, Sheets, Calendar, Mail, Tasks, Meetings, and more, with 200+ commands and 19 AI Agent Skills.",
                language: "Go",
                topics: ["go"],
                updated: "29 March 2026",
                isNew: false
            },
            {
                owner: "Michaelliv",
                name: "markit",
                url: "https://github.com/Michaelliv/markit",
                cat: "web",
                desc: "Convert anything to markdown. Mark it.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "29 March 2026",
                isNew: false
            },
            {
                owner: "facebookresearch",
                name: "tribev2",
                url: "https://github.com/facebookresearch/tribev2",
                cat: "ai",
                desc: "This repository contains the code to train and evaluate TRIBE v2, a multimodal model for brain response prediction",
                language: "Jupyter Notebook",
                topics: ["jupyter_notebook"],
                updated: "30 March 2026",
                isNew: false
            },
            {
                owner: "zc-zhangchen",
                name: "any-auto-register",
                url: "https://github.com/zc-zhangchen/any-auto-register",
                cat: "dev",
                desc: "Automated multi-platform account registration tool with configurable credential generation and email verification.",
                language: "Python",
                topics: ["python"],
                updated: "30 March 2026",
                isNew: false
            },
            {
                owner: "ryanstephen",
                name: "lil-agents",
                url: "https://github.com/ryanstephen/lil-agents",
                cat: "ai",
                desc: "tiny AI companions that live on your macOS dock",
                language: "Swift",
                topics: ["swift"],
                updated: "30 March 2026",
                isNew: false
            },
            {
                owner: "TheTom",
                name: "turboquant_plus",
                url: "https://github.com/TheTom/turboquant_plus",
                cat: "dev",
                desc: "Extended variant of TurboQuant implementing additional quantization strategies for LLM KV cache compression beyond the original ICLR 2026 paper, with benchmarking utilities and custom bit-width configurations.",
                language: "Python",
                topics: ["python"],
                updated: "30 March 2026",
                isNew: false
            },
            {
                owner: "tonbistudio",
                name: "turboquant-pytorch",
                url: "https://github.com/tonbistudio/turboquant-pytorch",
                cat: "ai",
                desc: "From-scratch PyTorch implementation of Google's TurboQuant (ICLR 2026) for LLM KV cache compression. 5x compression at 3-bit with 99.5% attention fidelity.",
                language: "Python",
                topics: ["python", "go"],
                updated: "31 March 2026",
                isNew: false
            },
            {
                owner: "revfactory",
                name: "harness",
                url: "https://github.com/revfactory/harness",
                cat: "ai",
                desc: "A meta-skill that designs domain-specific agent teams, defines specialized agents, and generates the skills they use.",
                language: "HTML",
                topics: ["claude_code", "claude_code_plugin", "harness", "harness_engineering"],
                updated: "31 March 2026",
                isNew: false
            },
            {
                owner: "openai",
                name: "codex-plugin-cc",
                url: "https://github.com/openai/codex-plugin-cc",
                cat: "ai",
                desc: "Use Codex from Claude Code to review code or delegate tasks.",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "31 March 2026",
                isNew: false
            },
            {
                owner: "glommer",
                name: "pgmicro",
                url: "https://github.com/glommer/pgmicro",
                cat: "ai",
                desc: "An in-process reimplementation of PostgreSQL, backed by a SQLite-compatible storage engine",
                language: "Rust",
                topics: ["rust"],
                updated: "31 March 2026",
                isNew: false
            },
            {
                owner: "adamlyttleapps",
                name: "notchy",
                url: "https://github.com/adamlyttleapps/notchy",
                cat: "ai",
                desc: "macOS menu bar utility written in Swift that enhances notch-area display real estate with quick-access widgets.",
                language: "Swift",
                topics: ["swift"],
                updated: "1 April 2026",
                isNew: false
            },
            {
                owner: "LeoYeAI",
                name: "openclaw-auto-dream",
                url: "https://github.com/LeoYeAI/openclaw-auto-dream",
                cat: "ai",
                desc: "Automatic memory consolidation for OpenClaw agents \u2014 like sleep for your AI. Powered by MyClaw.ai",
                language: "HTML",
                topics: ["ai_agent", "auto_dream", "llm", "memory", "memory_management", "myclaw", "openclaw"],
                updated: "1 April 2026",
                isNew: false
            },
            {
                owner: "instructkr",
                name: "claw-code",
                url: "https://github.com/instructkr/claw-code",
                cat: "dev",
                desc: "The fastest repo in history to surpass 50K stars , reaching the milestone in just 2 hours after publication. Better Harness Tools that make real things done. Now writing in Rust using oh-my-codex.",
                language: "Rust",
                topics: ["rust"],
                updated: "1 April 2026",
                isNew: false
            },
            {
                owner: "sanbuphy",
                name: "claude-code-source-code",
                url: "https://github.com/sanbuphy/claude-code-source-code",
                cat: "ai",
                desc: "It will be revised soon.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "1 April 2026",
                isNew: false
            },
            {
                owner: "ChinaSiro",
                name: "claude-code-sourcemap",
                url: "https://github.com/ChinaSiro/claude-code-sourcemap",
                cat: "ai",
                desc: "TypeScript source map generator and inspector tool for Claude Code CLI, enabling readable stack traces in production builds.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "2 April 2026",
                isNew: false
            },
            {
                owner: "Kuberwastaken",
                name: "claude-code",
                url: "https://github.com/Kuberwastaken/claude-code",
                cat: "ai",
                desc: "Claude Code in Rust & a Breakdown of How it Works",
                language: "Rust",
                topics: ["rust"],
                updated: "2 April 2026",
                isNew: false
            },
            {
                owner: "Gitlawb",
                name: "openclaude",
                url: "https://github.com/Gitlawb/openclaude",
                cat: "ai",
                desc: "Claude Code opened to any LLM \u2014 OpenAI, Gemini, DeepSeek, Ollama, and 200+ models via OpenAI-compatible API shim",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "2 April 2026",
                isNew: false
            },
            {
                owner: "NanmiCoder",
                name: "claude-code-haha",
                url: "https://github.com/NanmiCoder/claude-code-haha",
                cat: "ai",
                desc: "Claude Code leaked source - locally runnable version",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "2 April 2026",
                isNew: false
            },
            {
                owner: "sk0dot7",
                name: "journal-buddy",
                url: "https://github.com/sk0dot7/journal-buddy",
                cat: "dev",
                desc: "Personal journaling assistant app that prompts daily reflections, tracks mood trends, and organizes entries locally.",
                language: null,
                topics: [],
                updated: "3 April 2026",
                isNew: false
            },
            {
                owner: "emdash-cms",
                name: "emdash",
                url: "https://github.com/emdash-cms/emdash",
                cat: "web",
                desc: "Minimal TypeScript-based headless CMS with markdown-first content editing and a clean structured content API.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "3 April 2026",
                isNew: false
            },
            {
                owner: "JackChen-me",
                name: "open-multi-agent",
                url: "https://github.com/JackChen-me/open-multi-agent",
                cat: "ai",
                desc: "Production-grade multi-agent orchestration framework. Model-agnostic, supports team collaboration, task scheduling, and inter-agent communication.",
                language: "TypeScript",
                topics: ["agent_framework", "ai_agents", "claude", "llm", "model_agnostic", "multi_agent", "openai", "orchestration", "task_scheduling", "typescript"],
                updated: "3 April 2026",
                isNew: false
            },
            {
                owner: "VoltAgent",
                name: "awesome-design-md",
                url: "https://github.com/VoltAgent/awesome-design-md",
                cat: "ai",
                desc: "Collection of DESIGN.md files that capture design systems from popular websites. Drop one into your project and let coding agents build matching UI.",
                language: "HTML",
                topics: ["awesome_list", "design_md", "design_system", "design_tokens", "figma", "google_stitch", "landing_page"],
                updated: "3 April 2026",
                isNew: false
            },
            {
                owner: "ultraworkers",
                name: "claw-code-parity",
                url: "https://github.com/ultraworkers/claw-code-parity",
                cat: "network",
                desc: "claw-code Rust port parity work - it is temporary work while claw-code repo is doing migration",
                language: "Rust",
                topics: ["rust"],
                updated: "3 April 2026",
                isNew: false
            },
            {
                owner: "oboard",
                name: "claude-code-rev",
                url: "https://github.com/oboard/claude-code-rev",
                cat: "ai",
                desc: "Runnable ClaudeCode source code",
                language: "TypeScript",
                topics: ["claude_code"],
                updated: "4 April 2026",
                isNew: false
            },
            {
                owner: "codeany-ai",
                name: "open-agent-sdk-typescript",
                url: "https://github.com/codeany-ai/open-agent-sdk-typescript",
                cat: "ai",
                desc: "Agent-SDK without CLI dependencies, as an alternative to claude-agent-sdk, completely open source",
                language: "TypeScript",
                topics: ["agent_sdk", "claude_agent_sdk", "claude_code", "open_agent_sdk"],
                updated: "4 April 2026",
                isNew: false
            },
            {
                owner: "HKUDS",
                name: "OpenHarness",
                url: "https://github.com/HKUDS/OpenHarness",
                cat: "ai",
                desc: "OpenHarness: Open Agent Harness",
                language: "Python",
                topics: ["python"],
                updated: "4 April 2026",
                isNew: false
            },
            {
                owner: "motiful",
                name: "cc-gateway",
                url: "https://github.com/motiful/cc-gateway",
                cat: "security",
                desc: "AI API identity gateway \u2014 reverse proxy that normalizes device fingerprints and telemetry for privacy-preserving API proxying",
                language: "TypeScript",
                topics: ["anthropic", "api_gateway", "claude_code", "docker", "fingerprint", "privacy", "reverse_proxy", "telemetry", "typescript"],
                updated: "4 April 2026",
                isNew: false
            },
            {
                owner: "jarmuine",
                name: "claude-code",
                url: "https://github.com/jarmuine/claude-code",
                cat: "ai",
                desc: "Fork of instructkr/claude-code",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "5 April 2026",
                isNew: false
            },
            {
                owner: "0xGF",
                name: "boneyard",
                url: "https://github.com/0xGF/boneyard",
                cat: "web",
                desc: "Auto generated skeleton loading framework",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "5 April 2026",
                isNew: false
            },
            {
                owner: "kevinrgu",
                name: "autoagent",
                url: "https://github.com/kevinrgu/autoagent",
                cat: "ai",
                desc: "autonomous harness engineering",
                language: "Python",
                topics: ["python"],
                updated: "5 April 2026",
                isNew: false
            },
            {
                owner: "yasasbanukaofficial",
                name: "claude-code",
                url: "https://github.com/yasasbanukaofficial/claude-code",
                cat: "ai",
                desc: "Open source Claude Code CLI source code. Advanced AI Agent for developers. Includes TypeScript codebase for LLM tool-calling, agentic workflows, and terminal UI. Remember this is just the skeleton not the brain itself. Found by Chaofan Shou.",
                language: "TypeScript",
                topics: ["claude_ai", "claude_code", "leaked_claude_code", "leaked_code"],
                updated: "5 April 2026",
                isNew: false
            },
            {
                owner: "walter-grace",
                name: "mac-code",
                url: "https://github.com/walter-grace/mac-code",
                cat: "ai",
                desc: "mac code \u2014 Claude Code, but it runs on your Mac for free. 35B AI agent at 30 tok/s via Apple Silicon flash-paging. $0/month.",
                language: "Python",
                topics: ["python"],
                updated: "6 April 2026",
                isNew: false
            },
            {
                owner: "AAAAAAAJ",
                name: "slides",
                url: "https://github.com/AAAAAAAJ/slides",
                cat: "dev",
                desc: "slides generates prompts for various expression styles",
                language: "Python",
                topics: ["python"],
                updated: "6 April 2026",
                isNew: false
            },
            {
                owner: "santifer",
                name: "career-ops",
                url: "https://github.com/santifer/career-ops",
                cat: "ai",
                desc: "AI-powered job search system built on Claude Code. 14 skill modes, Go dashboard, PDF generation, batch processing.",
                language: "Go",
                topics: ["ai_agent", "anthropic", "automation", "career", "claude", "claude_code", "cli", "golang", "interview_prep", "job_search", "open_source", "resume"],
                updated: "6 April 2026",
                isNew: false
            },
            {
                owner: "JuliusBrussee",
                name: "caveman",
                url: "https://github.com/JuliusBrussee/caveman",
                cat: "ai",
                desc: "why use many token when few token do trick \u2014 Claude Code skill that cuts 75% of tokens by talking like caveman",
                language: "Python",
                topics: ["ai", "anthropic", "caveman", "claude", "claude_code", "llm", "meme", "prompt_engineering", "skill", "tokens"],
                updated: "6 April 2026",
                isNew: false
            },
            {
                owner: "k2-fsa",
                name: "OmniVoice",
                url: "https://github.com/k2-fsa/OmniVoice",
                cat: "ai",
                desc: "High-Quality Voice Cloning TTS for 600+ Languages",
                language: "Python",
                topics: ["python"],
                updated: "7 April 2026",
                isNew: false
            },
            {
                owner: "m1heng",
                name: "claude-plugin-weixin",
                url: "https://github.com/m1heng/claude-plugin-weixin",
                cat: "ai",
                desc: "Claude Code plugin that bridges the WeChat (Weixin) messaging API, enabling AI agents to send, receive, and process WeChat messages as part of automated workflows.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "7 April 2026",
                isNew: false
            },
            {
                owner: "safishamsi",
                name: "graphify",
                url: "https://github.com/safishamsi/graphify",
                cat: "ai",
                desc: "AI coding assistant skill (Claude Code, Codex, OpenCode, OpenClaw). Turn any folder of code, docs, papers, or images into a queryable knowledge graph",
                language: "Python",
                topics: ["claude_code", "codex", "graphrag", "knowledge_graph", "openclaw", "skills"],
                updated: "7 April 2026",
                isNew: false
            },
            {
                owner: "zengwenliang416",
                name: "ppt-agent",
                url: "https://github.com/zengwenliang416/ppt-agent",
                cat: "ai",
                desc: "AI agent that autonomously generates professional PowerPoint presentations from plain-text prompts. Outputs structured HTML-based slide decks with layouts, themes, and content sections.",
                language: "HTML",
                topics: ["html"],
                updated: "7 April 2026",
                isNew: false
            },
            {
                owner: "patoles",
                name: "agent-flow",
                url: "https://github.com/patoles/agent-flow",
                cat: "ai",
                desc: "Real-time visualization of Claude Code agent orchestration \u2014 see your agents think, branch, and coordinate as they work.",
                language: "TypeScript",
                topics: ["agent_visualization", "ai_agents", "claude_code", "developer_tools", "llm", "vscode_extension"],
                updated: "8 April 2026",
                isNew: false
            },
            {
                owner: "milla-jovovich",
                name: "mempalace",
                url: "https://github.com/milla-jovovich/mempalace",
                cat: "ai",
                desc: "The highest-scoring AI memory system ever benchmarked. And it's free.",
                language: "Python",
                topics: ["ai", "chromadb", "llm", "mcp", "memory", "python"],
                updated: "8 April 2026",
                isNew: false
            },
            {
                owner: "sooryathejas",
                name: "METATRON",
                url: "https://github.com/sooryathejas/METATRON",
                cat: "ai",
                desc: "AI-powered penetration testing assistant using local LLM on linux (Parrot OS)",
                language: "Python",
                topics: ["python"],
                updated: "8 April 2026",
                isNew: false
            },
            {
                owner: "maaslalani",
                name: "sheets",
                url: "https://github.com/maaslalani/sheets",
                cat: "dev",
                desc: "Terminal based spreadsheet tool",
                language: "Go",
                topics: ["go"],
                updated: "9 April 2026",
                isNew: false
            },
            {
                owner: "GitFrog1111",
                name: "badclaude",
                url: "https://github.com/GitFrog1111/badclaude",
                cat: "ai",
                desc: "A web-based jailbreak and adversarial prompt testing interface for Claude. Explores model behavior under edge-case, unusual, or boundary-pushing HTML-rendered prompt inputs.",
                language: "HTML",
                topics: ["html"],
                updated: "9 April 2026",
                isNew: false
            },
            {
                owner: "farzaa",
                name: "clicky",
                url: "https://github.com/farzaa/clicky",
                cat: "dev",
                desc: "Lightweight native macOS Swift utility for tracking, replaying, and automating mouse click sequences. Useful for UI testing, macro recording, and accessibility workflows.",
                language: "Swift",
                topics: ["swift"],
                updated: "9 April 2026",
                isNew: false
            },
            {
                owner: "LaurieWired",
                name: "tailslayer",
                url: "https://github.com/LaurieWired/tailslayer",
                cat: "ai",
                desc: "Library for reducing tail latency in RAM reads",
                language: "C++",
                topics: ["cplusplus"],
                updated: "9 April 2026",
                isNew: false
            },
            {
                owner: "afar1",
                name: "fieldtheory-cli",
                url: "https://github.com/afar1/fieldtheory-cli",
                cat: "web",
                desc: "Sync and locally store all of your X/Twitter bookmarks. Free and open source CLI for Mac.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "10 April 2026",
                isNew: false
            },
            {
                owner: "fikrikarim",
                name: "parlor",
                url: "https://github.com/fikrikarim/parlor",
                cat: "ai",
                desc: "On-device, real-time multimodal AI. Have natural voice and vision conversations with an AI that runs entirely on your machine. Powered by Gemma 4 E2B and Kokoro.",
                language: "HTML",
                topics: ["apple_silicon", "gemma", "kokoro", "litert_lm", "local_llm", "mlx", "multimodal", "on_device_ai", "python", "real_time", "speech_recognition", "text_to_speech", "voice_assistant"],
                updated: "10 April 2026",
                isNew: false
            },
            {
                owner: "Keychron",
                name: "Keychron-Keyboards-Hardware-Design",
                url: "https://github.com/Keychron/Keychron-Keyboards-Hardware-Design",
                cat: "ai",
                desc: "All the industrial design files for Keychron keyboards and mice. Includes CAD models (case, plate, stabilizer, encoder, keycap) for Q, Q Pro, Q HE, K Pro, K Max, K HE, V Max, P HE series and M1\u2013M7 mice. 100+ models. STEP/DXF/PDF formats. This project is source-available. Commercial use is strictly prohibited.",
                language: "Python",
                topics: ["3d_printing", "cad", "gaming", "gaming_keyboard", "gaming_mouse", "hardware_designs", "keyboard", "keyboard_firmware", "keychron", "mechanical_keyboard", "mouse", "qmk", "qmk_firmware", "zephyr", "zmk", "zmk_firmware"],
                updated: "10 April 2026",
                isNew: false
            },
            {
                owner: "mattmireles",
                name: "gemma-tuner-multimodal",
                url: "https://github.com/mattmireles/gemma-tuner-multimodal",
                cat: "ai",
                desc: "Fine-tune Gemma 4 and 3n with audio, images and text on Apple Silicon, using PyTorch and Metal Performance Shaders.",
                language: "Python",
                topics: ["python"],
                updated: "10 April 2026",
                isNew: false
            },
            {
                owner: "hilash",
                name: "cabinet",
                url: "https://github.com/hilash/cabinet",
                cat: "ai",
                desc: "AI-first knowledge base and startup OS",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "11 April 2026",
                isNew: false
            },
            {
                owner: "PrathamLearnsToCode",
                name: "paper2code",
                url: "https://github.com/PrathamLearnsToCode/paper2code",
                cat: "ai",
                desc: "Agent skill to turn any arxiv paper into a working implementation",
                language: "Python",
                topics: ["agent", "claude_code", "skills"],
                updated: "11 April 2026",
                isNew: false
            },
            {
                owner: "garrytan",
                name: "gbrain",
                url: "https://github.com/garrytan/gbrain",
                cat: "ai",
                desc: "Garry's Opinionated OpenClaw/Hermes Agent Brain",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "11 April 2026",
                isNew: false
            },
            {
                owner: "phuryn",
                name: "claude-usage",
                url: "https://github.com/phuryn/claude-usage",
                cat: "ai",
                desc: "A local dashboard for tracking your Claude Code token usage, costs, and session history. Pro and Max subscribers get a progress bar. This gives you the full picture.",
                language: "Python",
                topics: ["claude_code"],
                updated: "11 April 2026",
                isNew: false
            },
            {
                owner: "Houseofmvps",
                name: "codesight",
                url: "https://github.com/Houseofmvps/codesight",
                cat: "ai",
                desc: "Universal AI context generator. Saves thousands of tokens per conversation in Claude Code, Cursor, Copilot, Codex, and more.",
                language: "TypeScript",
                topics: ["ai", "claude", "cli", "code_analysis", "codebase", "codex", "context_engineering", "copilot", "cursor", "developer_tools", "llm", "mcp", "repo_map", "token_savings"],
                updated: "12 April 2026",
                isNew: false
            },
            {
                owner: "wxtsky",
                name: "CodeIsland",
                url: "https://github.com/wxtsky/CodeIsland",
                cat: "dev",
                desc: "macOS-native Swift app providing a visual island-style workspace for managing and switching between coding projects",
                language: "Swift",
                topics: ["swift"],
                updated: "12 April 2026",
                isNew: false
            },
            {
                owner: "yizhiyanhua-ai",
                name: "fireworks-tech-graph",
                url: "https://github.com/yizhiyanhua-ai/fireworks-tech-graph",
                cat: "ai",
                desc: "Claude Code skill for generating production-quality SVG+PNG technical diagrams. Supports 8 diagram types, 5 visual styles, and deep AI/Agent domain knowledge.",
                language: "Shell",
                topics: ["shell"],
                updated: "12 April 2026",
                isNew: false
            },
            {
                owner: "nashsu",
                name: "llm_wiki",
                url: "https://github.com/nashsu/llm_wiki",
                cat: "ai",
                desc: "LLM Wiki is a cross-platform desktop application that turns your documents into an organized, interlinked knowledge base \u2014 automatically. Instead of traditional RAG (retrieve-and-answer from scratch every time), the LLM incrementally builds and maintains a persistent wiki from your sources",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "12 April 2026",
                isNew: false
            },
            {
                owner: "xtclovver",
                name: "RKNHardering",
                url: "https://github.com/xtclovver/RKNHardering",
                cat: "dev",
                desc: "Android application for detecting VPNs and proxies on a device using the RKN method to identify circumvention tools.",
                language: "Kotlin",
                topics: ["kotlin"],
                updated: "13 April 2026",
                isNew: false
            },
            {
                owner: "kessler",
                name: "gemma-gem",
                url: "https://github.com/kessler/gemma-gem",
                cat: "ai",
                desc: "Gemma Gem runs Google's Gemma 4 model entirely on-device via WebGPU \u2014 no API keys, no cloud, no data leaving your machine.",
                language: "TypeScript",
                topics: ["ai", "chrome_extension", "gemma4", "gemma4_2b", "gemma4_agent_skills", "llm"],
                updated: "13 April 2026",
                isNew: false
            },
            {
                owner: "joeynyc",
                name: "hermes-hudui",
                url: "https://github.com/joeynyc/hermes-hudui",
                cat: "ai",
                desc: "Web UI consciousness monitor for Hermes \u2014 the AI agent with persistent memory",
                language: "Python",
                topics: ["python"],
                updated: "13 April 2026",
                isNew: false
            },
            {
                owner: "AgriciDaniel",
                name: "claude-obsidian",
                url: "https://github.com/AgriciDaniel/claude-obsidian",
                cat: "ai",
                desc: "Claude + Obsidian knowledge companion. Persistent, compounding wiki vault based on Karpathy's LLM Wiki pattern. /wiki /save /autoresearch",
                language: "Shell",
                topics: ["ai", "claude_code", "claude_code_skill", "knowledge_management", "obsidian", "open_source", "second_brain"],
                updated: "13 April 2026",
                isNew: false
            },
            {
                owner: "vyfor",
                name: "rattles",
                url: "https://github.com/vyfor/rattles",
                cat: "web",
                desc: "Minimal terminal spinners for Rust",
                language: "Rust",
                topics: ["animation", "cli", "no_std", "ratatui", "rattles", "rust", "spinner", "spinners", "terminal", "tui"],
                updated: "14 April 2026",
                isNew: false
            },
            {
                owner: "coleam00",
                name: "claude-memory-compiler",
                url: "https://github.com/coleam00/claude-memory-compiler",
                cat: "ai",
                desc: "Give Claude Code a memory that evolves with your codebase. Hooks automatically capture sessions, the Claude Agent SDK extracts key decisions and lessons, and an LLM compiler organizes everything into structured, cross-referenced knowledge articles - inspired by Karpathy's LLM Knowledge Base architecture.",
                language: "Python",
                topics: ["python"],
                updated: "14 April 2026",
                isNew: false
            },
            {
                owner: "momenbasel",
                name: "PureMac",
                url: "https://github.com/momenbasel/PureMac",
                cat: "systems",
                desc: "Free, open-source macOS cleaner. CleanMyMac alternative with zero telemetry. Native SwiftUI, scheduled auto-cleaning, Xcode/Homebrew/system cache cleanup. MIT licensed.",
                language: "Swift",
                topics: ["cache_cleaner", "cleanmymac", "cleanup", "disk_cleaner", "disk_space", "homebrew", "mac_utility", "macos", "macos_app", "macos_cleaner", "macosx", "native", "oss", "osx", "privacy", "swift", "swiftui", "system_cleaner", "xcode_cleaner"],
                updated: "14 April 2026",
                isNew: false
            },
            {
                owner: "hexiecs",
                name: "talk-normal",
                url: "https://github.com/hexiecs/talk-normal",
                cat: "ai",
                desc: "Make any LLM talk like a normal person. A system prompt that removes AI slop.",
                language: "Shell",
                topics: ["shell"],
                updated: "14 April 2026",
                isNew: false
            },
            {
                owner: "obdev",
                name: "littlesnitch-linux",
                url: "https://github.com/obdev/littlesnitch-linux",
                cat: "dev",
                desc: "Open Source components of Little Snitch for Linux",
                language: "Rust",
                topics: ["rust"],
                updated: "15 April 2026",
                isNew: false
            },
            {
                owner: "whwangovo",
                name: "pyre-code",
                url: "https://github.com/whwangovo/pyre-code",
                cat: "ai",
                desc: "A self-hosted ML coding practice platform. 68 problems from ReLU to flow matching \u2014 attention, training, RLHF, diffusion, and more. Instant feedback in the browser.",
                language: "Python",
                topics: ["python"],
                updated: "15 April 2026",
                isNew: false
            },
            {
                owner: "AgentSeal",
                name: "codeburn",
                url: "https://github.com/AgentSeal/codeburn",
                cat: "ai",
                desc: "See where your AI coding tokens go. Interactive TUI dashboard for Claude Code and Codex cost observability.",
                language: "TypeScript",
                topics: ["ai_coding", "claude_code", "cli", "codex", "cost_tracking", "developer_tools", "observability", "terminal_ui", "token_usage"],
                updated: "15 April 2026",
                isNew: false
            },
            {
                owner: "OpenMOSS",
                name: "MOSS-TTS-Nano",
                url: "https://github.com/OpenMOSS/MOSS-TTS-Nano",
                cat: "ai",
                desc: "MOSS-TTS-Nano is an open-source multilingual tiny speech generation model from MOSI.AI and the OpenMOSS team. With only 0.1B parameters, it is designed for realtime speech generation, can run directly on CPU without a GPU, and keeps the deployment stack simple enough for local demos, web serving, and lightweight product integration.",
                language: "Python",
                topics: ["audio_tokenizer", "chinese", "english", "multi_modality", "multilingual", "realtime", "streaming_audio", "tts", "voice_clone"],
                updated: "15 April 2026",
                isNew: false
            },
            {
                owner: "prod-forge",
                name: "backend",
                url: "https://github.com/prod-forge/backend",
                cat: "web",
                desc: "Boilerplate backend service scaffold for production-grade APIs with auth, database, and deployment configuration.",
                language: null,
                topics: [],
                updated: "16 April 2026",
                isNew: false
            },
            {
                owner: "sterlingcrispin",
                name: "nothing-ever-happens",
                url: "https://github.com/sterlingcrispin/nothing-ever-happens",
                cat: "network",
                desc: "Polymarket bot that buys \"No\" on all non-sports markets",
                language: "Python",
                topics: ["meme", "not_financial_advice", "nothing_ever_happens", "polymarket"],
                updated: "16 April 2026",
                isNew: false
            },
            {
                owner: "patterniha",
                name: "SNI-Spoofing",
                url: "https://github.com/patterniha/SNI-Spoofing",
                cat: "security",
                desc: "Bypass DPI with IP/TCP-Header manipulation",
                language: "Python",
                topics: ["python"],
                updated: "16 April 2026",
                isNew: false
            },
            {
                owner: "yaojingang",
                name: "GEOFlow",
                url: "https://github.com/yaojingang/GEOFlow",
                cat: "ai",
                desc: "Open-source GEO content production system with AI tasks, review workflow, and publishing.",
                language: "PHP",
                topics: ["ai", "cms", "content_automation", "geo", "openai_compatible", "php", "postgresql", "seo"],
                updated: "16 April 2026",
                isNew: false
            },
            {
                owner: "sogonov",
                name: "anubis",
                url: "https://github.com/sogonov/anubis",
                cat: "security",
                desc: "Android app manager with VPN integration. Manages groups of apps by freezing/unfreezing them based on VPN connection state.",
                language: "Kotlin",
                topics: ["kotlin"],
                updated: "16 April 2026",
                isNew: false
            },
            {
                owner: "AMAP-ML",
                name: "SkillClaw",
                url: "https://github.com/AMAP-ML/SkillClaw",
                cat: "ai",
                desc: "Let Skills Evolve Collectively with Agentic Evolver",
                language: "Python",
                topics: ["python"],
                updated: "17 April 2026",
                isNew: false
            },
            {
                owner: "vercel-labs",
                name: "wterm",
                url: "https://github.com/vercel-labs/wterm",
                cat: "systems",
                desc: "A terminal emulator for the web",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "17 April 2026",
                isNew: false
            },
            {
                owner: "Nightmare-Eclipse",
                name: "RedSun",
                url: "https://github.com/Nightmare-Eclipse/RedSun",
                cat: "security",
                desc: "The Red Sun vulnerability repository",
                language: "C++",
                topics: ["cplusplus"],
                updated: "17 April 2026",
                isNew: false
            },
            {
                owner: "Tencent-Hunyuan",
                name: "HY-World-2.0",
                url: "https://github.com/Tencent-Hunyuan/HY-World-2.0",
                cat: "ai",
                desc: "HY-World 2.0: A Multi-Modal World Model for Reconstructing, Generating, and Simulating 3D Worlds",
                language: "Python",
                topics: ["3d", "ai", "worldmodel"],
                updated: "17 April 2026",
                isNew: false
            },
            {
                owner: "Manavarya09",
                name: "design-extract",
                url: "https://github.com/Manavarya09/design-extract",
                cat: "ai",
                desc: "Extract the complete design language from any website \u2014 colors, typography, spacing, shadows, and more. npx CLI + Claude Code plugin.",
                language: "JavaScript",
                topics: ["agent_skill", "agent_skills", "ai", "claude_code_plugin", "cli", "colors", "css", "design_system", "design_tokens", "npx", "playwright", "skills_sh", "tailwind", "typography", "web_scraping"],
                updated: "18 April 2026",
                isNew: false
            },
            {
                owner: "lewislulu",
                name: "html-ppt-skill",
                url: "https://github.com/lewislulu/html-ppt-skill",
                cat: "ai",
                desc: "HTML PPT Studio \u2014 AgentSkill with 24 themes, 31 layouts, 20+ animations for building professional HTML presentations",
                language: "HTML",
                topics: ["html"],
                updated: "18 April 2026",
                isNew: false
            },
            {
                owner: "Robbyant",
                name: "lingbot-map",
                url: "https://github.com/Robbyant/lingbot-map",
                cat: "ai",
                desc: "A feed-forward 3D foundation model for reconstructing scenes from streaming data",
                language: "Python",
                topics: ["python"],
                updated: "18 April 2026",
                isNew: false
            },
            {
                owner: "browser-use",
                name: "video-use",
                url: "https://github.com/browser-use/video-use",
                cat: "web",
                desc: "Python framework for AI agents that interact with video content — extracting frames, transcribing audio, and executing actions based on visual and spoken context from video streams.",
                language: "Python",
                topics: ["python"],
                updated: "18 April 2026",
                isNew: false
            },
            {
                owner: "EKKOLearnAI",
                name: "hermes-web-ui",
                url: "https://github.com/EKKOLearnAI/hermes-web-ui",
                cat: "ai",
                desc: "Web dashboard for Hermes Agent \u2014 multi-platform AI chat, session management, scheduled jobs, usage analytics & channel configuration (Telegram, Discord, Slack, WhatsApp)",
                language: "TypeScript",
                topics: ["ai_agent", "chat_ui", "chatbot", "cron_jobs", "dashboard", "discord_bot", "hermes_agent", "i18n", "llm", "multi_platform", "naive_ui", "nousresearch", "session_management", "slack_bot", "telegram_bot", "typescript", "vue3", "web_terminal", "whatsapp"],
                updated: "19 April 2026",
                isNew: false
            },
            {
                owner: "WeaveMindAI",
                name: "weft",
                url: "https://github.com/WeaveMindAI/weft",
                cat: "ai",
                desc: "A programming language for AI systems",
                language: "Rust",
                topics: ["rust"],
                updated: "19 April 2026",
                isNew: false
            },
            {
                owner: "browser-use",
                name: "browser-harness",
                url: "https://github.com/browser-use/browser-harness",
                cat: "ai",
                desc: "Self-healing browser harness that enables LLMs to complete any task.",
                language: "Python",
                topics: ["python"],
                updated: "19 April 2026",
                isNew: false
            },
            {
                owner: "Lazarus-AI",
                name: "clearwing",
                url: "https://github.com/Lazarus-AI/clearwing",
                cat: "ai",
                desc: "Python-based agent memory pruning and context distillation tool that removes stale or low-value information from agent state.",
                language: "Python",
                topics: ["python"],
                updated: "19 April 2026",
                isNew: false
            },
            {
                owner: "andrewjiang",
                name: "palantir-for-family-trips",
                url: "https://github.com/andrewjiang/palantir-for-family-trips",
                cat: "web",
                desc: "A Palantir-ish dashboard for family trip planning.",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "20 April 2026",
                isNew: false
            },
            {
                owner: "xataio",
                name: "xata",
                url: "https://github.com/xataio/xata",
                cat: "ai",
                desc: "Open source, cloud native, Postgres platform with copy-on-write branching and scale-to-zero",
                language: "Go",
                topics: ["branching", "kubernetes", "postgresql", "scale_to_zero"],
                updated: "20 April 2026",
                isNew: false
            },
            {
                owner: "kyegomez",
                name: "OpenMythos",
                url: "https://github.com/kyegomez/OpenMythos",
                cat: "ai",
                desc: "A theoretical reconstruction of the Claude Mythos architecture, built from first principles using the available research literature.",
                language: "Python",
                topics: ["ai", "anthropic", "attention", "claude", "claude_ai", "claude_code", "claude_code_plugin", "claude_mythos", "claude_sonnet", "deepmind", "gpt_5", "gpt_7", "jax", "looped_transformers", "ml", "pytorch", "sonnet", "torch"],
                updated: "20 April 2026",
                isNew: false
            },
            {
                owner: "cathrynlavery",
                name: "diagram-design",
                url: "https://github.com/cathrynlavery/diagram-design",
                cat: "ai",
                desc: "Thirteen editorial diagram types for Claude Code. Self-contained HTML + SVG. No shadows, no Mermaid-slop.",
                language: "HTML",
                topics: ["html"],
                updated: "20 April 2026",
                isNew: false
            },
            {
                owner: "op7418",
                name: "logo-generator-skill",
                url: "https://github.com/op7418/logo-generator-skill",
                cat: "ai",
                desc: "logo-generator-skill",
                language: "HTML",
                topics: ["html", "go"],
                updated: "21 April 2026",
                isNew: false
            },
            {
                owner: "NikolayS",
                name: "pgque",
                url: "https://github.com/NikolayS/pgque",
                cat: "systems",
                desc: "PgQue \u2013 Zero-bloat Postgres queue. One SQL file to install, pg_cron to tick.",
                language: "PLpgSQL",
                topics: ["plpgsql"],
                updated: "21 April 2026",
                isNew: false
            },
            {
                owner: "codejunkie99",
                name: "agentic-stack",
                url: "https://github.com/codejunkie99/agentic-stack",
                cat: "ai",
                desc: "One brain, many harnesses. Portable .agent/ folder (memory + skills + protocols) that plugs into Claude Code, Cursor, Windsurf, OpenCode, OpenClaw, Hermes, or DIY Python \u2014 and keeps its knowledge when you switch.",
                language: "Python",
                topics: ["python"],
                updated: "21 April 2026",
                isNew: false
            },
            {
                owner: "bergside",
                name: "design-md-chrome",
                url: "https://github.com/bergside/design-md-chrome",
                cat: "ai",
                desc: "Chrome extension to extract styles from any website and generate DESIGN.md files and design skills for AI based on TypeUI",
                language: "JavaScript",
                topics: ["ai", "chrome", "chrome_extension", "design_md", "design_skills", "extension", "open_source", "skills", "skills_ai", "typeui"],
                updated: "21 April 2026",
                isNew: false
            },
            {
                owner: "stanford-iris-lab",
                name: "meta-harness",
                url: "https://github.com/stanford-iris-lab/meta-harness",
                cat: "ai",
                desc: "Reference code for the Meta-Harness paper.",
                language: "Python",
                topics: ["harness_engineering", "llm_agents"],
                updated: "22 April 2026",
                isNew: true
            },
            {
                owner: "assai-id",
                name: "nemesis",
                url: "https://github.com/assai-id/nemesis",
                cat: "ai",
                desc: "JavaScript security testing toolkit for identifying and exploiting misconfigurations in web application authentication flows.",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "22 April 2026",
                isNew: true
            },
            {
                owner: "tw93",
                name: "Kami",
                url: "https://github.com/tw93/Kami",
                cat: "ai",
                desc: "Good content deserves good paper.",
                language: "HTML",
                topics: ["html", "go"],
                updated: "22 April 2026",
                isNew: true
            },
            {
                owner: "OpenCoworkAI",
                name: "open-codesign",
                url: "https://github.com/OpenCoworkAI/open-codesign",
                cat: "ai",
                desc: "Open-source Claude Design alternative. One-click import your Claude Code / Codex API key. Prompt prototype / slides / PDF. Multi-model (Claude, GPT, Gemini, Kimi, GLM, Ollama). BYOK, local-first, MIT.",
                language: "TypeScript",
                topics: ["ai_design", "anthropic", "byok", "claude", "claude_code", "claude_design", "claude_design_alternative", "deepseek", "design_to_code", "desktop_app", "electron", "figma_alternative", "gemini", "local_first", "multi_model", "ollama", "openai", "openrouter", "typescript", "ui_generator"],
                updated: "22 April 2026",
                isNew: true
            },
            {
                owner: "golbin",
                name: "hop",
                url: "https://github.com/golbin/hop",
                cat: "web",
                desc: "TypeScript-based project workspace switcher and directory jump tool for fast terminal navigation between projects.",
                language: "TypeScript",
                topics: ["typescript"],
                updated: "23 April 2026",
                isNew: true
            },
            {
                owner: "SteveTheKiller",
                name: "KillerPDF",
                url: "https://github.com/SteveTheKiller/KillerPDF",
                cat: "network",
                desc: "Portable PDF editor for Windows. GPLv3. No installer, no account, no subscription, no telemetry.",
                language: "C#",
                topics: ["dotnet", "gplv3", "opensource", "pdf", "pdf_editor", "portable", "windows", "wpf"],
                updated: "23 April 2026",
                isNew: true
            },
            {
                owner: "the-hidden-fish",
                name: "advisor-ledger",
                url: "https://github.com/the-hidden-fish/advisor-ledger",
                cat: "dev",
                desc: "Financial advisory ledger tool for tracking client portfolios, fee structures, and investment performance over time.e",
                language: "Python",
                topics: ["python"],
                updated: "23 April 2026",
                isNew: true
            },
            {
                owner: "masterking32",
                name: "MasterHttpRelayVPN",
                url: "https://github.com/masterking32/MasterHttpRelayVPN",
                cat: "security",
                desc: "HTTP relay and VPN tunneling tool that forwards traffic through configurable proxy chains with authentication support.",
                language: "Python",
                topics: ["python"],
                updated: "23 April 2026",
                isNew: true
            },
            {
                owner: "OranAi-Ltd",
                name: "oransim",
                url: "https://github.com/OranAi-Ltd/oransim",
                cat: "ai",
                desc: "Causal Digital Twin for Marketing at Scale Predict any marketing decision before you spend a dollar.",
                language: "Python",
                topics: ["python"],
                updated: "24 April 2026",
                isNew: true
            },
            {
                owner: "ZeroZ-lab",
                name: "cc-design",
                url: "https://github.com/ZeroZ-lab/cc-design",
                cat: "ai",
                desc: "High-fidelity HTML design and prototype guidance skill for AI agents",
                language: "JavaScript",
                topics: ["javascript"],
                updated: "24 April 2026",
                isNew: true
            },
            {
                owner: "openai",
                name: "privacy-filter",
                url: "https://github.com/openai/privacy-filter",
                cat: "ai",
                desc: "OpenAI Privacy Filter",
                language: "Python",
                topics: ["python"],
                updated: "24 April 2026",
                isNew: true
            },
            {
                owner: "op7418",
                name: "guizang-ppt-skill",
                url: "https://github.com/op7418/guizang-ppt-skill",
                cat: "ai",
                desc: "A Claude Code Skill that turns prompts into horizontal-swipe magazine-style HTML decks \u2014 10 layouts, 5 curated themes, WebGL hero backgrounds, single-file output.",
                language: "HTML",
                topics: ["html"],
                updated: "24 April 2026",
                isNew: true
            },
            {
                owner: "deepseek-ai",
                name: "TileKernels",
                url: "https://github.com/deepseek-ai/TileKernels",
                cat: "ai",
                desc: "A kernel library written in tilelang",
                language: "Python",
                topics: ["python"],
                updated: "25 April 2026",
                isNew: true
            },
            {
                owner: "ConardLi",
                name: "web-design-skill",
                url: "https://github.com/ConardLi/web-design-skill",
                cat: "ai",
                desc: "An AI agent skill that transforms AI-generated web pages from \"functional\" to \"stunning.\"(Inspired by Claude Design)",
                language: "CSS",
                topics: ["css"],
                updated: "25 April 2026",
                isNew: true
            }
        ];

          

            let active = "all", menuOpen = false;

           /* ══════════════════════════════════════════════════════
   CORE FUNCTIONS — paste these AFTER the REPOS array
══════════════════════════════════════════════════════ */

/* ── Build single card HTML ───────────────────────── */
function buildCard(r) {
  const lc     = LANGCOLORS[r.language] || LANGCOLORS.default;
  const topics = (r.topics || []).slice(0, 3);
  const cm     = CATS[r.cat] || CATS.all;

  return `
    <a href="${r.url}" target="_blank" rel="noopener noreferrer"
       class="oss-card" data-cat="${r.cat}"
       aria-label="${r.owner}/${r.name} on GitHub">

      <div class="cardtop">
        <div class="cardbadges">
          <span class="cardcat-pill">${cm.label}</span>
          ${r.isNew ? '<span class="cardnew">NEW</span>' : ''}
        </div>
        <div class="cardarrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            e x1="7" y1="17" x2="17" y2="7"/>
            <polyline points="7 7 17 7 17 17"/>
          </svg>
        </div>
      </div>

      <div class="cardowner">${r.owner}</div>
      <div class="cardname">${r.name}</div>
      <p class="carddesc">${r.desc}</p>

      ${topics.length
        ? `<div class="cardtopics">${
            topics.map(t => `<span class="cardtopic">${t}</span>`).join('')
          }</div>`
        : ''}

      <div class="cardfooter">
        <div class="cardlang">
          ${r.language
            ? `<span class="lang-dot" style="background:${lc}" aria-hidden="true"></span>${r.language}`
            : ''}
        </div>
        <div class="cardupdated">
          <i class="fas fa-calendar"></i> ${r.updated}
        </div>
      </div>
    </a>`;
}

/* ── Render grid based on active category ─────────── */
function renderGrid() {
  const grid = document.getElementById('oss-grid');
  if (!grid) return;

  const filtered = active === 'all'
    ? REPOS
    : REPOS.filter(r => r.cat === active);

  grid.innerHTML = filtered.length
    ? filtered.map(buildCard).join('')
    : `<div class="oss-empty">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
           ircle cx="11" cy="11" r="8"/>
           e x1="21" y1="21" x2="16.65" y2="16.65"/>
         </svg>
         <p>No projects in this category yet.</p>
       </div>`;

  /* update stats */
  const elTotal = document.getElementById('sb-total');
  const elShown = document.getElementById('sb-visible');
  if (elTotal) elTotal.textContent = REPOS.length;
  if (elShown) elShown.textContent = filtered.length;
}

/* ── Update category banner ────────────────────────── */
function updateBanner() {
  const banner = document.getElementById('cat-banner');
  if (!banner) return;

  if (active === 'all') {
    banner.innerHTML = '';
    banner.style.cssText = '';
    return;
  }

  const m       = CATS[active] || CATS.all;
  const visible = REPOS.filter(r => r.cat === active).length;

  banner.style.cssText =
    `--cat:${m.color};--catd:${m.dim};--catb:${m.border}`;
  banner.innerHTML = `
    <span style="font-size:1rem">${m.emoji}</span>
    <strong style="font-size:.85rem">${m.label}</strong>
    <div class="cat-banner-right">
      <span>${visible} project${visible !== 1 ? 's' : ''}</span>
    </div>`;
}

/* ── Update sidebar trigger button label ───────────── */
function updateTrigger() {
  const m = CATS[active] || CATS.all;
  const trigger = document.getElementById('sb-trigger');

  const icon  = document.getElementById('sb-trigger-icon');
  const label = document.getElementById('sb-trigger-label');
  const sub   = document.getElementById('sb-trigger-sub');
  const bar   = document.getElementById('sb-trigger-bar');

  if (icon)  icon.textContent  = m.emoji;
  if (label) label.textContent = m.label;
  if (sub)   sub.textContent   = m.desc;
  if (bar)   bar.style.background = m.color;

  if (trigger) {
    trigger.style.setProperty('--cat-color', m.color);
    trigger.style.setProperty('--cat-glow',  m.dim);
  }
}

/* ── Build sidebar dropdown menu ───────────────────── */
function buildMenu() {
  const menu = document.getElementById('sb-menu');
  if (!menu) return;

  const usedCats  = [...new Set(REPOS.map(r => r.cat))];
  const allCats   = ['all', ...usedCats];
  let   html      = '';

  allCats.forEach((cat, i) => {
    const m     = CATS[cat] || CATS.all;
    const count = cat === 'all'
      ? REPOS.length
      : REPOS.filter(r => r.cat === cat).length;
    const isSel = cat === active;

    html += `
      ${i > 0 ? '<div class="sbmenu-div"></div>' : ''}
      <button class="sbmenu-item${isSel ? ' selected' : ''}"
              data-cat="${cat}"
              style="--item-color:${m.color};--item-dim:${m.dim}"
              role="option"
              aria-selected="${isSel}">
        <span class="sbitem-emoji">${m.emoji}</span>
        <span class="sbitem-body">
          <span class="sbitem-label">${m.label}</span>
          <span class="sbitem-desc">${m.desc}</span>
        </span>
        <span class="sbitem-count">${count}</span>
      </button>`;
  });

  menu.innerHTML = html;

  /* click handler */
  menu.querySelectorAll('.sbmenu-item').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      active = btn.dataset.cat;
      closeMenu();
      updateTrigger();
      renderGrid();
      updateBanner();

      /* update selected state */
      menu.querySelectorAll('.sbmenu-item').forEach(b => {
        const sel = b.dataset.cat === active;
        b.classList.toggle('selected', sel);
        b.setAttribute('aria-selected', sel);
      });
    });
  });
}

/* ── Dropdown open / close ─────────────────────────── */
function openMenu() {
  menuOpen = true;
  document.getElementById('sb-menu')?.classList.add('open');
  const t = document.getElementById('sb-trigger');
  t?.classList.add('open');
  t?.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  menuOpen = false;
  document.getElementById('sb-menu')?.classList.remove('open');
  const t = document.getElementById('sb-trigger');
  t?.classList.remove('open');
  t?.setAttribute('aria-expanded', 'false');
}

/* ══════════════════════════════════════════════════════
   DOM READY — all init runs here
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Init page ──────────────────────────────────── */
  buildMenu();
  updateTrigger();
  renderGrid();
  updateBanner();

  /* ── Dropdown trigger click ─────────────────────── */
  document.getElementById('sb-trigger')
    ?.addEventListener('click', e => {
      e.stopPropagation();
      menuOpen ? closeMenu() : openMenu();
    });

  /* ── Close dropdown on outside click / Escape ───── */
  document.addEventListener('click',   () => closeMenu());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ── Mobile nav toggle ──────────────────────────── */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks   = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars',  !navLinks.classList.contains('active'));
        icon.classList.toggle('fa-times',  navLinks.classList.contains('active'));
      }
    });
  }

  /* ── Typewriter effect ──────────────────────────── */
  const el = document.getElementById('brand');
  if (el) {
    const text         = el.dataset.text || 'DevSpireHub';
    let i              = 0;
    let isDeleting     = false;
    const typeSpeed    = 100;
    const deleteSpeed  = 50;
    const pauseTime    = 2000;
    const restartPause = 500;

    function typeLoop() {
      el.textContent = text.slice(0, i);
      if (!isDeleting && i < text.length) {
        i++;
        setTimeout(typeLoop, typeSpeed);
      } else if (!isDeleting && i === text.length) {
        isDeleting = true;
        setTimeout(typeLoop, pauseTime);
      } else if (isDeleting && i > 0) {
        i--;
        setTimeout(typeLoop, deleteSpeed);
      } else {
        isDeleting = false;
        setTimeout(typeLoop, restartPause);
      }
    }
    typeLoop();
  }

  /* ── Scroll-to-top progress circle ─────────────── */
  const scrollBtn    = document.getElementById('scrollUpBtn');
  if (scrollBtn) {
    const circle       = scrollBtn.querySelector('.progress-circle');
    const circumference = 2 * Math.PI * 15.9155;

    if (circle) {
      circle.style.strokeDasharray  = circumference;
      circle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? scrollTop / docHeight : 0;
      if (circle) circle.style.strokeDashoffset = circumference * (1 - pct);
      scrollBtn.style.display = scrollTop > 100 ? 'block' : 'none';
    });

    scrollBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
