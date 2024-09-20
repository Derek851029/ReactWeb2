import React, { useState, useEffect } from 'react';
import { ArrowRightOutlined, ArrowLeftOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Divider,
    DatePicker,
    Upload,
    Radio,
    InputNumber
} from 'antd';
const { TextArea } = Input;

const QuestionBank = ({ form, onStepChange, option_a_image, setOption_a_image, option_b_image, setOption_b_image,
    uploadButton, getFile, beforeUpload, handlePreview, handleChange }) => {
    const onFinish = (values) => {
        console.log('stepQuestion:', values);
        onStepChange(4, values);
    };

    const onFail = (e) => {
        console.log("error:", e);
    };

    return (
        <Form
            form={form}
            name="stepQuestion"
            size='large'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onFinish}
            onFinishFailed={onFail}
        >
            {
                option_a_image.map((obj, index) => (
                <>
                    {
                        index !== 0 ?
                            (
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button danger style={{ color: 'red' }} shape="circle" icon={<DeleteOutlined />}
                                        onClick={() => {
                                            setOption_a_image(option_a_image.filter((fileValue, fileIndex) => fileIndex !== index));
                                            setOption_b_image(option_b_image.filter((fileValue, fileIndex) => fileIndex !== index));
                                        }}>
                                    </Button>
                                </div>
                            ) : null
                    }
                    <Form.Item required
                        label={`題目(${index + 1})` }
                        name={`subject${index}` }
                        rules={[
                            {
                                required: true,
                                message: '請輸入題目!',
                            },
                        ]}
                    >
                        <TextArea rows={4} placeholder="請輸入題目。。。" />
                    </Form.Item>

                    <Form.Item required label="選項A" name={`option_a${index}` }
                        rules={[
                            {
                                required: true,
                                message: '請輸入選項A!',
                            },
                        ]}
                    >
                        <Input placeholder="請輸入選項A。。。" />
                    </Form.Item>

                    <Form.Item required
                        label="選項A回復圖"
                        name={`option_a_image${index}` }
                        getValueFromEvent={getFile}
                        extra="※請上傳400x160圖示"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={option_a_image[index]}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            onChange={(e) => handleChange(e, "option_a_image",index)}
                        >
                            {option_a_image[index].length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                        <Form.Item required label="選項B" name={`option_b${index}` }
                        rules={[
                            {
                                required: true,
                                message: '請輸入選項B!',
                            },
                        ]}
                    >
                        <Input placeholder="請輸入選項B。。。" />
                    </Form.Item>

                    <Form.Item required
                        label="選項B回復圖"
                        name={`option_b_image${index}` }
                        getValueFromEvent={getFile}
                        extra="※請上傳400x160圖示"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={option_b_image[index]}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            onChange={(e) => handleChange(e, "option_b_image",index)}
                        >
                            {option_b_image[index].length >= 1 ? null : uploadButton}
                        </Upload>
                        </Form.Item>

                        <Divider ></Divider>

                        {
                            index === option_a_image.length - 1 ? (<Button style={{ color: 'green' }} shape="round" icon={<PlusOutlined />}
                                onClick={() => {
                                    setOption_a_image([...option_a_image, []]);
                                    setOption_b_image([...option_b_image,[]])
                                }}>新增題目</Button>)
                                : null
                        }
                </>))
            }
            

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

export default QuestionBank;