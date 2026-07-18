import { Card, Col, Row, Table, Tabs, Tag, message } from "antd";
import { useCallback, useEffect, useState } from "react";

import client, { apiErrorMessage } from "../api/client";
import FiltersBar from "../components/FiltersBar";
import KpiCards from "../components/KpiCards";
import {
  ComparisonChart,
  GradeDistributionChart,
  SessionTrendChart,
} from "../components/charts";
import { BRAND } from "../theme";

function buildParams(filters) {
  const params = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value == null || value === "") continue;
    params[key] = Array.isArray(value) ? value.join(",") : value;
  }
  return params;
}

export default function DashboardPage() {
  const [options, setOptions] = useState(null);
  const [filters, setFilters] = useState({});
  const [ranking, setRanking] = useState({ mode: "top", count: 10 });
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    client
      .get("/dashboard/filters/")
      .then(({ data }) => setOptions(data))
      .catch((err) => message.error(apiErrorMessage(err)));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams(filters);
      const [{ data: s }, { data: st }] = await Promise.all([
        client.get("/dashboard/summary/", { params }),
        client.get("/dashboard/students/", {
          params: { ...params, [ranking.mode]: ranking.count },
        }),
      ]);
      setSummary(s);
      setStudents(st.students);
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters, ranking]);

  useEffect(() => {
    load();
  }, [load]);

  const studentColumns = [
    { title: "#", render: (_, __, i) => i + 1, width: 50 },
    { title: "Roll No", dataIndex: "roll_no" },
    { title: "Student Name", dataIndex: "student_name" },
    { title: "Campus", dataIndex: "campus" },
    { title: "Session", dataIndex: "session" },
    { title: "Obtained", dataIndex: "obtained_marks" },
    { title: "%age", dataIndex: "percentage", render: (v) => `${v}%` },
    {
      title: "Grade",
      dataIndex: "grade",
      render: (v) => (v ? <Tag color={BRAND.blue}>{v}</Tag> : <Tag>N/A</Tag>),
    },
  ];

  const comparisonTabs = [
    { key: "campus", label: "By Campus", data: summary?.campus_comparison },
    { key: "city", label: "By City", data: summary?.city_comparison },
    { key: "board", label: "By Board", data: summary?.board_comparison },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <FiltersBar
        options={options}
        filters={filters}
        onChange={setFilters}
        ranking={ranking}
        onRankingChange={setRanking}
      />
      <KpiCards kpis={summary?.kpis} />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card title="Grade Distribution" loading={loading && !summary}>
            <GradeDistributionChart data={summary?.grade_distribution ?? []} />
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Session Trend — Average %" loading={loading && !summary}>
            <SessionTrendChart data={summary?.session_trend ?? []} />
          </Card>
        </Col>
      </Row>
      <Card title="Average Percentage" loading={loading && !summary}>
        <Tabs
          items={comparisonTabs.map((t) => ({
            key: t.key,
            label: t.label,
            children: (
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                <ComparisonChart data={t.data ?? []} metric="avg" />
              </div>
            ),
          }))}
        />
      </Card>
      <Card
        title={`${ranking.mode === "top" ? "Top" : "Lowest"} ${ranking.count} Students`}
        loading={loading && students.length === 0}
      >
        <Table
          rowKey="id"
          size="small"
          columns={studentColumns}
          dataSource={students}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
