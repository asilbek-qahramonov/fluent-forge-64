
-- =========================================
-- 1. PROFILES: yangi maydonlar
-- =========================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS coins integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_until timestamptz,
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_banned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_daily_bonus_at date;

-- Har bir mavjud foydalanuvchi uchun referral_code generatsiya qilish
UPDATE public.profiles
SET referral_code = upper(substr(md5(id::text || random()::text), 1, 8))
WHERE referral_code IS NULL;

-- Coin va premium ustunlarini foydalanuvchi o'zgartira olmasligi uchun
-- alohida policy — foydalanuvchi profilini yangilashi mumkin, ammo
-- faqat display_name, bio, avatar_url, native_language kabi maydonlarni.
-- Buni column-level qilish uchun eski policy'ni almashtiramiz.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Trigger orqali sezgir maydonlarni himoya qilamiz
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin bo'lsa hammasi mumkin
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Aks holda sezgir maydonlar o'zgarmasligi kerak
  NEW.coins := OLD.coins;
  NEW.is_premium := OLD.is_premium;
  NEW.premium_until := OLD.premium_until;
  NEW.is_banned := OLD.is_banned;
  NEW.referral_code := OLD.referral_code;
  NEW.referred_by := OLD.referred_by;
  NEW.last_daily_bonus_at := OLD.last_daily_bonus_at;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_fields ON public.profiles;
CREATE TRIGGER protect_profile_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_sensitive_fields();

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =========================================
-- 2. handle_new_user'ni referral_code bilan yangilash
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_code text;
  referrer_id uuid;
BEGIN
  ref_code := upper(substr(md5(NEW.id::text || random()::text), 1, 8));

  -- Signup metadata'da referral kod bo'lsa, taklif qilgan userni topamiz
  IF NEW.raw_user_meta_data ? 'referral_code' THEN
    SELECT id INTO referrer_id
    FROM public.profiles
    WHERE referral_code = upper(NEW.raw_user_meta_data->>'referral_code')
    LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, display_name, avatar_url, referral_code, referred_by)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url',
    ref_code,
    referrer_id
  );
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- auth.users trigger'i mavjud emasligi mumkin, tekshiramiz
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- 3. COIN_TRANSACTIONS
-- =========================================
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coin_tx_user ON public.coin_transactions(user_id, created_at DESC);

