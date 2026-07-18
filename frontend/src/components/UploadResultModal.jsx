import { InboxOutlined } from "@ant-design/icons";
import { Alert, Modal, Select, Statistic, Table, Tabs, Typography, Upload, message } from "antd";
import { useEffect, useState } from "react";

import client, { apiErrorMessage } from "../api/client";

const EXPLANATIONS = {
  inserted: "New results added to the database.",
  skipped:
    "Rows NOT inserted because a result with the same Roll No + Session + Board already " +
    "exists (or the same row appears twice in the file). Existing records are never overwritten.",
  ungraded:
    "Rows that WERE inserted, but their percentage does not fall inside any grade band " +
    "defined in the Grades module — their grade shows as N/A until bands cover that range.",
  errors:
    "Rows rejected because of invalid data (missing roll no or name, non-numeric marks, " +
    "obtained marks greater than total, or total of zero).",
};

const RECORD_COLUMNS = {
  skipped: [
    { title: "Excel Row", dataIndex: "row", width: 90 },
    { title: "Roll No", dataIndex: "roll_no" },
    { title: "Student Name", dataIndex: "student_name" },
    { title: "Board", dataIndex: "board" },
    { title: "Reason", dataIndex: "reason" },
  ],
  ungraded: [
    { title: "Excel Row", dataIndex: "row", width: 90 },
    { title: "Roll No", dataIndex: "roll_no" },
    { title: "Student Name", dataIndex: "student_name" },
    { title: "%age", dataIndex: "percentage", render: (v) => `${v}%` },
  ],
  errors: [
    { title: "Excel Row", dataIndex: "row", width: 90 },
    { title: "Roll No", dataIndex: "roll_no", render: (v) => v || "—" },
    { title: "Student Name", dataIndex: "student_name", render: (v) => v || "—" },
    { title: "Problem", dataIndex: "message" },
  ],
};

function RecordList({ kind, records }) {
  return (
    <>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
        {EXPLANATIONS[kind]}
      </Typography.Paragraph>
      <Table
        rowKey={(r) => `${r.row}`}
        size="small"
        columns={RECORD_COLUMNS[kind]}
        dataSource={records}
        pagination={records.length > 8 ? { pageSize: 8, showSizeChanger: false } : false}
        locale={{ emptyText: "No records" }}
      />
    </>
  );
}

export default function UploadResultModal({ open, onClose, onUploaded }) {
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!open) return;
    setSession(null);
    setFile(null);
    setSummary(null);
    client
      .get("/sessions/")
      .then(({ data }) => setSessions(data.map((s) => s.name)))
      .catch((err) => message.error(apiErrorMessage(err)));
  }, [open]);

  const handleUpload = async () => {
    if (!session) {
      message.warning("Please select a session first.");
      return;
    }
    if (!file) {
      message.warning("Please choose an .xlsx file.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("session", session);
      formData.append("file", file);
      const { data } = await client.post("/results/upload/", formData);
      setSummary(data);
      onUploaded?.();
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const detailTabs = summary
    ? [
        {
          key: "skipped",
          label: `Skipped (${summary.skipped_duplicates.length})`,
          children: <RecordList kind="skipped" records={summary.skipped_duplicates} />,
        },
        {
          key: "ungraded",
          label: `Ungraded (${summary.ungraded.length})`,
          children: <RecordList kind="ungraded" records={summary.ungraded} />,
        },
        {
          key: "errors",
          label: `Errors (${summary.errors.length})`,
          children: <RecordList kind="errors" records={summary.errors} />,
        },
      ]
    : [];

  return (
    <Modal
      title="Add Result — Upload Excel Sheet"
      open={open}
      onCancel={onClose}
      onOk={summary ? onClose : handleUpload}
      okText={summary ? "Done" : "Upload"}
      confirmLoading={uploading}
      width={summary ? 760 : 560}
    >
      {!summary && (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Session</div>
            <Select
              style={{ width: "100%" }}
              placeholder="Select session (e.g. 2024 - 2026)"
              options={sessions.map((s) => ({ value: s, label: s }))}
              value={session}
              onChange={setSession}
            />
          </div>
          <Upload.Dragger
            accept=".xlsx"
            maxCount={1}
            beforeUpload={(f) => {
              setFile(f);
              return false;
            }}
            onRemove={() => setFile(null)}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag the result sheet (.xlsx) here</p>
            <p className="ant-upload-hint">
              Expected columns: Sr No, Roll No, Student Name, Campus, City, Board, Total
              Marks, Obtained Marks, Remarks. Percentage and grade are computed
              automatically.
            </p>
          </Upload.Dragger>
        </>
      )}
      {summary && (
        <>
          <Alert
            type={summary.errors.length ? "warning" : "success"}
            message="Upload complete"
            description={EXPLANATIONS.inserted}
            style={{ marginBottom: 16 }}
            showIcon
          />
          <div style={{ display: "flex", gap: 32, marginBottom: 8, flexWrap: "wrap" }}>
            <Statistic title="Inserted" value={summary.inserted} />
            <Statistic title="Skipped (duplicates)" value={summary.skipped_duplicates.length} />
            <Statistic title="Ungraded" value={summary.ungraded.length} />
            <Statistic title="Errors" value={summary.errors.length} />
          </div>
          <Tabs items={detailTabs} />
        </>
      )}
    </Modal>
  );
}
