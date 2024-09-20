import React, { useState, useEffect } from 'react';
import { ArrowRightOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Upload,
    Divider,
    Typography
} from 'antd';
const { Title, Text } = Typography;

const ViewSetting = ({ form, onStepChange, win_image, no_win_image, cd_image, prize_image, setPrize_image,
    item_image, setItem_image, uploadButton, getFile, beforeUpload, handlePreview, handleChange, save }) => {

    const onFinish = (values) => {
        console.log('步骤 3:', values);
        onStepChange(3, values,"save");
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
                label="中獎"
                name="win_image"
                getValueFromEvent={getFile}
                extra="※請上傳480x624圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={win_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "win_image")}
                >
                    {win_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="未中獎"
                name="no_win_image"
                getValueFromEvent={getFile}
                extra="※請上傳1536x1248圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={no_win_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "no_win_image")}
                >
                    {no_win_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                label="冷卻中"
                name="cd_image"
                getValueFromEvent={getFile}
                extra="※請上傳720x960圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={cd_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "cd_image")}
                >
                    {cd_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>
            <Form.Item required
                label="轉軸圖"
                name="item_image"
                getValueFromEvent={getFile}
                extra="※請上傳160x3072圖示"
            >
                <Upload
                    listType="picture-card"
                    fileList={item_image}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={(e) => handleChange(e, "item_image")}
                >
                    {item_image.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>
            <br></br>
            <Divider ></Divider>
            <br></br>
            <Title level={3}>獎項設定</Title>
            {
                prize_image.map((value, index) => (
                    <>
                        {
                            index !== 0 ?
                                (
                                    <div style={{flex:1,display:'flex',justifyContent:'flex-end'} }>
                                        <Button danger style={{ color: 'red' }} shape="circle" icon={<DeleteOutlined />}
                                            onClick={() => {
                                                setPrize_image(prize_image.filter((fileValue, fileIndex) => fileIndex !== index))
                                            }}
                                        >
                                        </Button>
                                    </div>
                                ) : null
                        }
                        <Form.Item required
                            label="獎品名稱"
                            name={`prize_name${index}` }
                            rules={[
                                {
                                    required: true,
                                    message: '請輸入獎品名稱!',
                                },
                            ]}
                        >
                            <Input placeholder="請輸入獎品名稱。。。" />
                        </Form.Item>

                        <Form.Item required
                            label="獎品ID"
                            name={`coupon_id${index}` }
                            rules={[
                                {
                                    required: true,
                                    message: '請輸入獎品ID!',
                                },
                            ]}
                        >
                            <Input placeholder="請輸入獎品ID。。。" />
                        </Form.Item>

                        <Form.Item required
                            label="獎品數量"
                            name={`prize_amount${index}` }
                            rules={[
                                {
                                    required: true,
                                    message: '請輸入獎品數量!',
                                },
                            ]}
                        >
                            <Input placeholder="請輸入獎品數量。。。" />
                        </Form.Item>

                        <Form.Item required
                            label="品牌"
                            name={`brand${index}` }
                            rules={[
                                {
                                    required: true,
                                    message: '請選擇品牌!',
                                },
                            ]}
                        >
                            <Select placeholder="請選擇品牌。。。" options={[{ label: 'Kfc', value: 'Kfc' }, { label: 'Pizzahut', value: 'Pizzahut' }]} />
                        </Form.Item>

                        {/*<Form.Item required
                            label="轉軸圖"
                            name={`item_image${index}`}
                            getValueFromEvent={getFile}
                            extra="※請上傳169x256圖示"
                        >
                            <Upload
                                listType="picture-card"
                                fileList={item_image[index]}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={(e) => handleChange(e, "item_image", index)}
                            >
                                {item_image[index].length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>*/}

                        <Form.Item required
                            label="得獎圖"
                            name={`prize_image${index}`}
                            getValueFromEvent={getFile}
                            extra="※請上傳400x400圖示"
                        >
                            <Upload
                                listType="picture-card"
                                fileList={prize_image[index]}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                onChange={(e) => handleChange(e, "prize_image",index)}
                            >
                                {prize_image[index].length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>

                        <Divider ></Divider>

                        {
                            index === prize_image.length - 1 ? (<Button style={{ color: 'green' }} shape="round" icon={<PlusOutlined />}
                                onClick={() => {
                                    setPrize_image([...prize_image, []])
                                   /* setItem_image([...item_image, []])*/
                                }}>新增獎品</Button>)
                                : null
                        }
                    </>
                ))
            }

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button style={{ marginLeft: 8 }} shape="round" icon={<ArrowLeftOutlined />}
                    onClick={() => {
                        onStepChange(2);
                    }}>上一步</Button>
                <Button type="primary"
                    htmlType="submit"
                    shape="round"
                    icon={<ArrowRightOutlined />}
                    size='large'
                >
                    完成
                </Button>

            </Form.Item>
        </Form>
    );
};

export default ViewSetting;