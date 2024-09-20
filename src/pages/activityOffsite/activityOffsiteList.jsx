import React, { useState, useEffect } from 'react';
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

const ActivityOffsiteList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [activityList, setActivityList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [activityType, setActivityType] = useState([
        {
            text: '���Q',
            value: 'Slots'
        },
        {
            text: '����',
            value: 'DrawPrize'
        },
        {
            text: '�ݵ�',
            value: 'Quiz'
        }
    ]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'activity_id',

        },
        {
            title: '��������',
            dataIndex: 'activity_type',
            filters: activityType,
            onFilter: (value, record) => record.activity_type.includes(value),
            render: (value, array, index) => activityType.find((obj) => obj.value === value).text
        },
        {
            title: '�ɴ��W��',
            dataIndex: 'title',
        },
        {
            title: '���ʮɶ��϶�(�_�����)',
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
            title: '���ʪ��A',
            dataIndex: 'activity_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - end_time > 0) {
                    return "���ʤw����";
                }
                else {
                    if (array.status == 0) {
                        return (
                            <>
                                ���ʤw�U�[ <br></br>
                                < Button type="default" shape="round" icon={< CaretUpOutlined />} size='small' onClick={() => { changeStatus(value, 1); }}> �W�[����</Button >
                            </>
                        );
                    }
                    else {
                        if (new Date() - start_time > 0 && new Date() - end_time < 0) {
                            return (
                                <>
                                    ���ʶi�椤<br></br>
                                    < Button danger type="default" shape="round" icon={< CaretDownOutlined />} size='small' onClick={() => { changeStatus(value, 0); }}> �U�[����</Button >
                                </>

                            );
                        }
                        else {
                            if (new Date() - start_time < 0) {
                                return (
                                    <>
                                        ���}�l<br></br>
                                        < Button danger type="default" shape="round" icon={< CaretDownOutlined />} size='small' onClick={() => { changeStatus(value, 0); }}> �U�[����</Button >
                                    </>
                                );
                            }

                        }

                    }
                }

            }
        },
        {
            title: '�w��',
            dataIndex: 'activity_id',
            render: (value) => {
                return (
                    < Button type="link" shape="round" size='small' onClick={() => { navigate('/activityOffsite/version/' + value); }}> �d��</Button >
                );
            }
        },
        {
            title: '�ާ@',
            dataIndex: 'activity_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - end_time > 0) {
                    return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/activityOffsite/edit/' + value, { state: { type: 'view', activity: array.activity_type } }); }}> �d��</Button >;
                }
                else {
                    if (new Date() - start_time > 0 && array.status == 1) {
                        return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/activityOffsite/edit/' + value, { state: { type: 'view', activity: array.activity_type } }); }}> �d��</Button >;
                    }
                    else {
                        return (
                            <>
                                < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/activityOffsite/edit/' + value, { state: { type: 'edit', activity: array.activity_type } }); }}> �s��</Button >
                                < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteActivity(value, 1); }}> �R��</Button >
                            </>
                        );

                    }

                }

            }
        },
    ];

    useEffect(() => {
        getActivity();
    }, []);

    const getActivity = () => {
        setLoading(true);

        fetch('../api/activityOffsiteOffsite' + '?type=list&id=0', {
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

                setActivityList(
                    data.map((value, index, arr) => {
                        const jsonObject = {
                            key: index,
                            activity_id: value.activity_id,
                            activity_type: value.activity_type,
                            title: value.title,
                            start_time: value.start_time,
                            end_time: value.end_time,
                            status: value.status,
                        };
                        return jsonObject;
                    }));

                setLoading(false);

            });
    };

    const changeStatus = (id, status) => {
        fetch('../api/activityOffsiteOffsite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'status', ActivityOffsiteId: id, })
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
                    messageBox("success", "���ʤw�U�[!");
                }
                else {
                    messageBox("success", "���ʤw�W�[!");
                }
                getActivity();
            })
            .catch(error => {
                messageBox("error", "���ʽs�襢��!");
                console.error('Unable to add item.', error);
            });
    };

    const deleteActivity = (id, status) => {
        fetch('../api/activityOffsite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'delete', ActivityOffsiteId: id, })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("data:", data);
                messageBox("success", "�R�����\!");

                getActivity();
            })
            .catch(error => {
                messageBox("error", "�R������!");
                console.error('Unable to add item.', error);
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
            <Title level={2}>���~���ʦC��</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>���~���ʦC��</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/activityOffsiteOffsite/new'); }}>
                �s�W����
            </Button>


            <Table columns={columns} dataSource={activityList} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default ActivityOffsiteList;