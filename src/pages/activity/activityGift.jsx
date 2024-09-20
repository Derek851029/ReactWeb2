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

const ActivityGift = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState("table")
    const [type, setType] = useState(props.type)

    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(type === "edit" ? false : true);
    const [formData, setFormData] = useState();

    const [optNoStyle, setOptNoStyle] = useState(props.activity === "Quiz" ? false : true)

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState();

    const [activityGiftList, setActivityGiftList] = useState([])

    const [activityID, setActivityID] = useState(props.id)
    const [activityPrizeId, setActivityPrizeId] = useState(0)

    const columns = [
        {
            title: '品牌',
            dataIndex: 'brand',

        },
        {
            title: '優惠券ID',
            dataIndex: 'sl_coupon_id',
        },
        {
            title: '獎品數量',
            dataIndex: 'amount',
        },
        {
            title: '被抽取數量',
            dataIndex: 'take_amount',
        },
        {
            title: '操作',
            dataIndex: 'app_activity_prize_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - end_time > 0) {
                    return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small'
                        onClick={() => {
                            getActivityGiftData(value);
                            setPage("view");
                            setFormShowDisable(true);
                        }}>
                        查看</Button >;
                }
                else {
                    if (new Date() - start_time > 0 && array.status == 1) {
                        return < Button type="primary" shape="round" icon={<EyeOutlined />} size='small'
                            onClick={() => {
                                getActivityGiftData(value);
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
                                        getActivityGiftData(value);
                                        setPage("edit");
                                        setActivityPrizeId(value)
                                    }}>
                                    編輯</Button >

                                < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small'
                                    onClick={() => { deleteGift(value); }}> 刪除</Button >
                            </>
                        );

                    }

                }

            }
        },
    ];

    useEffect(() => {
        getActivityGiftList();
    }, [props.id, props.activity]);

    const getActivityGiftList = () => {
        setLoading(true);

        fetch('/api/activity' + '?type=giftList&id=' + activityID +'', {
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
                var giftData = [];
                console.log(data);
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        app_activity_prize_id: value.app_activity_prize_id,
                        brand: value.brand,
                        sl_coupon_id: value.sl_coupon_id,
                        start_time: value.start_time,
                        end_time: value.end_time,
                        amount: value.amount,
                        take_amount: value.take_amount,
                    };

                    giftData.push(jsonObject);
                });
                setActivityGiftList(giftData);
                setLoading(false);

            });
    }

    const getActivityGiftData = (activityPrizeId) => {
        setLoading(true);

        fetch('/api/activity' + '?type=giftData&id=' + activityPrizeId + '', {
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
                const activityPrizeData = data[0]
                form.setFieldsValue({
                    brand: activityPrizeData.brand,
                    sl_coupon_id: activityPrizeData.sl_coupon_id,
                    description: activityPrizeData.description,
                    amount: activityPrizeData.amount,
                });
            });
    }

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
                type: `${page}Gift`,
                ActivityType: props.activity, 
                ActivityID: activityID,
                ActivityPrizeId: activityPrizeId
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
                messageBox("success", page === "new" ? "新增獎品成功!" : "編輯獎品成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", page === "new" ? "新增獎品失敗!" : "編輯獎品失敗");
                console.error('Unable to add item.', error);
            });
    };

    const deleteGift = (id) => {
        fetch('/api/activity', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ActivityPrizeId: id, Type: "gift" })
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

                getActivityGiftList();
            })
            .catch(error => {
                messageBox("error", "刪除失敗!");
                console.error('Unable to add item.', error);
            });
    }

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
                        setFormShowDisable(false)
                        setPage("table")
                        getActivityGiftList()

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
            <Form.Item required
                noStyle={optNoStyle}
                label="選項"
                name="prize_group"
            >
                {
                    props.activity === 'Quiz' ? (
                        <Select
                            placeholder="請選擇選項。。。"
                            options={[{ label: '選項A', value: 'a' }, { label: '選項B', value: 'b' }]} />
                    ) : null
                }
            </Form.Item>

            <Form.Item required label="品牌" name="brand"
                rules={[
                    {
                        required: true,
                        message: '請選擇品牌!',
                    },
                ]}
            >
                <Select
                    placeholder="請選擇品牌。。。"
                    options={[{ label: 'KFC', value: 'KFC' }, { label: 'Pizzahut', value: 'Pizzahut' }]} />
            </Form.Item>

            <Form.Item required label="優惠券ID" name="sl_coupon_id"
                rules={[
                    {
                        required: true,
                        message: '請輸入優惠券ID!',
                    },
                ]}
            >
                <Input placeholder="請輸入優惠券ID。。。" />
            </Form.Item>

            <Form.Item required label="獎品數量" name="amount"
                rules={[
                    {
                        required: true,
                        message: '請輸入獎品數量!',
                    },
                ]}
            >
                <InputNumber  placeholder="請輸入獎品數量。。。" />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={page === "new" ?<PlusOutlined /> : <EditOutlined />} size='large'>{page === "new" ?  "新增" : "編輯"}</Button>
            </Form.Item>
        </Form>
    );

  return (
      <>
          {contextHolder}

          {
              page === "table" ?
                  <>
                      {
                          type === "edit" ?
                              <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { setPage("new"); }}>
                                  新增獎品
                              </Button>
                              : null
                      }
                    
                    <Table columns={columns} dataSource={activityGiftList} loading={loading} onChange={onChange}></Table>
                </>
                : formTable
          }
          

          <ModalShow
              title="預覽"
              formTable={formTable}
              open={open}
              page='activity'
              handleOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={onCancel}>
          </ModalShow>
      </>
  );
}

export default ActivityGift;