import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useCallback, useEffect, useState } from "react";

import client, { apiErrorMessage } from "../api/client";
import UploadResultModal from "../components/UploadResultModal";
import { BRAND } from "../theme";

export default function ResultsPage() {
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      for (const [key, value] of Object.entries(filters)) {
        if (value == null || value === "" || (Array.isArray(value) && !value.length)) continue;
        params[key] = Array.isArray(value) ? value.join(",") : value;
      }
      const { data: res } = await client.get("/results/", { params });
      setData({ results: res.results, count: res.count });
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const loadFilterOptions = useCallback(async () => {
    try {
      const { data: f } = await client.get("/dashboard/filters/");
      setFilterOptions(f);
    } catch {
      // non-fatal; filter dropdowns just stay empty
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  const setFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => {
      const next = { ...prev };
      if (value && (!Array.isArray(value) || value.length)) next[key] = value;
      else delete next[key];
      return next;
    });
  };

  const handleDelete = async (record) => {
    try {
      await client.delete(`/results/${record.id}/`);
      message.success("Result deleted");
      load();
    } catch (err) {
      message.error(apiErrorMessage(err));
    }
  };

  const handleDeleteAll = () => {
    modal.confirm({
      title: "Delete ALL results?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete all ${data.count} results from the database. This cannot be undone.`,
      okText: "Yes, delete everything",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const { data: res } = await client.post("/results/delete-all/");
          message.success(`Deleted ${res.deleted} results`);
          setPage(1);
          load();
          loadFilterOptions();
        } catch (err) {
          message.error(apiErrorMessage(err));
        }
      },
    });
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await client.put(`/results/${editing.id}/`, values);
      message.success("Result updated — percentage and grade recomputed");
      setEditing(null);
      load();
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const selectOptions = (values) => (values ?? []).map((v) => ({ value: v, label: v }));

  const multiProps = {
    mode: "multiple",
    allowClear: true,
    maxTagCount: "responsive",
    showSearch: true,
  };

  const columns = [
    { title: "Roll No", dataIndex: "roll_no" },
    { title: "Student Name", dataIndex: "student_name" },
    { title: "Campus", dataIndex: "campus" },
    { title: "City", dataIndex: "city" },
    { title: "Board", dataIndex: "board" },
    { title: "Session", dataIndex: "session" },
    { title: "Total", dataIndex: "total_marks" },
    { title: "Obtained", dataIndex: "obtained_marks" },
    { title: "%age", dataIndex: "percentage", render: (v) => `${v}%` },
    {
      title: "Grade",
      dataIndex: "grade",
      render: (v) => (v ? <Tag color={BRAND.blue}>{v}</Tag> : <Tag>N/A</Tag>),
    },
    { title: "Remarks", dataIndex: "remarks", render: (v) => v || "—" },
    {
      title: "Actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Delete this result?" onConfirm={() => handleDelete(record)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Student Results"
      extra={
        <Space>
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteAll}>
            Delete All
          </Button>
          <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadOpen(true)}>
            Add Result
          </Button>
        </Space>
      }
    >
      {contextHolder}
      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search name / roll no"
          allowClear
          style={{ width: 220 }}
          onSearch={(v) => setFilter("search", v)}
        />
        <Select
          {...multiProps}
          placeholder="Session"
          style={{ minWidth: 160 }}
          options={selectOptions(filterOptions?.sessions)}
          onChange={(v) => setFilter("session", v)}
        />
        <Select
          {...multiProps}
          placeholder="City"
          style={{ minWidth: 140 }}
          options={selectOptions(filterOptions?.cities)}
          onChange={(v) => setFilter("city", v)}
        />
        <Select
          {...multiProps}
          placeholder="Board"
          style={{ minWidth: 140 }}
          options={selectOptions(filterOptions?.boards)}
          onChange={(v) => setFilter("board", v)}
        />
        <Select
          {...multiProps}
          placeholder="Campus"
          style={{ minWidth: 220 }}
          options={selectOptions(filterOptions?.campuses)}
          onChange={(v) => setFilter("campus", v)}
        />
        <Select
          {...multiProps}
          placeholder="Grade"
          style={{ minWidth: 120 }}
          options={selectOptions(filterOptions?.grades)}
          onChange={(v) => setFilter("grade", v)}
        />
      </Space>
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={data.results}
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          current: page,
          pageSize: 25,
          total: data.count,
          showSizeChanger: false,
          showTotal: (total) => `${total} results`,
          onChange: setPage,
        }}
      />
      <UploadResultModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => {
          load();
          loadFilterOptions();
        }}
      />
      <Modal
        title={`Edit Result — ${editing?.roll_no ?? ""}`}
        open={!!editing}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => setEditing(null)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="roll_no" label="Roll No" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="student_name" label="Student Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="campus" label="Campus" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="board" label="Board" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="session" label="Session" rules={[{ required: true }]}>
            <Select options={selectOptions(filterOptions?.sessions)} />
          </Form.Item>
          <Form.Item name="total_marks" label="Total Marks" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="obtained_marks" label="Obtained Marks" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
