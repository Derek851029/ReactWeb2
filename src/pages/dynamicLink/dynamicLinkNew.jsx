import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Typography,
    message,
    Breadcrumb,
    Select,
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;

const DynamicLinkNew = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [actionOpts, setActionOpts] = useState([
        {
            label: "toNews",
            value: "toNews",
        },
        {
            label: "toActivity",
            value: "toActivity",
        },
        {
            label: "toCoupon",
            value: "toCoupon",
        },
        {
            label: "toNothing",
            value: "toNothing",
        },
    ])

    useEffect(() => {
        form.setFieldsValue({
            createDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        });
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        //fetch('../api/dynamiclink', {
        //    method: 'POST',
        //    headers: {
        //        'Accept': 'application/json',
        //        'Content-Type': 'application/json'
        //    },
        //    body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'new' })
        //})
        //    .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
        //    .then(data => {
        //        setOpen(false);
        //        setConfirmLoading(false);

        //        messageBox("success", "新增動態連結成功!");
        //    })
        //    .catch(error => {
        //        messageBox("error", "新增動態連結失敗!");
        //        console.error('Unable to add item.', error);
        //    });

        setOpen(false);
        setConfirmLoading(false);

        messageBox("success", "新增動態連結成功!");
    };

    const onCancel = () => {
        setFormShowDisable(false);
        setOpen(false);
    }

    const messageBox = (type, text) => {
        switch (type) {
            case 'error':
                messageApi.open({
                    type: type,
                    content: text,
                });
                break;
            case 'success':
                messageApi.open({
                    type: type,
                    content: text,
                    onClose: () => {
                        setOpen(false);
                        setConfirmLoading(false);
                        navigate("/appMessage/list", { replace: true });
                    }
                });
                break;
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const formTable = (
        <Form
            disabled={formShowDisable}
            form={form}
            size='large'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item required label="來源" name="source"
                rules={[
                    {
                        required: true,
                        message: '請輸入來源!',
                    },
                ]}
            >
                <Input placeholder="請輸入來源。。。" />
            </Form.Item>

            <Form.Item required label="事件" name="action"
                rules={[
                    {
                        required: true,
                        message: '請選擇事件!',
                    },
                ]}
            >
                <Select placeholder="請選擇事件。。。" options={actionOpts} />
            </Form.Item>

            <Form.Item required label="事件ID" name="action_id"
                rules={[
                    {
                        required: true,
                        message: '請輸入事件ID!',
                    },
                ]}
            >
                <Input placeholder="請輸入事件ID。。。" />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<PlusOutlined />} size='large'>新增</Button>
            </Form.Item>
        </Form>
    )

  return (
      <>
          {contextHolder}
          <Title level={2}>
              新增自訂訊息</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item><Link to='/dynamiclink/list'>動態連結列表</Link></Breadcrumb.Item>
              <Breadcrumb.Item>新增動態連結</Breadcrumb.Item>
          </Breadcrumb>

          {formTable}

          <ModalShow
              title="預覽"
              formTable={formTable}
              open={open}
              page='dynamiclink'
              handleOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={onCancel}>
          </ModalShow>
      </>
  );
}

export default DynamicLinkNew;