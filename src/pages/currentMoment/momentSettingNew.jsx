import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Typography,
    message,
    Breadcrumb,
    Checkbox,
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;

const MomentSettingNew = () => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const weekOptions = [
        {
            label: '星期一',
            value: '1',
        },
        {
            label: '星期二',
            value: '2',
        },
        {
            label: '星期三',
            value: '3',
        },
        {
            label: '星期四',
            value: '4',
        },
        {
            label: '星期五',
            value: '5',
        },
        {
            label: '星期六',
            value: '6',
        },
        {
            label: '星期日',
            value: '7',
        },
    ];

    const timeOptions = [
        {
            label: '00:00 ~ 00:59',
            value: '1',
        },
        {
            label: '01:00 ~ 01:59',
            value: '2',
        },
        {
            label: '02:00 ~ 02:59',
            value: '3',
        },
        {
            label: '03:00 ~ 03:59',
            value: '4',
        },
        {
            label: '04:00 ~ 04:59',
            value: '5',
        },
        {
            label: '05:00 ~ 05:59',
            value: '6',
        },
        {
            label: '06:00 ~ 06:59',
            value: '7',
        },
        {
            label: '07:00 ~ 07:59',
            value: '8',
        },
        {
            label: '08:00 ~ 08:59',
            value: '9',
        },
        {
            label: '09:00 ~ 09:59',
            value: '10',
        },
        {
            label: '10:00 ~ 10:59',
            value: '11',
        },
        {
            label: '11:00 ~ 11:59',
            value: '12',
        },
        {
            label: '12:00 ~ 12:59',
            value: '13',
        },
        {
            label: '13:00 ~ 13:59',
            value: '14',
        },
        {
            label: '14:00 ~ 14:59',
            value: '15',
        },
        {
            label: '15:00 ~ 15:59',
            value: '16',
        },
        {
            label: '16:00 ~ 16:59',
            value: '17',
        },
        {
            label: '17:00 ~ 17:59',
            value: '18',
        },
        {
            label: '18:00 ~ 18:59',
            value: '19',
        },
        {
            label: '19:00 ~ 19:59',
            value: '20',
        },
        {
            label: '20:00 ~ 20:59',
            value: '21',
        },
        {
            label: '21:00 ~ 21:59',
            value: '22',
        },
        {
            label: '22:00 ~ 22:59',
            value: '23',
        },
        {
            label: '23:00 ~ 23:59',
            value: '24',
        },
    ];

    useEffect(() => {
        form.setFieldsValue({
            createDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        })
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values)
        setFormShowDisable(true)
        setOpen(true)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOk = () => {

        setConfirmLoading(true);

        fetch('../api/momentsetting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'new' })
        })
        .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
        .then(data => {
            setOpen(false);
            setConfirmLoading(false);
            messageBox("success", "新增當下時刻時段成功!")
            console.log(data)
        })
        .catch(error => {
            messageBox("error", "新增當下時刻時段失敗!")
            console.error('Unable to add item.', error)
        });
    };

    const onCancel = () => {
        setFormShowDisable(false)
        setOpen(false)
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
                        navigate("/currentMoment/list", { replace: true })
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
            <Form.Item required label="時段名稱" name="name"
                rules={[
                    {
                        required: true,
                        message: '請輸入時段名稱!',
                    },
                ]}
            >
                <Input placeholder="請輸入時段名稱。。。" />
            </Form.Item>

            <Form.Item required label="星期" name="week"
                rules={[
                    {
                        required: true,
                        message: '請選擇星期!',
                    },
                ]}
            >
                <Checkbox.Group options={weekOptions} />
            </Form.Item>

            <Form.Item required label="時段" name="time"
                rules={[
                    {
                        required: true,
                        message: '請選擇時段!',
                    },
                ]}>
                <Checkbox.Group style={{ display: 'grid' }} options={timeOptions} />
                
            </Form.Item>

            <Form.Item label="建立日期" name="createDate">
                <DatePicker disabled />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<PlusOutlined />} size='large'>新增</Button>
            </Form.Item>
        </Form>
    )
    return (
        <>
            {contextHolder}
            <Title level={2}>新增當下時刻時段</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/currentMoment/list'>當下時刻時段</Link></Breadcrumb.Item>
                <Breadcrumb.Item>新增</Breadcrumb.Item>
            </Breadcrumb>
            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='momentSetting'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    )
}

export default MomentSettingNew