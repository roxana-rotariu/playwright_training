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
npx playwright test --grep @visual
```

Update visual snapshots:

```powershell
npx playwright test --update-snapshots
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
