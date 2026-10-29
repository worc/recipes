# About this .nvmrc

## 2026-10-21: Node 20.8.0 -> 24.22.1

Sorry about the major-version jump. There was a reason, and this project
will probably be fine. Probably.

**Why:** In October 2026 eight eMudhra (emSign) intermediate CA keys turned
out to be trivially recoverable, and Mozilla pulled the emSign ECC Root CA - G3
from its root store. Node 20.x is end-of-life, so it never got the
fixed root store or the compromised-key block. Supported lines did:
22.23.4, 24.22.1 and 26.12.1.

- Incident: https://bugzilla.mozilla.org/show_bug.cgi?id=2083449
- Node fix: https://nodejs.org/en/blog/release/v22.23.4

**If something breaks, check:**

- [ ] `rm -rf node_modules` and reinstall from the lockfile. Native addons
      (sharp, DB drivers, bcrypt, etc.) are built per Node ABI.
- [ ] `engines.node` in package.json allows 24.22.1.
- [ ] Other places that pin Node: Dockerfile `FROM node:...`, CI workflows,
      `.tool-versions`, `volta` in package.json.
- [ ] Build, tests, and one manual run of the thing.

**To undo:** `.nvmrc.bak` holds the old pin, or `git checkout .nvmrc`.
Undoing puts this repo back on a Node line with no fix for the above.
