import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { EditOutlined, MenuOutlined, TagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Typography,
    message,
    Breadcrumb,
    Select,
    Menu,
    Divider,
    Transfer,
    Col,
    InputNumber
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;

const RedeemCouponEdit = () => {
    const navigate = useNavigate();
    const location = useLocation()

    const state = location.state.type
    const { redeemCouponID } = useParams();
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [current, setCurrent] = useState('info');

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [dataInfo, setDataInfo] = useState(null)
    const [tagsData, setTagsData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);

    const [statusOpts, setStatusOpts] = useState([
        { label: '發佈', value: 1 },
        { label: '不發佈', value: 0 },
    ]);

    const [typeOpts, setTypeOpts] = useState([
        { label: '商品券', value: 'product' },
        { label: '現金券', value: 'cash' },
    ]);

    const [brandOpts, setBrandOpts] = useState([
        { label: 'KFC', value: 'KFC' },
        { label: 'Pizzahut', value: 'Pizzahut' },
    ])

    const [sortweightOpts, setSortweightOpts] = useState(
        Array.from({ length: 100 }, (_, index) => ({
            label: String(index + 1),
            value: index + 1,
        }))
    )

    const items = [
        {
            label: '基本資料',
            key: 'info',
            icon: <MenuOutlined />,
        },
        {
            label: '標籤',
            key: 'tag',
            icon: <TagOutlined />,
        }
    ]

    useEffect(() => {
        getData();

        const tagsData = async () => {
            //搭配 await 等待兩個 API 都取得回應後才繼續
            const data = await Promise.all([
                getTags(),
                getRedeemCouponTags(),
            ]);

            tagsInfo(data);
        };

        tagsData()

        if (state === 'view') setFormShowDisable(true)
    }, [])

    const getData = () => {
        fetch('/api/redeemcoupon?type=edit&id=' + redeemCouponID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const redeemCouponData = data[0];
                const created = dayjs(redeemCouponData.created * 1000).format('YYYY-MM-DD');

                form.setFieldsValue({
                    app_redeem_coupon_id: redeemCouponData.app_redeem_coupon_id,
                    status: redeemCouponData.status,
                    brand: redeemCouponData.brand,
                    type: redeemCouponData.type,
                    point: redeemCouponData.point,
                    sl_coupon_id: redeemCouponData.sl_coupon_id,
                    sortweight: redeemCouponData.sortweight,
                    createDate: dayjs(created),
                });

                setDataInfo(redeemCouponData);
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getTags = () => {
        return fetch('/api/tags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data;
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getRedeemCouponTags = () => {
        return fetch('/api/redeemcoupon' + '?type=tags&id=' + redeemCouponID + '', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data;

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const tagsInfo = (tagsData) => {
        const tags = tagsData[0];
        const news = tagsData[1];

        const tempData = [];
        const tempTargetData = [];

        tags.forEach((value, index, array) => {
            if (news[index]) {
                console.log(1, news[index].tag_id);
                tempTargetData.push(news[index].tag_id);
            }

            const data = {
                key: value.tag_id,
                title: value.tag_title,
            };
            tempData.push(data);
        });

        setTagsData(tempData);
        setTargetKeys(tempTargetData);
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/redeemcoupon', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', RedeemCouponID: redeemCouponID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);

                messageBox("success", "編輯點數兌換成功!");
            })
            .catch(error => {
                messageBox("error", "編輯點數兌換失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const saveTags = () => {
        const newsTags = {
            TagsData: ''
        };

        if (targetKeys.length != 0) {
            newsTags.TagsData = targetKeys.toString();
        }

        console.log(targetKeys);
        fetch('/api/redeemcoupon', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(newsTags), Type: 'tags', RedeemCouponID: redeemCouponID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "標籤儲存成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "標籤儲存失敗!");
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
                        /*navigate("/redeemcoupon/list", { replace: true });*/
                    }
                });
                break;
        }

    };

    const menuOnClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

    const transferChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
    };

    const transfereSearch = (dir, value) => {
        /*console.log('search:', dir, value);*/
    };

    const transferTags = (
        <>
            <Transfer
                dataSource={tagsData}
                showSearch
                filterOption={filterOption}
                targetKeys={targetKeys}
                onChange={transferChange}
                onSearch={transfereSearch}
                render={(item) => item.title}
                listStyle={{ width: '80%', height: 500 }}
            />
            <Divider />
            <Col span={8} offset={11}>
                <Button type="primary" shape="round" icon={<CheckCircleOutlined />} size='large' onClick={() => { saveTags(); }}>儲存</Button>
            </Col>
        </>
    )

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
            <Form.Item required label="是否發佈" name="status"
                rules={[
                    {
                        required: true,
                        message: '請選擇是否發佈!',
                    },
                ]}
            >
                <Select placeholder="請選擇是否發佈。。。" options={statusOpts} />
            </Form.Item>

            <Form.Item label="排序" name="sortweight"
                rules={[
                    {
                        required: true,
                        message: '請選擇排序!',
                    },
                ]}
            >
                <Select placeholder="請選擇排序。。。" options={sortweightOpts} />
            </Form.Item>

            <Form.Item required label="點數" name="point"
                rules={[
                    {
                        required: true,
                        message: '請輸入點數!',
                    },
                ]}
            >
                <InputNumber placeholder="請輸入點數。。。" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="類型" name="type"
                rules={[
                    {
                        required: true,
                        message: '請選擇類型!',
                    },
                ]}
            >
                <Select placeholder="請選擇類型。。。" options={typeOpts} />
            </Form.Item>

            <Form.Item label="品牌" name="brand"
                rules={[
                    {
                        required: true,
                        message: '請選擇品牌!',
                    },
                ]}
            >
                <Select placeholder="請選擇品牌。。。" options={brandOpts} />
            </Form.Item>

            <Form.Item label="優惠券ID" name="sl_coupon_id"
                rules={[
                    {
                        required: true,
                        message: '請輸入優惠券ID!',
                    },
                ]}
            >
                <Input placeholder="請輸入優惠券ID。。。" />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} size='large'>編輯</Button>
            </Form.Item>
        </Form>
    )

    return (
        <>
            {contextHolder}
            <Title level={2}>
                編輯點數兌換</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/redeemcoupon/list'>點數兌換列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯點數兌換</Breadcrumb.Item>
            </Breadcrumb>

            <Menu
                onClick={menuOnClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{ fontSize: 20 }}
            >
            </Menu>

            <Divider />

            {current == 'info' ?
                formTable
                : transferTags
            }

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='redeemcoupon'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
}

export default RedeemCouponEdit;