import React, { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AppMessageDeliveryList = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { messageID } = useParams()
    const navigate = useNavigate()
    const [deliveryList, setDeliveryList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '建立時間',
            dataIndex: 'created',
            sorter: (a, b) => a.created - b.created,
            render: (value, array, index) => {
                const created = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')

                return created
            }
        },
        {
            title: '狀態',
            dataIndex: 'delivery_status',
            render: (value, array, index) => {
                let str = ''
                value === 3 ? str = '投遞完成' : str = '等待投遞'
                return str
            }
        },
        {
            title: '開始推播時間',
            dataIndex: 'start_push_time',
            render: (value, array, index) => {
                const start_push_time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')

                return start_push_time
            }
        },
        {
            title: '開始投遞時間',
            dataIndex: 'start_delivery_time',
            render: (value, array, index) => {
                let str = ''
                const start_delivery_time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')

                array.delivery_status === 3 ? str = start_delivery_time : str = '未開始投遞'
                return str
            }
        },
        {
            title: '完成投遞時間',
            dataIndex: 'complete_time',
            sorter: (a, b) => a.ver_created - b.ver_created,
            render: (value, array, index) => {
                let str = ''
                const complete_time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')

                array.delivery_status === 3 ? str = complete_time : str = '未完成投遞'
                return str
            }
        },
        {
            title: '成功投遞數',
            dataIndex: 'delivery_count',
            sorter: (a, b) => a.ver_created - b.ver_created,
            render: (value, array, index) => {
                let str = ''

                array.delivery_status === 3 ? str = value : str = '未完成投遞'
                return str
            }
        },
        {
            title: '操作',
            dataIndex: 'delivery_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { recycle(value) }}> 收回</Button >
                    </>
                )

            }
        },
    ]

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        setLoading(true);

        fetch('/api/deliverypush' + '?type=AppMessage&id='+messageID, {
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
                var deliveryData = []
                console.log(data)
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        delivery_id: value.delivery_id,
                        delivery_status: value.delivery_status,
                        start_push_time: value.start_push_time,
                        delivery_count: value.delivery_count,
                        start_schedule_time: value.start_schedule_time,
                        start_delivery_time: value.start_delivery_time,
                        complete_time: value.complete_time,
                        created: value.created
                    }

                    deliveryData.push(jsonObject)
                })
                console.log(deliveryData)
                setDeliveryList(deliveryData)
                setLoading(false);

            })
    }

    const recycle = (DeliveryId) => {
        fetch('/api/deliverypush', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DeliveryId: DeliveryId, type: 'AppMessage' })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                data === 'Success' ?
                messageBox("success", "該筆投遞回收成功!") :
                messageBox("error", "該筆投遞無法回收!")
            })
            .catch(error => {
                messageBox("error", "該筆投遞回收失敗!")
                console.error('Unable to add item.', error)
            });
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
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
                        navigate("/appMessage/list", { replace: true })
                    }
                });
                break;
        }

    }

    return (
        <>
            { contextHolder }
            < Title level={2} > 自訂訊息投遞列表</Title >
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appMessage/list'>自訂訊息</Link></Breadcrumb.Item>
                <Breadcrumb.Item>投遞列表</Breadcrumb.Item>
            </Breadcrumb>

            <Table columns={columns} dataSource={deliveryList} loading={loading} onChange={onChange}></Table>
        </>
    )
}

export default AppMessageDeliveryList