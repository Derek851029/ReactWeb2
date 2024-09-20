import React, { useState, useEffect } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Upload,
    Radio,
    InputNumber
} from 'antd';
const { RangePicker } = DatePicker;

const InfoSetting = ({ form, onStepChange, activity_image, uploadButton, getFile, beforeUpload, handlePreview, handleChange }) => {
    const onFinish = (values) => {
        console.log('步骤 1:', values);
        onStepChange(1, values); 
    };

    return (
        <Form
            form={form}
            name="step1"
            size='large'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
        >
            <Form.Item required
                label="活動類型"
                name="activity_type"
                rules={[
                    {
                        required: true,
                        message: '請選擇活動類型!',
                    },
                ]}
            >
                <Select placeholder="請選擇活動類型。。。" options={[{ label: '抽抽樂', value: 'DrawPrize' }, { label: '拉霸', value: 'Slots' }, { label: '問答', value: 'Quiz' }]} />
            </Form.Item>

            <Form.Item required label="活動標題" name="title"
                rules={[
                    {
                        required: true,
                        message: '請輸入活動標題!',
                    },
                ]}
            >
                <Input placeholder="請輸入活動標題。。。" />
            </Form.Item>

            <Form.Item required
                label="可遊玩對象"
                name="play_target"
                rules={[
                    {
                        required: true,
                        message: '請選擇可遊玩對象!',
                    },
                ]}
            >
                <Select placeholder="請選擇可遊玩對象。。。" options={[{ label: '不限定', value: '1' }, { label: '限定會員', value: '2' }, { label: '限定部分會員', value: '3' }]} />
            </Form.Item>

            <Form.Item required
                label="是否免費遊玩"
                name="is_free"
                rules={[
                    {
                        required: true,
                        message: '請選擇是否免費遊玩!',
                    },
                ]}
            >
                <Radio.Group value={1}>
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item required
                label="間隔時數(小時)"
                name="play_interval"
                rules={[
                    {
                        required: true,
                        message: '請輸入間隔時數!',
                    },
                ]}>
                <InputNumber />
            </Form.Item>

            <Form.Item required
                label="中獎機率"
                name="chance"
                rules={[
                    {
                        required: true,
                        message: '請輸入中獎機率!',
                    },
                ]}>
                <InputNumber />
            </Form.Item>

            <Form.Item required
                label="活動區間"
                name="time"
                rules={[
                    {
                        required: true,
                        message: '請選擇活動區間間!',
                    },
                ]}>
                <RangePicker showTime />
            </Form.Item>

            

            <Form.Item required
                label="活動圖示"
                name="Activity_image"
                getValueFromEvent={getFile}
                extra="※請上傳1360x512圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={activity_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e,"activity_image")}
                >
                    {activity_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<ArrowRightOutlined />} size='large'>下一步</Button>
            </Form.Item>
        </Form>
    );
};

export default InfoSetting;