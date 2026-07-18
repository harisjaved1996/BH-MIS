import { FireFilled, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { apiErrorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";

export default function LoginPage() {
  const { colors: BRAND } = useTheme();
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/dashboard" replace />;

  const onFinish = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Brand hero panel */}
      <div
        className="bh-login-hero"
        style={{
          flex: "1 1 55%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          color: "#fff",
        }}
      >
        <div className="bh-rise" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${BRAND.yellow}, #F0DC00)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 28px rgba(254,236,19,0.35)",
              }}
            >
              <FireFilled style={{ fontSize: 26, color: BRAND.navy }} />
            </div>
            <div>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 22, lineHeight: 1.1 }}>
                Beaconhouse
              </div>
              <div style={{ fontSize: 12, letterSpacing: "0.28em", opacity: 0.65 }}>
                MIS SYSTEM
              </div>
            </div>
          </div>
          <h1
            className="bh-rise bh-rise-1"
            style={{
              fontFamily: "Poppins",
              fontSize: "clamp(30px, 4vw, 46px)",
              fontWeight: 800,
              lineHeight: 1.15,
              margin: 0,
              maxWidth: 560,
            }}
          >
            Every result.
            <br />
            Every campus.{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${BRAND.yellow}, #fff6a1)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              One dashboard.
            </span>
          </h1>
          <p
            className="bh-rise bh-rise-2"
            style={{ marginTop: 20, fontSize: 16, opacity: 0.75, maxWidth: 460, lineHeight: 1.7 }}
          >
            Upload consolidated board results, compute grades automatically, and explore
            performance across sessions, cities, boards and campuses.
          </p>
        </div>
      </div>

      {/* Sign-in panel */}
      <div
        style={{
          flex: "1 1 45%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND.bg,
          padding: 32,
        }}
      >
        <div className="bh-rise bh-rise-1" style={{ width: "100%", maxWidth: 380 }}>
          <Typography.Title level={2} style={{ marginBottom: 4, fontWeight: 700 }}>
            Welcome back
          </Typography.Title>
          <Typography.Text type="secondary" style={{ display: "block", marginBottom: 32 }}>
            Sign in to the admin panel to continue
          </Typography.Text>
          {error && <Alert type="error" message={error} style={{ marginBottom: 20 }} showIcon />}
          <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
            <Form.Item
              name="email"
              label="Email address"
              rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
            >
              <Input prefix={<MailOutlined style={{ color: BRAND.inkMuted }} />} placeholder="admin@example.com" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Enter your password" }]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: BRAND.inkMuted }} />} placeholder="••••••••" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 46,
                marginTop: 8,
                background: `linear-gradient(90deg, ${BRAND.yellow}, #F0DC00)`,
                color: BRAND.onYellow,
                fontWeight: 700,
                boxShadow: "0 8px 20px rgba(254,236,19,0.4)",
              }}
            >
              Sign In
            </Button>
          </Form>
        </div>
      </div>

      {/* Hide hero on small screens */}
      <style>{`
        @media (max-width: 900px) {
          .bh-login-hero { display: none !important; }
        }
      `}</style>
    </div>
  );
}
