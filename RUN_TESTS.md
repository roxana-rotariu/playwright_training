# Run Tests

Quick guide for running the Playwright + TypeScript tests in this repo.

## Prerequisites

```powershell
npm install
npx playwright install --with-deps
```

## Common runs

Full test run (default env):

```powershell
npx playwright test
```

Env-specific runs:

```powershell
npm run test:dev
npm run test:stage
npm run test:prod
```

Single test:

```powershell
npx playwright test tests/ui/login.spec.ts --project=ui-regression
```

Visual tests:

```powershell
npx playwright test --grep "@visual"
```

Update visual snapshots:

```powershell
npx playwright test --grep "@visual" --project=ui-regression --update-snapshots
```

Update visual snapshots on Linux via Docker:

```powershell
docker run --rm -t -v "C:\Users\roxana.curcan\OsfProjects\PlaywrightTestPrj\skyshop-tests:/work" -w /work mcr.microsoft.com/playwright:v1.58.1-jammy bash -lc 'npm ci && npx playwright test --grep "@visual" --project=ui-regression --update-snapshots'
```

## Reports

Generate Allure report:

```powershell
npx allure generate --clean allure-results
```

Open Allure report:

```powershell
npx allure open
```
