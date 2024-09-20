import React, { useState, useEffect } from 'react';
import { List, Switch, Image, Typography, Breadcrumb, message, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import Bank from '../../images/app-payment/bank.png';
import LinePay from '../../images/app-payment/linepay.png';
import ApplePay from '../../images/app-payment/applepay.png';
import GooglePay from '../../images/app-payment/googlepay.png';
import JkoPay from '../../images/app-payment/jkopay.png';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Payment = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [dataInfo, setDataInfo] = useState([
        {
            payment_key: "bank",
            src: Bank,
        },
        //{
        //    payment_key: "linepay",
        //    src: LinePay,
        //},
        //{
        //    payment_key: "applepay",
        //    src: ApplePay,
        //},
        //{
        //    payment_key: "googlepay",
        //    src: GooglePay,
        //},
        //{
        //    payment_key: "jkopay",
        //    src: JkoPay,
        //},
    ]);

    useEffect(() => {
        getPayment();
    }, []);

    const getPayment = () => {
        fetch('../api/payment', {
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
                const res = data;

                setDataInfo(
                    dataInfo.map((obj) => {
                        const find = res.find((find) => obj.payment_key === find.payment_key);

                        if (find) {
                            find.status === 1 ? obj.status = true : obj.status = false;
                        }

                        return obj;
                    })
                );
            })
            .catch(err => { console.log(err); });
    };

    const onSwitchChange = (checked, key) => {
        confirm({
            title: checked ? `確定啟用${key}?` : `確定關閉${key}?`,
            icon: <ExclamationCircleFilled />,
            onOk() {
                let status = 0;
                checked ? status = 1 : status = 0;

                changeStatus(status, key);

                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('errors'));
            },
            onCancel() { },
        });
    };

    const changeStatus = (status, key) => {
        fetch('../api/payment', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status, Payment_key: key }) })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                getPayment()
                messageBox("success",status === 1 ? "啟用成功!" : "關閉成功!")
            })
            .catch(err => { console.log(err); });
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
            <Title level={2}>支付設定</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>商品券設定</Breadcrumb.Item>
                <Breadcrumb.Item>支付設定</Breadcrumb.Item>
            </Breadcrumb>
            <List
                itemLayout="horizontal"
                dataSource={dataInfo}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Image preview={false} height={150} width={300} src={item.src} />}
                        />
                        <Switch checkedChildren="啟用" unCheckedChildren="關閉" checked={item.status}
                            onChange={(checked) => { onSwitchChange(checked, item.payment_key); }}
                        />
                    </List.Item>
                )}
            />
        </>
    );
};

export default Payment;