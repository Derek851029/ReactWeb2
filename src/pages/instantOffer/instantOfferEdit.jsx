import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { PlusOutlined, CheckCircleOutlined, EditOutlined, MenuOutlined, TagOutlined } from '@ant-design/icons';
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
    InputNumber,
    Divider,
    Col,
    Menu,
    Transfer
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

const InstantofferEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { instantOfferID } = useParams()
    const [messageApi, contextHolder] = message.useMessage();
    const state = location.state.type

    const [form] = Form.useForm();

    const [current, setCurrent] = useState('info');

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

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
                getInstantOfferTags(),
            ]);

            tagsInfo(data)
        };

        tagsData()

        if (state === 'view') setFormShowDisable(true)
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);

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
        console.log(formData)
        fetch('/api/instantoffer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', app_instant_offer_id: instantOfferID })
        })
        .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
        .then(data => {
            setOpen(false);
            setConfirmLoading(false);
            messageBox("success", "編輯熱銷推薦成功!")
            console.log(data)
        })
        .catch(error => {
            messageBox("error", "編輯熱銷推薦失敗!")
            console.error('Unable to add item.', error)
        });
    };

    const onCancel = () => {
        setFormShowDisable(false)
        setOpen(false)
    }

    const getData = () => {
        console.log(instantOfferID)
        fetch('/api/instantoffer?type=edit&id=' + instantOfferID, {
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
                var instantOfferData = data[0]
                const start_time = dayjs(instantOfferData.start_time * 1000).format('YYYY-MM-DD HH:MM:ss')
                const end_time = dayjs(instantOfferData.end_time * 1000).format('YYYY-MM-DD HH:MM:ss')
                const created = dayjs(instantOfferData.created * 1000).format('YYYY-MM-DD')
                console.log(data)
                form.setFieldsValue({
                    brand: instantOfferData.brand,
                    app_instant_offer_name: instantOfferData.app_instant_offer_name,
                    app_instant_offer_title: instantOfferData.app_instant_offer_title,
                    app_instant_offer_sub_title: instantOfferData.app_instant_offer_sub_title,
                    time: [dayjs(start_time), dayjs(end_time)],
                    time_frequency: instantOfferData.time_frequency,
                    min_sales: instantOfferData.min_sales,
                    product_url: instantOfferData.product_url,
                    push_title: instantOfferData.push_title,
                    createDate: dayjs(created),
                })
                if (instantOfferData.image_fid > 0) {
                    getFilesData(instantOfferData.image_fid, 'image')
                }
            })
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
                /* console.log(filesData)*/
                if (type === 'image') {
                    setFileList([{
                        uid: '1',
                        name: filesData.file_name,
                        status: 'done',
                        url: filesData.file_path,
                    }])
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
        .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
        .then(data => {
            return data
        })
        .catch(error => console.error('Unable to add item.', error));
    }

    const getInstantOfferTags = () => {
        return fetch('/api/instantoffer' + '?type=tags&id=' + instantOfferID + '', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data
                //const tempData = []

                //data.forEach((value, index, array) => {
                //    const data = {
                //        key: value.tag_id,
                //        title: value.tag_title,
                //    };
                //    tempData.push(data)
                //})

                //setTagsData(tempData)

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const saveTags = () => {
        const momentActivityTags = {
            TagsData: ''
        }

        if (targetKeys.length != 0) {
            momentActivityTags.TagsData = targetKeys.toString()
        }

        console.log(targetKeys)
        fetch('/api/instantoffer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(momentActivityTags), Type: 'tags', app_instant_offer_id: instantOfferID })
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

    const tagsInfo = (tagsData) => {
        const tags = tagsData[0]
        const instantOffer = tagsData[1]

        const tempData = []
        const tempTargetData = []

        tags.forEach((value, index, array) => {
            if (instantOffer[index]) {
                console.log(1, instantOffer[index].tag_id)
                tempTargetData.push(instantOffer[index].tag_id)
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

    const menuOnClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

    const transferChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
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
                      /*  navigate("/instantoffer/list", { replace: true })*/
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
            <Form.Item required label="熱銷推薦名稱" name="app_instant_offer_name"
                rules={[
                    {
                        required: true,
                        message: '請輸入熱銷推薦名稱!',
                    },
                ]}
            >
                <Input placeholder="請輸入熱銷推薦名稱。。。" />
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

            <Form.Item required label="熱銷推薦標題" name="app_instant_offer_title"
                rules={[
                    {
                        required: true,
                        message: '請輸入熱銷推薦標題!',
                    },
                ]}
            >
                <Input
                    showCount
                    maxLength={20}
                    placeholder="請輸入熱銷推薦標題。。。"
                />
            </Form.Item>

            <Form.Item label="熱銷推薦副標題" name="app_instant_offer_sub_title"
                rules={[
                    {
                        message: '請輸入熱銷推薦副標題!',
                    },
                ]}>
                <Input
                    showCount
                    maxLength={20}
                    placeholder="請輸入熱銷推薦副標題。。。"
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

            <Form.Item required label="時間頻率(分鐘)" name="time_frequency"
                rules={[
                    {
                        required: true,
                        message: '請輸入時間頻率!',
                    },
                ]}>
                <InputNumber addonBefore="每" addonAfter="分鐘" />
            </Form.Item>

            <Form.Item required label="最低銷售量" name="min_sales"
                rules={[
                    {
                        required: true,
                        message: '請輸入最低銷售量!',
                    },
                ]}>
                <InputNumber />
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
                <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} size='large'>編輯</Button>
            </Form.Item>
        </Form>
    )

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

    return (
        <>
            {contextHolder}
            <Title level={2}>編輯即時優惠</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/instantoffer/list'>即時優惠</Link></Breadcrumb.Item>
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
                page='momentActivity'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default InstantofferEdit