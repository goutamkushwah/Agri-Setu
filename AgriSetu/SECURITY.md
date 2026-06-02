# Security guide for Agri-Setu

## Before pushing to GitHub

1. **Never commit** `backend/.env` or any file with real passwords or API keys.
2. Copy `backend/.env.example` → `backend/.env` and set values only on your machine.
3. Use a **private** GitHub repository.
4. Enable **2FA** on your GitHub account.

## Check nothing secret is staged

```powershell
cd D:\Agri-Setu
git status
git check-ignore -v backend/.env
```

`backend/.env` should be listed as ignored. It must **not** appear under "Changes to be committed".

If `.env` was committed before:

```powershell
git rm --cached backend/.env
git commit -m "Stop tracking .env"
```

If secrets were already pushed, **rotate** all passwords and keys, then clean git history (see [GitHub docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)).

## First push

```powershell
git init
git add .
git status
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Agri-Setu.git
git push -u origin main
```

Prefer SSH: `git@github.com:YOUR_USERNAME/Agri-Setu.git`

## Production

- New strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- New admin password (set via seed + `.env`, not in code)
- `NODE_ENV=production`
- HTTPS and correct `FRONTEND_URL` in CORS
