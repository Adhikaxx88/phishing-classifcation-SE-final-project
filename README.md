# PhishGuard

- A web app that checks whether a URL is phishing. You paste a link or scan a QR code, and a deep learning model returns a verdict with a confidence score.
- Final project for the Software Engineering course. The code started from last semester's HCI project and works the same way.
- It has three parts: a React frontend, a FastAPI backend that serves the model, and Supabase for login.
- The frontend runs on Vercel and the backend runs on a Hugging Face Space.

## Project structure

- `src/`: frontend source
  - `main.tsx`: entry point, mounts `App` and loads the global styles
  - `app/App.tsx`: wraps the router with the language and auth providers
  - `app/routes.ts`: route table
  - `app/components/`
    - `LinkPredictor.tsx`: the main screen, with URL input, QR scan, analysis, result and history
    - `Layout.tsx`: app shell with the sidebar, background effects and the login guard
    - `auth/AuthPage.tsx`: sign in, register and reset password forms
    - `AboutUs.tsx` and `CollaboratorCard.tsx`: team and project page
    - `Settings.tsx`: settings panel with the language switch
    - `StatisticWidget.tsx`: scan counters, donut chart and recent scans
    - `MatrixProgress.tsx`, `GlitchText.tsx`, `NeonSeparator.tsx`, `ToastNotification.tsx`: small visual pieces
    - `CyberParticles.tsx`, `ThreeScene.tsx`, `CustomCursor.tsx`: background and cursor effects
    - `BarcodeScanner.tsx` and `ScanFrame.tsx`: older QR scanner pieces that nothing imports now, because the scan logic lives in `LinkPredictor.tsx`
    - `ui/`: a generated Radix based component library that the app screens do not use yet
    - `img/ImageWithFallback.tsx`: image helper, unused
  - `app/context/`: `AuthContext.tsx` holds the Supabase session, `LanguageContext.tsx` holds the English and Indonesian strings
  - `lib/supabase.ts`: creates the Supabase client from env vars
  - `styles/`: `index.css` has the cyber palette, keyframes and global classes, `theme.css` has the UI kit tokens, `tailwind.css` sets up Tailwind v4, `fonts.css` is empty
- `backend/`: model service
  - `app.py`: the FastAPI app
  - `src/preprocess.py`: `URLEmbeddingTransformer`, a thin wrapper around sentence-transformers
  - `models/phishing_detection_deeplearning.h5`: the trained Keras model, stored with Git LFS
  - `data/data.csv`: the dataset
  - `notebooks/EDA.ipynb`: exploration, model comparison, training and evaluation
  - `notebooks/src/preprocess.py`: an older copy of the transformer that the notebook imports
  - `Dockerfile`, `.dockerignore`, `requirements.txt`, `runtime.txt` (Python 3.10)
  - `README.md`: front matter that Hugging Face reads to set up the Space
  - `.gitattributes`: Git LFS rules for model files
  - `credentials/`: empty on purpose, keys never go into git
- Root config
  - `package.json` and `.npmrc` (`legacy-peer-deps=true`)
  - `vite.config.ts`: React and Tailwind plugins, `@` alias for `src`
  - `postcss.config.mjs`
  - `vercel.json`: rewrites every path to `/` so client side routes survive a refresh
  - `Dockerfile`: frontend dev server
  - `docker-compose.yml`: runs frontend (5173) and backend (8000) together
  - `index.html`
- `.github/workflows/sync_to_hf.yml`: deploys `backend/` to the Hugging Face Space
- `.project/specs/`: requirement and design notes for the two UI redesign rounds, written in Indonesian

## Architecture and logic flow

### System overview
- The browser loads the React app from Vercel.
- The app talks to two services: Supabase for login and the FastAPI backend for predictions.
- There are no database tables. Scan history is kept in the browser.

### Routing and access
- `/auth` is public.
- `/` and `/about` render inside `Layout`, which redirects to `/auth` when there is no Supabase session.
- Any other path redirects to `/`.
- While the session is loading, `Layout` shows a spinner so the login screen does not flash.

