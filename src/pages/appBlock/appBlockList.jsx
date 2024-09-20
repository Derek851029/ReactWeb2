import React, { useState } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined, DeleteOutlined, HistoryOutlined, ExportOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Typography, DatePicker, Table, Breadcrumb, message, Popconfirm, Input } from 'antd';
import { useEffect } from "react";

import dayjs from 'dayjs';
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'time' || inputType === 'next_time' ? <RangePicker showTime /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `請輸入 ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const AppBlockList = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;

    const [blockList, setBlockList] = useState([]);
    const [nextBlockList, setNextblockList] = useState([]);

    const columns = [
        {
            title: '活動名稱',
            dataIndex: 'block_name',
        },
        {
            title: '當前標題',
            dataIndex: 'title',
            editable: true,
        },
        {
            title: '當前副標題',
            dataIndex: 'sub_title',
            editable: true,
        },
        {
            title: '顯示區間',
            dataIndex: 'time',
            editable: true,
            render: (value, array) => (
                dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss') + "~" + dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss')
            )
        },
        {
            title: '操作',
            dataIndex: 'key',
            render: (value, array, index) => (
                value === editingKey ?
                    (
                        <>
                            <span>
                                <Typography.Link
                                    onClick={() => save(value, "now")}
                                    style={{
                                        marginRight: 8,
                                    }}
                                >
                                    儲存
                                </Typography.Link>
                                <Popconfirm title="確定取消編輯?" onConfirm={() => setEditingKey("")}>
                                    <a>取消</a>
                                </Popconfirm>
                            </span>
                        </>
                    ) :
                    < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => edit(array,value)}> 編輯</Button >
            )
        },
    ];

    const columns2 = [
        {
            title: '活動名稱',
            dataIndex: 'block_name',
        },
        {
            title: '未來標題',
            dataIndex: 'next_title',
            editable: true,
        },
        {
            title: '未來副標題',
            dataIndex: 'next_sub_title',
            editable: true,
        },
        {
            title: '未來顯示區間',
            dataIndex: 'next_time',
            editable: true,
            render: (value, array) => (dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss') + "~" + dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss'))
        },
        {
            title: '操作',
            dataIndex: 'key',
            render: (value, array, index) => (
                value === editingKey ?
                    (
                        <>
                            <span>
                                <Typography.Link
                                    onClick={() => save(value, "next")}
                                    style={{
                                        marginRight: 8,
                                    }}
                                >
                                    儲存
                                </Typography.Link>
                                <Popconfirm title="確定取消編輯?" onConfirm={() => setEditingKey("")}>
                                    <a>取消</a>
                                </Popconfirm>
                            </span>
                        </>
                    ) :
                    < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => edit(array, value)}> 編輯</Button >
            )
        },
    ];

    useEffect(() => {
        getAppBlock();
    }, []);

    const getAppBlock = () => {
        setLoading(true);

        fetch('../api/appblock', {
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
            .then((data) => {
                const newBlock = data.map((value, index) => ({
                    ...value,
                    time: [dayjs(value.start_time * 1000), dayjs(value.end_time * 1000)],
                    key: index.toString(),
                }));

                const nextBlock = data.map((value, index) => ({
                    ...value,
                    next_time: [dayjs(value.next_start_time * 1000), dayjs(value.next_end_time * 1000)],
                    key: (index + 10).toString(),
                }))

                setBlockList(newBlock);
                setNextblockList(nextBlock);
                setLoading(false);

            })
            .catch(err => {
                console.log(`error:${err}`);
            });
    };

    const edit = (array,key) => {
        form.setFieldsValue({
            ...array,
            time: [dayjs(array.start_time * 1000), dayjs(array.end_time * 1000)],
            next_time: [dayjs(array.next_start_time * 1000), dayjs(array.next_end_time * 1000)]
        });
        console.log(key)
        setEditingKey(key);
    };

    const save = async (key, type) => {
        try {
            const row = await form.validateFields();
            const newData = type === "now" ? [...blockList] : [...nextBlockList];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                type === "now" ? setBlockList(newData) : setNextblockList(newData);

                callSave(type, newData[index]);
                setEditingKey('');
            } else {
                newData.push(row);
                type === "now" ? setBlockList(newData) : setNextblockList(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const callSave = (type, data) => {
        console.log(data);

        fetch('../api/appblock', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(data), Type: type })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                messageBox("success", "儲存成功!");
                getAppBlock();
            })
            .catch(error => {
                messageBox("error", "儲存失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const messageBox = (type, text) => {
        messageApi.open({
            type: type,
            content: text,
        });
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === "time" ? "time" : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const nextMergedColumns = columns2.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === "next_time" ? "time" : 'text',
                dataIndex: col.dataIndex,
                title: col.next_title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            {contextHolder}
            <Title level={2}>App區塊管理</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>App區塊管理</Breadcrumb.Item>
            </Breadcrumb>

            <Title mark level={3}>當前顯示標題&副標題</Title>

            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    pagination={false}
                    columns={mergedColumns}
                    dataSource={blockList}
                    loading={loading}>
                </Table>
            </Form>

            <br></br>
            <Title mark level={3}>未來顯示標題&副標題</Title>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    pagination={false}
                    columns={nextMergedColumns}
                    dataSource={nextBlockList}
                    loading={loading}>
                </Table>
            </Form>
        </>
    );
};

export default AppBlockList;