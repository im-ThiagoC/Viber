import { useTheme } from "next-themes";

export const useCurrentTheme = () => {
  const { theme, systemTheme } = useTheme();

  if(theme === "dark" || theme === "light") {
    return theme;
  }
  // If theme is "system", use the system preference
  return systemTheme;
};