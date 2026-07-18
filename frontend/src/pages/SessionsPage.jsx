import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
  Tag,
  message,
} from "antd";
import { useCallback, useEffect, useState } from "react";

import client, { apiErrorMessage } from "../api/client";
import { BRAND } from "../theme";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/sessions/");
      setSessions(data);
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await client.post("/sessions/", values);
      message.success("Session added");
      setModalOpen(false);
      form.resetFields();
      load();
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      await client.delete(`/sessions/${record.id}/`);
      message.success("Session deleted");
      load();
    } catch (err) {
      message.error(apiErrorMessage(err));
    }
  };

  const startYear = Form.useWatch("start_year", form);

  const columns = [
    {
      title: "Session",
      dataIndex: "name",
      render: (v) => <Tag color={BRAND.blue}>{v}</Tag>,
    },
    { title: "Start Year", dataIndex: "start_year" },
    { title: "Created By", dataIndex: "created_by_email", render: (v) => v || "—" },
    {
      title: "Created Date",
      dataIndex: "created_date",
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Popconfirm
          title="Delete this session?"
          description="Sessions with uploaded results cannot be deleted."
          onConfirm={() => handleDelete(record)}
        >
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      title="Academic Sessions"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add Session
        </Button>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={sessions}
        loading={loading}
        pagination={false}
      />
      <Modal
        title="Add Session"
        open={modalOpen}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="start_year"
            label="Start Year"
            rules={[{ required: true, message: "Enter the starting year" }]}
            extra={
              startYear
                ? `Session will be created as "${startYear} - ${startYear + 2}"`
                : "Sessions span two years, e.g. 2028 - 2030"
            }
          >
            <InputNumber min={2000} max={2100} style={{ width: "100%" }} placeholder="2028" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
