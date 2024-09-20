import React, { useState, useEffect } from 'react';
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button,  Typography, Table, Breadcrumb } from 'antd';
const { Title } = Typography;

const RoleGroupList = () => {
    const [roleList, setRoleList] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const columns = [
        {
            title: '角色名稱',
            dataIndex: 'role_title',
        },
        {
            title: '操作',
            dataIndex: 'rid',
            render: (rid) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/roleGroup/edit/' + rid, { state: { type: 'edit' } }) }}> 編輯</Button >
                    </>
                )

            }
        },
    ]

    useEffect(() => {
        getRole()
    }, []);

    const getRole = () => {
        setLoading(true);

        fetch('../api/roles?id=0', {
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
                console.log(data)
                var roleData = []

                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        rid: value.rid,
                        role_title: value.role_title,
                    }

                    roleData.push(jsonObject)
                })

                setRoleList(roleData)
                setLoading(false);

            })
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
        <Title level={2 }>角色列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>後台帳號管理</Breadcrumb.Item>
                <Breadcrumb.Item>角色管理</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/roleGroup/new') }}>
                新增角色
            </Button>

            <Table columns={columns} dataSource={roleList} loading={loading} onChange={onChange}>
            </Table>
        </>
    )
}
export default RoleGroupList