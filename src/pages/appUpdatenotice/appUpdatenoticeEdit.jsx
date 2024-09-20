import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { EditOutlined, MenuOutlined, TagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Typography,
    message,
    Breadcrumb,
    Select,
    Menu,
    Divider,
    Transfer,
    Col,
    InputNumber
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';

const { TextArea } = Input;
const { Title } = Typography;

const AppUpdatenoticeEdit = () => {
    const navigate = useNavigate();
    const location = useLocation()

    const state = location.state.type
    const { updateNoticeID } = useParams();
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [dataInfo, setDataInfo] = useState(null)

    const [forceOpts, setForceOpts] = useState([
        { label: '強制', value: 1 },
        { label: '不強制', value: 0 },
    ]);


    useEffect(() => {
        getData();

        if (state === 'view') setFormShowDisable(true)
    }, [])

    const getData = () => {
        let type =
            state === "view" ? "editVersion"
                : "edit"
        let url =
            state === "view" ? `/api/updatenotice?type=${type}&version=${location.state.version}&id=${updateNoticeID}`
            : `/api/updatenotice?type=${type}&id=${updateNoticeID}`

        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const updateNoticeData = data[0];
                const created = dayjs(updateNoticeData.changed * 1000).format('YYYY-MM-DD');

                form.setFieldsValue({
                    app_update_notice_id: updateNoticeData.app_update_notice_id,
                    device: updateNoticeData.device,
                    app_version: updateNoticeData.app_version,
                    tips: updateNoticeData.tips,
                    is_force: updateNoticeData.is_force,
                    createDate: dayjs(created),
                });

                setDataInfo(updateNoticeData);
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/updatenotice', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', UpdateNoticeID: updateNoticeID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);

                messageBox("success", "編輯APP版本控制成功!");
            })
            .catch(error => {
                messageBox("error", "編輯APP版本控制失敗!");
                console.error('Unable to add item.', error);
            });
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
                        setFormShowDisable(false)
                       /* navigate("/appupdatenotice/list", { replace: true });*/
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
            <Form.Item required label="手機種類" name="device"
                rules={[
                    {
                        required: true,
                        message: '請輸入手機種類!',
                    },
                ]}
            >
                <Input placeholder="請輸入手機種類。。。" disabled />
            </Form.Item>

            <Form.Item label="版本號" name="app_version"
                rules={[
                    {
                        required: true,
                        message: '請輸入版本號!',
                    },
                ]}
            >
                <Input placeholder="請輸入版本號。。。" />
            </Form.Item>

            <Form.Item required label="是否強制更新" name="is_force"
                rules={[
                    {
                        required: true,
                        message: '請選擇是否強制更新!',
                    },
                ]}
            >
                <Select placeholder="請選擇是否強制更新。。。" options={forceOpts} />
            </Form.Item>

            <Form.Item label="提示文字" name="tips"
                rules={[
                    {
                        required: true,
                        message: '請輸入提示文字!',
                    },
                ]}
            >
                <TextArea placeholder="請輸入提示文字。。。" />
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
            <Title level={2}>編輯APP版本控制</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appupdatenotice/list'>版本控制列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>版本控制</Breadcrumb.Item>
            </Breadcrumb>


            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='appupdatenotice'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
}

export default AppUpdatenoticeEdit;