### Auth flow
- `AuthContext` loads the session on start and listens for auth changes.
- Sign in uses email and password.
- Register asks for a confirmation field and at least 6 characters. Supabase then sends a confirmation email.
- Reset password sends an email with a link back to `<site origin>/auth?mode=reset`.
- The deployed domain must be listed in the Supabase Site URL and Redirect URLs, otherwise those email links fail.
- If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing, the Supabase client throws at startup and the page stays blank.

### Prediction flow, frontend
- The user types or pastes a URL, or scans a QR code with the camera or an uploaded image (html5-qrcode). A decoded QR fills the input.
- Analyze sends `POST {VITE_API_URL}/predict` with `{ "url": "..." }`. The base URL defaults to `http://localhost:8000`.
- While waiting, the UI plays a progress bar and a terminal style log. Those steps are timed on the client, they are not streamed from the backend.
- After the response arrives, a fixed 5 second animation runs and then the result shows: verdict, confidence and legitimate probability.
- The scan is saved to `localStorage` under `phishguard_history` (newest 50) and the statistics widget updates.
- Report to Google opens the Google Safe Browsing phishing report page for the URL. The backend has a `/report` endpoint, but the UI does not call it.
- If the backend cannot be reached, the terminal panel logs an error and an alert appears.

### Prediction flow, backend
- On startup `app.py` loads the Keras model and the `all-MiniLM-L6-v2` sentence transformer. Both run on CPU.
- `POST /predict` turns the URL into a 384 dimension vector and runs the model.
- The model output is the probability that the URL is legitimate. When the phishing probability is above 0.5 the label is `PHISHING`, otherwise `LEGITIMATE`.
- The response has `url`, `label`, `confidence` (percent for the winning label), `legitimate_chance` and `is_dangerous`.
- `/predict` returns 503 if the model or the encoder failed to load.
- `GET /` reports whether the model and the encoder are loaded.
- `POST /report` submits the URL to Google Web Risk with a service account. It returns 500 when credentials are missing and 502 when the Google call fails.
- CORS allows every origin unless `ALLOWED_ORIGIN` is set to a comma separated list.

### Model
- Input is the URL string only. The extra numeric columns in `data.csv` were used for exploration, not for training.
- Pipeline: sentence-transformers embedding (384 dimensions), then a small dense network.
- Network layers: Dense 128 (ReLU), Dropout 0.3, Dense 64 (ReLU), Dropout 0.2, Dense 1 (sigmoid).
- Training setup: Adam, binary cross entropy, early stopping on loss, up to 15 epochs, batch size 32.
- Dataset: 80,755 unique URLs after dropping duplicates and empty rows. Label 0 (phishing) has 50,438 rows and label 1 (legitimate) has 30,317, which matches how `app.py` reads the output.
- Split: 80/20 stratified with `random_state=42`, so the test set has 16,151 rows.
- The saved model scored 96.62% accuracy and 0.975 ROC AUC on the test set.
- The notebook also compares logistic regression (96.50%) and two dense network variants (96.77% and 96.79%) on the same split.
- To retrain, run `EDA.ipynb`. The cell that saves the model writes it into `backend/models/`.

### Deployment flow
- Branches: work happens on `develop` and is merged into `master`. A merge into `master` triggers both deployments.
- Frontend: a Vercel project is connected to this repo with `master` as the production branch. Env vars live in the Vercel project.
- Backend: a Hugging Face Docker Space. The workflow `sync_to_hf.yml` runs on pushes to `master` that touch `backend/`, or by hand from the Actions tab.
- The workflow pushes one snapshot commit of `backend/` to the Space, so old non LFS model blobs in git history are not sent to Hugging Face.
- The Space builds `backend/Dockerfile` (Python 3.10, non root user) and serves on port 7860.
- The model file goes through Git LFS, set in `backend/.gitattributes`.
- Local Docker: `docker-compose.yml` runs both services, reads `.env` and mounts `google_key.json` into the backend container. Port 8000 on the host maps to 7860 in the container.

