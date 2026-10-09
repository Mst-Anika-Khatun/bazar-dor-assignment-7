# Verification and remaining setup

## Completed checks

- Standard Next.js production build passed.
- Workers-compatible hosted build passed.
- Five price/formatting tests passed.
- Twenty local production HTTP checks passed: invalid routes, protected redirects, category refresh, password validation, signup without automatic signin, wrong-password rejection, signin, session, authenticated detail refresh, profile update, profile refresh, separate update route, logout and invalidated-session protection.
- Hosted assets and live API checked; all 33 products loaded from the live API.
- Hosted D1 signup, signin, persistent session, name update and logout checks passed after fixing the preview database adapter.
- Meaningful development commits are included in the Git history.

## Still required before submission

- Set real Google and GitHub OAuth credentials and complete both real social-login flows.
- Push to the user's own GitHub repository.
- Use an examiner-accessible deployment; the ChatGPT-hosted preview is owner-private.
- Check browser interactions, mobile/tablet layout and console errors. Browser access was declined during this run, so these visual checks are unverified.

No full-marks guarantee is implied. The final examiner checks and configured external services determine readiness.
