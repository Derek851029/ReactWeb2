import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined, MenuOutlined, TagOutlined, CheckCircleOutlined, UserOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
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
    Col,
    InputNumber,
    Spin
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl'
const { Title } = Typography;
const { TextArea } = Input;

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
    },
    {
        label: '標籤推播投遞',
        key: 'tagPush',
        icon: <TagOutlined />,
    },
    {
        label: '會員推播投遞',
        key: 'memberPush',
        icon: <UserOutlined />,
    },
    {
        label: 'Csv推播投遞',
        key: 'csvPush',
        icon: <FileOutlined />,
    },
]

const AppMessageEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { messageID } = useParams()
    const [form] = Form.useForm();
    const state = location.state.type
    const version = location.state.version

    const [dataInfo, setDataInfo] = useState(null)

    const [current, setCurrent] = useState('info');

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()
    const [videoData, setVideoData] = useState(null)

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);
    const [videoFileList, setVideoFileList] = useState([]);
    const [pushFileList, setPushFileList] = useState([]);
    const [coverFileList, setCoverFileList] = useState([]);
    const [csvFileList, setCsvFileList] = useState([]);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [spinLoading, setSpinLoading] = useState(false)

    const [tagsData, setTagsData] = useState([])
    const [targetKeys, setTargetKeys] = useState([]);

    const [tagsPushData, setTagsPushData] = useState([])
    const [tagsPushTargetKeys, setTagsPushTargetKeys] = useState([])

    const [memberPushData, setMemberPushData] = useState([])
    const [memberPushTargetKeys, setMemberPushTargetKeys] = useState([])

    useEffect(() => {
        setSpinLoading(true)
        getData()

        const waitData = async () => {
            //搭配 await 等待兩個 API 都取得回應後才繼續
            const data = await Promise.all([
                getTags(),
                getMessageTags(),
                getDeliveryPush(),
                getMember(),
            ]);

            waitDataSetting(data)
            console.log(data)
            setSpinLoading(false)
        };

        waitData()
        
        
        if (state === 'view') setFormShowDisable(true)
    }, [])

    const getData = () => {
        const url = state === 'view' ?
            `/api/message?type=editVersion&id=${messageID}&version=${version}`
            : `/api/message?type=edit&id=${messageID}`
        console.log(url)
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const messageData = data[0]
                const created = dayjs(messageData.created * 1000).format('YYYY-MM-DD')
                console.log(messageData)
                form.setFieldsValue({
                    status: messageData.status,
                    type: messageData.type,
                    brand: messageData.brand,
                    title: messageData.title,
                    content: messageData.content,
                    keep_time: messageData.keep_time,
                    click_title: messageData.click_title,
                    click_type: messageData.click_type,
                    click_value: messageData.click_value,
                    createDate: dayjs(created),
                })
                
                if (messageData.icon_fid > 0) {
                    getFilesData(messageData.icon_fid, 'icon')
                }

                if (messageData.image_fid > 0) {
                    getFilesData(messageData.image_fid, 'image')
                }

                if (messageData.cover_image_fid > 0) {
                    getFilesData(messageData.cover_image_fid, 'cover')
                }

                if (messageData.video_fid > 0) {
                    getFilesData(messageData.video_fid, 'video')
                }
                setDataInfo(messageData)
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
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getMessageTags = () => {
        return fetch('/api/message' + '?type=tags&id=' + messageID + '', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getDeliveryPush = () => {
        return fetch('/api/deliverypush' + '?type=AppMessage&id=' + messageID + '', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const deliveryPushData = data[0]
                return deliveryPushData
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getMember = () => {
        return fetch('/api/member?type=list&id=0', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data
                console.log(data)

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
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                var filesData = data
                console.log(filesData.file_path)
                /* console.log(filesData)*/
                if (type === 'image') {
                    setFileList([{
                        uid: '1',
                        name: filesData.file_name,
                        status: 'done',
                        url: filesData.file_path,
                    }])
                }

                if (type === 'video') {
                    setVideoFileList([{
                        uid: '1',
                        name: filesData.file_name,
                        status: 'done',
                        url: filesData.file_path,
                    }])
                }

                if (type === 'icon') {
                    setPushFileList([{
                        uid: '1',
                        name: filesData.file_name,
                        status: 'done',
                        url: filesData.file_path,
                    }])
                }

                if (type === 'cover') {
                    setCoverFileList([{
                        uid: '1',
                        name: filesData.file_name,
                        status: 'done',
                        url: filesData.file_path,
                    }])
                }
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const waitDataSetting = (data) => {
        const tags = data[0]
        const message = data[1]
        const deliveryPush = data[2]
        const member = data[3]

        const tempData = []
        const tempTargetData = []

        const memberData = []

        //tags
        tags.forEach((value, index, array) => {
            if (message[index]) {
                console.log(1, message[index].tag_id)
                tempTargetData.push(message[index].tag_id)
            }

            const data = {
                key: value.tag_id,
                title: value.tag_title,
            }
            tempData.push(data)
        })

        setTagsPushData(tempData)
        setTagsData(tempData)
        setTargetKeys(tempTargetData)

        //tagPush
        deliveryPush ? setTagsPushTargetKeys(JSON.parse(deliveryPush.tag_json)) : setTagsPushTargetKeys([])

        //memberPush
        member.forEach((value, index, array) => {

            const data = {
                key: value.mid,
                title: value.pk_id,
            }
            memberData.push(data)
        })
        setMemberPushData(memberData)
        deliveryPush ? setMemberPushTargetKeys(JSON.parse(deliveryPush.member_json)) : setMemberPushTargetKeys([])
    }

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

    const handleOk = () => {
        setConfirmLoading(true);
        formData.video = JSON.stringify(formData.video) //因為JSON.stringify會影響到form file, 在這才處理 upload file額外處理
        fetch('/api/message', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), OriginalData: JSON.stringify(dataInfo),type: 'edit', messageID: messageID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);
                if (videoFileList.length > 0) {
                    saveVideo(data)
                }
                messageBox("success", "編輯自訂訊息成功!")
            })
            .catch(error => {
                messageBox("error", "編輯自訂訊息失敗!")
                console.error('Unable to add item.', error)
            });
    };

    const saveTags = () => {
        const messageTags = {
            TagsData: ''
        }

        if (targetKeys.length != 0) {
            messageTags.TagsData = targetKeys.toString()
        }

        console.log(targetKeys)
        fetch('/api/message', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(messageTags), Type: 'tags', messageID: messageID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
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

    const onFinish = (values) => {
        console.log(tagsPushTargetKeys)
        console.log('Success:', values);
        if (fileList.length > 0) {
            values.activity_image = JSON.stringify(values.activity_image)

        }
        else {
            messageBox('error', "請上傳活動圖示!")
            return
        }

        if (coverFileList.length > 0) {
            values.cover_image = JSON.stringify(values.cover_image);

        }
        else {
            values.cover_image = undefined
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

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onPushTimeFinish = (values) => {
        //用分頁狀態來判斷目前在哪一個頁面 (type:current)
        if (current === 'tagPush') {
            if (tagsPushTargetKeys.length > 0) {
                values.PushData = tagsPushTargetKeys.toString()
            }
            else {
                messageBox('error', '請選擇推播投遞標籤!')
                return
            }
        } else if (current === 'memberPush') {
            if (memberPushTargetKeys.length > 0) {
                values.PushData = memberPushTargetKeys.toString()
            }
            else {
                messageBox('error', '請選擇推播投遞會員!')
                return
            }
        }
        console.log('Success:', values)
        fetch('/api/message', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ DataInfo: JSON.stringify(values), type: current, messageID: messageID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "推播投遞儲存成功!")
            })
            .catch(error => {
                messageBox("error", "推播投遞失敗!")
                console.error('Unable to add item.', error)
            });
    };

    const onPushTimeFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCsvFinish = (values) => {
        console.log('Success:', values);
    };

    const onCsvFinishFailed = (errorInfo) => {
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

    const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

    const transferChange = (newTargetKeys, type) => {
        switch (type) {
            case "tags": 
                setTargetKeys(newTargetKeys);
                break;
            case "tagPush":
                setTagsPushTargetKeys(newTargetKeys)
                break;
            case "memberPush":
                setMemberPushTargetKeys(newTargetKeys)
                break;
        }
        
    };

    const transfereSearch = (dir, value) => {
        /*console.log('search:', dir, value);*/
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
                        setFormShowDisable(false)
                    /*    navigate("/appMessage/list", { replace: true })*/
                    }
                });
                break;
        }

    }

    const menuOnClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
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

    const transferTags = (
        <>
            <Transfer
                dataSource={tagsData}
                showSearch
                filterOption={filterOption}
                targetKeys={targetKeys}
                onChange={(newTargetKeys) => transferChange(newTargetKeys, 'tags')}
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

    const pushTimeForm = (
        <Form
            form={form}
            size='large'
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onPushTimeFinish}
            onFinishFailed={onPushTimeFinishFailed}
        >
            <Form.Item required label="開始推播時間" name="pushTime"
                rules={[
                    {
                        required: true,
                        message: '請選擇開始推播時間!',
                    },
                ]}
            >
                <DatePicker showTime></DatePicker>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 11,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<CheckCircleOutlined />} size='large'> 儲存</Button>
            </Form.Item>
        </Form>
    )

    const tagPushComponent = (
        <>
            <Transfer
                dataSource={tagsPushData}
                showSearch
                filterOption={filterOption}
                targetKeys={tagsPushTargetKeys}
                onChange={(newTargetKeys) => transferChange(newTargetKeys, 'tagPush')}
                onSearch={transfereSearch}
                render={(item) => item.title}
                listStyle={{ width: '80%', height: 500 }}
            />
            <Divider />

            {pushTimeForm}
        </>
    )

    const memberPushComponent = (
        <>
            <Transfer
                dataSource={memberPushData}
                showSearch
                filterOption={filterOption}
                targetKeys={memberPushTargetKeys}
                onChange={(newTargetKeys) => transferChange(newTargetKeys, 'memberPush')}
                onSearch={transfereSearch}
                render={(item) => item.title}
                listStyle={{ width: '80%', height: 500 }}
            />
            <Divider />

            {pushTimeForm}
        </>
    )

    const csvPushComponent = (
        <Form
            form={form}
            size='large'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={onCsvFinish}
            onFinishFailed={onCsvFinishFailed}
        >
            <Form.Item required label="開始推播時間" name="push_time"
                rules={[
                    {
                        required: true,
                        message: '請選擇開始推播時間!',
                    },
                ]}
            >
                <DatePicker showTime></DatePicker>
            </Form.Item>

            <Form.Item required
                label="Csv"
                name="csv_file"
                getValueFromEvent={getFile}
            >
                <Upload
                    name='file'
                >
                    <Button icon={<UploadOutlined />}>上傳Csv</Button>
                </Upload>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" shape="round" icon={<CheckCircleOutlined />} size='large'> 儲存</Button>
            </Form.Item>
        </Form>
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
                <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} size='large'> 編輯</Button>
            </Form.Item>
        </Form>
    )

    return (
        <>
            
            <Spin tip="Loading" size="large" spinning={spinLoading }>
                {contextHolder}
                <Title level={2}>編輯自訂訊息</Title>
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item><Link to='/appMessage/list'>自訂訊息</Link></Breadcrumb.Item>
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

                {
                    (() => {
                        if (current === 'info') {
                            return formTable
                        } else if (current === 'tag') {
                            return transferTags
                        } else if (current === 'tagPush') {
                            return tagPushComponent
                        } else if (current === 'memberPush') {
                            return memberPushComponent
                        } else if (current === 'csvPush') {
                            return csvPushComponent
                        }
                    })()
                }
            </Spin>
            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='appNews'
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

export default AppMessageEdit