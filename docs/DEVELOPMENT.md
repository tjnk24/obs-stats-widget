# StreamoScope — development and release notes

**Froghead Works · Engineering Workshop**  
*Where the paperwork becomes executable.*

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

The project uses React 19, antd 6, Redux Toolkit, React Router 8, i18next, CSS modules, webpack and swc. Development conventions are in [`CLAUDE.md`](../CLAUDE.md).

## Releases and signed updates

A `v*` tag triggers the GitHub Actions release workflow: build, test, sign and publish. Published release assets:

| Asset | Purpose |
| --- | --- |
| `streamoscope-setup-<version>.exe` | Windows installer |
| `streamoscope-<version>.zip` | Dock, Lua bridge and supporting installation files |
| `compatibility.json` | OBS, WebSocket, Chromium and bridge compatibility information |
| `.minisig` files | Signatures for released assets |
| `SHA256SUMS.txt` | Checksums for the installer and archive |

Release notes contain a machine-readable `<!-- compatibility: {...} -->` comment that the dock uses to evaluate whether an update is compatible. **Don't remove or rewrite this block as marketing copy.**

Version numbers follow [Semantic Versioning](https://semver.org/). During the `0.x` series, minor versions may also change settings or installation steps; document those changes in the release notes.

CI runs checks and build tests on pushes and pull requests. Manual workflow runs test the release process without publishing. A Husky pre-commit hook lints changed files and checks types.

## Testing the updater without publishing a release

This flow uses a **separate test signing key and local update server**. Never commit the private key.

1. Generate a throwaway signing key outside the repository:

   ```bash
   minisign -G -W -p test.pub -s test.key
   ```

2. Build a test installer with `TEST_UPDATE_SERVER=http://127.0.0.1:3063` and `TEST_UPDATE_PUBLIC_KEY=<public key string>` set. These values affect the test build only.
3. Build a newer test version. Put its installer and `compatibility.json` in the folder to serve, and sign both with `minisign -S -s test.key -m <file>`.
4. Run `npm run serve:test-release -- <folder>`, install the older test build and trigger its update from the dock.
5. Restore a production build afterward.

Use the `--broken-signature` option when you want to verify that the updater rejects tampered release assets. The workshop considers this a desirable failure.

## Installer and removal behavior

The installer puts application files in `%LOCALAPPDATA%\Programs\streamoscope`, adds the OBS dock and Lua bridge, and attempts to configure the local WebSocket server. It keeps backups under `%LOCALAPPDATA%\streamoscope\backups` and writes `%LOCALAPPDATA%\streamoscope\configure-obs.log`.

Before copying files, the installer looks for an obs-stats-widget installation (versions 0.1.0–0.2.0) and runs its uninstaller silently, so OBS doesn't end up with two docks and two bridges. If that fails, usually because OBS is open, setup stops and asks to close OBS.

Close OBS before installation or removal. Uninstallation leaves OBS WebSocket enabled because another application might rely on it.

The Windows executable does **not** currently have an Authenticode signature. Release assets are protected separately with minisign signatures, and the README explains how to verify manual downloads.
