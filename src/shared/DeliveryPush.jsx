import React, { useState, useEffect } from 'react';
import {
    DeleteOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Table, message, DatePicker, Form, Spin } from 'antd';
import ModalShow from '../pages/ModalControl';
import dayjs from 'dayjs';

const DeliveryPush = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(props.page);
    const [type, setType] = useState(props.type)

    const [form] = Form.useForm();
    const [formData, setFormData] = useState();
    const [formShowDisable, setFormShowDisable] = useState(type === "edit" ? false : true)

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const [deliveryList, setDeliveryList] = useState([]);

    const [activityID, setActivityID] = useState(props.id);
    

    const columns = [
        {
            title: '建立時間',
            dataIndex: 'created',
            sorter: (a, b) => a.created - b.created,
            render: (value, array, index) => {
                const created = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');

                return created;
            }
        },
        {
            title: '狀態',
            dataIndex: 'delivery_status',
            render: (value, array, index) => {
                let str = '';
                value === 3 ? str = '投遞完成' : str = '等待投遞';
                return str;
            }
        },
        {
            title: '開始推播時間',
            dataIndex: 'start_push_time',
            render: (value, array, index) => {
                const start_push_time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');

                return start_push_time;
            }
        },
        {
            title: '開始投遞時間',
            dataIndex: 'start_delivery_time',
            render: (value, array, index) => {
                let str = '';
                const start_delivery_time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');

                array.delivery_status === 3 ? str = start_delivery_time : str = '未開始投遞';
                return str;
            }
        },
        {
            title: '完成投遞時間',
            dataIndex: 'complete_time',
            sorter: (a, b) => a.ver_created - b.ver_created,
            render: (value, array, index) => {
                let str = '';
                const complete_time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');

                array.delivery_status === 3 ? str = complete_time : str = '未完成投遞';
                return str;
            }
        },
        {
            title: '成功投遞數',
            dataIndex: 'delivery_count',
            sorter: (a, b) => a.ver_created - b.ver_created,
            render: (value, array, index) => {
                let str = '';

                array.delivery_status === 3 ? str = value : str = '未完成投遞';
                return str;
            }
        },
        {
            title: '操作',
            dataIndex: 'delivery_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { recycle(value); }}> 收回</Button >
                    </>
                );

            }
        },
    ]

    useEffect(() => {
        getPushList();
    }, [props.id,props.type,props.page]);

    const getPushList = () => {
        setLoading(true);
        setIsLoading(true);

        fetch('/api/deliverypush' + '?type=' + page +'&id=' + activityID, {
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
                var deliveryData = [];
                console.log(data);
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
                    };

                    deliveryData.push(jsonObject);
                });
                console.log(deliveryData);
                setDeliveryList(deliveryData);
                setLoading(false);
                setIsLoading(false)
            })
    };

    const recycle = (DeliveryId) => {
        fetch('/api/deliverypush', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DeliveryId: DeliveryId, type: page })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                data === 'Success' ?
                    messageBox("success", "該筆投遞回收成功!") :
                    messageBox("error", "該筆投遞無法回收!");
            })
            .catch(error => {
                messageBox("error", "該筆投遞回收失敗!");
                console.error('Unable to add item.', error);
            });
    }

    const handleOk = () => {
        //判斷時間是否在當前時間一小時後
        if (dayjs(formData.PushTime).isAfter(dayjs().add(1, 'hour')) === false) {
            messageBox("error", "推播時間必須設定在一小時後!");
            setFormShowDisable(false)
            setOpen(false);
            return
        }

        setConfirmLoading(true);

        fetch('/api/deliverypush', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DataInfo: JSON.stringify(formData),
                type: page,
                ID: activityID
            })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                setFormShowDisable(false)
                messageBox("success","推播投遞儲存成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "推播投遞儲存失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onCancel = () => {
        setFormShowDisable(false)
        setOpen(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true)
        setOpen(true);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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
                        setOpen(false);
                        setConfirmLoading(false);
                        setFormShowDisable(false)
                        getPushList()
                    }
                });
                break;
        }

    };

    const pushTimeForm = (
        <Form
            disabled={formShowDisable}
            form={form}
            size='large'
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item required label="開始推播時間" name="PushTime"
                rules={[
                    {
                        required: true,
                        message: '請選擇開始推播時間!',
                    },
                ]}
            >
                <DatePicker showTime></DatePicker>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 11,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<CheckCircleOutlined />} size='large'> 儲存</Button>
            </Form.Item>
        </Form>
    )

    return (
        <>
            <Spin tip="Loading..." spinning={isLoading }>
                {contextHolder}
                {
                    deliveryList.length > 0 ?
                        <Table columns={columns} dataSource={deliveryList} loading={loading} onChange={onChange}></Table>
                        :pushTimeForm
                }
                <ModalShow
                    title="預覽"
                    formTable={pushTimeForm}
                    open={open}
                    page='delivery'
                    handleOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={onCancel}>
                </ModalShow>

            
            </Spin>
        </>
    );
}

export default DeliveryPush;