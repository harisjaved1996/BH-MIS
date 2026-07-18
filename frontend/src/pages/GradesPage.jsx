import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useCallback, useEffect, useState } from "react";

import client, { apiErrorMessage } from "../api/client";
import { BRAND } from "../theme";

export default function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/grades/");
      setGrades(data);
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openModal = (record = null) => {
    setEditing(record);
    form.setFieldsValue(
      record ?? { name: "", min_percentage: null, max_percentage: null }
    );
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await client.put(`/grades/${editing.id}/`, values);
        message.success("Grade updated");
      } else {
        await client.post("/grades/", values);
        message.success("Grade added");
      }
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
      await client.delete(`/grades/${record.id}/`);
      message.success("Grade deleted");
      load();
    } catch (err) {
      message.error(apiErrorMessage(err));
    }
  };

  const columns = [
    {
      title: "Grade",
      dataIndex: "name",
      render: (v) => <Tag color={BRAND.blue}>{v}</Tag>,
    },
    { title: "Min %", dataIndex: "min_percentage" },
    { title: "Max %", dataIndex: "max_percentage" },
    { title: "Created By", dataIndex: "created_by_email", render: (v) => v || "—" },
    { title: "Updated By", dataIndex: "updated_by_email", render: (v) => v || "—" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm title="Delete this grade?" onConfirm={() => handleDelete(record)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Grade Bands"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Add Grade
        </Button>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={grades}
        loading={loading}
        pagination={false}
      />
      <Modal
        title={editing ? "Edit Grade" : "Add Grade"}
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
            name="name"
            label="Grade Name"
            rules={[{ required: true, message: "e.g. A++" }]}
          >
            <Input placeholder="A++" maxLength={10} />
          </Form.Item>
          <Form.Item
            name="min_percentage"
            label="Minimum Percentage"
            rules={[{ required: true, message: "Enter minimum %" }]}
          >
            <InputNumber min={0} max={100} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="max_percentage"
            label="Maximum Percentage"
            dependencies={["min_percentage"]}
            rules={[
              { required: true, message: "Enter maximum %" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const min = getFieldValue("min_percentage");
                  if (value == null || min == null || value >= min) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Max must be >= min"));
                },
              }),
            ]}
          >
            <InputNumber min={0} max={100} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
