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

const AdministratorEdit = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const { aid } = useParams()
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [rolesOptions, setRolesOptions] = useState([])
    
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        getRoles()
        getData()
    }, [])

    const getData = () => {
        fetch('/api/administrator?id='+aid, {
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
            const administratorData = data[0]
            const created = dayjs(administratorData.created * 1000).format('YYYY-MM-DD')
            let roles = [];

            if (administratorData.group_rid.length == 1) {
                roles.push(administratorData.group_rid)
            }
            else {
                roles = administratorData.group_rid.split(',')
            }

            form.setFieldsValue({
                status: administratorData.status,
                account: administratorData.account,
                name: administratorData.name,
                phone: administratorData.phone,
                email: administratorData.email,
                roles: roles.map(Number),
                createDate: dayjs(created),
            })
        })
    }

    const getRoles = () => {
        fetch('/api/roles?id=0', {
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

        fetch('/api/administrator', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit',aid: aid })
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
                messageBox("success", "編輯帳號成功!")
                console.log(data)
            })
            .catch(error => {
                messageBox("error", "編輯帳號失敗!")
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
                       /* navigate("/administrator/list", { replace: true })*/
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
                        { label: '啟用', value: 1 }, { label: '封鎖', value: 0 }
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
                <Input disabled placeholder="請輸入帳號。。。" />
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
                <Checkbox.Group options={rolesOptions} />
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

    return(
        <>
            {contextHolder}
            <Title level={2}>編輯帳號</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>後台帳號管理</Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/administrator/list'>帳號管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯帳號</Breadcrumb.Item>
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
    )
}

export default AdministratorEdit