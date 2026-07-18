import {
  ApartmentOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  EnvironmentOutlined,
  FallOutlined,
  LineChartOutlined,
  RiseOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Tooltip } from "antd";

import { useTheme } from "../theme/ThemeContext";

function Kpi({ title, value, suffix, icon, accent, hint }) {
  const { colors: C, mode } = useTheme();
  const accents = {
    blue: { bg: C.blueSoft, color: C.blue },
    yellow: {
      bg: C.yellowSoft,
      // raw yellow is illegible on white; use dark amber in light mode
      color: mode === "dark" ? C.yellow : "#B08D00",
    },
  };
  const a = accents[accent];
  const card = (
    <Card className="bh-kpi-card" styles={{ body: { padding: 18 } }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: a.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: a.color,
          fontSize: 18,
          marginBottom: 14,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: C.inkMuted,
          marginBottom: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: value != null && String(value).length > 12 ? 16 : 24,
          color: C.text,
          lineHeight: 1.25,
        }}
      >
        {value != null && value !== "" ? `${value}${suffix ?? ""}` : "—"}
      </div>
    </Card>
  );
  return hint ? <Tooltip title={hint}>{card}</Tooltip> : card;
}

export default function KpiCards({ kpis }) {
  const { colors: C } = useTheme();
  const items = [
    { title: "Total Students", value: kpis?.total_students ?? 0, icon: <TeamOutlined />, accent: "blue" },
    { title: "Average", value: kpis?.average_percentage, suffix: "%", icon: <LineChartOutlined />, accent: "yellow" },
    { title: "Pass Rate", value: kpis?.pass_rate, suffix: "%", icon: <CheckCircleOutlined />, accent: "blue", hint: "Students at or above 33%" },
    { title: "Above 80%", value: kpis?.above_80_rate, suffix: "%", icon: <StarOutlined />, accent: "yellow", hint: "Share of students scoring 80% or higher" },
    { title: "Highest", value: kpis?.highest_percentage, suffix: "%", icon: <RiseOutlined />, accent: "blue" },
    { title: "Lowest", value: kpis?.lowest_percentage, suffix: "%", icon: <FallOutlined />, accent: "yellow" },
    { title: "90%+ Students", value: kpis?.above_90, icon: <TrophyOutlined />, accent: "blue", hint: "Students scoring 90% or higher" },
    {
      title: "Top Campus",
      value: kpis?.top_campus,
      suffix: kpis?.top_campus_avg != null ? ` (${kpis.top_campus_avg}%)` : "",
      icon: <CrownOutlined />,
      accent: "yellow",
      hint: "Campus with the highest average percentage",
    },
  ];

  const coverage = [
    { title: "Campuses", value: kpis?.campuses, icon: <ApartmentOutlined /> },
    { title: "Cities", value: kpis?.cities, icon: <EnvironmentOutlined /> },
    { title: "Boards", value: kpis?.boards, icon: <BankOutlined /> },
    { title: "Sessions", value: kpis?.sessions, icon: <CalendarOutlined /> },
  ];

  return (
    <>
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col xs={12} md={8} lg={6} key={item.title}>
            <Kpi {...item} />
          </Col>
        ))}
      </Row>
      <Card styles={{ body: { padding: "14px 20px" } }}>
        <Row gutter={[16, 8]}>
          {coverage.map((c) => (
            <Col xs={12} md={6} key={c.title}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: C.blue, fontSize: 16 }}>{c.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.inkMuted,
                  }}
                >
                  {c.title}
                </span>
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    fontSize: 18,
                    color: C.text,
                    marginLeft: "auto",
                  }}
                >
                  {c.value ?? "—"}
                </span>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </>
  );
}
