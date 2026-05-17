import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () => set((state) => {
        const nextDark = !state.isDark;
        if (nextDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDark: nextDark };
      }),
      setTheme: (dark) => {
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDark: dark });
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
