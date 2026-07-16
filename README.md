# The Open 2026 Live Sweepstake

A shareable live leaderboard containing all **341 entries** from the supplied PDF.

## Easiest setup

1. Create a free GitHub account and a free Cloudflare account.
2. Create a new GitHub repository named `the-open-2026-sweepstake`.
3. Upload every file and folder from this package to that repository.
4. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
5. Select the repository.
6. Set the build output directory to `public`. No build command is required.
7. After deployment, open **Settings → Variables and Secrets** and add:
   - `RAPIDAPI_KEY` — your Slash Golf / Live Golf Data key
   - `TOURN_ID` — The Open tournament ID from the Slash Golf schedule endpoint
   - `YEAR` — `2026`
   - `ORG_ID` — normally `1`
8. Redeploy once. Cloudflare gives you a public link ending in `.pages.dev`.
9. Share that one link in WhatsApp.

## During the tournament

The display refreshes every 15 minutes and sorts entrants by lowest combined score. A cut or withdrawal is shown clearly and moved below valid entries.

## Manual fallback

Open the public page, press **Admin / manual scores**, paste score JSON, and save. Manual data is stored in that browser only, so it is mainly for a TV display or emergency use.

## Important

Do not put the API key inside `index.html` or share it in WhatsApp. Add it only as a Cloudflare secret/environment variable.
