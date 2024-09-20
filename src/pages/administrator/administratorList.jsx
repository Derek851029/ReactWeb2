import React, { useState, useEffect } from 'react';
import { DeleteOutlined, PlusCircleOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, message, Input, Typography, Table, Breadcrumb } from 'antd';
const { Title } = Typography;

const AdministratorList = () => {
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [mimaOpen, setMimaOpen] = useState(false);
    const [mimaAid, setMimaAid] = useState(0);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const columns = [
        {
            title: '帳號',
            dataIndex: 'account',
        },
        {
            title: '角色',
            dataIndex: 'rolesText',
        },
        {
            title: '狀態',
            dataIndex: 'status',
            render: (status) => {
                return "啟用";
            }
        },
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '操作',
            dataIndex: 'aid',
            render: (aid) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/administrator/edit/' + aid, { state: { type: 'edit' } }); }}> 編輯</Button >
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteAdministrator(aid, 1); }}> 刪除</Button >
                        < Button type="primary" shape="round" icon={<LockOutlined />} size='small' onClick={() => {
                            setMimaOpen(true);
                            setMimaAid(aid);
                        }}> 變更密碼</Button >
                    </>
                );

            }
        },
    ];

    useEffect(() => {
        getUser();
    }, []);

    const getUser = () => {
        setLoading(true);

        fetch('../api/administrator?id=0', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                var userData = [];

                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        aid: value.aid,
                        account: value.account,
                        rolesText: value.rolesText,
                        status: value.status,
                        name: value.name,
                    };

                    userData.push(jsonObject);
                });

                setUserList(userData);
                setLoading(false);

            });
    };

    const deleteAdministrator = (aid, status) => {
        console.log(aid);
        fetch('../api/administrator', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), type: 'delete', aid: aid })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                messageBox("success", "刪除帳號成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "刪除帳號失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onMimaSave = (values) => {
        setConfirmLoading(true)
        console.log(values.mima)
        fetch('../api/administrator', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Password: values.mima }), type: 'update', aid: mimaAid })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                messageBox("success", "變更密碼成功!");
                setConfirmLoading(false)
                setMimaOpen(false)
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "變更密碼失敗!");
                setConfirmLoading(false);
                setMimaOpen(false)
                console.error('Unable to add item.', error);
            });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const messageBox = (type, text) => {
        messageApi.open({
            type: type,
            content: text,
        });
        getUser();
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>管理者列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>後台帳號管理</Breadcrumb.Item>
                <Breadcrumb.Item>帳號管理</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/administrator/new'); }}>
                新增帳號
            </Button>

            <Table columns={columns} dataSource={userList} loading={loading} onChange={onChange}>
            </Table>

            <Modal
                open={mimaOpen}
                title="變更密碼"
                okText="儲存"
                cancelText="取消"
                confirmLoading={confirmLoading}
                onCancel={() => setMimaOpen(false)}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onMimaSave(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                >
                    <Form.Item
                        name="mima"
                        label="請輸入密碼"

                        rules={[
                            {
                                required: true,
                                message: '請輸入密碼!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="請輸入密碼。。。" />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
};
export default AdministratorList;
