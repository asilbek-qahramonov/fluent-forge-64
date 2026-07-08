
# Reja: Premium, Tanga tizimi, Admin panel

Katta ish — 4 bosqichda quraman. Har bosqich alohida tugallanadi va tekshiriladi.

## 1-bosqich: Backend (database schema)

Yangi jadval va ustunlar:

- `profiles` ga qo'shish: `coins int default 0`, `is_premium bool default false`, `premium_until timestamptz`, `referral_code text unique`, `referred_by uuid`, `is_banned bool default false`
- `coin_transactions` — har bir tanga o'zgarishi tarixi (user_id, amount, reason, metadata)
- `coin_tasks` — admin tomonidan boshqariladigan vazifalar ro'yxati (title, description, reward, type: `telegram_join` | `daily_login` | `referral` | `lesson_complete` | `custom`, config jsonb, is_active)
- `user_task_completions` — kim qaysi vazifani bajargani (unique constraint task_id+user_id yoki kunlik uchun date bilan)
- `premium_plans` — admin sozlaydigan paketlar (name, price_usd, price_coins, duration_days, features jsonb)
- `payment_orders` — Stripe orderlar (user_id, plan_id, amount, currency, status, stripe_session_id)
- `user_vocabulary` da allaqachon bor — `vocabulary_exams` yangi jadval: foydalanuvchi lug'atidan random imtihon sessiyalari (score, total, questions jsonb)
- `admin_settings` — global sozlamalar (telegram_channel_url, referral_reward, etc.)

RLS: har biri uchun to'g'ri policy'lar + `has_role('admin')` bilan admin write.

Server-side funksiyalar (SECURITY DEFINER):
- `award_coins(user_id, amount, reason)` — atomik tanga qo'shish + transaction log
- `redeem_premium_with_coins(plan_id)` — coin yechib premium beradi
- `activate_premium(user_id, days)` — premium_until yangilaydi

## 2-bosqich: Stripe to'lov

- `payments--recommend_payment_provider` → `enable_stripe_payments` (seamless, kartadan to'lov)
- Admin `premium_plans` ga products yaratadi (batch_create_product orqali)
- Checkout server function: Stripe session yaratadi, muvaffaqiyatli to'lovdan keyin webhook `activate_premium` chaqiradi
- `/api/public/stripe/webhook` — signature verify + premium activation

## 3-bosqich: Coin tizimi + vazifalar UI

Yangi sahifa `/earn` (tanga yig'ish):
- Telegram kanalga a'zo bo'lish tugmasi → linkga o'tadi, "Tekshirish" tugmasi → server function bot orqali `getChatMember` bilan tekshiradi (Telegram connector) → +20 coin
- Kunlik login streak — dashboardga kirilganda avtomatik +5 (kuniga bir marta)
- Referral: har user'ga `referral_code`, signup'da `?ref=CODE` → do'st premium yoki 5 dars tugatgach ikkalasiga +50
- Faollik: dars/quiz tugatilganda +10, lug'at qo'shilganda +2, community post +5 (trigger yoki server fn)

Premium sahifasi `/premium`:
- Paketlarni ko'rsatadi
- "Karta bilan sotib olish" (Stripe checkout)
- "Tanga bilan sotib olish" (yetarli coin bo'lsa)
- Foydalanuvchi coin balansi va streak header'da ko'rinadi

## 4-bosqich: Admin panel (kengaytirilgan) + Lug'at imtihoni

`/admin` ni kengaytirish, tabs bilan:
- **Analitika**: recharts bilan grafiklar — jami foydalanuvchi, premium user, kunlik daromad, coin flow, aktiv user (7/30 kun)
- **Foydalanuvchilar**: jadval, qidiruv, ban/unban, premium berish/olib tashlash, rol berish
- **Content**: kurs, dars, grammar, vocabulary CRUD
- **Vazifalar**: `coin_tasks` CRUD (yangi vazifa qo'shish, mukofot o'zgartirish, on/off)
- **Community moderation**: post/comment ro'yxati, o'chirish, report

`/vocabulary` sahifasiga "Random imtihon" tugmasi:
- Foydalanuvchi o'z `user_vocabulary` dan random 10 so'z tanlanadi
- 4 xil savol turi: tarjima → so'z, so'z → tarjima, gap ichida to'ldirish (AI orqali), audio (TTS)
- Natija `vocabulary_exams` ga yoziladi, ball asosida coin beriladi

## Xavfsizlik

- Barcha jadvallar RLS on, `has_role('admin')` orqali admin gate
- Coin manipulatsiyani oldini olish: `award_coins` faqat SECURITY DEFINER server fn orqali, client to'g'ridan-to'g'ri UPDATE qila olmaydi (policy user_id o'zgartirishga ruxsat bermaydi)
- Stripe webhook signature verification
- Telegram membership tekshirish server-side (bot token faqat serverda)
- Rate limiting daily task uchun DB unique constraint (task_id + user_id + date)
- Input validation zod bilan har bir server fn'da

## Texnik detallar

- Stack: mavjud TanStack Start + Cloud (Supabase)
- Yangi paket: `recharts` (allaqachon shadcn bilan), Telegram uchun connector
- Server fns: `src/lib/coins.functions.ts`, `src/lib/premium.functions.ts`, `src/lib/admin.functions.ts`
- Public route: `src/routes/api/public/stripe/webhook.ts`

## Nima tashqarida qoldi (keyingi bosqichlarda)

- Ovozli AI suhbat (Realtime API) — alohida katta ish
- Sertifikat PDF generator — premium tugatgan kursdan keyin
- Mobile push notification

## Tasdiqlashingizni so'rayman

1. **Telegram**: Telegram kanal a'zoligini tekshirish uchun Telegram bot connector kerak. Sizda kanal bor? Kanal username'ni bilishim kerak (masalan `@linguaai_uz`). Yo'q bo'lsa, hozircha "Kanalga o'tish + o'zi tasdiqlash" (honor system) qilib qo'yaman, keyin bot qo'shsangiz almashtiramiz.
2. **Stripe**: Seamless Stripe (Lovable managed) — sizga Stripe account kerak emas boshlash uchun. Test rejimda darhol ishlaydi, real to'lov uchun keyin verify qilasiz. Davom etaymi?
3. **Paket narxlari**: Standart taklif — 1 oy $9 (500 coin), 3 oy $24 (1200 coin), 1 yil $79 (4000 coin). O'zgartirasizmi yoki shunday davom etamimi?

Javob bergach, 1-bosqichdan boshlab quraman.
