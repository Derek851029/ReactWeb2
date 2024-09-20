import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Typography,
    message,
    Breadcrumb,
    Checkbox,
    Select
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;

const RoleGroupEdit = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()
    const { rid } = useParams()

    const [permissionsOptions, setPermissionsOptions] = useState([])
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        getPermissions()
        getData()
        
    }, [])

    const getData = () => {
        fetch('/api/roles?id='+rid, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log(data)
                const permissionsData = data[0]
                let permission = []

                if (permissionsData.group_pid.length == 1) {
                    permission.push(permissionsData.group_pid)
                }
                else {
                    permission = permissionsData.group_pid.split(',')
                }

                form.setFieldsValue({
                    role_title: permissionsData.role_title,
                    permission: permission.map(Number),
                })
            })
    }

    const getPermissions = () => {
        fetch('/api/permission', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const permissionsData = []

                data.forEach((value, index, array) => {
                    permissionsData.push(
                        {
                            label: value.permission_title,
                            value: value.pid,
                        }
                    )
                })
                setPermissionsOptions(permissionsData)
            })
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values)
        setFormShowDisable(true)
        setOpen(true)
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/roles', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', rid : rid })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                messageBox("success", "編輯角色成功!")
                console.log(data)
            })
            .catch(error => {
                messageBox("error", "編輯角色失敗!")
                console.error('Unable to add item.', error)
            });
    };

    const onCancel = () => {
        setFormShowDisable(false)
        setOpen(false)
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
               /*         navigate("/roleGroup/list", { replace: true })*/
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

            <Form.Item required label="角色名稱" name="role_title"
                rules={[
                    {
                        required: true,
                        message: '請輸入角色名稱!',
                    },
                ]}
            >
                <Input placeholder="請輸入角色名稱。。。" />
            </Form.Item>

            <Form.Item required label="權限" name="permission"
                rules={[
                    {
                        required: true,
                        message: '請選擇權限!',
                    },
                ]}
            >
                <Checkbox.Group style={{ display: 'grid' }} options={permissionsOptions} />
            </Form.Item>

            <Form.Item label="建立日期" name="createDate">
                <DatePicker disabled />
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
            <Title level={2}>編輯帳號</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>後台帳號管理</Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/roleGroup/list'>角色管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯角色</Breadcrumb.Item>
            </Breadcrumb>

            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='role'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    )
}

export default RoleGroupEdit