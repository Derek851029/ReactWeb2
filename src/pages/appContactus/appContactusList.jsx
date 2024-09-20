import React, { useState, useEffect } from 'react';
import {
    EditOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AppContactusList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [contactusList, setContactusList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '版本',
            dataIndex: 'version',
        },
        {
            title: '提問人',
            dataIndex: 'name',
        },
        {
            title: '會員卡號',
            dataIndex: 'pk_id',
        },
        {
            title: '提問人電話',
            dataIndex: 'tel',
        },
        {
            title: '問題類別',
            dataIndex: 'title',
        },
        {
            title: '填表時間',
            dataIndex: 'created',
            render: (value) => (
                dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
        },
        {
            title: '處理狀態',
            dataIndex: 'reply_status',
            render: (value) => (value === 1 ? "未回覆" : "結案")
        },
        {
            title: '客服人員',
            dataIndex: 'admin_name',
        },
        {
            title: '歷史版本',
            dataIndex: 'app_contactus_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/contactus/version/' + value); }}> 檢視版本</Button >
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'app_contactus_id',
            render: (value, array, index) => {
                return (
                    < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/contactus/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                );

            }
        },
    ];

    useEffect(() => {
        getContactus();
    }, []);

    const getContactus = () => {
        setLoading(true);

        fetch('../api/contactus' + '?type=list&id=0', {
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

                setContactusList(data.map((value, index) => {
                    var jsonObject = {
                        key: index,
                        app_contactus_id: value.app_contactus_id,
                        version: value.version,
                        name: value.name,
                        tel: value.tel,
                        reply_status: value.reply_status,
                        pk_id: value.pk_id,
                        title: value.title,
                        admin_name: value.admin_name,
                        created: value.created,
                    };

                    return jsonObject;
                }));
                setLoading(false);

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
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>聯絡我們列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>聯絡我們</Breadcrumb.Item>
            </Breadcrumb>


            <Table columns={columns} dataSource={contactusList} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default AppContactusList;