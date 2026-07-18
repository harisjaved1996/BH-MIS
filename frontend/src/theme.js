import { theme } from "antd";

// Beaconhouse brand — navy #061D7B / yellow #FEEC13 from beaconhouse.net.
// Theme-invariant brand constants:
export const BRAND = {
  navy: "#061D7B",
  navyDark: "#04124E",
  blue: "#4C6FFF", // navy-family accent (validated for charts on both surfaces)
  blueSoft: "rgba(76, 111, 255, 0.14)",
  yellow: "#FEEC13",
  yellowSoft: "rgba(254, 236, 19, 0.14)",
  onYellow: "#292929",
  chartBlue: "#4C6FFF",
};

// Per-mode palettes (surfaces, text, borders):
export const MODES = {
  dark: {
    bg: "#0B0E17",
    sidebar: "#0E1220",
    surface: "#131727",
    surfaceRaised: "#181D30",
    border: "rgba(255, 255, 255, 0.08)",
    text: "#E8EAF2",
    textSecondary: "#9AA0B4",
    inkMuted: "#6A7089",
    chartGrid: "rgba(255, 255, 255, 0.06)",
    tableHeaderBg: "#161B2C",
    rowHoverBg: "#1A2036",
  },
  light: {
    bg: "#F4F5FA",
    sidebar: "#061D7B", // brand navy sidebar in light mode
    surface: "#FFFFFF",
    surfaceRaised: "#FFFFFF",
    border: "rgba(6, 29, 123, 0.10)",
    text: "#1E2235",
    textSecondary: "#5A607A",
    inkMuted: "#8B90A8",
    chartGrid: "rgba(6, 29, 123, 0.08)",
    tableHeaderBg: "#F7F8FD",
    rowHoverBg: "#F1F4FE",
  },
};

export function buildAntdTheme(mode) {
  const c = MODES[mode];
  return {
    algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: BRAND.blue,
      colorInfo: BRAND.blue,
      colorLink: BRAND.blue,
      colorBgBase: mode === "dark" ? c.bg : undefined,
      colorBgContainer: c.surface,
      colorBgElevated: c.surfaceRaised,
      colorBgLayout: c.bg,
      colorBorder: c.border,
      colorBorderSecondary:
        mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(6,29,123,0.07)",
      colorText: c.text,
      colorTextSecondary: c.textSecondary,
      colorTextHeading: c.text,
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      borderRadius: 10,
      controlHeight: 38,
      fontSize: 14,
    },
    components: {
      Layout: {
        siderBg: c.sidebar,
        bodyBg: c.bg,
        headerBg: "transparent",
      },
      Menu: {
        darkItemBg: "transparent",
        darkSubMenuItemBg: "transparent",
        darkItemColor: "rgba(255,255,255,0.65)",
        darkItemSelectedBg: BRAND.yellow,
        darkItemSelectedColor: BRAND.onYellow,
      },
      Card: {
        borderRadiusLG: 14,
        paddingLG: 20,
        colorBgContainer: c.surface,
      },
      Table: {
        borderRadius: 12,
        headerBg: c.tableHeaderBg,
        rowHoverBg: c.rowHoverBg,
        colorBgContainer: c.surface,
      },
      Button: {
        fontWeight: 600,
        controlHeight: 38,
      },
      Modal: {
        borderRadiusLG: 16,
        contentBg: c.surfaceRaised,
        headerBg: c.surfaceRaised,
      },
      Select: {
        optionSelectedBg: BRAND.blueSoft,
      },
    },
  };
}
