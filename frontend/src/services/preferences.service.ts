/**
 * 用户偏好设置持久化服务。
 * 参考 golutra settingsStore 的规范化与持久化模式。
 * 使用 localStorage 存储，避免增加后端复杂度。
 */

const PREFS_KEY = 'flowmind:preferences';

export type AppTheme = 'light' | 'dark' | 'system';
export type AppLocale = 'zh-CN' | 'en-US';

export interface NotificationPreferences {
  email: boolean;
  desktop: boolean;
  taskReminder: boolean;
}

export interface AppearancePreferences {
  theme: AppTheme;
  locale: AppLocale;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  appearance: AppearancePreferences;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  notifications: {
    email: true,
    desktop: true,
    taskReminder: true,
  },
  appearance: {
    theme: 'light',
    locale: 'zh-CN',
  },
};

const normalizePreferences = (raw: Partial<UserPreferences>): UserPreferences => {
  return {
    notifications: {
      email: raw.notifications?.email ?? DEFAULT_PREFERENCES.notifications.email,
      desktop: raw.notifications?.desktop ?? DEFAULT_PREFERENCES.notifications.desktop,
      taskReminder:
        raw.notifications?.taskReminder ?? DEFAULT_PREFERENCES.notifications.taskReminder,
    },
    appearance: {
      theme: (['light', 'dark', 'system'] as AppTheme[]).includes(raw.appearance?.theme as AppTheme)
        ? (raw.appearance!.theme as AppTheme)
        : DEFAULT_PREFERENCES.appearance.theme,
      locale: (['zh-CN', 'en-US'] as AppLocale[]).includes(raw.appearance?.locale as AppLocale)
        ? (raw.appearance!.locale as AppLocale)
        : DEFAULT_PREFERENCES.appearance.locale,
    },
  };
};

export const preferencesService = {
  load(): UserPreferences {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return { ...DEFAULT_PREFERENCES };
      return normalizePreferences(JSON.parse(raw) as Partial<UserPreferences>);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  },

  save(prefs: UserPreferences): void {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(normalizePreferences(prefs)));
    } catch {
      // localStorage 不可用时静默失败
    }
  },

  update(partial: Partial<UserPreferences>): UserPreferences {
    const current = this.load();
    const next = normalizePreferences({
      notifications: { ...current.notifications, ...partial.notifications },
      appearance: { ...current.appearance, ...partial.appearance },
    });
    this.save(next);
    return next;
  },
};
