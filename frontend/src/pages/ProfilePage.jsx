import { Button, Card, Col, Form, Input, Row, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import client, { apiErrorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm] = Form.useForm();

  const saveProfile = async (values) => {
    setSavingProfile(true);
    try {
      const { data } = await client.patch("/auth/me/", values);
      updateUser(data);
      message.success("Profile updated");
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (values) => {
    setSavingPassword(true);
    try {
      const { data } = await client.post("/auth/change-password/", values);
      localStorage.setItem("bhmis_token", data.token);
      passwordForm.resetFields();
      message.success("Password changed");
      navigate("/dashboard");
    } catch (err) {
      message.error(apiErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="My Information">
          <Form
            layout="vertical"
            initialValues={{ email: user?.email, full_name: user?.full_name }}
            onFinish={saveProfile}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="full_name" label="Full Name">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={savingProfile}>
              Save Changes
            </Button>
          </Form>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Change Password">
          <Form form={passwordForm} layout="vertical" onFinish={savePassword}>
            <Form.Item
              name="current_password"
              label="Current Password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="new_password"
              label="New Password"
              rules={[{ required: true, min: 6, message: "Min 6 characters" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              label="Confirm New Password"
              dependencies={["new_password"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={savingPassword}>
              Change Password
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
