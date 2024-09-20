﻿import React, { useState, useEffect } from 'react';
import {EyeOutlined} from '@ant-design/icons';
import { useNavigate, useParams ,Link } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const MessageVersion = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { messageID } = useParams()
    const navigate = useNavigate()
    const [versionList, setVersionList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '版本',
            dataIndex: 'version',
        },
        {
            title: '建立時間',
            dataIndex: 'ver_created',
            sorter: (a, b) => a.ver_created - b.ver_created,
            render: (value, array, index) => {
                const ver_created = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')

                return ver_created
            }
        },
        {
            title: '操作',
            dataIndex: 'app_message_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/appMessage/edit/' + value, { state: { type: 'view' } }) }}> 檢視</Button >
                    </>
                )

            }
        },
    ]

    useEffect(() => {
        getVersion()
    }, []);

    const getVersion = () => {
        setLoading(true);

        fetch('/api/message' + '?type=version&id=' + messageID, {
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
                var messageData = []
                console.log(data)
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        app_message_id: value.app_message_id,
                        version: value.version,
                        ver_created: value.ver_created
                    }

                    messageData.push(jsonObject)
                })
                setVersionList(messageData)
                setLoading(false);

            })
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>自訂訊息版本列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appMessage/list'>自訂訊息</Link></Breadcrumb.Item>
                <Breadcrumb.Item>自訂訊息版本列表</Breadcrumb.Item>
            </Breadcrumb>

            <Table columns={columns} dataSource={versionList} loading={loading} onChange={onChange}></Table>
        </>
    )
}

export default MessageVersion