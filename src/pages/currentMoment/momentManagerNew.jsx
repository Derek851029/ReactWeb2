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
const { Title } = Typography;
const { RangePicker } = DatePicker;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const MomentManagerNew = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()
    const [currentMomentList, setCurrentMomentList] = useState([])

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        getCurrentMoment()
        form.setFieldsValue({
            createDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        })
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);
        console.log(fileList)

        if (fileList.length > 0) {
            values.activity_image = JSON.stringify(values.activity_image)
            setFormData(values)
            setFormShowDisable(true)
            setOpen(true)
        }
        else {
            messageBox('error', "請上傳活動圖示!")
            return
        }
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('../api/momentmanager', {
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
            messageBox("success", "新增當下時刻活動成功!")
            console.log(data)
        })
        .catch(error => {
            messageBox("error", "新增當下時刻活動失敗!")
            console.error('Unable to add item.', error)
        });
    };

    const onCancel = () => {
        setFormShowDisable(false)
        setOpen(false)
    }

    const getCurrentMoment = () => {
        fetch('../api/momentsetting?id=0', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                var momentData = []
                console.log(data)
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        label: value.name,
                        value: value.app_moment_id
                    }

                    momentData.push(jsonObject)
                })
                /*        console.log(caseData)*/
                setCurrentMomentList(momentData)

            })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const selectOnChange = (value) => {
        console.log(`selected ${value}`);
    };
    const selectOnSearch = (value) => {
        console.log('search:', value);
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
        console.log(newFileList);
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
    };

    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

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
                        navigate("/momentManager/list", { replace: true })
                    }
                });
                break;
        }

    }

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
            <Form.Item required label="時段名稱" name="moment_id"
                rules={[
                    {
                        required: true,
                        message: '請選擇時段名稱!',
                    },
                ]}
            >
                <Select
                    showSearch
                    placeholder="請選擇時段名稱。。。"
                    optionFilterProp="children"
                    onChange={selectOnChange}
                    onSearch={selectOnSearch}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={currentMomentList}
                />
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

            <Form.Item required label="當下時刻活動名稱" name="act_title"
                rules={[
                    {
                        required: true,
                        message: '請輸入當下時刻活動名稱!',
                    },
                ]}
            >
                <Input placeholder="請輸入當下時刻活動名稱。。。" />
            </Form.Item>

            <Form.Item required label="當下時刻標題"
                name="app_moment_title"
                extra="※前台會顯示"
                rules={[
                    {
                        required: true,
                        message: '請輸入當下時刻標題!',
                    },
                ]}
            >
                <Input
                    showCount
                    maxLength={20}
                    placeholder="請輸入當下時刻標題。。。"
                />
            </Form.Item>

            <Form.Item label="當下時刻副標題"
                name="app_moment_sub_title"
                extra="※前台會顯示"
                rules={[
                    {
                        message: '請輸入當下時刻副標題!',
                    },
                ]}>
                <Input
                    showCount
                    maxLength={30}
                    placeholder="請輸入當下時刻副標題。。。"
                />
            </Form.Item>

            <Form.Item required label="活動區間" name="time"
                rules={[
                    {
                        required: true,
                        message: '請選擇活動區間間!',
                    },
                ]}>
                <RangePicker showTime />
            </Form.Item>

            <Form.Item required label="商品連結" name="product_url"
                rules={[
                    {
                        required: true,
                        message: '請輸入商品連結!',
                    },
                ]}>
                <Input placeholder="請輸入商品連結。。。" />
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
            <Title level={2}>新增當下時刻活動</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/momentManager/list'>當下時刻</Link></Breadcrumb.Item>
                <Breadcrumb.Item>新增</Breadcrumb.Item>
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
                page='momentManager'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default MomentManagerNew