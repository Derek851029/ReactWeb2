import React, { useState, useEffect } from 'react';
import {
    EditOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { Form, Typography, Input, Button, Breadcrumb, message } from 'antd';
import ModalShow from '../ModalControl';

const { Title, Text } = Typography;

const AppSettingPhoneBarcode = (props) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();
    const [formData, setFormData] = useState();
    const [formShowDisable, setFormShowDisable] = useState(false);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [data, setData] = useState(props.data)

    useEffect(() => {
        initData();
    }, [props.data]);

    const initData = () => {
        form.setFieldsValue({
            [data.setting_key]: data.setting_value,
        });
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/appsetting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: formData.e_invoices_terms, type: 'edit', SettingKey: props.settingKey })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                messageBox("success", "編輯會員歸戶手機條碼載具使用條款成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "編輯會員歸戶手機條碼載具使用條款失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        setFormShowDisable(false);
        setOpen(false);
    };

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
            <Form.Item required label="會員歸戶手機條碼載具使用條款" name="e_invoices_terms"
                rules={[
                    {
                        required: true,
                        message: '請輸入會員歸戶手機條碼載具使用條款!',
                    },
                ]}
            >
                <Input placeholder="請輸入會員歸戶手機條碼載具使用條款。。。" />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} size='large'>編輯</Button>
            </Form.Item>
        </Form >
    )

    return (
        <>
            {contextHolder}
            <Title level={2}>會員歸戶手機條碼載具使用條款</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appsetting/list'>APP設定</Link></Breadcrumb.Item>
                <Breadcrumb.Item>會員歸戶手機條碼載具使用條款</Breadcrumb.Item>
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

export default AppSettingPhoneBarcode;