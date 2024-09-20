import React, { useState, useEffect } from 'react';
import {PlusCircleOutlined, 
    EditOutlined, DeleteOutlined, HistoryOutlined, UnorderedListOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button,  Typography, Table, Breadcrumb, message } from 'antd';

const { Title, Text } = Typography;

const AppMessage = () => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    const [messageList, setMessageList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'app_message_id',
        },
        {
            title: '名稱',
            dataIndex: 'title',
        },
        {
            title: '投遞列表',
            dataIndex: 'app_message_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<UnorderedListOutlined />} size='small' onClick={() => { navigate('/appMessage/deliveryList/' + value) }}> 檢視列表</Button >
                )
            }
        },
        {
            title: '歷史版本',
            dataIndex: 'app_message_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/appMessage/version/' + value) }}> 檢視版本</Button >
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'app_message_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/appMessage/edit/' + value, { state: { type: 'edit' } }) }}> 編輯</Button >
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteMessage(value, 1) }}> 刪除</Button >
                    </>
                )

            }
        },
    ]

    useEffect(() => {
        getMessage()
    }, []);

    const getMessage = () => {
        setLoading(true);

        fetch('../api/message' + '?type=list&id=0', {
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
                        title: value.title,
                    }

                    messageData.push(jsonObject)
                })
                setMessageList(messageData)
                setLoading(false);

            })
    }

    const deleteMessage = (id, status) => {
        fetch('../api/message', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'delete', MessageID: id, })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                console.log("data:", data)
                messageBox("success", "刪除成功!")

                getMessage()
            })
            .catch(error => {
                messageBox("error", "刪除失敗!")
                console.error('Unable to add item.', error)
            });
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const messageBox = (type, text) => {
        messageApi.open({
            type: type,
            content: text,
        });
    }

    return(
        <>
            {contextHolder}
            <Title level={2}>自訂訊息列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>自訂訊息</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/appMessage/new') }}>
                新增自訂訊息
            </Button>


            <Table columns={columns} dataSource={messageList} loading={loading} onChange={onChange}></Table>
        </>
    )
}

export default AppMessage