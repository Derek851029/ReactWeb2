import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
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


const AdministratorNew = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [rolesOptions, setRolesOptions] = useState([])
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        getRoles()
        form.setFieldsValue({
            createDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        })
    }, [])

    const getRoles = () => {
        fetch('../api/roles?id=0', {
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
            const rolesData = []

            data.forEach((value, index, array) => {
                rolesData.push(
                    {
                        label: value.role_title,
                        value: value.rid,
                    }
                )
            })
            setRolesOptions(rolesData)
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

        fetch('../api/administrator', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'new' })
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
                messageBox("success", "新增帳號成功!")
                console.log(data)
            })
            .catch(error => {
                messageBox("error", "新增帳號失敗!")
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
                        navigate("/administrator/list", { replace: true })
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

            <Form.Item required label="是否啟用" name="status"
                rules={[
                    {
                        required: true,
                        message: '請選擇是否啟用!',
                    },
                ]}
            >
                <Select
                    placeholder="請選擇是否啟用。。。"
                    options={[
                        { label: '啟用', value: 1 }, {label:'封鎖',value:0}
                    ]}
                />
            </Form.Item>

            <Form.Item required label="帳號" name="account"
                rules={[
                    {
                        required: true,
                        message: '請輸入帳號!',
                    },
                ]}
            >
                <Input placeholder="請輸入帳號。。。" />
            </Form.Item>

            <Form.Item required label="密碼" name="password"
                rules={[
                    {
                        required: true,
                        message: '請輸入密碼!',
                    },
                    {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]{8,16}$/,
                        message: '密碼 需包含英文大小寫及數字，8到16個字'
                    }
                ]}>
                <Input.Password placeholder="請輸入密碼。。。" />
            </Form.Item>

            <Form.Item required label="密碼確認" name="password_check"
                rules={[
                    {
                        required: true,
                        message: '請輸入確認密碼!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('輸入的兩次密碼不匹配!'));
                        },
                    }),
                ]}>
                <Input.Password placeholder="請輸入確認密碼。。。" />
            </Form.Item>

            <Form.Item required label="姓名" name="name"
                rules={[
                    {
                        required: true,
                        message: '請輸入姓名!',
                    },
                ]}>
                <Input placeholder="請輸入姓名。。。" />
            </Form.Item>

            <Form.Item label="連絡電話" name="phone">
                <Input placeholder="請輸入連絡電話。。。" />
            </Form.Item>

            <Form.Item label="E-mail" name="email"
                rules={[
                    {
                        type: 'email',
                        message: '未符合E-mail格式!',
                    },
                ]}>
                <Input placeholder="請輸入E-mail。。。" />
            </Form.Item>

            <Form.Item label="角色(可複選)" name="roles"
                rules={[
                    {
                        required: true,
                        message: '請選擇角色!',
                    },
                ]}>
                <Checkbox.Group style={{ display: 'grid' }} options={rolesOptions} />
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
                <Button type="primary" htmlType="submit" shape="round" icon={<PlusOutlined />} size='large'>新增</Button>
            </Form.Item>
        </Form>
    )

    return (
        <>
            {contextHolder}
            <Title level={2}>新增帳號</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>後台帳號管理</Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/administrator/list'>帳號管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item>新增帳號</Breadcrumb.Item>
            </Breadcrumb>

            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='administrator'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default AdministratorNew