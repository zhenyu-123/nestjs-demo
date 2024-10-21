import React, { useState } from 'react';
import './Login.css';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';

import { message } from 'antd';

type FieldType = {
  username?: string;
  password?: string;
  imgCode?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
  const resp = await fetch('/api/session/create', {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
  if (resp.code === 200) {
    message.success('登录成功');
  } else {
    message.error(resp.msg);
  }
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const App: React.FC = () => {
  const [codeUrl, setCodeUrl] = useState(
    '/api/session/code' + '?' + Math.random(),
  );
  const resetCode = () => {
    setCodeUrl('/api/session/code' + '?' + Math.random());
  };
  return (
    <div className="wraps">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="imgCode"
          label="验证码"
          rules={[{ required: true, message: '请输入验证码!' }]}
        >
          <div style={{ display: 'flex', width: '100%' }}>
            <Input style={{ flex: 1, width: '100%' }} />
            <img
              src={codeUrl}
              onClick={resetCode}
              alt=""
              style={{ width: '100px', height: 40, marginLeft: 10 }}
            />
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
