# The Unknown - Slack Bot

## Overview

The Unknown is a Slack bot designed to manage people coming in and out of a private channel. The project is built using the Slack Platform with Deno runtime and leverages Slack's workflow automation features to handle channel access requests and management.

The bot provides interactive workflows that allow users to request access to private channels through Slack shortcuts, processes these requests, and manages channel membership automatically. The application is structured around Slack's workflow-based architecture with custom functions, triggers, and datastores.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Runtime Environment
- **Framework**: Deno-based Slack Platform SDK
- **Language**: TypeScript
- **Deployment**: Slack-hosted platform (not traditional server deployment)

**Rationale**: The Slack Platform with Deno provides a serverless execution environment specifically designed for Slack apps, eliminating the need for infrastructure management while providing native integration with Slack APIs.

### Workflow Architecture
The application follows Slack's workflow-based architecture pattern:

1. **Triggers** - Event listeners that initiate workflows (shortcut-based)
2. **Workflows** - Orchestration layer that chains functions together
3. **Functions** - Reusable business logic units that perform specific tasks
4. **Datastores** - Slack-hosted key-value storage for application state

**Rationale**: This architecture is mandated by the Slack Platform but provides good separation of concerns and enables interactive, form-based user experiences within Slack.

### Data Persistence
- **Primary Storage**: Slack Datastores (NoSQL key-value store)
- **Schema**: Simple object storage with string-based primary keys
- **Sample Schema**: `SampleObjectDatastore` with `object_id`, `original_msg`, and `updated_msg` fields

**Rationale**: Slack Datastores are the native persistence layer for Slack Platform apps, providing automatic hosting and tight integration with Slack's security model. No external database setup required.

### User Interaction Flow
1. User triggers bot via Slack shortcut
2. Bot presents interactive form using `OpenForm` function
3. User submits channel access request
4. Custom function processes request and stores state in datastore
5. Bot performs channel management actions (invite/remove users)

**Rationale**: Form-based interaction provides a familiar Slack-native experience while collecting structured input. The shortcut trigger makes the bot easily accessible from any channel.

### Bot Permissions
Required scopes:
- `commands` - Handle slash commands
- `chat:write` - Send messages
- `chat:write.public` - Post to public channels without joining
- `datastore:read` - Read from datastores
- `datastore:write` - Write to datastores

**Rationale**: Minimal permission set following principle of least privilege while enabling core channel management and messaging functionality.

## External Dependencies

### Slack Platform SDK
- **Package**: `deno-slack-sdk` and `deno-slack-api`
- **Purpose**: Core framework for building Slack apps with workflow automation
- **Integration Points**: All workflow definitions, function implementations, and datastore schemas

### Slack CLI
- **Tool**: Official Slack command-line interface
- **Purpose**: Local development, deployment, and app management
- **Usage**: Running app locally (`slack run`), creating triggers, deploying to production

### Development Tools
- **Watchdog** (Python) - File system monitoring for Hackatime integration
- **Hackatime** - Coding activity tracking (development metrics only, not core functionality)
- **WakaTime CLI** - Command-line tool for sending coding activity heartbeats to Hackatime

## Hackatime Time Tracking

### Overview
This project includes automatic time tracking through Hackatime (Hack Club's open-source WakaTime alternative). The tracker runs in the background and automatically logs your coding activity to your Hackatime dashboard.

### Setup
The Hackatime tracker is configured to run automatically via a Replit workflow. It monitors file changes in your workspace and sends heartbeats to Hackatime every time you edit code files.

**Configuration:**
- **API Endpoint**: `https://hackatime.hackclub.com/api/hackatime/v1`
- **API Key**: Stored securely in `HACKATIME_API_KEY` environment secret
- **Tracker Script**: `hackatime_tracker.py`
- **Config File**: `~/.wakatime.cfg` (auto-generated)

### How It Works
1. The `hackatime-tracker` workflow runs `hackatime_tracker.py` in the background
2. The script watches for file modifications using Python's watchdog library
3. When you edit supported file types (.py, .js, .ts, .html, .css, etc.), a heartbeat is sent to Hackatime
4. Heartbeats are rate-limited to one per file every 30 seconds to avoid spam
5. All activity appears in your Hackatime dashboard at https://hackatime.hackclub.com

### Tracked File Types
Python, JavaScript, TypeScript, JSX, TSX, HTML, CSS, JSON, Markdown, YAML, TOML, Shell scripts

### Logs and Debugging
- Tracker status: Check the `hackatime-tracker` workflow console
- WakaTime logs: `~/.wakatime/wakatime.log`
- Offline heartbeats are queued and synced when connection is available

### Slack Workspace
- **Requirement**: Paid Slack plan required for workflow automation features
- **Integration**: App installed to specific workspace with designated bot user

**Note**: The application is entirely self-contained within the Slack ecosystem with no external APIs, databases, or third-party services required for core functionality (Hackatime tracker is optional development tooling).