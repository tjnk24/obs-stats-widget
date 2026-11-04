# StreamoScope — development and release notes

This document covers the build system, tests, installer and updater. If you just want to install StreamoScope, the [main README](../README.md) is less alarming.

## Requirements and local development

- **Node.js 24+**; the current dev server does not support Node 25.
- Windows and Inno Setup 6 for building the Windows installer.
- OBS Studio 28+ for integration testing.

```bash
npm install
npm run start:dev
```

The development server uses `http://localhost:3062` by default. Set `PORT` in `.env` to choose another port. When OBS is available, the dev server can read WebSocket credentials from the OBS configuration and serve them locally. Mock mode allows interface development without a live stream.

| Command | What it does |
| --- | --- |
| `npm run start:dev` | Start the development server with hot reload |
| `npm run build:prod` | Create a production dock in `build/` |
| `npm run package:release` | Package release files and `compatibility.json` |
| `npm run package:installer` | Build the Windows installer; needs Inno Setup 6 (`ISCC_PATH` may point to `ISCC.exe`) |
| `npm run serve:test-release -- <folder>` | Host a local test release at `127.0.0.1:3063`; supports `--broken-signature` |
| `npm run test:installer` | Run Windows installer/updater checks with Pester 5 |
| `npm run lint` | TypeScript, ESLint, Stylelint and Knip checks |
| `npm run test:unit` | Run Vitest |
| `npm test` | Lint and unit tests |

The development server clears `build/`. Re-run `npm run build:prod` before using that folder in OBS.

The project uses React 19, antd 6, Redux Toolkit, React Router 8, i18next, CSS modules, webpack and swc. Development conventions are in [`CLAUDE.md`](../CLAUDE.md) (in Russian).

## Releases and signed updates

To release a version:

1. Write `docs/release-notes/<version>.md`: English first, then `---` and Russian. The workflow fails without it.
2. Run `npm version <major|minor|patch>` to bump `package.json`, commit and create the `v<version>` tag.
3. Run `git push --follow-tags`.
4. When the build is done, approve the `publish` job on the page of the workflow run. Updates reach people without a click on their side, so this click is the last human check.

The `v*` tag triggers the GitHub Actions release workflow: build, test, sign and publish. The `publish` job runs in the `release` environment, which needs that approval and accepts only `v*` tags. Published release assets:

| Asset | Purpose |
| --- | --- |
| `streamoscope-setup-<version>.exe` | Windows installer |
| `streamoscope-<version>.zip` | Dock, Lua bridge and updater scripts. Manual installs unpack it; the installed dock updates itself from it |
| `compatibility.json` | OBS, WebSocket, Chromium and bridge compatibility information |
| `.minisig` files | Signatures for released assets |
| `SHA256SUMS.txt` | Checksums for the installer and archive |

The workflow appends a machine-readable `<!-- compatibility: {...} -->` comment to the published release notes; the dock reads it to decide whether an update is compatible. **Don't remove or rewrite it when editing the release on GitHub.**

Version numbers follow [Semantic Versioning](https://semver.org/). During the `0.x` series, minor versions may also change settings or installation steps; document those changes in the release notes.

CI runs checks and build tests on pushes to `main` and on pull requests. Manual workflow runs test the release process without publishing. A Husky pre-commit hook lints changed files and checks types.

## Testing the updater without publishing a release

This flow uses a **separate test signing key and local update server**. Never commit the private key.

1. Generate a throwaway signing key outside the repository:

   ```bash
   minisign -G -W -p test.pub -s test.key
   ```

2. Build a test installer with `TEST_UPDATE_SERVER=http://127.0.0.1:3063` and `TEST_UPDATE_PUBLIC_KEY=<public key string>` set: `npm run package:installer`. These values affect the test build only.
3. Build a newer test version the same way, in a copy of the project with a raised `version`. Zip `release/streamoscope-<version>` so that this folder is the top level of the archive, put the zip and `compatibility.json` in the folder to serve, and sign both with `minisign -S -s test.key -m <file>`.
4. Run `npm run serve:test-release -- <folder>`, install the older test build and open OBS. About a minute later the bridge downloads the newer version by itself; **Check for updates** and **Update** in the settings do it at once. The test server reports an old publication date, so the two-day wait doesn't get in the way.
5. Restart OBS and check the version in the settings. Restore a production build afterward.

Use the `--broken-signature` option when you want to verify that the updater rejects a tampered package. The workshop considers this a desirable failure.

## How updates work

Updates work the way Chrome does them: the new version lands next to the old one and starts with the next launch of OBS.

```text
%LOCALAPPDATA%\Programs\streamoscope
  dock\index.html             loader, redirects to the current version
  streamoscope-bridge.lua     loader, runs the bridge of the current version
  current-version.js          which version is current
  update-trial.txt            the new version is on trial, see below
  versions\<version>\         dock, bridge and updater scripts of that version
  updater\minisign.exe        checks signatures, comes only with the installer
```

OBS keeps the paths of the two loaders in its configuration, so they never move and rarely change.

About a minute after OBS starts and then once a day, the bridge starts `Update-Widget.ps1 -Auto`. It asks GitHub for the latest release at most once an hour, skips releases younger than 48 hours and major versions, then verifies and unpacks the archive. The last step is one atomic rewrite of `current-version.js`: a failure before it leaves the current version alone. The three newest versions and the one to roll back to stay on disk. The **Update** button runs the same steps through `-Version X.Y.Z`, without the wait.

The check also puts the running version back into the Windows Apps list if a rollback left it behind.

The switch **Update automatically** is stored by the bridge in `%LOCALAPPDATA%\streamoscope\auto-update.txt`, so the background check works even when the dock is closed or broken.

### Automatic rollback

A freshly switched version is on trial, and `update-trial.txt` names it and the previous version. Only the bridge loader judges it, because it's the one piece of code that doesn't change with the version.

- The bridge fails to load: back to the previous version at once, in the same session.
- The dock is healthy: a second after it finds the bridge, a dock that hasn't hit a render error sends `healthy:X.Y.Z`. The bridge records it in `healthy-version.txt` and ends the trial.
- No report 5 seconds after OBS says it finished loading (`OBS_FRONTEND_EVENT_FINISHED_LOADING`): back to the previous version right there, so the next launch is already fine. A dock that was merely slow can still report later, and that undoes the rollback.
- OBS crashes or keeps being closed before any of this: the third launch rolls back before the bridge even loads. Scene collection switches reload the script but don't count, because a launch is one OBS process.

If the previous version never reported health, for example because the dock has never connected, silence proves nothing, so the trial doesn't watch the dock (`panel=0`). The rolled back version goes to `rolled-back-version.txt`: the background check skips it and anything older, and the settings card says what happened and offers to try it again with the button. A successful update clears the file.

A new bridge can meet an old dock: switching the scene collection reloads the scripts, while the open dock stays on its version. Bridge data therefore only gains fields.

## Installer and removal behavior

The installer puts application files in `%LOCALAPPDATA%\Programs\streamoscope` in the layout above, adds the OBS dock and Lua bridge, and attempts to configure the local WebSocket server. It keeps backups under `%LOCALAPPDATA%\streamoscope\backups` and writes `%LOCALAPPDATA%\streamoscope\configure-obs.log`.

Close OBS before installation or removal. Uninstallation leaves OBS WebSocket enabled because another application might rely on it.

The Windows executable does **not** currently have an Authenticode signature. Release assets are protected separately with minisign signatures, and the README explains how to verify manual downloads.
