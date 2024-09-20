import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Modal,
    DatePicker,
    Typography,
    message,
    Breadcrumb,
    Upload,
    Select
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
import { post } from '../../apis/apis';
const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const AppNewsNew = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()
    const [videoData, setVideoData] = useState()
    const [appImageNoStyle, setAppImageNoStyle] = useState(true)

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);
    const [fileList3, setFileList3] = useState([]);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [clickTypeOpts, setClickTypeOpts] = useState([
        { label: '無', value: '' },
        { label: '開啟連結至外部瀏覽器', value: 'outWebView' },
        { label: '開啟連結至內崁瀏覽器', value: 'toWebView' },
        { label: '到指定最新消息', value: 'toNews' },
        { label: '到指定活動', value: 'toActivity' },
        { label: '到商品券', value: 'toVoucherProducts' },
    ])

    useEffect(() => {
        form.setFieldsValue({
            createDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        })
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);

        if (fileList2.length > 0) {
            values.video = values.video[0].originFileObj;
            setVideoData(values.video); //因為JSON.stringify會影響到form file, 單獨處理
        }
        else {
            values.video = undefined
        }

        if (fileList.length > 0) {
            values.activity_image = JSON.stringify(values.activity_image)

        }
        else {
            messageBox('error', "請上傳活動圖示!")
            return
        }

        if (appImageNoStyle) {
            values.app_image = undefined
        }
        else {
            if (fileList3.length > 0) {
                values.app_image = JSON.stringify(values.app_image)
            }
            else {
                messageBox('error', "推播來源為後台，請上傳推播圖示!")
                return
            }
        }

        setFormData(values)
        setFormShowDisable(true)
        setOpen(true)
    };

    const handleOk = () => {
        setConfirmLoading(true);
        formData.video = JSON.stringify(formData.video) //因為JSON.stringify會影響到form file, 在這才處理 upload file額外處理

        fetch('../api/news', {
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
            if (fileList2.length > 0) {
                saveVideo(data)
            }
            messageBox("success", "新增最新消息成功!")
        })
            .catch(error => {
                setConfirmLoading(false);
            messageBox("error", "新增最新消息失敗!")
            console.error('Unable to add item.', error)
        });
    };

    const saveVideo = (app_news_id) => {
        console.log(videoData)
        const formFileData = new FormData()
        formFileData.append("formFile", videoData)
        formFileData.append("page", 'app_banner')
        formFileData.append("dataID", app_news_id)
        formFileData.append("type", 'video')

        fetch('../api/file', {
            method: 'POST',
            body: formFileData
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {

            })
            .catch(error => {
                console.error('Unable to add item.', error)
            });
        setOpen(false);
        setConfirmLoading(false);
    }

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
                        navigate("/appNews/list", { replace: true })
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
            return true;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('照片尺寸需小於 2MB!');
            return true;
        }

        return false;
    };

    const beforeUploadVideo = (file) => {
        const isVideo = file.type === 'video/mp4' || file.type === 'video/mp3' || file.type === 'video/mov';
        if (!isVideo) {
            message.error('請上傳 MP4/MP3/MOV 類型檔案!');
            return true;
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('影片尺寸需小於 10MB!');
            return true;
        }

        return false;
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = async ({ fileList: newFileList }) => {
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                setFileList([]);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj);
                setFileList(newFileList);
            }
        }
        else {
            setFileList(newFileList);
        }
    }

    const handleChange2 = async ({ fileList: newFileList }) => {
        console.log(newFileList[0].status)
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                setFileList2([]);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj);
                setFileList2(newFileList);
            }
        }
        else {
            setFileList2(newFileList);
        }
    }

    const handleChange3 = async ({ fileList: newFileList }) => {
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                setFileList3([]);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj);
                setFileList3(newFileList);
            }
        }
        else {
            setFileList3(newFileList);
        }

    }

    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                上傳圖示
            </div>
        </div>
    );

    const uploadVideo = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                上傳影片
            </div>
        </div>
    );

    const pushSourceChange = (value, option) => {
        value === 'backend' ? setAppImageNoStyle(false) : setAppImageNoStyle(true)
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

            <Form.Item required label="類型" name="type"
                rules={[
                    {
                        required: true,
                        message: '請選擇類型!',
                    },
                ]}
            >
                <Select placeholder="請選擇類型。。。" options={[{ label: '優惠訊息', value: 'discount' }, { label: '會員訊息', value: 'member' }, { label: '訂單訊息', value: 'order' }]} />
            </Form.Item>

            <Form.Item required label="品牌" name="brand"
                rules={[
                    {
                        required: true,
                        message: '請選擇品牌!',
                    },
                ]}
            >
                <Select placeholder="請選擇品牌。。。" options={[{ label: 'PK', value: 'PK' }, { label: 'KFC', value: 'KFC' }, { label: 'Pizzahut', value: 'Pizzahut' }]} />
            </Form.Item>

            <Form.Item required label="名稱" name="title"
                rules={[
                    {
                        required: true,
                        message: '請輸入名稱!',
                    },
                ]}>
                <Input
                    showCount
                    maxLength={35}
                    placeholder="請輸入名稱(35字以內)。。。"
                />
            </Form.Item>

            <Form.Item required label="內容" name="content"
                rules={[
                    {
                        required: true,
                        message: '請輸入內容!',
                    },
                ]}>
                <TextArea placeholder="請輸入內容。。。" />
            </Form.Item>

            <Form.Item required label="推播來源" name="push_source"
                rules={[
                    {
                        required: true,
                        message: '請選擇推播來源!',
                    },
                ]}>
                <Select
                    onChange={pushSourceChange }
                    placeholder="請選擇推播來源。。。"
                    options={[{ label: '無', value: 'None' },{ label: '後台', value: 'backend' }, { label: 'Braze', value: 'braze' }]} />
            </Form.Item>

            <Form.Item required
                noStyle={appImageNoStyle }
                label="推播圖示"
                name="app_image"
                getValueFromEvent={getFile}
                shouldUpdate={(prevValues, currentValues) =>
                    prevValues.push_source !== currentValues.push_source
                }
            >
                {
                    form.getFieldValue('push_source') === 'backend' ? (
                    <Upload
                        listType="picture-card"
                        fileList={fileList3}
                        beforeUpload={beforeUpload}
                        onPreview={handlePreview}
                        onChange={handleChange3}
                    >
                        {fileList3.length >= 1 ? null : uploadButton}
                    </Upload>
                    ) : null
                }
                    

                
            </Form.Item>

            <Form.Item required label="上/下架時間" name="time"
                rules={[
                    {
                        required: true,
                        message: '請選擇上/下架時間!',
                    },
                ]}>
                <RangePicker showTime />
            </Form.Item>

            <Form.Item required
                label="活動圖示"
                name="activity_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item
                label="影片"
                name="video"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={fileList2}
                    beforeUpload={beforeUploadVideo}
                    onPreview={handlePreview}
                    onChange={handleChange2}
                >
                    {fileList2.length >= 1 ? null : uploadVideo}
                </Upload>
            </Form.Item>

            <Form.Item label="點擊按鈕文字" name="click_title" initialValue="">
                <Input placeholder="請輸入點擊按鈕文字。。。" />
            </Form.Item>

            <Form.Item label="點擊事件" name="click_type" initialValue=''>
                <Select placeholder="請選擇點擊事件。。。"
                    options={clickTypeOpts} />
            </Form.Item>

            <Form.Item label="點擊事件參數" name="click_value" initialValue="">
                <Input placeholder="請輸入點擊事件參數。。。" />
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
            <Title level={2}>
                新增最新消息</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appNews/list'>最新消息</Link></Breadcrumb.Item>
                <Breadcrumb.Item>新增最新消息</Breadcrumb.Item>
            </Breadcrumb>

            {formTable}

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='news'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    )
}

export default AppNewsNew