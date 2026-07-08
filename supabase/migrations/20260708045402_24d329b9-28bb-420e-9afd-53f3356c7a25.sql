
-- Anon rolidan barcha yangi funksiyalarga EXECUTE huquqini olib tashlash
REVOKE EXECUTE ON FUNCTION public.award_coins(uuid, integer, text, jsonb) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.complete_task(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.activate_premium(uuid, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.redeem_premium_with_coins(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.claim_daily_bonus(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_stats() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_revenue_series(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_set_ban(uuid, boolean) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_grant_premium(uuid, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_revoke_premium(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_adjust_coins(uuid, integer, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_grant_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_revoke_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.protect_profile_sensitive_fields() FROM anon, public;

-- Faqat authenticated + service_role uchun
GRANT EXECUTE ON FUNCTION public.complete_task(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_daily_bonus(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_premium_with_coins(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revenue_series(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_ban(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_grant_premium(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_premium(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_adjust_coins(uuid, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_grant_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_role(uuid, app_role) TO authenticated;

-- Sensitive funksiyalar faqat service_role uchun
GRANT EXECUTE ON FUNCTION public.award_coins(uuid, integer, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.activate_premium(uuid, integer) TO service_role;
