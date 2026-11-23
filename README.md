# Fajr Wake website

Public pages for the Fajr Wake (فجر) apps on iPhone and Android, served by GitHub Pages from the `main` branch
(repository root): https://abdullahjbnj.github.io/fajrwake-privacy/

| URL | Page | Used by |
|-----|------|---------|
| `/support/` | Support (setup, challenges, Fajr Pro, troubleshooting, contact) | App Store Connect "Support URL" |
| `/privacy/` | Privacy policy, iPhone + Android | App Store Connect "Privacy Policy URL" |
| `/terms/` | Terms of use (adds to Apple's Standard EULA on iPhone) | App Store description, Fajr Pro screen |
| `/privacy-site/` | **Same file as `/privacy/`**: the original Google Play privacy URL, kept working | Google Play Console |

`privacy-site/index.html` must stay an exact copy of `privacy/index.html` (both are one folder deep, so the relative
links work in both). After editing the policy: `Copy-Item privacy/index.html privacy-site/index.html`.

Every page has both languages. `assets/site.js` shows Arabic (RTL) or English (LTR): `?lang=ar|en` in the address,
then the visitor's earlier choice, then the browser language. Without JavaScript both languages are shown.
No cookies, analytics, or third-party requests (system fonts only).

When the apps change (new data, permissions, SDKs, prices or labels), update the support page and the privacy policy,
and change the "Last updated" date.
