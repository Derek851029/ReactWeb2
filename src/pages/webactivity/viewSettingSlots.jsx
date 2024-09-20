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

const ViewSettingSlots = ({ form, onStepChange, footer_image, slotsfooter_image, drawbar_image, tip_image,
    slotsframe_image, slotsDrawbarBall_image,uploadButton, getFile, beforeUpload, handlePreview, handleChange }) => {
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
                label="遊戲底圖"
                name="footer_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={footer_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "footer_image")}
                >
                    {footer_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="機台底圖"
                name="slotsfooter_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={slotsfooter_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "slotsfooter_image")}
                >
                    {slotsfooter_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="機台拉桿"
                name="drawbar_image"
                getValueFromEvent={getFile}
                extra="※請上傳720x960圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={drawbar_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "drawbar_image")}
                >
                    {drawbar_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="點選提示"
                name="tip_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={tip_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "tip_image")}
                >
                    {tip_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="機台邊框圖"
                name="slotsframe_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={slotsframe_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "slotsframe_image")}
                >
                    {slotsframe_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="機台拉桿球"
                name="slotsDrawbarBall_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={slotsDrawbarBall_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "slotsDrawbarBall_image")}
                >
                    {slotsDrawbarBall_image.length >= 1 ? null : uploadButton}
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

export default ViewSettingSlots;