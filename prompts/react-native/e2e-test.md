# Prompt — Detox E2E Test

**Platform:** React Native (TypeScript)  
**Category:** Code Quality  
**Type:** one-shot

---

## Purpose

Generates a Detox E2E test for a React Native user flow from a plain-English description.

---

## Prompt

```
You are a senior React Native engineer and QA automation specialist. Generate a complete
Detox E2E test for the user flow described below.

Rules:
1. Use Detox with Jest runner and TypeScript.
2. Use testID props to select elements — never use text content selectors for interactive elements.
3. Structure: describe block → beforeAll (launch app) → afterAll → individual it blocks.
4. Each it block tests ONE atomic action and assertion.
5. Use waitFor().toBeVisible() for async elements (avoid arbitrary sleep).
6. Cover: happy path, validation errors, and one edge case.
7. Add comments explaining WHY steps are done (not WHAT — the code is readable).
8. Output: complete test file + a list of testID props to add to the app components.

User flow to test:
[DESCRIBE THE FLOW — include: starting screen, actions, expected outcomes, error states]
```

---

## Example Usage

**What you paste:**
```
User flow to test:
Login flow: user opens app → sees Login screen → enters email and password →
taps Login button → sees Home screen. 
Error case: invalid credentials → sees "Invalid email or password" error message.
Validation: empty email → sees "Email is required" error inline.
```

**Expected output:**
```typescript
// e2e/login.test.ts
import { device, element, by, expect, waitFor } from 'detox';

describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('shows the Login screen on first launch', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.id('email-input'))).toBeVisible();
    await expect(element(by.id('password-input'))).toBeVisible();
    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('navigates to Home screen after successful login', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('correctPassword123');
    await element(by.id('password-input')).tapReturnKey();

    await element(by.id('login-button')).tap();

    // Wait for async navigation — do not use fixed sleep
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('shows error message for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('wrongPassword');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('auth-error-message')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('auth-error-message'))).toHaveText(
      'Invalid email or password'
    );
    // Confirm we did NOT navigate away
    await expect(element(by.id('login-screen'))).toBeVisible();
  });

  it('shows inline validation error for empty email', async () => {
    // Tap Login without filling email — triggers validation
    await element(by.id('login-button')).tap();

    await expect(element(by.id('email-error'))).toBeVisible();
    await expect(element(by.id('email-error'))).toHaveText('Email is required');
  });

  it('clears error message when user starts typing again', async () => {
    // Trigger the error first
    await element(by.id('login-button')).tap();
    await expect(element(by.id('email-error'))).toBeVisible();

    // Start typing — error should clear
    await element(by.id('email-input')).typeText('u');
    await expect(element(by.id('email-error'))).not.toBeVisible();
  });
});

/* testIDs to add to your React Native components:
   <View testID="login-screen">
   <TextInput testID="email-input" />
   <TextInput testID="password-input" />
   <TouchableOpacity testID="login-button">
   <Text testID="auth-error-message">{authError}</Text>
   <Text testID="email-error">{emailError}</Text>
   <View testID="home-screen">
*/
```

---

## Variations

- **With mock server:** Add "Use Detox's network mocking to return a 401 for invalid credentials without hitting the real API."
- **Maestro instead of Detox:** Add "Generate a Maestro YAML flow file instead of a Detox TypeScript test."
