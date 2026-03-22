# Permanent Codespaces Setup

Make startup commands even faster by adding these to your shell profile for **every** Codespaces session.

## Add Aliases to Codespaces

Edit the file that persists across Codespaces sessions:

```bash
echo 'alias svm-start="cd /workspaces/short-video-maker && ./start.sh"' >> ~/.bashrc
echo 'alias svm-run="cd /workspaces/short-video-maker && ./quick-start.sh"' >> ~/.bashrc
echo 'alias svm-build="cd /workspaces/short-video-maker && pnpm install && pnpm build"' >> ~/.bashrc
echo 'alias svm-docker="cd /workspaces/short-video-maker && docker build -f main-tiny.Dockerfile -t short-video-maker:latest ."' >> ~/.bashrc
```

Then source it:

```bash
source ~/.bashrc
```

## Or Add to .devcontainer (Permanent Across Rebuilds)

Add this to `.devcontainer/devcontainer.json` if you have one, or request Codespaces devcontainer:

```json
{
  "postCreateCommand": "echo 'alias svm-start=\"cd /workspaces/short-video-maker && ./start.sh\"' >> ~/.bashrc && echo 'alias svm-run=\"cd /workspaces/short-video-maker && ./quick-start.sh\"' >> ~/.bashrc && source ~/.bashrc"
}
```

## Quick Command Reference

After setup, use these in any Codespaces terminal:

| Command | Action |
|---------|--------|
| `svm-start` | Full setup (first time) |
| `svm-run` | Quick run (after) |
| `svm-build` | Rebuild TypeScript & React |
| `svm-docker` | Build Docker image only |

## One-Time Setup (This Session)

If you don't want to modify shell profile, just run once per session:

```bash
cd /workspaces/short-video-maker
./start.sh
```

---

**Pro Tip:** Bookmark the QUICK_START_README.md in your browser for instant reference!
