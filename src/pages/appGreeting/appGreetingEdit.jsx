import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { EditOutlined, PlusOutlined, } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Typography,
    message,
    Breadcrumb,
    DatePicker,
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { RangePicker } = DatePicker;
const dateFormat = 'HH:mm';

const { Title } = Typography;
const { TextArea } = Input;

const AppContactusEdit = () => {
    const navigate = useNavigate();

    const { greetingID } = useParams();
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState();

    const [dataInfo, setDataInfo] = useState({});

    useEffect(() => {
        if (greetingID) {
            getData();
        }

    }, []);

    const getData = () => {

        fetch(`/api/greeting?type=edit&id=${greetingID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const greetingData = data[0];
                const start_time = dayjs(greetingData.start_time * 1000).format('YYYY-MM-DD HH:mm:ss');
                const end_time = dayjs(greetingData.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');

                form.setFieldsValue({
                    greeting_name: greetingData.greeting_name,
                    time: [dayjs(start_time), dayjs(end_time)],
                });

                setDataInfo(greetingData);
            })
            .catch(error => console.error('Unable to add item.', error));
    };

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/greeting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DataInfo: JSON.stringify(formData),
                type: greetingID ? 'edit' : 'new',
                GreetingID: greetingID ?? 0
            })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                console.log(data)
                if (data === "Success") {
                    setOpen(false);
                    setConfirmLoading(false);

                    messageBox("success", greetingID ? "編輯時段問候成功!" : "新增時段問候成功!");
                }
                else {
                    messageBox("error", `已有相同時段的設定，ID:${data}`);
                    setOpen(false);
                    setConfirmLoading(false);
                    setFormShowDisable(false)
                }
                
                
            })
            .catch(error => {
                messageBox("error", greetingID ? "編輯時段問候失敗!" : "新增時段問候失敗!");
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
                        setFormShowDisable(false)
                    /*    navigate("/greeting/list", { replace: true });*/
                    }
                });
                break;
        }

    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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

            <Form.Item required label="問候文字" name="greeting_name"
                rules={[
                    {
                        required: true,
                        message: '請輸入問候文字!',
                    },
                ]}
            >
                <Input placeholder="請輸入問候文字。。。" />
            </Form.Item>

            <Form.Item required label="時間區間" name="time"
                rules={[
                    {
                        required: true,
                        message: '請輸入時間區間!',
                    },
                ]}
            >
                <RangePicker
                    format={dateFormat}

                    showTime={{
                        format: dateFormat,
                        hideDisabledOptions: true,
                    }}
 
                />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={greetingID ? <EditOutlined /> : <PlusOutlined />} size='large'>
                    {greetingID ? "編輯" : "新增"}
                </Button>
            </Form.Item>
        </Form>
    );

    return (
        <>
            {contextHolder}
            <Title level={2}>
                {greetingID ? "編輯時段問候" : "新增時段問候" }
            </Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/greeting/list'>時段問候列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯時段問候</Breadcrumb.Item>
            </Breadcrumb>

            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='greeting'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default AppContactusEdit;