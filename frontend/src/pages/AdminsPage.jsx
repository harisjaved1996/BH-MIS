import { DeleteOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import { useCallback, useEffect, useState } from "react";

import client, { apiErrorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function AdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/admins/");
      setAdmins(data.results ?? data);
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
      record
        ? { ...record, password: "" }
        : { email: "", full_name: "", password: "", is_active: true }
    );
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editing && !values.password) delete values.password;
    setSaving(true);
    try {
      if (editing) {
        await client.patch(`/admins/${editing.id}/`, values);
        message.success("Admin updated");
      } else {
        await client.post("/admins/", values);
        message.success("Admin added");
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
      await client.delete(`/admins/${record.id}/`);
      message.success("Admin deleted");
      load();
    } catch (err) {
      message.error(apiErrorMessage(err));
    }
  };

  const columns = [
    { title: "Email", dataIndex: "email" },
    { title: "Full Name", dataIndex: "full_name", render: (v) => v || "—" },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (v) => (v ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>),
    },
    { title: "Created By", dataIndex: "created_by_email", render: (v) => v || "—" },
    {
      title: "Created Date",
      dataIndex: "created_date",
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm
            title="Delete this admin?"
            onConfirm={() => handleDelete(record)}
            disabled={record.id === user?.id}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.id === user?.id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Admin Users"
      extra={
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => openModal()}>
          Add Admin
        </Button>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={admins} loading={loading} />
      <Modal
        title={editing ? "Edit Admin" : "Add Admin"}
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
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="full_name" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={editing ? "New Password (leave blank to keep current)" : "Password"}
            rules={editing ? [] : [{ required: true, min: 6, message: "Min 6 characters" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
