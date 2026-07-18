import {
  BarChartOutlined,
  CalendarOutlined,
  FileExcelOutlined,
  FireFilled,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Tooltip } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";

const { Sider, Content } = Layout;

const MENU_ITEMS = [
  { key: "/dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
  { key: "/results", icon: <FileExcelOutlined />, label: "Results" },
  { key: "/sessions", icon: <CalendarOutlined />, label: "Sessions" },
  { key: "/grades", icon: <TrophyOutlined />, label: "Grades" },
  { key: "/admins", icon: <TeamOutlined />, label: "Admins" },
  { key: "/profile", icon: <UserOutlined />, label: "My Profile" },
];

const SUBTITLES = {
  "/dashboard": "Overall performance of the Beaconhouse school system",
  "/results": "Upload result sheets and manage student records",
  "/sessions": "Two-year academic sessions used when uploading results",
  "/grades": "Percentage bands used for automatic grading",
  "/admins": "Manage admin panel users",
  "/profile": "Update your information and password",
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { colors: C, mode, toggle } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const active = MENU_ITEMS.find((m) => m.key === location.pathname);

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <Sider
        width={240}
        breakpoint="lg"
        collapsedWidth={0}
        className="bh-sider"
        style={{
          background: C.sidebar,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "22px 20px",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${C.yellow}, #F0DC00)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(254,236,19,0.25)",
              flexShrink: 0,
            }}
          >
            <FireFilled style={{ fontSize: 20, color: C.navy }} />
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.1,
              }}
            >
              Beaconhouse
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, letterSpacing: "0.24em" }}>
              MIS SYSTEM
            </div>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={MENU_ITEMS}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ background: "transparent" }}>
        <Content style={{ padding: "20px 28px 32px", maxWidth: 1440, width: "100%", margin: "0 auto" }}>
          {/* Top row: page heading + theme toggle + user chip */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1 className="bh-page-title">{active?.label ?? ""}</h1>
              <div className="bh-page-subtitle">{SUBTITLES[location.pathname] ?? ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Tooltip title={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
                <Button
                  shape="circle"
                  size="large"
                  icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggle}
                />
              </Tooltip>
              <Dropdown
                menu={{
                  items: [
                    { key: "profile", icon: <UserOutlined />, label: "My Profile" },
                    { type: "divider" },
                    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
                  ],
                  onClick: ({ key }) =>
                    key === "logout" ? handleLogout() : navigate("/profile"),
                }}
                trigger={["click"]}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    padding: "8px 14px",
                    borderRadius: 12,
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <Avatar
                    size={32}
                    style={{
                      background: `linear-gradient(135deg, ${C.blue}, ${C.navy})`,
                      fontWeight: 600,
                    }}
                  >
                    {(user?.full_name || user?.email || "?")[0].toUpperCase()}
                  </Avatar>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>
                      {user?.full_name || "Admin"}
                    </div>
                    <div style={{ fontSize: 11, color: C.inkMuted }}>{user?.email}</div>
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
