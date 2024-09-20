import React, { useState, useEffect } from 'react';
import {
    EditOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { Form, Typography, Input, Button, Breadcrumb, message } from 'antd';
import ModalShow from '../ModalControl';

const { Title, Text } = Typography;

const AppSettingUrl = (props) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();
    const [formData, setFormData] = useState()
    const [formShowDisable, setFormShowDisable] = useState(false);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [data, setData] = useState(props.data)

    useEffect(() => {
        initData();
    }, [props.data]);

    const initData = () => {
        data.forEach((value, index) => {
            form.setFieldsValue({
                [value.setting_key]: value.setting_value,
            })
        })       
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        setFormData(values);
        setFormShowDisable(true);
        setOpen(true)
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/appsetting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', SettingKey: props.settingKey })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                messageBox("success", "編輯相關網址設定成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "編輯相關網址設定失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        setFormShowDisable(false);
        setOpen(false);
    }

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
                        navigate("/appsetting/list", { replace: true });
                    }
                });
                break;
        }

    }

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
            <Form.Item required label="肯德基入口站" name="order_card_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基入口站!',
                    },
                ]}
            >
                <Input placeholder="請輸入肯德基入口站。。。" />
            </Form.Item>

            <Form.Item required label="必勝客入口站" name="order_card_pizzahut"
                rules={[
                    {
                        required: true,
                        message: '請輸入必勝客入口站!',
                    },
                ]}
            >
                <Input placeholder="請輸入必勝客入口站。。。" />
            </Form.Item>

            <Form.Item required label="肯德基訂餐網址" name="online_order_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基訂餐網址!',
                    },
                ]}
            >
                <Input placeholder="請輸入肯德基訂餐網址。。。" />
            </Form.Item>

            <Form.Item required label="必勝客訂餐網址" name="online_order_pizzahut"
                rules={[
                    {
                        required: true,
                        message: '請輸入必勝客訂餐網址!',
                    },
                ]}>
                <Input placeholder="請輸入必勝客訂餐網址。。。" />
            </Form.Item>

            <Form.Item required label="肯德基外帶網址" name="store_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基外帶網址!',
                    },
                ]}>
                <Input placeholder="請輸入肯德基外帶網址。。。" />
            </Form.Item>

            <Form.Item required label="必勝客外帶網址" name="store_pizzahut"
                rules={[
                    {
                        required: true,
                        message: '請輸入必勝客外帶網址!',
                    },
                ]}>
                <Input placeholder="請輸入必勝客外帶網址。。。" />
            </Form.Item>

            <Form.Item required label="肯德基外送網址" name="delivery_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基外送網址!',
                    },
                ]}>
                <Input placeholder="請輸入肯德基外送網址。。。" />
            </Form.Item>

            <Form.Item required label="肯德基訂餐歷史網址" name="order_history_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基訂餐歷史網址!',
                    },
                ]}>
                <Input placeholder="請輸入肯德基訂餐歷史網址。。。" />
            </Form.Item>

            <Form.Item required label="必勝客訂餐歷史網址" name="order_history_pizzahut"
                rules={[
                    {
                        required: true,
                        message: '請輸入必勝客訂餐歷史網址!',
                    },
                ]}>
                <Input placeholder="請輸入必勝客訂餐歷史網址。。。" />
            </Form.Item>

            <Form.Item required label="肯德基訂餐設定網址" name="order_setting_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基訂餐設定網址!',
                    },
                ]}>
                <Input placeholder="請輸入肯德基訂餐設定網址。。。" />
            </Form.Item>

            <Form.Item required label="必勝客訂餐設定網址" name="order_setting_pizzahut"
                rules={[
                    {
                        required: true,
                        message: '請輸入必勝客訂餐設定網址!',
                    },
                ]}>
                <Input placeholder="請輸入必勝客訂餐設定網址。。。" />
            </Form.Item>

            <Form.Item required label="肯德基優惠券線上兌換網址" name="redeem_coupon_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基優惠券線上兌換網址!',
                    },
                ]}>
                <Input placeholder="請輸入肯德基優惠券線上兌換網址。。。" />
            </Form.Item>

            <Form.Item required label="必勝客優惠券線上兌換網址" name="redeem_coupon_pizzahut"
                rules={[
                    {
                        required: true,
                        message: '請輸入必勝客優惠券線上兌換網址!',
                    },
                ]}>
                <Input placeholder="請輸入必勝客優惠券線上兌換網址。。。" />
            </Form.Item>

            <Form.Item required label="肯德基點數線上兌換網址" name="redeem_offer_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基點數線上兌換網址!',
                    },
                ]}>
                <Input placeholder="請輸入肯德基點數線上兌換網址。。。" />
            </Form.Item>

            <Form.Item required label="必勝客點數線上兌換網址" name="redeem_offer_pizzahut"
                rules={[
                    {
                        required: true,
                        message: '請輸入必勝客點數線上兌換網址!',
                    },
                ]}>
                <Input placeholder="請輸入必勝客點數線上兌換網址。。。" />
            </Form.Item>

            <Form.Item required label="肯德基商品券線上兌換網址" name="redeem_commodity_kfc"
                rules={[
                    {
                        required: true,
                        message: '請輸入肯德基商品券線上兌換網址!',
                    },
                ]}>
                <Input placeholder="請輸入肯德基商品券線上兌換網址。。。" />
            </Form.Item>

            <Form.Item required label="必勝客商品券線上兌換網址" name="redeem_commodity_pizzahut"
                rules={[
                    {
                        required: true,
                        message: '請輸入必勝客商品券線上兌換網址!',
                    },
                ]}>
                <Input placeholder="請輸入必勝客商品券線上兌換網址。。。" />
            </Form.Item>

            <Form.Item required label="線上客服網址" name="chatbot"
                rules={[
                    {
                        required: true,
                        message: '請輸入線上客服網址!',
                    },
                ]}>
                <Input placeholder="請輸入線上客服網址。。。" />
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
            <Title level={2}>相關網址設定</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appsetting/list'>APP設定</Link></Breadcrumb.Item>
                <Breadcrumb.Item>相關網址設定</Breadcrumb.Item>
            </Breadcrumb>

            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='appsetting'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default AppSettingUrl;