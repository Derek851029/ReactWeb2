import React, { useState, useEffect } from 'react';
import {PlusCircleOutlined, 
    EditOutlined, DeleteOutlined, HistoryOutlined, ExportOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button,  Typography, Table, Breadcrumb, message } from 'antd';

const { Title, Text } = Typography;

const AppNews = () => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'app_news_id',
        },
        {
            title: '名稱',
            dataIndex: 'title',
        },
        {
            title: '狀態',
            dataIndex: 'status',
            render: (status) => {
                return status === 1 ? "發佈" : "下架"
            }
        },
        {
            title: '歷史版本',
            dataIndex: 'app_news_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/appNews/version/' + value) }}> 檢視版本</Button >
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'app_news_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/appNews/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >&nbsp;&nbsp;
                        < Button type="primary" shape="round" icon={<ExportOutlined />} size='small' onClick={() => { exportTxt(value); }}> 匯出</Button >&nbsp;&nbsp;
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteNews(value, 1); }}> 刪除</Button >
                    </>
                )

            }
        },
    ]

    useEffect(() => {
        getNews()
    }, []);

    const getNews = () => {
        setLoading(true);

        fetch('../api/news' + '?type=list&id=0', {
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
                var newsData = []
                console.log(data)
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        app_news_id: value.app_news_id,
                        title: value.title,
                        status: value.status
                    }

                    newsData.push(jsonObject)
                })
                setNewsList(newsData)
                setLoading(false);

            })
    }

    const deleteNews = (id, status) => {
        fetch('../api/news', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'delete', NewsID: id, })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                console.log("data:", data)
                messageBox("success", "刪除成功!")

                getNews()
            })
            .catch(error => {
                messageBox("error", "刪除失敗!")
                console.error('Unable to add item.', error)
            });
    }

    const exportTxt = (id) => {
        const fileUrl = `../api/news?type=export&id=${id}`
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `最新消息(${id}).txt`;

        link.click();
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
            <Title level={2}>最新消息列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>最新消息列表</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/appNews/new') }}>
                新增最新消息
            </Button>


            <Table columns={columns} dataSource={newsList} loading={loading} onChange={onChange}></Table>
        </>
    )
}

export default AppNews