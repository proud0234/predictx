# PredictX – Navbar, Auth & UX Overhaul

## Current State
- Navbar has nav dropdowns (Markets, Trade, Rewards, Leaderboard) on hover
- Login/Signup modals are basic with no validation
- Notifications bell shows a static badge (3) but no dropdown
- After login, only a tiny principal-based avatar and logout button appear
- Mobile hamburger opens a simple list of page links
- No settings/appearance panel
- No profile dropdown

## Requested Changes (Diff)

### Add
- **Profile dropdown** (top-right after login): clicking avatar opens dropdown with: Profile, Settings, Appearance, Leaderboard, Notifications, Wallet, Help, Logout
- **Settings panel inside that dropdown**: appearance (dark/light theme toggle), account settings, notification preferences, leaderboard shortcut
- **Notifications panel/dropdown**: clicking bell shows a real dropdown list of notifications (market updates, trade fills, reward alerts) with mark-as-read functionality
- **Google-style account picker modal**: login button opens an account chooser popup (shows saved accounts as cards to click, plus "Use another account") — selecting an account goes straight in, "Use another account" shows email+password form
- **Gmail validation in signup**: email field must be a real Gmail address (ends in @gmail.com); show inline error if not valid; also validate username (min 3 chars, alphanumeric), password strength (min 8 chars, 1 uppercase, 1 number)
- **User state context**: store logged-in user profile (name, email, avatar initials, join date) in React context/state, pass to navbar
- **Security badge**: show a lock/shield icon in the nav with "Secured by ICP" tooltip

### Modify
- **Mobile hamburger menu**: currently opens a plain page list; change to open a full slide-down panel with nav links PLUS a Settings section (appearance toggle, account info if logged in)
- **Avatar**: after login show colored circle avatar with user's initials (from signup name) or first 2 chars of principal
- **Login modal**: replace with Google-style account picker UI

### Remove
- Nothing removed, only enhanced

## Implementation Plan
1. Create `AuthContext.tsx` — React context storing user profile state (name, email, avatarColor, isLoggedIn), login/logout/signup functions
2. Rewrite `Navbar.tsx` completely:
   - Add NotificationsDropdown component (inline) with list of mock notifications, unread count badge, mark-all-read button
   - Add ProfileDropdown component (inline) shown only when logged in, with all settings items
   - Replace login modal with `AccountPickerModal` component: shows 2-3 mock saved accounts as selectable cards + "Use another account" option
   - "Use another account" shows inline email/password form inside same modal
   - Mobile menu enhanced with settings section
3. Update signup modal with proper validation:
   - Username: 3+ chars, alphanumeric
   - Email: must match /^[a-zA-Z0-9._%+-]+@gmail\.com$/ pattern
   - Password: 8+ chars, 1 uppercase, 1 digit
   - Show inline error messages under each field
   - On successful signup, auto-login and store profile in AuthContext
4. Update `App.tsx` to wrap with `AuthProvider`
5. Add appearance toggle (dark mode CSS class on root) with localStorage persistence
