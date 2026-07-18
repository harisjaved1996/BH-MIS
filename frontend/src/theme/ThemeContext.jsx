import { ConfigProvider } from "antd";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { BRAND, MODES, buildAntdTheme } from "../theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem("bhmis_theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  useEffect(() => {
    localStorage.setItem("bhmis_theme", mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  }, []);

  const colors = { ...BRAND, ...MODES[mode] };

  return (
    <ThemeContext.Provider value={{ mode, colors, toggle }}>
      <ConfigProvider theme={buildAntdTheme(mode)}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
