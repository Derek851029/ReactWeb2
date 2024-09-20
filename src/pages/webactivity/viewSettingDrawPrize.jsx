import React, { useState, useEffect } from 'react';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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

const ViewSettingDrawPrize = ({ form, onStepChange, start_image, background_image, title_image, content_image,
    uploadButton, getFile, beforeUpload, handlePreview, handleChange }) => {
    const onFinish = (values) => {
        console.log('步骤 2:', values);
        onStepChange(2, values);
    };

    const onFail = (e) => {
        console.log("error:", e);
    };

    return (
        <Form
            form={form}
            name="step2"
            size='large'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
            onFinishFailed={onFail}
        >
            <Form.Item required
                label="網站底色"
                name="background_color"
                rules={[
                    {
                        required: true,
                        message: '請輸入網站底色!',
                    },
                ]}
            >
                <Input placeholder="請輸入網站底色。。。" />
            </Form.Item>

            <Form.Item required label="網站文字色" name="font_color"
                rules={[
                    {
                        required: true,
                        message: '請輸入網站文字色!',
                    },
                ]}
            >
                <Input placeholder="請輸入網站文字色。。。" />
            </Form.Item>

            <Form.Item required label="活動說明區－底色" name="content_background_color"
                rules={[
                    {
                        required: true,
                        message: '請輸入活動說明區－底色!',
                    },
                ]}
            >
                <Input placeholder="請輸入活動說明區－底色。。。" />
            </Form.Item>

            <Form.Item required label="活動說明區－文字色" name="content_font_color"
                rules={[
                    {
                        required: true,
                        message: '請輸入活動說明區－文字色!',
                    },
                ]}
            >
                <Input placeholder="請輸入活動說明區－文字色。。。" />
            </Form.Item>

            <Form.Item required
                label="遊戲開始圖"
                name="start_image"
                getValueFromEvent={getFile}
                extra="※請上傳720x960圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={start_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "start_image")}
                >
                    {start_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="遊戲背景圖"
                name="background_image"
                getValueFromEvent={getFile}
                extra="※請上傳1536x1248圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={background_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "background_image")}
                >
                    {background_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="遊戲標題圖"
                name="title_image"
                getValueFromEvent={getFile}
                extra="※請上傳720x960圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={title_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "title_image")}
                >
                    {title_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="遊戲抽籤圖"
                name="content_image"
                getValueFromEvent={getFile}
                extra="※請上傳600x600px圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={content_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "content_image")}
                >
                    {content_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button style={{ marginLeft: 8 }} shape="round" icon={<ArrowLeftOutlined />}
                    onClick={() => {
                        onStepChange(0);
                    }}>上一步</Button>
                <Button type="primary" htmlType="submit" shape="round" icon={<ArrowRightOutlined />} size='large'>下一步</Button>

            </Form.Item>
        </Form>
    );
};

export default ViewSettingDrawPrize;