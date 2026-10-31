# human: do this

Things the agent can't do from its sandbox: the registrar, root on Altair, `/var/www`, systemd, certbot, Discord, GitHub settings. Ordered roughly by when they block the work. Check things off or delete them as they land.

Sibling list over in reuben.report: `.planning/human-todo.md` (same idea, different name).

---

## 0. now-ish, independent of the recipes work

- [x] **Rotate the Discord webhook.** The full webhook URL was pasted at the bottom of `altair/readme.md` (commit `01b7c9b`, "update readme"). The line is now removed in the working tree, but it's still in git history. If `worc/altair` is public, anyone can post to that channel. Delete the webhook in Discord, make a new one, put it in `altair/.env`, re-run the deploy so `/opt/altair/ddns.conf` picks it up. Rotating is the actual fix; scrubbing history is optional once it's dead.

## 0.5 publish frontmatter-js 2.0 (blocks the recipes build)

Code, tests and verification are done in the `frontmatter` repo's working tree; details in its `todo.md`.

- [x] Review and commit. Include `git rm -r --cached dist` (dist is gitignored now, but the old build files are still tracked).
- [x] `npm version major` → 2.0.0 (runs tests, commits, tags; `postversion` pushes). Needs a clean tree.
- [x] `npm publish` (`prepublishOnly` tests + builds; npm will want your OTP).
- [x] Tell the agent, who then drops the esbuild alias in reuben.report.

## 1. TLS: get the shared cert healthy again (on Altair)

**Root cause found 2026-10-30** (via `cert-doctor.sh`): `garden-journal.stxalq.dev` had its own A record (`75.164.151.4`) that DDNS never updated. It failed http-01, which failed renewal for the whole shared cert. garden-journal is being retired, so it comes off the cert. Write-up: `altair/runbooks/CERTS.md` (incident log at the bottom). From the altair checkout, in this order:

