# Deployment notes — GitHub Pages (docs branch)

This repository includes an automated workflow that deploys the `web/` folder to the `docs` branch on pushes to `main`.

Workflow path:
- `.github/workflows/deploy-docs.yml`

How to enable Pages:
1. Go to Settings → Pages
2. Select **Branch:** `docs` and **Folder:** `/ (root)`
3. Save

After the next push to `main`, the workflow will run and update the `docs` branch.

If you want me to open a PR with these changes (workflow + this file) and push to a branch so you can review, let me know and I will create the branch and PR now.