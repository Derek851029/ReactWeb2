import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Modal,
    DatePicker,
    TimePicker,
    Typography,
    message,
    Breadcrumb,
    Upload,
    Select,
    InputNumber,
    Checkbox
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'HH:mm';

const StoreNew = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);


    const [storeTypeOpts, setStoreTypeOpts] = useState(
        [
            { label: '餐廳', value: '6' },
            { label: '簡易型門市', value: '7' },
            { label: '外帶外送門市', value: '8' },
            { label: '歡樂吧', value: '9' },
            { label: 'Express', value: '13' },
            { label: 'SCVS', value: '14' },
        ]
    )

    const serviceOpts = [
        {
            label: '早餐',
            value: '1',
        },
        {
            label: '車道',
            value: '2',
        },
        {
            label: '外送',
            value: '3',
        },
        {
            label: '預定快取',
            value: '10',
        },
        {
            label: '外帶',
            value: '11',
        },
        {
            label: '內用',
            value: '12',
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

    const handleOk = () => {
        setConfirmLoading(true);
        const data = { ...formData }
        const openTimes = {
            text: data.store_text ?? "",
            time: [
                {
                    week: "1",
                    start: dayjs(data.mon[0]).format('HH:mm'),
                    end: dayjs(data.mon[1]).format('HH:mm'),
                },
                {
                    week: "2",
                    start: dayjs(data.tues[0]).format('HH:mm'),
                    end: dayjs(data.tues[1]).format('HH:mm'),
                },
                {
                    week: "3",
                    start: dayjs(data.wed[0]).format('HH:mm'),
                    end: dayjs(data.wed[1]).format('HH:mm'),
                },
                {
                    week: "4",
                    start: dayjs(data.thur[0]).format('HH:mm'),
                    end: dayjs(data.thur[1]).format('HH:mm'),
                },
                {
                    week: "5",
                    start: dayjs(data.fri[0]).format('HH:mm'),
                    end: dayjs(data.fri[1]).format('HH:mm'),
                },
                {
                    week: "6",
                    start: dayjs(data.sat[0]).format('HH:mm'),
                    end: dayjs(data.sat[1]).format('HH:mm'),
                },
                {
                    week: "7",
                    start: dayjs(data.sun[0]).format('HH:mm'),
                    end: dayjs(data.sun[1]).format('HH:mm'),
                },

            ]
        }
        data.open_times_json = JSON.stringify(openTimes)
        data.store_service_json = data.store_service_json.toString()
        console.log(data)
        fetch('../api/store', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(data), type: 'new' })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);

                messageBox("success", "新增門市成功!")
            })
            .catch(error => {
                messageBox("error", "新增門市失敗!")
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
                        navigate("/store/list", { replace: true })
                    }
                });
                break;
        }

    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('請上傳 JPG/PNG 類型檔案!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('照片尺寸需小於 2MB!');
        }

        return isJpgOrPng && isLt2M;
    };

    const beforeUploadVideo = (file) => {
        const isJpgOrPng = file.type === 'video/mp4' || file.type === 'video/mp3' || file.type === 'video/mov';
        if (!isJpgOrPng) {
            message.error('請上傳 MP4/MP3/MOV 類型檔案!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('影片尺寸需小於 10MB!');
        }

        return isJpgOrPng && isLt2M;
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
            <Form.Item required label="是否發佈" name="status"
                rules={[
                    {
                        required: true,
                        message: '請選擇是否發佈!',
                    },
                ]}
            >
                <Select placeholder="請選擇是否發佈。。。" options={[{ label: '發佈', value: 1 }, { label: '不發佈', value: 0 }]} />
            </Form.Item>

            <Form.Item required label="選擇品牌" name="brand"
                rules={[
                    {
                        required: true,
                        message: '請選擇品牌!',
                    },
                ]}
            >
                <Select placeholder="請選擇品牌。。。" options={[{ label: 'KFC', value: 'Kfc' }, { label: 'Pizzahut', value: 'Pizzahut' }]} />
            </Form.Item>

            <Form.Item required label="門市類別" name="store_type_json"
                rules={[
                    {
                        required: true,
                        message: '請選擇門市類別!',
                    },
                ]}
            >
                <Select placeholder="請選擇門市類別。。。" options={storeTypeOpts} />
            </Form.Item>

            <Form.Item required label="門市名稱" name="store_name"
                rules={[
                    {
                        required: true,
                        message: '請輸入門市名稱!',
                    },
                ]}>
                <Input placeholder="請輸入門市名稱。。。" />
            </Form.Item>

            <Form.Item required label="門市代號" name="store_code"
                rules={[
                    {
                        required: true,
                        message: '請輸入門市代號!',
                    },
                ]}>
                <Input placeholder="請輸入門市代號。。。" />
            </Form.Item>

            <Form.Item label="門市電話" name="store_phone" >
                <Input placeholder="請輸入門市電話。。。" />
            </Form.Item>

            <Form.Item required label="門市地址" name="store_addr"
                rules={[
                    {
                        required: true,
                        message: '請輸入門市地址!',
                    },
                ]}>
                <Input placeholder="請輸入門市地址。。。" />
            </Form.Item>

            <Form.Item label="地址簡述" name="store_addr_desc">
                <TextArea placeholder="請輸入地址簡述。。。" />
            </Form.Item>

            <Form.Item label="門市服務" name="store_service_json" >
                <Checkbox.Group style={{ display: 'grid' }} options={serviceOpts} />

            </Form.Item>

            <Form.Item label="座位" name="store_seat" >
                <Input placeholder="請輸入座位。。。" />
            </Form.Item>

            <Form.Item required label="經度" name="longitude"
                rules={[
                    {
                        required: true,
                        message: '請輸入門市經度!',
                    },
                ]}>
                <Input placeholder="請輸入門市經度。。。" />
            </Form.Item>

            <Form.Item required label="緯度" name="latitude"
                rules={[
                    {
                        required: true,
                        message: '請輸入門市緯度!',
                    },
                ]}>
                <Input placeholder="請輸入門市緯度。。。" />
            </Form.Item>

            <Form.Item label="營業時間簡述" name="store_text" >
                <TextArea placeholder="請輸入營業時間簡述。。。" />
            </Form.Item>

            <Form.Item required label="星期一" name="mon"
                rules={[
                    {
                        required: true,
                        message: '請選擇星期一時間區間!',
                    },
                ]}
            >
                <TimePicker.RangePicker
                    format={dateFormat}

                    showTime={{
                        format: dateFormat,
                        hideDisabledOptions: true,
                    }}

                />
            </Form.Item>

            <Form.Item required label="星期二" name="tues"
                rules={[
                    {
                        required: true,
                        message: '請選擇星期二時間區間!',
                    },
                ]}
            >
                <TimePicker.RangePicker
                    format={dateFormat}

                    showTime={{
                        format: dateFormat,
                        hideDisabledOptions: true,
                    }}

                />
            </Form.Item>

            <Form.Item required label="星期三" name="wed"
                rules={[
                    {
                        required: true,
                        message: '請選擇星期三時間區間!',
                    },
                ]}
            >
                <TimePicker.RangePicker
                    format={dateFormat}

                    showTime={{
                        format: dateFormat,
                        hideDisabledOptions: true,
                    }}

                />
            </Form.Item>

            <Form.Item required label="星期四" name="thur"
                rules={[
                    {
                        required: true,
                        message: '請選擇星期四時間區間!',
                    },
                ]}
            >
                <TimePicker.RangePicker
                    format={dateFormat}

                    showTime={{
                        format: dateFormat,
                        hideDisabledOptions: true,
                    }}

                />
            </Form.Item>

            <Form.Item required label="星期五" name="fri"
                rules={[
                    {
                        required: true,
                        message: '請選擇星期五時間區間!',
                    },
                ]}
            >
                <TimePicker.RangePicker
                    format={dateFormat}

                    showTime={{
                        format: dateFormat,
                        hideDisabledOptions: true,
                    }}

                />
            </Form.Item>

            <Form.Item required label="星期六" name="sat"
                rules={[
                    {
                        required: true,
                        message: '請選擇星期六時間區間!',
                    },
                ]}
            >
                <TimePicker.RangePicker
                    format={dateFormat}

                    showTime={{
                        format: dateFormat,
                        hideDisabledOptions: true,
                    }}

                />
            </Form.Item>

            <Form.Item required label="星期日" name="sun"
                rules={[
                    {
                        required: true,
                        message: '請選擇星期日時間區間!',
                    },
                ]}
            >
                <TimePicker.RangePicker
                    format={dateFormat}

                    showTime={{
                        format: dateFormat,
                        hideDisabledOptions: true,
                    }}

                />
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

    return(
        <>
            {contextHolder}
            <Title level={2}>新增門市</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/store/list'>門市列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>新增門市</Breadcrumb.Item>
            </Breadcrumb>

            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='appMessage'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    )
}

export default StoreNew;