- [x] `sudo bash scripts/cert-doctor.sh` (found it)
- [x] Porkbun: delete the `garden-journal` A record. (Order note: the cert change below doesn't need garden-journal to resolve. It only re-validates the names that *stay*.)
- [x] Install the reload hook: `sudo install -m 755 scripts/certbot-deploy-hook.sh /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh`
- [x] `sudo bash scripts/certbot-names.sh remove garden-journal.stxalq.dev --dry-run`. If it passes, run it again without `--dry-run` (certbot asks you to confirm the shorter name list, then the script reloads nginx).
  - If the dry run fails on another name, the doctor's table in `CERTS.md` maps it to a fix. scarlet.dog and reuben.report are the other two names riding on this cert.
- [x] `sudo bash scripts/cert-doctor.sh | grep -E '^(FAIL|WARN)'`: expect only `recipes.stxalq.dev is served by nginx but NOT on the cert` (that's section 2), and only once the new altair.conf is deployed.
- [x] Phone on cellular: `https://reuben.report` and `https://altair.stxalq.dev` load clean.
- [ ] Teardown leftovers on the box: `/var/www/garden-journal.stxalq.dev` if it exists, and whatever was listening on `:42069`. Its nginx blocks and its `deploy.ts` health check are already gone in the altair working tree.
- [x] Deploy altair (nginx without garden-journal, plus the recipes blocks and the DDNS fixes): `sudo $(which bun) scripts/deploy.ts`. sudo's `secure_path` drops `~/.bun/bin`, hence `$(which bun)`.
- [ ] `ls -l /home/robert/.bun/bin/bun`: `altair.service` hard-codes this path; a bun reinstall that moves it kills DDNS silently.

## 2. recipes.stxalq.dev

- [x] **Porkbun:** add a `CNAME` record `recipes.stxalq.dev → altair.stxalq.dev` (TTL 600). **Not an A record**: that's exactly the garden-journal failure. CNAME means DDNS only ever maintains the one A record.
- [x] **Webroot:** `sudo mkdir -p /var/www/recipes.stxalq.dev && sudo chown robert:www-data /var/www/recipes.stxalq.dev && sudo chmod 2755 /var/www/recipes.stxalq.dev`
- [x] **nginx:** covered by the altair deploy in section 1 (the recipes blocks ship with it; verified on a local nginx). Until the cert covers the name, `https://recipes…` warns in browsers, but the :80 block serves the ACME challenge, which is all the next step needs.
- [x] **Why `add` failed with `unauthorized` (2026-10-30):** nginx runs `/etc/nginx/altair.conf` via the systemd override (by design), but `deploy.ts` was writing `/etc/nginx/nginx.conf`, so the recipes blocks never went live. Fixed in the altair working tree (`deploy.ts`, `certbot-names.sh` and the deploy hook all target and `-c`-test `altair.conf`). To get recipes live:
  - [x] Preview what the first correct deploy changes: `sudo diff /etc/nginx/altair.conf altair.conf` (expect: garden-journal blocks out, recipes blocks in, the cache/HSTS rules, plus anything else that drifted since altair.conf was last copied by hand).
  - [x] `sudo $(which bun) scripts/deploy.ts` (it snapshots the live `altair.conf` first, so `--rollback` works). Caveat: snapshots taken *before* this fix captured `/etc/nginx/nginx.conf`, so don't `--rollback` to one of those; `--list-snapshots` shows the timestamps.
  - [x] Re-install the hook, since it changed (now `nginx -t -c`): `sudo install -m 755 scripts/certbot-deploy-hook.sh /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh`
  - [x] `sudo bash scripts/cert-doctor.sh recipes.stxalq.dev | grep -E 'runs the file|recipes'`: want `nginx runs the file deploy.ts writes` and `token … comes back over :80`.
- [x] **certbot:** `sudo bash scripts/certbot-names.sh add recipes.stxalq.dev --dry-run`, then without `--dry-run`. It refuses to run until every remaining name has a webroot, so it also double-checks that garden-journal really is off the cert.
- [x] **First deploy:** `npm install && npm run deploy` from the recipes checkout on Altair (the conversion has landed in the working tree).
- [x] **Smoke test from off the LAN** (phone on cellular): `https://recipes.stxalq.dev/`, a hard refresh on a deep link like `/frybread`, and an old hash link like `/#/frybread`.
- [x] Update the pinned link to the coddle recipe in the sibling chat
- [ ] Pin the frybread recipe in the Mom chat (several times a year she asks, "What's the ratio on your frybread?" lol), waiting on the window title update here

## 3. GitHub

- [x] Once `recipes.stxalq.dev` is proven: leave Pages serving `docs/` on `main` (which will just be the redirect page), or turn Pages off in repo settings once you're sure nothing points at `worc.github.io/recipes` anymore. (leaving as a redirect for now)
- [x] Commit/push: agents leave changes in the working tree; you review and push.

## 4. style pass + lab notebooks go live (2026-10-31)

- [ ] Review / commit the recipes working tree (new `src/notebooks/`, the site rewrite, planning docs) and the altair `altair.conf` change.
- [ ] **altair first:** `sudo diff /etc/nginx/altair.conf altair.conf` (expect only the recipes `location /` block), then `sudo $(which bun) scripts/deploy.ts --skip-ddns`.
- [ ] **then recipes:** `npm install && npm run deploy` (new font packages).
- [ ] Spot-check from a phone: `https://recipes.stxalq.dev/notebooks/caramelized-onions`; paste a recipe link into a chat app or Bluesky and see the title + description preview.

## later / optional

- [ ] HSTS `includeSubDomains` on `altair.stxalq.dev` once every `*.stxalq.dev` vhost is HTTPS-ready (recipes would make that list: altair, garden-journal, recipes).
- [ ] Webhook autodeploy (`altair/.planning/webhook-deploy.md`) would cover recipes too, but it isn't needed for this pass.
