# AGENTS.md

Instructions for coding agents working in this repo.

## Project overview
- Playwright + TypeScript test suite for Demoblaze.
- Test types: UI, API, hybrid, mock, and visual.

## Agent roster
### ui-test-author
- Use when adding or updating UI specs in `tests/ui/` or visuals in `tests/ui/visuals/`.
- Import `test, expect` from `fixtures/baseTest`.
- Prefer Page Objects (`pages/`) and Components (`components/`) over raw selectors.
- Tag visual specs with `@visual` when needed.

### api-test-author
- Use when adding or updating API specs in `tests/api/`.
- Import `test, expect` from `fixtures/apiTest`.
- Validate status, shape, and minimal required fields.
- Avoid creating new dotted filenames like `*.api.spec.ts`.

### hybrid-test-author
- Use when a spec needs both UI and API setup in `tests/hybrid/`.
- Import from `fixtures/baseTest` and use `apiClient` when needed.
- Keep UI steps after API setup small and deterministic.

### page-object-maintainer
- Use when updating `pages/`, `components/`, or `flows/`.
- Encapsulate selectors and actions; avoid test assertions here.
- Keep navigation explicit in method names.

### data-helpers-steward
- Use when updating `utils/` or `test-data/`.
- Keep helper APIs stable and avoid side effects.
- Add small, reusable utilities rather than test-specific helpers.

### reporting-ci-guardian
- Use when changing `playwright.config.ts`, Allure usage, or CI pipelines.
- Ensure report commands and artifacts remain consistent.

### allure-best-practices-enforcer
- Use when adding Allure steps/labels/attachments across UI, API, and hybrid specs.
- Prefer `AllureHelper.step()` for meaningful user actions and business milestones.
- Apply `AllureHelper.epic/feature/story/severity` at the top of suites where it adds value.
- Avoid wrapping every single line in steps; keep steps readable and outcome-focused.
- Do not duplicate attachments already handled in `fixtures/baseTest.ts`.

## Setup
```powershell
npm install
npx playwright install --with-deps
```

## Common commands
- Full test run (default env):
  ```powershell
  npx playwright test
  ```
- Env-specific runs:
  ```powershell
  npm run test:dev
  npm run test:stage
  npm run test:prod
  ```
- Single test:
  ```powershell
  npx playwright test tests/ui/login.spec.ts --project=ui-regression
  ```
- Visual tests:
  ```powershell
  npx playwright test --grep @visual
  ```
- Update visual snapshots:
  ```powershell
  npx playwright test --update-snapshots
  ```

## Reporting
- Generate Allure report:
  ```powershell
  npx allure generate --clean allure-results
  ```
- Open Allure report:
  ```powershell
  npx allure open
  ```

## CI steps
- GitHub Actions workflow: `.github/workflows/allure-ci.yml`
  - Install dependencies
  - Install Playwright browsers
  - Run UI tests
  - Generate Allure HTML report
  - Upload Allure artifacts
  - Publish report to GitHub Pages
- GitLab CI: `.gitlab-ci.yml`
- Azure DevOps pipeline: `azure-pipelines.yml`

## Conventions
- Use fixtures from `fixtures/baseTest.ts` for UI/hybrid tests.
- Use fixtures from `fixtures/apiTest.ts` for API-only tests.
- Prefer `baseURL` routing (`page.goto("/")`, `page.goto("/cart.html")`) instead of hardcoded URLs.
- Avoid `networkidle` waits for Demoblaze; prefer DOM-driven waits.

## Notes
- If you change global hooks/fixtures, run at least one UI and one API spec to validate.
