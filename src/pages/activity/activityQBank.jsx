import React, { useState, useEffect } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Table, message, InputNumber, Select, Form } from 'antd';
import ModalShow from '../ModalControl';
import dayjs from 'dayjs';

const { TextArea } = Input;

const ActivityQBank = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState("table");

    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState();

    const [activityQBankList, setActivityQBankList] = useState([]);

    const [activityID, setActivityID] = useState(props.id);
    const [activityQBankId, setActivityQBankId] = useState(0);

    const columns = [
        {
            title: '問題',
            dataIndex: 'subject',

        },
        {
            title: '選項A',
            dataIndex: 'option_a',
        },
        {
            title: '選項B',
            dataIndex: 'option_b',
        },
        {
            title: '操作',
            dataIndex: 'actq_item_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - end_time > 0) {
                    return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small'
                        onClick={() => {
                            getActivityQData(value);
                            setPage("view");
                            setFormShowDisable(true);
                        }}>
                        查看</Button >;
                }
                else {
                    if (new Date() - start_time > 0 && array.status == 1) {
                        return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small'
                            onClick={() => {
                                getActivityQData(value);
                                setPage("view");
                                setFormShowDisable(true);
                            }}>
                            查看</Button >;
                    }
                    else {
                        return (
                            <>
                                < Button type="primary" shape="round" icon={<EditOutlined />} size='small'
                                    onClick={() => {
                                        getActivityQData(value);
                                        setPage("edit");
                                        setActivityQBankId(value);
                                    }}>
                                    編輯</Button >

                                < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small'
                                    onClick={() => { deleteQ(value); }}> 刪除</Button >
                            </>
                        );

                    }

                }

            }
        },
    ];

    useEffect(() => {
        getActivityQList();
    }, [props.id]);

    const getActivityQList = () => {
        setLoading(true);

        fetch('/api/activity' + '?type=qList&id=' + activityID + '', {
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
                var qData = [];
                console.log(data);
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        actq_item_id: value.actq_item_id,
                        subject: value.subject,
                        option_a: value.option_a,
                        option_b: value.option_b,
                        start_time: value.start_time,
                        end_time: value.end_time,
                    };

                    qData.push(jsonObject);
                });
                setActivityQBankList(qData)
                setLoading(false);

            });
    };

    const getActivityQData = (actq_item_id) => {
        setLoading(true);

        fetch('/api/activity' + '?type=qData&id=' + actq_item_id + '', {
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
                const activityQData = data[0];
                form.setFieldsValue({
                    subject: activityQData.subject,
                    option_a: activityQData.option_a,
                    reply_a: activityQData.reply_a,
                    option_b: activityQData.option_b,
                    reply_b: activityQData.reply_b,
                });
            });
    };

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/activity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DataInfo: JSON.stringify(formData),
                type: `${page}QBank`,
                ActivityID: activityID,
                ActivityQBankId: activityQBankId
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                messageBox("success", page === "new" ? "新增題庫成功!" : "編輯題庫成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", page === "new" ? "新增題庫失敗!" : "編輯題庫失敗");
                console.error('Unable to add item.', error);
            });
    };

    const deleteQ = (id) => {
        fetch('/api/activity', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ActivityQBankId: id, Type: "qbank" })
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

                getActivityQList();
            })
            .catch(error => {
                messageBox("error", "刪除失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onCancel = () => {
        setFormShowDisable(false);
        setOpen(false);
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
                        setOpen(false);
                        setConfirmLoading(false);
                        setFormShowDisable(false);
                        setPage("table");
                        getActivityQList();

                        form.resetFields();
                    }
                });
                break;
        }

    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const formTable = (
        <Form
            disabled={formShowDisable}
            form={form}
            size='large'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >

            <Form.Item required label="題目" name="subject"
                rules={[
                    {
                        required: true,
                        message: '請選擇題目!',
                    },
                ]}
            >
                <TextArea placeholder="請輸入題目。。。" />
            </Form.Item>

            <Form.Item required label="問題A" name="option_a"
                rules={[
                    {
                        required: true,
                        message: '請輸入問題A!',
                    },
                ]}
            >
                <Input placeholder="請輸入問題A。。。" />
            </Form.Item>

            <Form.Item required label="回覆問題A" name="reply_a"
                rules={[
                    {
                        required: true,
                        message: '請輸入回覆問題A!',
                    },
                ]}
            >
                <Input placeholder="請輸入回覆問題A。。。" />
            </Form.Item>

            <Form.Item required label="問題B" name="option_b"
                rules={[
                    {
                        required: true,
                        message: '請輸入問題B!',
                    },
                ]}
            >
                <Input placeholder="請輸入問題B。。。" />
            </Form.Item>

            <Form.Item required label="回覆問題B" name="reply_b"
                rules={[
                    {
                        required: true,
                        message: '請輸入回覆問題B!',
                    },
                ]}
            >
                <Input placeholder="請輸入回覆問題B。。。" />
            </Form.Item>


            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={page === "new" ? <PlusOutlined /> : <EditOutlined />} size='large'>{page === "new" ? "新增" : "編輯"}</Button>
            </Form.Item>
        </Form>
    );

    return (
        <>
            {contextHolder}

            {
                page === "table" ?
                    <>
                        <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { setPage("new"); }}>
                            新增題庫
                        </Button>
                        <Table columns={columns} dataSource={activityQBankList} loading={loading} onChange={onChange}></Table>
                    </>
                    : formTable
            }


            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='QBank'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default ActivityQBank;