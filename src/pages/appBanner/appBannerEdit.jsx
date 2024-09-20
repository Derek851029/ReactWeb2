import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined, MenuOutlined, TagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Select,
    Modal,
    DatePicker,
    Typography,
    message,
    Breadcrumb,
    Upload,
    Menu,
    Divider,
    Transfer,
    Col
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl'
const { Title } = Typography;
const { RangePicker } = DatePicker;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const items = [
    {
        label: '基本資料',
        key: 'info',
        icon: <MenuOutlined />,
    },
    {
        label: '標籤',
        key: 'tag',
        icon: <TagOutlined />,
    }
]

const AppBannerEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { bannerID } = useParams()
    const state = location.state.type

    const [form] = Form.useForm();

    const [current, setCurrent] = useState('info');

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()
    const [videoData, setVideoData] = useState(null)

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [tagsData, setTagsData] = useState([])
    const [targetKeys, setTargetKeys] = useState([]);

    useEffect(() => {
        getData()

        const tagsData = async () => {
            //搭配 await 等待兩個 API 都取得回應後才繼續
            const data = await Promise.all([
                getTags(),
                getBannerTags(),
            ]);

            tagsInfo(data)
        };

        tagsData()

        if (state === 'view') setFormShowDisable(true)
    }, [])

    const getData = () => {
        fetch('/api/banner?type=edit&id=' + bannerID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const bannerData = data[0]
                const start_time = dayjs(bannerData.start_time * 1000).format('YYYY-MM-DD HH:MM:ss')
                const end_time = dayjs(bannerData.end_time * 1000).format('YYYY-MM-DD HH:MM:ss')
                const created = dayjs(bannerData.created * 1000).format('YYYY-MM-DD')

                form.setFieldsValue({
                    status: bannerData.status,
                    brand: bannerData.brand,
                    title: bannerData.title,
                    click_type: bannerData.click_type,
                    click_value: bannerData.click_value,
                    time: [dayjs(start_time), dayjs(end_time)],
                    createDate: dayjs(created),
                })

                if (bannerData.image_fid > 0) {
                    getFilesData(bannerData.image_fid, 'image')
                }

                if (bannerData.video_fid > 0) {
                    getFilesData(bannerData.video_fid, 'icon')
                }
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getTags = () => {
        return fetch('/api/tags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                return data
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getBannerTags = () => {
        return fetch('/api/banner' + '?type=tags&id=' + bannerID + '', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                return data

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getFilesData = (fid, type) => {
        fetch('/api/file?fid=' + fid, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                var filesData = data
                /* console.log(filesData)*/
                if (type === 'image') {
                    setFileList([{
                        uid: '1',
                        name: filesData.file_name,
                        status: 'done',
                        url: filesData.file_path,
                    }])
                }

                if (type === 'icon') {
                    setFileList2([{
                        uid: '1',
                        name: filesData.file_name,
                        status: 'done',
                        url: filesData.file_path,
                    }])
                }

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const tagsInfo = (tagsData) => {
        const tags = tagsData[0]
        const banner = tagsData[1]

        const tempData = []
        const tempTargetData = []

        tags.forEach((value, index, array) => {
            if (banner[index]) {
                console.log(1, banner[index].tag_id)
                tempTargetData.push(banner[index].tag_id)
            }

            const data = {
                key: value.tag_id,
                title: value.tag_title,
            }
            tempData.push(data)
        })

        setTagsData(tempData)
        setTargetKeys(tempTargetData)
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        if (values.video != undefined) {
            if (fileList2.length > 0) {
                values.video = values.video[0].originFileObj
                setVideoData(values.video) //因為JSON.stringify會影響到form file, 單獨處理
            }
        }
        

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
        formData.video = JSON.stringify(formData.video) //因為JSON.stringify會影響到form file, 在這才處理 upload file額外處理
        fetch('/api/banner', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', BannerID: bannerID })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                if (videoData != null) {
                    saveVideo(data)
                }
                messageBox("success", "編輯首頁輪播成功!")
            })
            .catch(error => {
                messageBox("error", "編輯首頁輪播失敗!")
                console.error('Unable to add item.', error)
            });
    };

    const saveVideo = (app_banner_id) => {
        console.log(videoData)
        const formFileData = new FormData()
        formFileData.append("formFile", videoData)
        formFileData.append("page", 'app_banner')
        formFileData.append("dataID", app_banner_id)
        formFileData.append("type", 'video')

        fetch('../api/file', {
            method: 'POST',
            body: formFileData
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {

            })
            .catch(error => {
                console.error('Unable to add item.', error)
            });
        setOpen(false);
        setConfirmLoading(false);
    }

    const saveTags = () => {
        const bannerTags = {
            TagsData: ''
        }

        if (targetKeys.length != 0) {
            bannerTags.TagsData = targetKeys.toString()
        }

        console.log(targetKeys)
        fetch('/api/banner', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(bannerTags), Type: 'tags', bannerID: bannerID })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                messageBox("success", "標籤儲存成功!")
                console.log(data)
            })
            .catch(error => {
                messageBox("error", "標籤儲存失敗!")
                console.error('Unable to add item.', error)
            });
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
                        setFormShowDisable(false)
                        /*navigate("/appBanner/list", { replace: true })*/
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

    const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

    const transferChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
    };

    const transfereSearch = (dir, value) => {
        /*console.log('search:', dir, value);*/
    };

    const transferTags = (
        <>
            <Transfer
                dataSource={tagsData}
                showSearch
                filterOption={filterOption}
                targetKeys={targetKeys}
                onChange={transferChange}
                onSearch={transfereSearch}
                render={(item) => item.title}
                listStyle={{ width: '80%', height: 500 }}
            />
            <Divider />
            <Col span={8} offset={11}>
                <Button type="primary" shape="round" icon={<CheckCircleOutlined />} size='large' onClick={() => { saveTags() }}>儲存</Button>
            </Col>
        </>
    )

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
                    maxLength={128}
                    placeholder="請輸入名稱。。。"
                />
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
                label="圖示"
                name="activity_image"
                getValueFromEvent={getFile}
                extra="※請上傳1280x720圖示"
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
                <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} size='large'>編輯</Button>
            </Form.Item>
        </Form>
    )

    const menuOnClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>編輯首頁輪播</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/appBanner/list'>首頁輪播</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯</Breadcrumb.Item>
            </Breadcrumb>

            <Divider />

            <Menu
                onClick={menuOnClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{ fontSize: 20 }}
            >
            </Menu>

            <Divider />

            {current == 'info' ?
                formTable
                : transferTags
            }

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
                page='appBanner'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    )
}
export default AppBannerEdit