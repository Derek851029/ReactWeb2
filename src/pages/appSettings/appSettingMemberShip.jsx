import React, { useState, useEffect } from 'react';
import {
    EditOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { Form, Typography, Button, Breadcrumb, message } from 'antd';
import CKEditorComponent from '../../shared/CKEditor'
import ModalShow from '../ModalControl';

const { Title, Text } = Typography;

const AppSettingMemberShip = (props) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [data, setData] = useState(props.data)

    const [form] = Form.useForm();
    const [formData, setFormData] = useState();
    const [formShowDisable, setFormShowDisable] = useState(false);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [editorDisable, setEditorDisable] = useState(false)
    const [contentData, setContentData] = useState(props.data.setting_value)


    useEffect(() => {
        console.log(data)
    }, [props.data]);

    const onFinish = (values) => {
        console.log('Success:', contentData);
        setFormData(values);
        setFormShowDisable(true);
        setEditorDisable(true)
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
            body: JSON.stringify({ DataInfo: contentData, type: 'edit', SettingKey: props.settingKey })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                messageBox("success", "編輯會員條款成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "編輯會員條款失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        setFormShowDisable(false);
        setEditorDisable(false)
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
            <CKEditorComponent data={data} contentData={contentData} setContentData={setContentData} editorDisable={editorDisable }></CKEditorComponent>
            <Form.Item
                wrapperCol={{
                    offset: 11,
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
            <Title level={2}>會員條款</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appsetting/list'>APP設定</Link></Breadcrumb.Item>
                <Breadcrumb.Item>會員條款</Breadcrumb.Item>
            </Breadcrumb>

            {formTable }

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

export default AppSettingMemberShip;