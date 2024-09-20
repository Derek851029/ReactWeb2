import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {PlusCircleOutlined,EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { Button, Radio, Divider, Typography, Table, Breadcrumb, message, Menu, Col, DatePicker } from 'antd';
const { Title, Text } = Typography;

const weekFormat = [
    {
        label: '星期一',
        value: '1',
    },
    {
        label: '星期二',
        value: '2',
    },
    {
        label: '星期三',
        value: '3',
    },
    {
        label: '星期四',
        value: '4',
    },
    {
        label: '星期五',
        value: '5',
    },
    {
        label: '星期六',
        value: '6',
    },
    {
        label: '星期日',
        value: '7',
    },
];

const timeFormat = [
    {
        label: '00:00 ~ 00:59',
        value: '1',
    },
    {
        label: '01:00 ~ 01:59',
        value: '2',
    },
    {
        label: '02:00 ~ 02:59',
        value: '3',
    },
    {
        label: '03:00 ~ 03:59',
        value: '4',
    },
    {
        label: '04:00 ~ 04:59',
        value: '5',
    },
    {
        label: '05:00 ~ 05:59',
        value: '6',
    },
    {
        label: '06:00 ~ 06:59',
        value: '7',
    },
    {
        label: '07:00 ~ 07:59',
        value: '8',
    },
    {
        label: '08:00 ~ 08:59',
        value: '9',
    },
    {
        label: '09:00 ~ 09:59',
        value: '10',
    },
    {
        label: '10:00 ~ 10:59',
        value: '11',
    },
    {
        label: '11:00 ~ 11:59',
        value: '12',
    },
    {
        label: '12:00 ~ 12:59',
        value: '13',
    },
    {
        label: '13:00 ~ 13:59',
        value: '14',
    },
    {
        label: '14:00 ~ 14:59',
        value: '15',
    },
    {
        label: '15:00 ~ 15:59',
        value: '16',
    },
    {
        label: '16:00 ~ 16:59',
        value: '17',
    },
    {
        label: '17:00 ~ 17:59',
        value: '18',
    },
    {
        label: '18:00 ~ 18:59',
        value: '19',
    },
    {
        label: '19:00 ~ 19:59',
        value: '20',
    },
    {
        label: '20:00 ~ 20:59',
        value: '21',
    },
    {
        label: '21:00 ~ 21:59',
        value: '22',
    },
    {
        label: '22:00 ~ 22:59',
        value: '23',
    },
    {
        label: '23:00 ~ 23:59',
        value: '24',
    },
];

const MomentSettingList = () => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    const [momentList, setMomentList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '時段名稱',
            dataIndex: 'name',
        },
        {
            title: '星期',
            dataIndex: 'group_week',
            render: (value, array, index) => {
                const splitArray = value.split(',')
                //有相同元素 重新找出不一樣的
                const newArray = [...new Set(splitArray)]
                const element = [];

                newArray.forEach((value, index, arr) => {
                    element.push(<><Text keyboard>{weekFormat[value - 1].label}</Text><br></br></>)
                })
                return <div>{element }</div>

            }
        },
        {
            title: '時段',
            dataIndex: 'group_time',
            render: (value, array, index) => {
                const splitArray = value.split(',')
                //有相同元素 重新找出不一樣的
                const newArray = [...new Set(splitArray)]
                const element = [];

                newArray.forEach((value, index, arr) => {
                    element.push(<><Text keyboard>{timeFormat[value - 1].label}</Text><br></br></>)
                })
                return <div>{element}</div>

            }
        },
        {
            title: '操作',
            dataIndex: 'app_moment_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/currentMoment/edit/' + value) }}> 編輯</Button >
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteMoment(value,1) }}> 刪除</Button >
                    </>
                )

            }
        },
    ]

    useEffect(() => {
        getMomentData()
    }, [])

    const getMomentData = () => {
        setLoading(true);

        fetch('../api/momentsetting?id=0', {
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

                setMomentList(data.map((value, index, arr) => {
                    value.key = index
                    return value;

                }))
                setLoading(false);

            })
    }

    const deleteMoment = (app_moment_id,status) => {

        fetch('../api/momentsetting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), type: 'delete', App_moment_id: app_moment_id })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "刪除當下時刻時段成功!")
                getMomentData()
            })
            .catch(error => {
                messageBox("error", "刪除當下時刻時段失敗!")
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
        getMomentData()
    }

    return (
        <>
            {contextHolder}
            <Title level={2}>當下時刻時段設定列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>當下時刻時段</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/currentMoment/new') }}>
                新增當下時刻時段
            </Button>

            <Table columns={columns} dataSource={momentList} loading={loading} onChange={onChange}></Table>
        </>
    )
}

export default MomentSettingList