GRANT SELECT ON public.coin_transactions TO authenticated;
GRANT ALL ON public.coin_transactions TO service_role;

ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own tx"
ON public.coin_transactions FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =========================================
-- 4. COIN_TASKS
-- =========================================
DO $$ BEGIN
  CREATE TYPE public.coin_task_type AS ENUM (
    'telegram_join', 'daily_login', 'referral', 'lesson_complete',
    'quiz_complete', 'vocab_add', 'community_post', 'custom'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.coin_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  reward integer NOT NULL DEFAULT 10,
  task_type public.coin_task_type NOT NULL DEFAULT 'custom',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  is_repeatable boolean NOT NULL DEFAULT false,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coin_tasks TO anon, authenticated;
GRANT ALL ON public.coin_tasks TO service_role;

ALTER TABLE public.coin_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads active tasks"
ON public.coin_tasks FOR SELECT
USING (is_active OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage tasks"
ON public.coin_tasks FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tg_coin_tasks_updated_at
BEFORE UPDATE ON public.coin_tasks
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================
-- 5. USER_TASK_COMPLETIONS
-- =========================================
CREATE TABLE IF NOT EXISTS public.user_task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.coin_tasks(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  completion_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE (user_id, task_id, completion_date)
);

CREATE INDEX IF NOT EXISTS idx_utc_user ON public.user_task_completions(user_id, completed_at DESC);

GRANT SELECT ON public.user_task_completions TO authenticated;
GRANT ALL ON public.user_task_completions TO service_role;

ALTER TABLE public.user_task_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own completions"
ON public.user_task_completions FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =========================================
-- 6. PREMIUM_PLANS
-- =========================================
CREATE TABLE IF NOT EXISTS public.premium_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_usd numeric(10,2) NOT NULL,
  price_coins integer,
  duration_days integer NOT NULL,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_popular boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  stripe_price_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.premium_plans TO anon, authenticated;
GRANT ALL ON public.premium_plans TO service_role;

ALTER TABLE public.premium_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads active plans"
ON public.premium_plans FOR SELECT
USING (is_active OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage plans"
ON public.premium_plans FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tg_premium_plans_updated_at
BEFORE UPDATE ON public.premium_plans
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================
-- 7. PAYMENT_ORDERS
-- =========================================
DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('stripe', 'coins');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.premium_plans(id) ON DELETE RESTRICT,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  method public.payment_method NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.payment_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.payment_orders(status);

GRANT SELECT ON public.payment_orders TO authenticated;
GRANT ALL ON public.payment_orders TO service_role;

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own orders"
ON public.payment_orders FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tg_payment_orders_updated_at
BEFORE UPDATE ON public.payment_orders
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================
-- 8. VOCABULARY_EXAMS
-- =========================================
CREATE TABLE IF NOT EXISTS public.vocabulary_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  coins_awarded integer NOT NULL DEFAULT 0,
  duration_seconds integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vocab_exam_user ON public.vocabulary_exams(user_id, created_at DESC);

GRANT SELECT, INSERT ON public.vocabulary_exams TO authenticated;
GRANT ALL ON public.vocabulary_exams TO service_role;

ALTER TABLE public.vocabulary_exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own exams"
ON public.vocabulary_exams FOR ALL
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id);

-- =========================================
-- 9. ADMIN_SETTINGS (key-value store)
-- =========================================
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_settings TO anon, authenticated;
GRANT ALL ON public.admin_settings TO service_role;

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads settings"
ON public.admin_settings FOR SELECT
USING (true);

CREATE POLICY "Admins manage settings"
ON public.admin_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Default sozlamalar
INSERT INTO public.admin_settings (key, value) VALUES
  ('telegram_channel', '{"url": "", "username": ""}'::jsonb),
  ('referral_reward', '{"referrer": 50, "referee": 20}'::jsonb),
  ('daily_bonus', '{"amount": 5}'::jsonb),
  ('free_tutor_limit', '{"messages_per_day": 10}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- =========================================
-- 10. SEED: default coin_tasks va premium_plans
-- =========================================
INSERT INTO public.coin_tasks (title, description, reward, task_type, is_repeatable, icon, sort_order)
VALUES
  ('Telegram kanalimizga a''zo bo''ling', 'Bizning rasmiy Telegram kanalimizga a''zo bo''lib, 20 tanga oling.', 20, 'telegram_join', false, 'send', 1),
  ('Kunlik kirish', 'Har kuni saytga kirib 5 tanga to''plang. Streak uzilmasin!', 5, 'daily_login', true, 'calendar-check', 2),
  ('Do''stni taklif qiling', 'Do''stingizni referral link orqali taklif qiling — ikkalangizga 50 tanga.', 50, 'referral', true, 'user-plus', 3),
  ('Dars tugatish', 'Har bir tugatilgan dars uchun 10 tanga.', 10, 'lesson_complete', true, 'graduation-cap', 4),
  ('Quiz tugatish', 'Har bir muvaffaqiyatli quiz uchun 8 tanga.', 8, 'quiz_complete', true, 'clipboard-check', 5),
  ('Lug''at qo''shish', 'Har bir yangi so''z qo''shganingiz uchun 2 tanga.', 2, 'vocab_add', true, 'book-open', 6),
  ('Community postingiz', 'Community''da post yozish uchun 5 tanga.', 5, 'community_post', true, 'message-square', 7)
ON CONFLICT DO NOTHING;

INSERT INTO public.premium_plans (name, description, price_usd, price_coins, duration_days, features, is_popular, sort_order)
VALUES
  ('1 oy Pro', 'Bir oyga barcha imkoniyatlar', 9.00, 500, 30,
   '["Cheksiz AI tutor", "Barcha B1–C2 kurslar", "IELTS/TOEFL mock imtihonlar", "PDF sertifikatlar", "Reklamasiz", "Ovozli AI suhbat"]'::jsonb,
   false, 1),
  ('3 oy Pro', 'Eng mashhur — 3 oy uchun', 24.00, 1200, 90,
   '["Cheksiz AI tutor", "Barcha B1–C2 kurslar", "IELTS/TOEFL mock imtihonlar", "PDF sertifikatlar", "Reklamasiz", "Ovozli AI suhbat", "Prioritet qo''llab-quvvatlash"]'::jsonb,
   true, 2),
  ('1 yil Pro', 'Yillik — eng foydali', 79.00, 4000, 365,
   '["Cheksiz AI tutor", "Barcha B1–C2 kurslar", "IELTS/TOEFL mock imtihonlar", "PDF sertifikatlar", "Reklamasiz", "Ovozli AI suhbat", "Prioritet qo''llab-quvvatlash", "Eksklyuziv webinarlar"]'::jsonb,
   false, 3)
ON CONFLICT DO NOTHING;

-- =========================================
-- 11. SERVER FUNCTIONS
-- =========================================

-- Atomik tanga qo'shish/ayirish
CREATE OR REPLACE FUNCTION public.award_coins(
  _user_id uuid,
  _amount integer,
  _reason text,
  _metadata jsonb DEFAULT '{}'::jsonb
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance integer;
BEGIN
  UPDATE public.profiles
  SET coins = GREATEST(0, coins + _amount)
  WHERE id = _user_id
  RETURNING coins INTO new_balance;

  IF new_balance IS NULL THEN
    RAISE EXCEPTION 'User not found: %', _user_id;
  END IF;

  INSERT INTO public.coin_transactions (user_id, amount, reason, metadata)
  VALUES (_user_id, _amount, _reason, _metadata);

  RETURN new_balance;
END;
$$;

-- Vazifani bajarilgan deb belgilash va tanga berish
CREATE OR REPLACE FUNCTION public.complete_task(
  _user_id uuid,
  _task_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _task record;
  _new_balance integer;
BEGIN
  SELECT * INTO _task FROM public.coin_tasks WHERE id = _task_id AND is_active;
  IF _task IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Task not found');
  END IF;

  -- Bajarilganligini tekshirish (bir marotaba yoki kunlik)
  IF NOT _task.is_repeatable THEN
    IF EXISTS (SELECT 1 FROM public.user_task_completions WHERE user_id = _user_id AND task_id = _task_id) THEN
      RETURN jsonb_build_object('success', false, 'error', 'Already completed');
    END IF;
  ELSE
    IF EXISTS (
      SELECT 1 FROM public.user_task_completions
      WHERE user_id = _user_id AND task_id = _task_id
        AND completion_date = (now() AT TIME ZONE 'utc')::date
    ) THEN
      RETURN jsonb_build_object('success', false, 'error', 'Already completed today');
    END IF;
  END IF;

  INSERT INTO public.user_task_completions (user_id, task_id) VALUES (_user_id, _task_id);
  _new_balance := public.award_coins(_user_id, _task.reward, 'task:' || _task.task_type::text, jsonb_build_object('task_id', _task_id));

  RETURN jsonb_build_object('success', true, 'reward', _task.reward, 'new_balance', _new_balance);
END;
$$;

-- Premium activatsiya
CREATE OR REPLACE FUNCTION public.activate_premium(
  _user_id uuid,
  _days integer
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET is_premium = true,
      premium_until = GREATEST(COALESCE(premium_until, now()), now()) + (_days || ' days')::interval
  WHERE id = _user_id;
END;
$$;

-- Tangaga premium sotib olish
CREATE OR REPLACE FUNCTION public.redeem_premium_with_coins(
  _user_id uuid,
  _plan_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _plan record;
  _balance integer;
  _order_id uuid;
BEGIN
  SELECT * INTO _plan FROM public.premium_plans WHERE id = _plan_id AND is_active;
  IF _plan IS NULL OR _plan.price_coins IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Plan not available for coins');
  END IF;

  SELECT coins INTO _balance FROM public.profiles WHERE id = _user_id;
  IF _balance < _plan.price_coins THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient coins', 'need', _plan.price_coins, 'have', _balance);
  END IF;

  -- Tangani yechish
  PERFORM public.award_coins(_user_id, -_plan.price_coins, 'premium_purchase', jsonb_build_object('plan_id', _plan_id));

  -- Buyurtma yaratish
  INSERT INTO public.payment_orders (user_id, plan_id, amount, currency, method, status)
  VALUES (_user_id, _plan_id, _plan.price_coins, 'coins', 'coins', 'paid')
  RETURNING id INTO _order_id;

  -- Premium berish
  PERFORM public.activate_premium(_user_id, _plan.duration_days);

  RETURN jsonb_build_object('success', true, 'order_id', _order_id, 'days', _plan.duration_days);
END;
$$;

-- Kunlik bonus
CREATE OR REPLACE FUNCTION public.claim_daily_bonus(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _last date;
  _amount integer;
  _new_balance integer;
BEGIN
  SELECT last_daily_bonus_at INTO _last FROM public.profiles WHERE id = _user_id;
  IF _last = (now() AT TIME ZONE 'utc')::date THEN
    RETURN jsonb_build_object('success', false, 'error', 'Already claimed today');
  END IF;

  SELECT (value->>'amount')::integer INTO _amount FROM public.admin_settings WHERE key = 'daily_bonus';
  _amount := COALESCE(_amount, 5);

  UPDATE public.profiles SET last_daily_bonus_at = (now() AT TIME ZONE 'utc')::date WHERE id = _user_id;
  _new_balance := public.award_coins(_user_id, _amount, 'daily_bonus', '{}'::jsonb);

  RETURN jsonb_build_object('success', true, 'reward', _amount, 'new_balance', _new_balance);
END;
$$;

-- Foydalanuvchi statistikasi (admin uchun)
CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'premium_users', (SELECT count(*) FROM public.profiles WHERE is_premium AND (premium_until IS NULL OR premium_until > now())),
    'banned_users', (SELECT count(*) FROM public.profiles WHERE is_banned),
    'active_7d', (SELECT count(DISTINCT user_id) FROM public.coin_transactions WHERE created_at > now() - interval '7 days'),
    'active_30d', (SELECT count(DISTINCT user_id) FROM public.coin_transactions WHERE created_at > now() - interval '30 days'),
    'total_revenue_usd', COALESCE((SELECT sum(amount) FROM public.payment_orders WHERE method = 'stripe' AND status = 'paid'), 0),
    'revenue_30d_usd', COALESCE((SELECT sum(amount) FROM public.payment_orders WHERE method = 'stripe' AND status = 'paid' AND created_at > now() - interval '30 days'), 0),
    'orders_count', (SELECT count(*) FROM public.payment_orders WHERE status = 'paid'),
    'total_coins_awarded', COALESCE((SELECT sum(amount) FROM public.coin_transactions WHERE amount > 0), 0),
    'total_coins_spent', COALESCE((SELECT sum(-amount) FROM public.coin_transactions WHERE amount < 0), 0),
    'total_courses', (SELECT count(*) FROM public.courses),
    'total_posts', (SELECT count(*) FROM public.community_posts)
  ) INTO _result;

  RETURN _result;
END;
$$;

-- Kunlik daromad grafigi
CREATE OR REPLACE FUNCTION public.admin_revenue_series(_days integer DEFAULT 30)
RETURNS TABLE(day date, revenue numeric, orders_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  RETURN QUERY
  SELECT
    d::date AS day,
    COALESCE(sum(po.amount), 0)::numeric AS revenue,
    count(po.id) AS orders_count
  FROM generate_series(current_date - (_days - 1), current_date, '1 day'::interval) d
  LEFT JOIN public.payment_orders po
    ON po.created_at::date = d::date AND po.status = 'paid' AND po.method = 'stripe'
  GROUP BY d
  ORDER BY d;
END;
$$;

-- Admin: foydalanuvchini boshqarish
CREATE OR REPLACE FUNCTION public.admin_set_ban(_user_id uuid, _banned boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE public.profiles SET is_banned = _banned WHERE id = _user_id;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_grant_premium(_user_id uuid, _days integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  PERFORM public.activate_premium(_user_id, _days);
END; $$;

CREATE OR REPLACE FUNCTION public.admin_revoke_premium(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE public.profiles SET is_premium = false, premium_until = NULL WHERE id = _user_id;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_adjust_coins(_user_id uuid, _amount integer, _reason text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN public.award_coins(_user_id, _amount, 'admin_adjust:' || _reason, '{}'::jsonb);
END; $$;

CREATE OR REPLACE FUNCTION public.admin_grant_role(_user_id uuid, _role app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _role) ON CONFLICT DO NOTHING;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_revoke_role(_user_id uuid, _role app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = _role;
END; $$;
