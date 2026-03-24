# Crown Agency — X Auto-Poster Setup Guide
## Total cost: FREE for ~60 days (Anthropic $5 free credit)

---

## Files to upload to GitHub

```
your-repo/
├── .github/
│   └── workflows/
│       └── daily-post.yml    ← GitHub Actions scheduler
├── scripts/
│   └── dailyPost.js          ← Main script
└── package.json              ← Dependencies
```

---

## Step 1 — Create GitHub repository

1. github.com → New repository
2. Name: `crown-agency-autoposter`
3. Set to **Private**
4. Create repository

---

## Step 2 — Get 3 API keys

### A) Anthropic API key (FREE — $5 credit on signup)
1. console.anthropic.com → Sign up
2. API Keys → Create Key
3. Copy key (starts with `sk-ant-...`)
4. $5 free = ~100 posts = ~3 months free

### B) Buffer Access Token (FREE)
1. buffer.com → Sign up free
2. Connect your X account
3. buffer.com/developers → Create App → Get Access Token
4. Copy your Access Token

### C) Buffer Profile ID (FREE)
1. Buffer dashboard → click your X account
2. Look at URL: buffer.com/profiles/**XXXXXXX**/tab/queue
3. Copy that ID

---

## Step 3 — Add secrets to GitHub

Repo → Settings → Secrets and variables → Actions → New repository secret

| Secret Name          | Value                  |
|----------------------|------------------------|
| ANTHROPIC_API_KEY    | sk-ant-xxxxx           |
| BUFFER_ACCESS_TOKEN  | your Buffer token      |
| BUFFER_PROFILE_ID    | your Buffer profile ID |

---

## Step 4 — Test manually first

1. Repo → Actions tab
2. "Crown Agency — Daily X Post"
3. "Run workflow" → Run workflow
4. Watch logs — see generated post
5. Check your X profile!

---

## Step 5 — Done. It runs automatically.

Every day at 7:00 AM IST:
→ GitHub picks today's topic from the 30-day calendar
→ Claude generates the post
→ Buffer posts it to X automatically
→ You don't touch anything

---

## Customise topics

Edit the `TOPICS` array in `scripts/dailyPost.js`
- Change topic text anytime
- Change pillar: explain / news / ai / feedback
- Change start date to today's date

---

## Cost breakdown

| Tool           | Cost          |
|----------------|---------------|
| GitHub Actions | Free          |
| Buffer         | Free          |
| Claude API     | Free (~60 days) then ~₹150/month |

---

## Troubleshooting

**Action failing?**
→ Actions tab → click failed run → read logs

**Post not on X?**
→ Check Buffer queue — may need approval first time

**Wrong topic?**
→ Change start date in getTodayTopic() function
