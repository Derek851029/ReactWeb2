import React, { useState, useEffect } from 'react';
import {
    EditOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { Form, Typography, Input, Button, Breadcrumb, message, Select } from 'antd';
import ModalShow from '../ModalControl';
const { TextArea } = Input;
const { Title, Text } = Typography;

const AppStrolletStatus = (props) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();
    const [formData, setFormData] = useState()
    const [formShowDisable, setFormShowDisable] = useState(false);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [data, setData] = useState(props.data)

    useEffect(() => {
        initData();
    }, [props.data]);

    const initData = () => {
        form.setFieldsValue({
            status: props.data[0].status,
            message: props.data[0].message,
        })      
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        setFormData(values);
        setFormShowDisable(true);
        setOpen(true)
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/appsetting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', SettingKey: props.settingKey })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                messageBox("success", "編輯成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "編輯失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
                        navigate("/appsetting/list", { replace: true });
                    }
                });
                break;
        }

    }

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
            <Form.Item required label="Strollet異常處理" name="status"
                rules={[
                    {
                        required: true,
                        message: '請選擇Strollet異常處理!',
                    },
                ]}
            >
                <Select placeholder="請選擇Strollet異常處理。。。" options={[{ label: '啟用', value: 1 }, { label: '停用', value: 0 }]} />
            </Form.Item>

            <Form.Item required label="訊息內容" name="message"
                rules={[
                    {
                        required: true,
                        message: '請輸入訊息內容!',
                    },
                ]}
            >
                <TextArea placeholder="請輸入訊息內容。。。" />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} size='large'>編輯</Button>
            </Form.Item>
        </Form>
    )

    return (
        <>
            {contextHolder}
            <Title level={2}>Strollet異常管理</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appsetting/list'>APP設定</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Strollet異常管理</Breadcrumb.Item>
            </Breadcrumb>

            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='appsetting'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default AppStrolletStatus;