﻿import React, { useState, useEffect } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    HistoryOutlined,
    EyeOutlined,
    CaretUpOutlined,
    CaretDownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ActivityList = () => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    const [activityList, setActivityList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'app_activity_id',

        },
        {
            title: '活動類型',
            dataIndex: 'activity_type',
            filters: [
                {
                    text: '抽抽樂',
                    value: 'DrawPrize'
                },
                {
                    text: '問答',
                    value: 'Quiz'
                }
            ],
            onFilter: (value, record) => record.activity_type.includes(value),
            render: (value, array, index) => value === "DrawPrize" ? "抽抽樂" : "問答"
        },
        {
            title: '檔期名稱',
            dataIndex: 'title',
        },
        {
            title: '活動時間區間(起迄日期)',
            dataIndex: 'start_time',
            sorter: (a, b) => a.start_time - b.start_time,
            render: (value, array, index) => {
                const start_time = dayjs(array.start_time * 1000).format('YYYY-MM-DD HH:mm:ss');

                const end_time = dayjs(array.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');

                const str = start_time + " ~ " + end_time;

                return str;

            }
        },
        {
            title: '活動狀態',
            dataIndex: 'app_activity_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - end_time > 0) {
                    return "活動已結束";
                }
                else {
                    if (array.status == 0) {
                        return (
                            <>
                                活動已下架 <br></br>
                                < Button type="default" shape="round" icon={< CaretUpOutlined />} size='small' onClick={() => { changeStatus(value, 1); }}> 上架活動</Button >
                            </>
                        );
                    }
                    else {
                        if (new Date() - start_time > 0 && new Date() - end_time < 0) {
                            return (
                                <>
                                    活動進行中<br></br>
                                    < Button danger type="default" shape="round" icon={< CaretDownOutlined />} size='small' onClick={() => { changeStatus(value, 0); }}> 下架活動</Button >
                                </>

                            );
                        }
                        else {
                            if (new Date() - start_time < 0) {
                                return (
                                    <>
                                        未開始<br></br>
                                        < Button danger type="default" shape="round" icon={< CaretDownOutlined />} size='small' onClick={() => { changeStatus(value, 0); }}> 下架活動</Button >
                                    </>
                                );
                            }

                        }

                    }
                }

            }
        },
        {
            title: '舊版本',
            dataIndex: 'app_activity_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/activity/version/' + value); }}> 檢視版本</Button >
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'app_activity_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - end_time > 0) {
                    return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/activity/edit/' + value, { state: { type: 'view', activity:array.activity_type } }); }}> 查看</Button >;
                }
                else {
                    if (new Date() - start_time > 0 && array.status == 1) {
                        return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/activity/edit/' + value, { state: { type: 'view', activity: array.activity_type } }); }}> 查看</Button >;
                    }
                    else {
                        return (
                            <>
                                < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/activity/edit/' + value, { state: { type: 'edit', activity: array.activity_type } }); }}> 編輯</Button >
                                < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteActivity(value, 1); }}> 刪除</Button >
                            </>
                        );

                    }

                }

            }
        },
    ]

    useEffect(() => {
        getActivity()
    }, []);

    const getActivity = () => {
        setLoading(true);

        fetch('../api/activity' + '?type=list&id=0', {
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
                var activityData = []
                console.log(data)
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        app_activity_id: value.app_activity_id,
                        activity_type: value.activity_type,
                        title: value.title,
                        start_time: value.start_time,
                        end_time: value.end_time,
                        status: value.status,
                        version: value.version,
                    }

                    activityData.push(jsonObject)
                })
                setActivityList(activityData)
                setLoading(false);

            })
    }

    const changeStatus = (id, status) => {
        fetch('../api/activity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'status', ActivityID: id, })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("data:", data);
                if (status == 0) {
                    messageBox("success", "活動已下架!");
                }
                else {
                    messageBox("success", "活動已上架!");
                }
                getActivity();
            })
            .catch(error => {
                messageBox("error", "活動編輯失敗!");
                console.error('Unable to add item.', error);
            });
    }

    const deleteActivity = (id, status) => {
        fetch('../api/activity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'delete', ActivityID: id, })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("data:", data)
                messageBox("success", "刪除成功!")

                getActivity()
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

    return (
        <>
            {contextHolder}
            <Title level={2}>活動列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>活動列表</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/activity/new') }}>
                新增活動
            </Button>


            <Table columns={columns} dataSource={activityList} loading={loading} onChange={onChange}></Table>
        </>
    )
}

export default ActivityList