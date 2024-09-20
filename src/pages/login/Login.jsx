import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

/* global grecaptcha */
const PsChangeForm = ({ open, onSave, onCancel }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title="設定密碼"
            okText="儲存"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onSave(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Form.Item
                    name="ps"
                    label="請輸入密碼"

                    rules={[
                        {
                            required: true,
                            message: '請輸入密碼!',
                        },
                    ]}
                >
                    <Input.Password placeholder="請輸入密碼。。。" />
                </Form.Item>

            </Form>
        </Modal>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const [aid, setAid] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const [spin, setSpin] = useState(false);
    const [psOpem, setPsOpen] = useState(false);

    const [recaptcha, setRecaptcha] = useState(true);
    const [googleToken, setgoogleToken] = useState("")

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6LeOp90nAAAAAPLJz2H1qUAUXk7rusPRwI1Knl-w';
        script.async = true;
        script.onload = handleScriptLoad;
        document.body.appendChild(script);
    }, []);

    const handleScriptLoad = () => {
     
        grecaptcha.enterprise.ready(async () => {

            const token = await grecaptcha.enterprise.execute('6LeOp90nAAAAAPLJz2H1qUAUXk7rusPRwI1Knl-w', { action: 'LOGIN' });
            console.log(token);
            setgoogleToken(token)
        });
    };

    const onFinish = (values) => {
        setSpin(true);
        fetch('api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Username: values.username, Password: values.password, GoogleToken:googleToken })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(async (data) => {
                await initLogin(data);
                setSpin(false);
            })
            .catch(error => {
                setSpin(false);
                console.error('Unable to add item.', error);
            });

        console.log('Success:', values);
    };

    const initLogin = (data) => {
        const info = data.data[0];
        console.log(data);

        switch (data.type) {
            case "Change":
                Modal.info({
                    title: '更換密碼',
                    content: '初次登入，請重新設定密碼。',
                    onOk() {
                        setPsOpen(true);
                    }
                });
                setAid(info.aid);
                break;
            case "Success":
                navigate(`/home/${info.aid}`, { replace: true });
                setAid(info.aid);
                break;
            case "Recaptcha Fail":
                messageBox("error", "機器人驗證不通過，請重新嘗試");
                break;
            default:
                messageBox("error", "使用者名稱或密碼輸入錯誤，請重新輸入");
                break;
        }
        console.log(data);
    };

    const onSave = (values) => {
        setSpin(true);
        const data = {
            Password: values.ps
        };
        fetch('api/administrator', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(data), type: 'update', aid: aid })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "密碼更改成功");
                setPsOpen(false);
                setSpin(false);
            })
            .catch(error => {
                setSpin(false);
                console.error('Unable to add item.', error);
            });

        console.log('Success:', values);
        console.log(values);
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
                });
                break;
        }

    };

    let newPromise = new Promise((resolve, reject) => {
        //const response = fetch('Test');
        //resolve(response.json())
    });

    const populateWeatherData = async () => {
        /*const response = await fetch('weatherforecast');*/
        const response = await fetch('api/menu');
        console.log(await response.json());
        console.log(await response.status);
        /*response.then(data => { console.log(data) })*/
        /*console.log(response.then(data => data))*/
        //newPromise.then((val) => {
        //    console.log("val:", val)
        //})
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onReCAPTCHAChange = (value) => {
        if (value) {
            setRecaptcha(false);
        }
        else {
            setRecaptcha(true);
        }
        console.log("Captcha value:", value);
    };

    return (
        <Spin tip="Loading" spinning={spin} style={{ marginTop: 250 }}>
            <div style={{ fwidth: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
                {contextHolder}

                <Form

                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="使用者名稱"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '請輸入使用者名稱!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密碼"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '請輸入密碼!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit" >
                            登入
                        </Button>
                    </Form.Item>
                </Form>

                <PsChangeForm
                    open={psOpem}
                    onSave={onSave}
                    onCancel={() => {
                        setPsOpen(false);
                    }}
                />
            </div>
        </Spin>
    );
};
export default Login;