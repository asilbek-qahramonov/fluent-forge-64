
# LinguaAI — Full Platform Skeleton

You chose "full skeleton of everything" on the Lovable stack (TanStack Start + Lovable Cloud + Lovable AI). I'll build a broad, navigable, visually premium platform where every major surface exists as a real route with working core interactions. Depth per feature will be v1 (real, not dummy — but not enterprise-complete).

## Scope this build covers

**Design system**
- Custom OKLCH theme (deep indigo + emerald accent, warm neutrals), Outfit + Inter fonts, gradients, glass surfaces, dark/light mode toggle, semantic tokens only.
- Animated page transitions, skeleton loaders, toasts (sonner), shimmer states, motion via `tw-animate-css` + Motion for React.

**Auth (Lovable Cloud / Supabase)**
- Email + password, Google, Apple (configured via `configure_social_auth`).
- `/auth` (sign-in/up tabs), `/auth/forgot`, `/auth/reset-password`, email verification flow, "remember me".
- `profiles` table + trigger, `user_roles` table for RBAC.

**Authenticated app shell** (`/_authenticated/*`)
Sidebar + topbar layout with command palette (⌘K), notifications popover, profile menu, theme toggle.

Routes:
- `/dashboard` — streak, XP, level ring, weekly/monthly goals, AI recommendations, continue-learning cards, animated skill radar (speaking/listening/reading/writing/grammar/vocab), leaderboard preview, daily challenge, quote.
- `/tutor` — full AI chat (AI Elements), streaming, message parts, voice input (STT), TTS playback, conversation history persisted per user, pin/delete/export.
- `/courses` + `/courses/$level` (A1–C2) + `/courses/$level/$lessonId` — lesson player with tabs (video/audio/reading/grammar/vocab/quiz), progress tracking.
- `/grammar` — topic library grid; `/grammar/$topic` — explanation + AI-generated examples + exercises.
- `/vocabulary` — searchable dictionary, favorites, flashcards with spaced repetition, daily word.
- `/speaking` — recorder, pronunciation scoring via AI, prompts.
- `/listening` — podcast/clip library with comprehension quizzes.
- `/reading` — article library + comprehension.
- `/writing` — essay editor with AI feedback, score, suggestions.
- `/quizzes` — quiz hub, multiple question types.
- `/exams` — IELTS / TOEFL / CEFR / Cambridge mock exams with timer.
- `/gamification` — badges, missions, leaderboard.
- `/community` — posts, comments, likes, follows.
- `/notes`, `/calendar`, `/bookmarks`, `/certificates` (PDF generation stub with QR).
- `/settings/*` — profile, password, devices, notifications, subscription, appearance.
- `/pricing` — plans (free/premium), Stripe placeholder.
- `/admin/*` (admin-role gated) — users, courses, lessons, vocab, grammar, analytics, tickets, logs, settings.

**Public marketing**
- `/` landing (hero, features, how-it-works, testimonials, pricing teaser, CTA), `/about`, `/features`, `/pricing`, `/blog`, `/contact` — each with its own SEO head.

**Backend / Cloud**
- Tables: `profiles`, `user_roles`, `app_role` enum, `has_role()` SECURITY DEFINER, `user_progress`, `user_stats` (xp, streak, level), `lessons`, `courses`, `vocabulary`, `user_vocabulary`, `grammar_topics`, `chat_conversations`, `chat_messages`, `user_notes`, `user_favorites`, `community_posts`, `community_comments`, `notifications`, `achievements`, `user_achievements`, `writing_submissions`, `quiz_attempts`.
- RLS + GRANTs on every table. Seed initial course/grammar/vocabulary content via migration.

**AI (Lovable AI Gateway, default `google/gemini-3-flash-preview`)**
- Streaming chat server route `/api/chat` using AI SDK.
- Server functions: `evaluateWriting`, `explainGrammar`, `generateExercises`, `translate`, `pronunciationFeedback`, `generateQuiz`, `generateLessonPlan`.
- Whisper STT via `openai/gpt-4o-mini-transcribe` for voice input.

**Chat UI**
- AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`, `tool`).
- Threaded conversations, DB persistence, per-thread URL `/tutor/$threadId`, new-thread action, restore on reload.

## Out of scope for this build (would be follow-ups)

- Real payment integration (Stripe/Paddle setup requires separate enable flow — I'll wire pricing UI + a "coming soon" checkout).
- Real 2FA / device management backend.
- PWA / offline mode.
- Real certificate PDF generation service.
- Full admin CRUD for every table (basic tables + read views; write flows for the main ones).
- 100k-word dictionary (seed ~200 words; wire dictionary API later).
- Real content library (podcasts, movies) — seed representative items.
- Multi-language UI (English-only for v1).

## Architecture notes (technical)

- TanStack Start file routes; `_authenticated/` for gated subtree (integration-managed layout).
- All AI calls server-side via `createServerFn` or `/api/chat` route; `LOVABLE_API_KEY` never in client.
- `requireSupabaseAuth` middleware for protected server fns; bearer attacher in `src/start.ts`.
- Framer Motion for page/element animation; `tw-animate-css` for utility animations.
- Icons: lucide-react.

## Delivery

I will build in one large pass: Cloud enable → migrations → auth → shell/design system → dashboard → tutor chat → each feature route → admin → landing. Expect some routes to be "v1 depth" (real UI + working core action) rather than exhaustive — the spec is genuinely months of work, and this establishes the full navigable product for iteration.

Approve to proceed, or tell me which areas to prioritize deeper vs lighter.