### Configuration
- Frontend env vars: `VITE_API_URL` (the Space URL without a trailing slash), `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Only variables that start with `VITE_` reach the browser.
- Backend env vars: `GOOGLE_SETTINGS` (service account JSON, written to a temp file at startup), `GOOGLE_APPLICATION_CREDENTIALS` (used locally), `ALLOWED_ORIGIN`.
- GitHub secret: `HF_TOKEN`, a Hugging Face token with write access to the Space.
- `.env` and `google_key.json` are git ignored and must stay out of commits.

## Design system

### Look and feel
- A dark cyber theme: neon green on near black, glass panels, monospace text.
- The palette is defined as CSS variables in `src/styles/index.css`. Most components still repeat the hex values inline instead of reading the variables.

### Colors
- `--cyber-bg` `#0a0f0f`: page background
- `--cyber-green` `#00ff9d`: main accent, active states and the legitimate verdict
- `--cyber-cyan` `#00ffff`: secondary accent, secondary buttons and subtitles
- `--cyber-red` `#ff3b3b`: phishing verdict and danger
- `--cyber-text` `#e0e0e0`: body text
- `--cyber-glass` `rgba(255,255,255,0.05)` and `--cyber-border` `rgba(255,255,255,0.1)`: glass fill and border
- `--cyber-glow-green`, `--cyber-glow-cyan`, `--cyber-glow-red`: a 15px glow in each color
- Orange `#ffa500` is used only for the Report to Google button

### Typography
- Monospace everywhere. No web fonts are loaded.
- Titles are uppercase with wide letter spacing, around 0.2em on the main heading.
- Small labels are 10 to 12px, uppercase, and start with a green triangle glyph.

### Surfaces and shape
- Cards: `rgba(8,14,14,0.88)` background, 14px backdrop blur, 1px border `rgba(0,255,157,0.18)`, 16px radius and a faint green glow.
- Sidebar: 220px wide, `rgba(5,10,10,0.92)` with a 16px blur and a green right border.
- Buttons: 8px radius and a 1px tinted border. Icon buttons are green, secondary actions are cyan, report is orange.
- Result colors: green for legitimate and red for phishing, used in the verdict card, the bars and the donut chart.
- Scrollbar: 6px wide with a green thumb.

### Motion
- Keyframes in `index.css`: sweep, border spin, pulsing dot, scan line, flicker, fade in, slide in from the left, button pulse and input underline sweep.
- The Analyze button pulses when clicked and the input draws an underline sweep on focus.
- `GlitchText` is used for titles, `MatrixProgress` shows while a scan runs, and toasts close on their own after 3 seconds.
- Background: a tsparticles field (130 particles, circles plus the characters `0 1 > $ #`, in green and cyan) and a three.js scene with a wireframe globe and a ring that follows the mouse.
- A custom cursor dot grows over interactive elements and is turned off on touch devices.
- `useReducedMotion` from framer-motion is checked in the result animations, the statistics widget and the toasts. The three.js scene skips itself when WebGL is not available.

### Layout
- App shell: a fixed sidebar and a scrolling content area, with the effects behind the content.
- Sidebar: logo block, nav items (Home and About Us) with an icon, label and glow on the active one, and a bottom block with the user chip, language toggle, settings and logout.
- Home screen has two columns. The left has the URL input, the QR scanner and the system log. The right has the analysis result and the statistics with history.

### Libraries and language
- Icons: lucide-react. Charts: recharts. Animation: framer-motion. Particles: tsparticles. 3D: three.
- Languages: English and Indonesian through `LanguageContext`, saved in `localStorage` as `phishguard_lang`.
- `theme.css` also holds shadcn style tokens (light and dark, radius 0.625rem, chart colors). They are ready for the `ui/` components, but the current screens do not use them.
- The original design notes are in `.project/specs/`, in Indonesian.
