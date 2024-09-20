import React, { useState, useEffect } from 'react';
import { useNavigate, Link,useLocation, useParams } from 'react-router-dom';
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

const SeckillEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { seckillID } = useParams()
    const state = location.state.type

    const [form] = Form.useForm();

    const [current, setCurrent] = useState('info');

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [messageApi, contextHolder] = message.useMessage();

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
                getSeckillTags(),
            ]);

            tagsInfo(data)
        };

        tagsData()

        if(state === 'view') setFormShowDisable(true)
    }, [])

    const getData = () => {
        fetch('/api/seckill', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({}), Type: 'view', seckillID: seckillID })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
        .then(data => {
            const seckillData = data
            const start_time = dayjs(seckillData.start_time * 1000).format('YYYY-MM-DD HH:MM:ss')
            const end_time = dayjs(seckillData.end_time * 1000).format('YYYY-MM-DD HH:MM:ss')
            const created = dayjs(seckillData.created * 1000).format('YYYY-MM-DD')

            form.setFieldsValue({
                brand: seckillData.brand,
                act_title: seckillData.act_title,
                app_title: seckillData.app_title,
                app_sub_title: seckillData.app_sub_title,
                time: [dayjs(start_time), dayjs(end_time)],
                product_url: seckillData.product_url,
                push_title: seckillData.push_title,
                createDate: dayjs(created),
            })

            if (seckillData.image_fid > 0) {
                getFilesData(seckillData.image_fid,'image')
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

    const getSeckillTags = () => {
        return fetch('/api/seckill' + '?type=tags&day=' + seckillID + '', {
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

    const getFilesData = (fid,type) => {
        fetch('/api/file?fid='+fid, {
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
            
        })
        .catch(error => console.error('Unable to add item.', error));
    }

    const tagsInfo = (tagsData) => {
        const tags = tagsData[0]
        const seckill = tagsData[1]

        const tempData = []
        const tempTargetData = []

        tags.forEach((value, index, array) => {
            if (seckill[index]) {
                console.log(1, seckill[index].tag_id)
                tempTargetData.push(seckill[index].tag_id)
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
        //formData.time[0] = dayjs(formData.time[0]).format("YYYY-MM-DD HH:MM:ss")
        //formData.time[1] = dayjs(formData.time[1]).format("YYYY-MM-DD HH:MM:ss")
        fetch('/api/seckill', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), Type: 'edit', SeckillID: seckillID })
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
            messageBox("success", "edit", "編輯限時秒殺成功!")
            console.log(data)
        })
        .catch(error => {
            messageBox("error", "編輯限時秒殺失敗!")
            console.error('Unable to add item.', error)
        });
    };

    const saveTags = () => {
        const seckillTags = {
            TagsData: ''
        }

        if (targetKeys.length != 0) {
            seckillTags.TagsData = targetKeys.toString()
        }

        console.log(targetKeys)
        fetch('/api/seckill', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(seckillTags), Type: 'tags',seckillID: seckillID })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                messageBox("success", "tags", "標籤儲存成功!")
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

    const messageBox = (status, type, text) => {
        switch (status) {
            case 'error':
                messageApi.open({
                    type: status,
                    content: text,
                });
                break;
            case 'success':
                messageApi.open({
                    type: status,
                    content: text,
                    onClose: () => {
                        if (type != 'tags') {
                            setOpen(false);
                            setConfirmLoading(false);
                            setFormShowDisable(false)
                          /*  navigate("/seckill/list", { replace: true })*/
                        }
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

    const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

    const transferChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
    };

    const transfereSearch = (dir, value) => {
        /*console.log('search:', dir, value);*/
    };

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
            <Form.Item required
                label="檔期名稱"
                name="act_title"
                rules={[
                    {
                        required: true,
                        message: '請輸入檔期名稱!',
                    },
                ]}
            >
                <Input placeholder="請輸入檔期名稱。。。" />
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

            <Form.Item required
                label="限時秒殺標題"
                name="app_title"
                extra="※前台會顯示"
                rules={[
                    {
                        required: true,
                        message: '請輸入限時秒殺標題!',
                    },
                ]}
            >
                <Input
                    showCount
                    maxLength={20}
                    placeholder="請輸入限時秒殺標題。。。"
                />
            </Form.Item>

            <Form.Item 
                label="限時秒殺副標題"
                name="app_sub_title"
                rules={[
                    {
                        message: '請輸入限時秒殺副標題!',
                    },
                ]}>
                <Input
                    showCount
                    maxLength={20}
                    placeholder="請輸入限時秒殺副標題。。。" />
            </Form.Item>

            <Form.Item required
                label="活動區間"
                name="time"
                rules={[
                    {
                        required: true,
                        message: '請選擇活動區間間!',
                    },
                ]}>
                <RangePicker showTime />
            </Form.Item>

            <Form.Item required
                label="商品連結"
                name="product_url"
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

    const menuOnClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>編輯限時秒殺</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/seckill/list'>限時秒殺</Link></Breadcrumb.Item>
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
                page='seckill'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default SeckillEdit