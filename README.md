# obs-stats-widget

A dock for [OBS Studio](https://obsproject.com/) that shows live stream stats for every output that is streaming:
the main stream and the extra targets of plugins such as [obs-multi-rtmp](https://github.com/sorayuki/obs-multi-rtmp),
side by side, plus the health of OBS itself.

It talks to OBS through the built-in obs-websocket server, so it needs no plugin of its own.
An optional Lua script adds the platform of plugin outputs, GPU load and system memory.

## Features

- **A card per streaming output.** The main stream from Settings → Stream gets a card, and so does every
  other output that streams to a service, such as an obs-multi-rtmp target.
- **Live bitrate with a two-minute graph** for each output.
- **Network health:** dropped frames in total and over the last minute, network congestion, and a status tag:
  live, losing frames, reconnecting or offline.
- **Platform detection** from the service name or the server address: YouTube, Twitch, Kick, VK Video Live,
  VK Video, Rutube, Telegram, Facebook and Trovo.
- **OBS card:** FPS, frame time, frames skipped by the encoder and missed by the renderer, CPU and OBS memory.
  With the bridge script: GPU load, hardware encoder load, video memory and system memory.
- **Interface in English, Russian, Spanish, German and Brazilian Portuguese**, picked from the OBS language
  and changeable in the settings.
- **Updates from the dock:** a banner tells about a new version, and one button downloads it, checks its signature
  and installs it, never during a stream or recording.
- **Diagnostics and error reports** that can be copied and attached to an issue.
- **Built-in mock mode** to see the dock with several platforms without streaming.

## Requirements

- OBS Studio 28 or newer (obs-websocket 5 is built in). Developed and tested on OBS 33 on Windows.
- GPU and system memory stats come from Windows performance counters, so they are shown on Windows only.
  Everything else does not depend on the operating system.
- The installer is for Windows 10 and 11 (64-bit). On other systems, install from the zip archive.

## Installation

The first release, 0.1.0, is not published yet. Until it is, use [From source](#from-source).

### With the installer (Windows, recommended)

1. **Download** `obs-stats-widget-setup-<version>.exe` from the
   [Releases](https://github.com/tjnk24/obs-stats-widget/releases) page.
2. **Close OBS** and run the installer. It needs no administrator rights.
   The installer is not code-signed yet, so Windows may show "Windows protected your PC": click More info →
   Run anyway. To be sure the file is genuine, [check its signature](#releases) first.
3. **Start OBS.** The dock is in Docks → obs-stats-widget; if it is not visible, turn it on there.
4. **Connect.** On first launch the dock asks for the obs-websocket port (4455 by default) and password:
   Tools → WebSocket Server Settings → Show Connect Info. The password is saved in the dock, so this happens once.

What the installer does:

- copies the dock and the bridge script to `%LOCALAPPDATA%\Programs\obs-stats-widget`
  and adds obs-stats-widget to Settings → Apps;
- adds the obs-stats-widget dock to OBS, adds the bridge script to every scene collection
  and turns the obs-websocket server on. Nothing else in OBS is changed;
- backs up every OBS file before changing it, to `%LOCALAPPDATA%\obs-stats-widget\backups`, and writes
  what it did to `%LOCALAPPDATA%\obs-stats-widget\configure-obs.log`. If anything fails, it puts the files back.

If OBS has never been started on this computer, start it once, close it and run the installer again.
If obs-websocket has never been turned on, the installer leaves it to you: Tools → WebSocket Server Settings →
Enable WebSocket server. For a portable OBS, use the [zip](#from-the-zip-archive).

**Update** from the dock: when a new version is out, a banner offers Update, Skip this version and Remind me
tomorrow. Update downloads the installer of the new version, checks its minisign signature and runs it silently;
then the dock reloads and says once which version it was updated to. While a stream or recording is running, the dock offers to update right after it stops.
If the new version needs a newer OBS, or the bridge script is not loaded in the current scene collection, the
banner links to the release instead. Running the installer of the new version by hand works too: it replaces the
files and adds the bridge script to scene collections created since the last install; the rest of your OBS
settings stays as it is.
**Uninstall** in Settings → Apps → obs-stats-widget with OBS closed: the dock and the bridge script are removed
from OBS too. The obs-websocket server stays on, since other programs may use it.

### From the zip archive

For a portable OBS, another operating system or a setup without the installer.

1. Download `obs-stats-widget-<version>.zip` from [Releases](https://github.com/tjnk24/obs-stats-widget/releases)
   and extract it to a folder that will stay, for example `%LOCALAPPDATA%\obs-stats-widget`.
2. **Turn on obs-websocket:** Tools → WebSocket Server Settings → Enable WebSocket server.
3. **Add the dock:** Docks → Custom Browser Docks, any name and this URL, with the real path and forward slashes:

   ```
   file:///C:/path/to/obs-stats-widget/dock/index.html
   ```

4. **Add the bridge script (optional, recommended):** Tools → Scripts, press `+` and choose `obs-stats-bridge.lua`.
   Keep the `obs-stats-bridge` folder next to it. Scripts are added per scene collection,
   so repeat this in every collection you stream from.
5. **Connect** as in step 4 of the installer.

To update, extract the new archive over the old folder and press Ctrl+R in the dock.

### From source

You need [Node.js](https://nodejs.org/) 24 or newer (see `.nvmrc`); Node 25 is not supported by the dev server.

```bash
git clone https://github.com/tjnk24/obs-stats-widget.git
cd obs-stats-widget
npm install
npm run build:prod
```

Then follow the zip steps 2–5 with the dock at `build/index.html` and the bridge script at
`obs-script/obs-stats-bridge.lua`. To update, pull the new code, run `npm run build:prod` again
and press Ctrl+R in the dock.

## The bridge script

obs-websocket reports the stats of plugin outputs but not where they stream to, and it knows nothing about the GPU.
`obs-stats-bridge.lua` runs inside OBS and fills these gaps:

- **Plugin platforms.** It reads the server address of every output that streams and passes only its scheme
  and host, never the stream key or the URL path. Without the script, plugin cards show "Unknown platform".
- **GPU and memory (Windows).** It reads the GPU load, the hardware encoder load and video memory from the same
  performance counters Task Manager uses, so it works with NVIDIA, AMD and Intel GPUs. It also reads system memory.
- **Updates and release links.** When you press Update, it starts the bundled updater. "What's new" and
  "Download manually" ask it to open the release page in your default browser: the browser built into OBS would
  open it in its own window, where a download does not work. It opens only this project's GitHub pages.

The script publishes this every three seconds as the profile parameter `[ObsStatsDock] PluginOutputs`,
which the dock reads through obs-websocket. The data carries the name of the scene collection the script runs in,
so after a collection switch the dock ignores what the previous collection's script left behind. While OBS switches
the collection, the dock dims the page, and the header shows what it is waiting for: the switch, the first data
or the bridge script.

`obs-stats-bridge.lua` is only the entry point: its parts live in the `obs-stats-bridge` folder next to it,
and OBS loads them from there. If you copy the script somewhere else, copy the folder with it.

## Settings

The gear in the top right corner opens the settings:

- **Port** and **Password** of obs-websocket, each with its own Save button. A new password is used only after
  OBS accepts it; until then the old one keeps working.
- **Display:** interface language, the OBS card on or off, and the mock mode.
- **Updates:** the current version, the time of the last check, a Check for updates button and the
  Check for updates automatically switch (on by default: at start and once a day the dock asks the GitHub API
  about the latest release; off, it goes online only when you press the button). A skipped or postponed version
  can be brought back with Update anyway.
- **Diagnostics:** copies the versions, the GPU and the outputs the dock found, for a bug report.

## Privacy and security

- The dock connects to obs-websocket on `127.0.0.1` and, to check for updates, to `api.github.com` for the
  latest release: at start and once a day while the automatic check is on, otherwise only when you press the
  button. Nothing about you or your stream is sent there.
- The stream key is never read: from the stream settings the dock takes only the service name and the server.
- The obs-websocket password is stored only in the dock's own browser storage.
- Diagnostics and error reports contain no keys, passwords or server addresses.

## Known limitations

- obs-multi-rtmp gives all its targets the same output name, `multi-output`, and obs-websocket finds outputs
  by name. With several obs-multi-rtmp targets the dock shows one card and stats for only one of them,
  with a warning on the card.
- The tag of a plugin card shows the plugin name only for outputs it knows (`multi-output` is shown as multi-rtmp).
  Other plugin outputs are labelled just "Plugin".

## Troubleshooting

- **The dock is not visible after installing.** Turn it on in Docks → obs-stats-widget.
- **The installer says OBS was not set up.** The reason is on its last page; the details are in
  `%LOCALAPPDATA%\obs-stats-widget\configure-obs.log`. Nothing in OBS was changed, so you can close OBS
  and run the installer again or follow the [zip steps](#from-the-zip-archive).
- **The dock is empty or outdated** (built from source). Run `npm run build:prod` again and press Ctrl+R in the dock.
- **"No connection to OBS".** Check that the WebSocket server is enabled in OBS and that the port matches.
  Inside OBS the dock says so itself and shows where to turn the server on. It retries every few seconds and
  connects as soon as OBS answers.
- **"Wrong password".** Copy the password from Tools → WebSocket Server Settings → Show Connect Info.
- **"The bridge script is not loaded in this scene collection".** Add it in Tools → Scripts → "+": the notice shows
  the path to `obs-stats-bridge.lua` with a copy button when the dock was installed with the installer or from the zip.
  Running the installer again adds it to every collection. The notice cannot be closed: without the script the
  dock cannot show plugin platforms, the GPU or memory and cannot update itself. It goes away by itself once the
  script is loaded.
- **Plugin cards say "Unknown platform".** The bridge script is missing in this scene collection, see above.
- **No GPU or system memory rows.** These need the bridge script and Windows.

If something else goes wrong, open an issue and attach the text from Settings → Diagnostics → Copy diagnostics,
or the error report if the dock shows an error screen.

## Development

```bash
npm install
npm run start:dev
```

`start:dev` serves the dock at http://localhost:3062 with hot reload. If OBS is running, the dock connects to it
by itself: the dev server reads the obs-websocket port and password from the OBS config folder and serves them
only on `localhost`. If OBS is started later, the dock picks it up within a few seconds.
To work without OBS, turn on the mock mode in the settings.

Scripts:

| Command | What it does |
| --- | --- |
| `npm run start:dev` | Dev server with hot reload on port 3062 (`PORT` in `.env` changes it) |
| `npm run build:prod` | Production build into `build` |
| `npm run package:release` | Production build plus the release folder and `compatibility.json` in `release` |
| `npm run package:installer` | `package:release` plus the Windows installer `release/obs-stats-widget-setup-<version>.exe` (needs [Inno Setup 6](https://jrsoftware.org/isinfo.php); `ISCC_PATH` points to `ISCC.exe` if it is not in the default folder) |
| `npm run serve:test-release -- <folder>` | Serves a signed test release on `http://127.0.0.1:3063` for an end-to-end update test; `--broken-signature` serves a wrong setup signature |
| `npm run test:installer` | Pester 5 tests of the script that sets up OBS and of the updater (`installer/`); downloads minisign first. Windows only |
| `npm run lint` | TypeScript, ESLint, Stylelint and Knip |
| `npm run test:unit` | Vitest unit tests of the dock logic (settings migrations, versions, release data, compatibility) |
| `npm test` | `lint` and `test:unit` together, as CI runs them |

### Testing an update end to end

The real updater only trusts GitHub and the release key, so a test runs on a test build:

1. Create a throwaway key: `minisign -G -W -p test.pub -s test.key` (keep it outside the repository).
2. Build the installer you will install with `TEST_UPDATE_SERVER=http://127.0.0.1:3063` and
   `TEST_UPDATE_PUBLIC_KEY=<the key string from test.pub>` set: the dock then asks that server for the latest release,
   and the installer ships a copy of the updater whose release address and key are replaced. Without these variables
   the build is the normal one.
3. Build a newer version the same way (for example in a copy of the project with a higher `version`), put its
   `obs-stats-widget-setup-<version>.exe` and `compatibility.json` into a folder and sign both with
   `minisign -S -s test.key -m <file>`.
4. Run `npm run serve:test-release -- <that folder>`, install the test build and press Update in the dock.

Reinstall a normal build afterwards.

A pre-commit hook (husky and lint-staged) lints the changed files and type-checks the project.
The dev server clears the `build` folder, so run `npm run build:prod` again before using the dock in OBS.

Tech stack: React 19, antd 6, Redux Toolkit, React Router 8, i18next, CSS modules, webpack and swc.
Code conventions are described in [CLAUDE.md](CLAUDE.md).

## Releases

Versions follow [semantic versioning](https://semver.org/). While the version is 0.x, a minor release may still
change settings or setup steps; this is always written in the release notes.

A release is built by GitHub Actions when a `v*` tag is pushed: the dock, the installer and the tests are built
and run on Windows, then the files are signed and published. Each release has:

- `obs-stats-widget-setup-<version>.exe`: the Windows installer;
- `obs-stats-widget-<version>.zip` with the dock (`dock/index.html`), the bridge script and its folder,
  `compatibility.json` and a short `README.txt`, for a manual install;
- `compatibility.json`: the minimum OBS version, the obs-websocket RPC version, the minimum Chromium version
  of the OBS browser, the minimum bridge script version and the obs-websocket requests the dock uses;
- [minisign](https://jedisct1.github.io/minisign/) signatures (`.minisig`) of all three files
  and `SHA256SUMS.txt` with the checksums of the installer and the archive.

The release notes end with a hidden `<!-- compatibility: {...} -->` line with the same data as `compatibility.json`:
the dock reads it through the GitHub API to tell whether a new version suits your OBS.

To check a download, use the public key [minisign.pub](minisign.pub):

```bash
minisign -Vm obs-stats-widget-setup-0.1.0.exe -p minisign.pub
```

Every push to `main` and every pull request also runs the lint, the release build and the installer tests (`ci.yml`).
The release workflow can be started by hand from the Actions tab: it then builds and tests everything on Windows
without publishing.

## License

[MIT](LICENSE). The installer also includes [minisign](https://github.com/jedisct1/minisign) by Frank Denis
(ISC license, `installer/third-party/minisign-LICENSE.txt`), used to check the signature of updates.
