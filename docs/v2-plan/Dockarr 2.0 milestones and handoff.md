# Dockarr 2.0: milestones and handoff

Nov 26, 2026 · @Jack

## Goal and scope

Dockarr is an opinionated CLI that sets up an HTPC and \*arr stack in Docker. One shareable file reproduces the same install on another machine, with secure defaults and safe automatic updates. App configuration is yours to explore.

- **In scope:** install, reproducible specs, secure defaults, automatic updates with rollback.
- **Out of scope:** configuring the apps themselves, and copying app settings or media between machines.
- **"Identical" means:** the same services, image digests, options and wiring. Host paths, user IDs, timezone and secrets stay local.

## Current state

The code at commit `3d7b9bf` builds, passes 16 of 16 tests and had a clean `npm audit` on Nov 26, 2026. No containers were started, so runtime findings come from code review, a generated compose file and upstream sources.

| Finding | Effect |
| --- | --- |
| [Watchtower is archived](https://github.com/containrrr/watchtower) and [fails on Docker 29](https://github.com/containrrr/watchtower/issues/2124) | Auto-update is broken on current Docker |
| `create` keeps only a compose file with mutable tags | Installs can't be reproduced |
| Deluge lacks `NET_ADMIN`, which [the image's usage requires](https://hub.docker.com/r/binhex/arch-delugevpn) | VPN is expected to fail |
| Downloads and libraries are separate mounts | [No hardlinks or atomic moves](https://wiki.servarr.com/Docker_Guide) |
| AdGuard publishes DNS on 5354 and keeps config under the data directory | Not usable as normal DNS |
| Tautulli mounts `$ConfigDir/plex/logs` | Wrong Plex log path |
| Mealie `ALLOW_SIGNUP` contains literal quotes | Setting may be misread |
| npm has 1.0.15 (March 2024); the repo is at 1.0.16 | Users stay on 1.0.15 until 2.0 ships |
| No `LICENSE` file or CI workflow | `package.json` claims MIT with no license text |

## Design

Dockarr owns the whole lifecycle: it renders compose from a spec, records exact versions and updates them on a schedule.

### Files

| File | Contents | Shared |
| --- | --- | --- |
| `dockarr.yaml` | Services, options, update settings, schema version | Yes |
| `dockarr.lock` | Image digests (multi-arch manifest) and catalog version | Yes |
| Local file, owner-only | Paths, user and group IDs, timezone, secrets, notification credentials | No |

### Commands

`init` writes the spec. `apply` renders and starts it. `update` moves the lockfile forward. `schedule status|disable|enable` manages the timer. `import`, `export` and `doctor` follow in later milestones. Existing `start`, `stop`, `restart`, `list` and `remove` stay; `install` is removed.

### Updates

Dockarr registers a systemd timer or Windows scheduled task during setup. Auto-updates are on, nightly, with policy `latest` unless the user changes them.

1. Check for new digests; stop if nothing changed.
2. Pull images while services keep running.
3. Stop affected services and back up their config.
4. Start the new versions and run health checks.
5. If healthy, write the new lockfile. Otherwise restore config and images, then record and report the failure.

A failed digest is not retried every night. Policy `follow` takes digests from a publisher's signed lockfile instead of the registries.

### Rules the build must keep

- Shared specs are untrusted input. They select catalog services and approved options only, never arbitrary images, mounts or privileges.
- The Docker socket is never mounted without explicit opt-in.
- Secrets never appear in shared files, command-line flags or logs.
- Web UIs bind to localhost or a chosen LAN address.
- Elevation is requested only to register the timer. The update job runs as a non-root user, noting that Docker access is root-equivalent.
- `apply` updates the timer when settings change; `remove` deletes it.

## Milestones

Six milestones, in order, with no dates set. Each starts when the one before meets its exit test. No further 1.x release is planned; all work targets 2.0, which releases after M4.

&#91;embedded content: milestone roadmap · 6 steps\]

### M0: Clear and fix

- [ ] Create the `v2` branch and set the version to a 2.0 pre-release
- [ ] Remove the services listed below
- [ ] Remove the `install` command entirely, including the Docker install; document Docker with Compose as a prerequisite and check for it
- [ ] Fix Deluge capability, shared `/data` mount, AdGuard ports and path, Tautulli log path, Mealie quoting
- [ ] Add `LICENSE`, `engines` and CI running tests plus `docker compose config` for every service

**Done when:** CI passes, and a clean Linux host with Docker runs a source build, starts the core services and imports a download by hardlink.

A service counts as unmaintained if it is archived or retired, or shows no upstream commit or release in 12 months. Checked Nov 26, 2026.

| Removed | Evidence |
| --- | --- |
| Watchtower | [Archived](https://github.com/containrrr/watchtower); Dockarr's updater replaces it |
| Readarr | [Archived June 2025](https://github.com/Readarr/Readarr) |
| LunaSea | [Archived April 2025](https://github.com/JagandeepBrar/LunaSea/releases) |
| EmulatorJS | [LinuxServer image deprecated](https://docs.linuxserver.io/deprecated_images/docker-emulatorjs/) |
| xTeVe | Last [upstream](https://github.com/xteve-project/xTeVe) commit March 2021; [image repo](https://github.com/alturismo/xteve) January 2023 |
| Kitana | [Last commit April 2023](https://github.com/pannal/Kitana) |
| Petio (and its MongoDB) | [Last commit January 2025](https://github.com/petio-team/petio) |
| Ubooquity | [Latest release found: August 2025](https://vaemendis.net/ubooquity/categorie2/release) |
| Requestrr | [Original archived](https://github.com/darkalfx/requestrr); owner chose not to adopt the fork |

### M1: Catalog and cleanup

- [ ] Define a catalog entry: ports, volumes, secrets, capabilities, user handling, health check, support tier, UI URL
- [ ] Move the remaining services into core and community tiers
- [ ] Split `Dockarr.ts` into commands, catalog, renderer and Docker runner
- [ ] Remove `telegram-request-bot/`, `.idea/`, `dockarr.iml` and dead code; decide on `get-api-keys`
- [ ] Generate README service lists from the catalog

**Done when:** every core service passes its health check in CI.

### M2: Spec, lockfile and apply

- [ ] Publish a versioned schema for `dockarr.yaml` and validate strictly
- [ ] Separate local values and secrets
- [ ] Resolve and pin digests in `dockarr.lock`
- [ ] Build `init` and `apply`
- [ ] Import existing 1.x deployments without moving config or media

**Done when:** the same spec and lockfile on two hosts of one architecture render the same services, digests and options.

### M3: Safe automatic updates

- [ ] Implement the update run with config backup, health checks and rollback
- [ ] Register the timer during setup on Linux and Windows
- [ ] Add schedule settings, notifications, failure memory and a run lock
- [ ] Set backup retention and check free disk space first
- [ ] Hold major version upgrades for manual approval where detectable

**Done when:** a test that ships a broken image rolls back services and config unattended and reports it.

### M4: Security defaults and 2.0 release

- [ ] Bind UIs to localhost or LAN, drop capabilities, set `no-new-privileges`, segment networks
- [ ] Make Portainer opt-in with a socket warning
- [ ] Release with npm provenance, signed tags and an SBOM; add `SECURITY.md`
- [ ] Write 2.0 docs and migration guide

**Done when:** automated checks enforce every rule under Design and 2.0 is on npm.

### M5: Sharing

- [ ] Build `export`, `import` with a review step, and `doctor`
- [ ] Add policy `follow` with signature verification
- [ ] Add CI that tests new digests and publishes the official lockfile

**Done when:** a second user installs a shared config, sees what it will do, and stays in step with its publisher.

## Handoff notes

Start with M0 on a new v2 branch from `master` at `3d7b9bf` in [jdesive/dockarr](https://github.com/jdesive/dockarr). Nothing in this plan is built yet.

| Path | What's there |
| --- | --- |
| `src/cli.ts` | Commander command definitions |
| `src/Dockarr.ts` | All command logic, template filling, installs |
| `src/compose-files.models.ts` | Service registry |
| `src/compose/` | One TypeScript compose template per service |
| `src/constants.ts` | Version and `~/.dockarr` location |
| `test/dockarr.test.ts` | Unit tests, including template checks |
| `.kennel/`, `.devcontainer/` | Sandboxed development setup |

- **Commands:** `npm ci`, then `npm test` (builds first; needs Node 21 or later). Run the CLI with `node bin/src/cli.js`.
- **Working method:** one pull request per checklist group, with tests. Verify image requirements against each image's own documentation.
- **Test on real Docker:** current tests never start a container. M0 needs an integration job that does.
- **Existing users:** never move or delete config or media. Back up a compose file before rewriting it.
- **Ask the owner first:** publishing to npm, removing anything beyond the lists above, or breaking an existing deployment without a migration path.

## Open decisions and risks

**Decided:** no further 1.x release; 2.0 may break 1.x deployments, with `import`; unmaintained services, the Telegram bot and all installs go. Updates run nightly on `latest` with 3 backups per service, and Windows stays beta. No dates or estimates.

These are still open:

| Decision | Recommendation | Needed by |
| --- | --- | --- |
| `get-api-keys` | Drop it, or read local config files | M1 |
| Core service list | Plex or Jellyfin, Sonarr, Radarr, Lidarr, Bazarr, Prowlarr, Seerr, one torrent and one Usenet client, Tautulli | M1 |
| Notification channel | One generic webhook first | M3 |
| Who maintains the official lockfile? | You, with automated testing | M5 |

### Risks

- **Rollback is only as good as the backup.** Large config directories, such as Plex metadata, make backups slow; decide what to exclude.
- **Health checks miss broken features.** Document this and keep manual rollback available.
- **Old digests can disappear from registries.** An old lockfile may stop reproducing.
- **Windows scheduling may need a signed-in user** because of Docker Desktop. Test early.
- **Shared configs are an attack path.** Review the schema and signature design before M5.
