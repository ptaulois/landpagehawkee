export function canAdmin(profile) {
  return Boolean(profile && profile.role === 'admin' && profile.active === true && profile.must_change_password === false);
}
export function validConfig(config) {
  return Boolean(config && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(config.supabaseUrl) && /^sb_publishable_[a-zA-Z0-9_-]+$/.test(config.publishableKey));
}
