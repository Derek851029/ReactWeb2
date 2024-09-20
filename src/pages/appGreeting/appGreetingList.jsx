import React, { useState, useEffect } from 'react';
import {
    EditOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AppGreetingList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [greetingList, setGreetingList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'app_greeting_id',
        },
        {
            title: '問候語',
            dataIndex: 'greeting_name',
        },
        {
            title: '時段區間',
            dataIndex: 'start_time',
            render: (value, array, index) => (
                `${dayjs(array.start_time * 1000).format('HH:mm')} ~ ${dayjs(array.end_time * 1000).format('HH:mm')}`
            )
  
        },
        {
            title: '操作',
            dataIndex: 'app_greeting_id',
            render: (value, array, index) => {
                return (
                    < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate(`/greeting/edit/${value}`); }}> 編輯</Button >
                );

            }
        },
    ];

    useEffect(() => {
        getGreeting();
    }, []);

    const getGreeting = () => {
        setLoading(true);

        fetch('../api/greeting' + '?type=list', {
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

                setGreetingList(data.map((value, index) => {
                    value.key = index

                    return value;
                }));
                setLoading(false);

            });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>時段問候列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>時段問候</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/greeting/edit/'); }}>
                新增時段問候
            </Button>

            <Table columns={columns} dataSource={greetingList} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default AppGreetingList;