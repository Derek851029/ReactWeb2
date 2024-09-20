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
    Select,
    InputNumber
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;
const { TextArea } = Input;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const AppMessageNew = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()
    const [videoData, setVideoData] = useState()

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [videoFileList, setVideoFileList] = useState([]);
    const [pushFileList, setPushFileList] = useState([]);
    const [coverFileList, setCoverFileList] = useState([]);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            createDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        })
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);

        if (fileList.length > 0) {
            values.activity_image = JSON.stringify(values.activity_image)
        }
        else {
            messageBox('error', "請上傳活動圖示!")
            return
        }

        if (coverFileList.length > 0) {
            values.cover_image = JSON.stringify(values.cover_image)
        }
        else {
            values.cover_image = undefined;
        }

        if (videoFileList.length > 0) {
            values.video = values.video[0].originFileObj;
            setVideoData(values.video); //因為JSON.stringify會影響到form file, 單獨處理
        }
        else {
            values.video = undefined
        }

        if (pushFileList.length > 0) {
            values.app_image = JSON.stringify(values.app_image);
        }
        else {
            values.app_image = undefined
        }

        setFormData(values)
        setFormShowDisable(true)
        setOpen(true)
    };

    const handleOk = () => {
        setConfirmLoading(true);
        formData.video = JSON.stringify(formData.video) //因為JSON.stringify會影響到form file, 在這才處理 upload file額外處理
        fetch('../api/message', {
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
                if (videoFileList.length > 0) {
                    saveVideo(data)
                }
                messageBox("success", "新增自訂訊息成功!")
            })
            .catch(error => {
                messageBox("error", "新增自訂訊息失敗!")
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
                        navigate("/appMessage/list", { replace: true })
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
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                setVideoFileList([]);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj);
                setVideoFileList(newFileList);
            }
        }
        else {
            setVideoFileList(newFileList);
        }
        
    }

    const handleChange3 = async ({ fileList: newFileList }) => {
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                setPushFileList([]);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj);
                setPushFileList(newFileList);
            }
        }
        else {
            setPushFileList(newFileList);
        }
        
    }

    const handleChange4 = async({ fileList: newFileList }) => {
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                setCoverFileList([]);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj);
                setCoverFileList(newFileList);
            }
        }
        else {
            setCoverFileList(newFileList);
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


            <Form.Item required
                label="推播圖示"
                name="app_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={pushFileList}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={handleChange3}
                >
                    {pushFileList.length >= 1 ? null : uploadButton}
                </Upload>
                    

                
            </Form.Item>

            <Form.Item required label="訊息維持數" name="keep_time"
                rules={[
                    {
                        required: true,
                        message: '請輸入訊息維持數!',
                    },
                ]}>
                <InputNumber />
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
                label="蓋版圖片"
                name="cover_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={coverFileList}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={handleChange4}
                >
                    {coverFileList.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item
                label="影片"
                name="video"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={videoFileList}
                    beforeUpload={beforeUploadVideo}
                    onPreview={handlePreview}
                    onChange={handleChange2}
                >
                    {videoFileList.length >= 1 ? null : uploadVideo}
                </Upload>
            </Form.Item>

            <Form.Item label="點擊按鈕文字" name="click_title" initialValue="">
                <Input placeholder="請輸入點擊按鈕文字。。。" />
            </Form.Item>

            <Form.Item label="點擊事件" name="click_type" initialValue=''>
                <Select placeholder="請選擇點擊事件。。。"
                    options=
                    {[
                        { label: '無', value: '' },
                        { label: '開啟連結至外部瀏覽器', value: 'outWebView' },
                        { label: '開啟連結至內崁瀏覽器', value: 'toWebView' },
                        { label: '到指定最新消息', value: 'toNews' },
                        { label: '到指定活動', value: 'toActivity' },
                        { label: '到商品券', value: 'toVoucherProducts' },
                    ]} />
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
                新增自訂訊息</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appMessage/list'>自訂訊息</Link></Breadcrumb.Item>
                <Breadcrumb.Item>新增自訂訊息</Breadcrumb.Item>
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

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>

            
        </>
    )
}

export default AppMessageNew