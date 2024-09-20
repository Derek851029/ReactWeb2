import React, { useState, useEffect } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    GiftOutlined,
    EyeOutlined,
    CaretUpOutlined,
    CaretDownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message, Menu } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const gcpDemoUrl = "https://pkappgameapi-lh42b6s57q-de.a.run.app/demo/";
const WebactivityList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [current, setCurrent] = useState('DrawPrize');
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const items = [
        {
            label: '抽抽樂',
            key: 'DrawPrize',
        },
        {
            label: '拉霸',
            key: 'Slots',
        },
        {
            label: '問答',
            key: 'Quiz',
        }
    ];
    const columns = [
        {
            title: 'ID',
            dataIndex: 'activity_id',

        },
        {
            title: '活動類型',
            dataIndex: 'activity_type',
            render: (value, array, index) => value === "DrawPrize" ? "抽抽樂" : value === "Slots" ? "拉霸" : "問答"
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
            title: 'Demo',
            dataIndex: 'activity_id',
            render: (value, array, index) => (<Button type="link" href={`${gcpDemoUrl}${value}`} target="_blank">Demo</Button>)
            /*render: (value, array, index) => (<Button type="link" onClick={() => getDemoUrl(value) } >Demo</Button>)*/
        },
        {
            title: '活動狀態',
            dataIndex: 'activity_id',
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
        //{
        //    title: '舊版本',
        //    dataIndex: 'app_activity_id',
        //    render: (value) => {
        //        return (
        //            < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/activity/version/' + value); }}> 檢視版本</Button >
        //        );
        //    }
        //},
        {
            title: '操作',
            dataIndex: 'activity_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - end_time > 0) {
                    return <>
                        < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/webactivity/edit/' + value, { state: { type: 'view', activity: current } }); }}> 查看</Button >
                        < Button type="primary" shape="round" icon={<GiftOutlined />} size='small' onClick={() => { navigate('/webactivity/takeamount', { state: { activity: current, id: value } }); }}> 獎品列表</Button >
                    </>;


                }
                else {
                    return <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/webactivity/edit/' + value, { state: { type: 'edit', activity: current } }); }}> 編輯</Button >
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteActivity(value, 1); }}> 刪除</Button >
                        < Button type="primary" shape="round" icon={<GiftOutlined />} size='small' onClick={() => { navigate('/webactivity/takeamount', { state: { activity: current, id: value } }); }}> 獎品列表</Button >
                    </>;
                    //if (new Date() - start_time > 0 && array.status == 1) {
                    //    return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/activity/edit/' + value, { state: { type: 'view', activity: array.activity_type } }); }}> 查看</Button >;
                    //}
                    //else {
                    //    return (
                    //        <>
                    //            < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/activity/edit/' + value, { state: { type: 'edit', activity: array.activity_type } }); }}> 編輯</Button >
                    //            < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteActivity(value, 1); }}> 刪除</Button >
                    //        </>
                    //    );

                    //}

                }

            }
        },
    ];

    useEffect(() => {
        getWebActivity(current);
    }, []);

    const getWebActivity = (key) => {
        setLoading(true);

        fetch(`../api/webactivity?type=list&activity=${key}`, {
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
                setSearchData(
                    data.map((obj, index) => {
                        obj.key = index;
                        return obj;
                    })
                );
                setLoading(false);

            });
    };

    const getDemoUrl = (acvitiyId) => {
        fetch(`../api/webactivity?type=demo&&activity=${current}&id=${acvitiyId}`, {
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

            });
    };

    const changeStatus = (id, status) => {
        fetch('../api/webactivity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'status', WebActivityID: id, })
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
                getWebActivity(current);
            })
            .catch(error => {
                messageBox("error", "活動編輯失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const deleteActivity = (id, status) => {
        fetch('../api/webactivity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'delete', WebActivityID: id, })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("data:", data);
                messageBox("success", "刪除成功!");

                getWebActivity(current);
            })
            .catch(error => {
                messageBox("error", "刪除失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const menuOnClick = (e) => {
        console.log('click ', e);
        getWebActivity(e.key);
        setCurrent(e.key);
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
            <Title level={2}>站外活動列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>站外活動列表</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/webactivity/new'); }}>
                新增活動
            </Button>

            <Menu
                onClick={menuOnClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{ fontSize: 20 }}
            >
            </Menu>
            <br></br>
            <Table columns={columns} dataSource={searchData} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default WebactivityList;