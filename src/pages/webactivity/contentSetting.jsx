import React, { useState, useEffect } from 'react';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Upload,
} from 'antd';
import CKEditorComponent from '../../shared/CKEditor';
const { TextArea } = Input;

const ContentSetting = ({ form, onStepChange, draw_image, contentData, setContentData,
    uploadButton, getFile, beforeUpload, handlePreview, handleChange }) => {


    const onFinish = (values) => {
        const activity_type = form.getFieldValue().activity_type;
        const stepNum = activity_type === "Quiz" ? 3 : 4;
        console.log();
        console.log('步骤 3:', values);
        onStepChange(stepNum, values);
    };

    return (
        <Form
            form={form}
            name="step3"
            size='large'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
        >
            <Form.Item required
                label="活動標題"
                name="draw_title"
                rules={[
                    {
                        required: true,
                        message: '請輸入活動標題!',
                    },
                ]}
            >
                <Input placeholder="請輸入活動標題。。。" />
            </Form.Item>

            <Form.Item required label="活動說明" name="draw_content"
                rules={[
                    {
                        required: true,
                        message: '請輸入活動說明!',
                    },
                ]}
            >
                <TextArea rows={4} placeholder="請輸入活動說明。。。" />
            </Form.Item>

            <Form.Item required label="注意事項" name="draw_note"
                rules={[
                    {
                        required: true,
                        message: '請輸入注意事項!',
                    },
                ]}
            >
                <CKEditorComponent form={form} contentData={contentData} setContentData={setContentData} ></CKEditorComponent>
            </Form.Item>

            <Form.Item required
                label="活動圖"
                name="draw_image"
                getValueFromEvent={getFile}
                extra="※請上傳1280x720圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={draw_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "draw_image")}
                >
                    {draw_image.length >= 1 ? null : uploadButton}
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
                        onStepChange(1);
                    }}>上一步</Button>
                <Button type="primary" htmlType="submit" shape="round" icon={<ArrowRightOutlined />} size='large'>下一步</Button>
            </Form.Item>
        </Form>
    );
};

export default ContentSetting;