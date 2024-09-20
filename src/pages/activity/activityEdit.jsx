import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation,useParams,Link } from 'react-router-dom';
import { PlusOutlined, MenuOutlined, TagOutlined, GiftOutlined, ReadOutlined, NotificationOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Input, Button, Modal, DatePicker, Typography, message, Breadcrumb, Upload, Select, InputNumber, Divider, Menu, Transfer, Col } from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
import ActivityGift from "./activityGift";
import ActivityQBank from "./activityQBank";
import DeliveryPush from "../../shared/DeliveryPush";
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


const ActivityEdit = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const type = location.state.type
    const activity = location.state.activity
    const version = location.state.version ? location.state.version : 0
    const { activityID } = useParams()

    const [current, setCurrent] = useState('info');

    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(type !== "edit" ? true : false);
    const [formData, setFormData] = useState();

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [pushIconFileList, setPushIconFileList] = useState([]);

    const [drawPrizeSettingNoStyle, setDrawPrizeSettingNoStyle] = useState(true);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [tagsData, setTagsData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);

    const items = activity === "DrawPrize" ?
        [
            {
                label: '基本資料',
                key: 'info',
                icon: <MenuOutlined />,
            },
            {
                label: '獎品',
                key: 'gift',
                icon: <GiftOutlined />,
            },
            {
                label: '標籤',
                key: 'tag',
                icon: <TagOutlined />,
            },
            {
                label: '推播投遞',
                key: 'push',
                icon: <NotificationOutlined />,
            },
        ]
        :
        [
            {
                label: '基本資料',
                key: 'info',
                icon: <MenuOutlined />,
            },
            {
                label: '獎品',
                key: 'gift',
                icon: <GiftOutlined />,
            },
            {
                label: '題庫',
                key: 'item',
                icon: <ReadOutlined />,
            },
            {
                label: '標籤',
                key: 'tag',
                icon: <TagOutlined />,
            },
            {
                label: '推播投遞',
                key: 'push',
                icon: <NotificationOutlined />,
            },
        ]

    useEffect(() => {
        getData()

        const tagsData = async () => {
            //搭配 await 等待兩個 API 都取得回應後才繼續
            const data = await Promise.all([
                getTags(),
                getActivityTags(),
            ]);

            tagsInfo(data);
        };

        tagsData()
    }, []);

    const getData = () => {
        console.log(activityID);
        fetch('/api/activity?type=' + type +'&version='+version+'&id=' + activityID, {
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
                var activitydata = data[0];
                dataInfo(activitydata)
            });
    }

    const dataInfo = (data) => {

        const start_time = dayjs(data.start_time * 1000).format('YYYY-MM-DD HH:MM:ss');
        const end_time = dayjs(data.end_time * 1000).format('YYYY-MM-DD HH:MM:ss');
        const created = dayjs(data.created * 1000).format('YYYY-MM-DD');
        console.log(data);
        form.setFieldsValue({
            activity_type: data.activity_type,
            title: data.title,
            time: [dayjs(start_time), dayjs(end_time)],
            play_interval: data.play_interval,
            description: data.description,
            cooldown_text: data.cooldown_text,
            not_winning_text: data.not_winning_text,
            push_title: data.push_title,
            chance_of_winning: data.chance_of_winning,
            is_free: data.is_free === 0 ? "否" : "是",
            createDate: dayjs(created),
        });

        if (data.activity_type === "DrawPrize") {
            setDrawPrizeSettingNoStyle(false);
        }

        if (data.icon_fid > 0) {
            getFilesData(data.icon_fid, 'icon');
        }
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
                return data;
            })
            .catch(error => console.error('Unable to add item.', error));
    };

    const getActivityTags = () => {
        return fetch('/api/activity' + '?type=tags&id=' + activityID + '', {
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
                return data;

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const saveTags = () => {
        const activityTags = {
            TagsData: ''
        };

        if (targetKeys.length != 0) {
            activityTags.TagsData = targetKeys.toString();
        }

        console.log(targetKeys);
        fetch('/api/activity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(activityTags), Type: 'tags', ActivityID: activityID })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                messageBox("success", "標籤儲存成功!","tags");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "標籤儲存失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const tagsInfo = (tagsData) => {
        const tags = tagsData[0];
        const instantOffer = tagsData[1];

        const tempData = [];
        const tempTargetData = [];

        tags.forEach((value, index, array) => {
            if (instantOffer[index]) {
                console.log(1, instantOffer[index].tag_id);
                tempTargetData.push(instantOffer[index].tag_id);
            }

            const data = {
                key: value.tag_id,
                title: value.tag_title,
            };
            tempData.push(data);
        });

        setTagsData(tempData);
        setTargetKeys(tempTargetData);
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
                var filesData = data;
                setPushIconFileList([{
                    uid: '1',
                    name: filesData.file_name,
                    status: 'done',
                    url: filesData.file_path,
                }]);

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        console.log(pushIconFileList);

        if (pushIconFileList.length > 0) {
            values.app_image = JSON.stringify(values.app_image);

        }
        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        const data = { ...formData };

        //antd 編輯set資料時, 無法選中對應的value label
        if (/^[\u4E00-\u9FFF]+$/.test(data.is_free)) data.is_free === "否" ? data.is_free = 0 : data.is_free = 1;
        setConfirmLoading(true);

        fetch('/api/activity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(data), type: 'edit', ActivityID: activityID })
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
                messageBox("success", "編輯活動成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "編輯活動失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onCancel = () => {
        setFormShowDisable(false);
        setOpen(false);
    };

    const messageBox = (type, text, page) => {
        switch (type) {
            case 'error':
                messageApi.open({
                    type: type,
                    content: text,
                    onClose: () => {
                        setOpen(false);
                        setConfirmLoading(false);
                    }
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
                        /*if (page !== "tags") { navigate("/activity/list", { replace: true }); }*/
                    }
                });
                break;
        }

    };

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
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                setPushIconFileList([]);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj);
                setPushIconFileList(newFileList);
            }
        }
        else {
            setPushIconFileList(newFileList);
        }

    };

    const activityTypeChange = (value, option) => {
        value === 'DrawPrize' ? setDrawPrizeSettingNoStyle(false) : setDrawPrizeSettingNoStyle(true);
    };

    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.pushIconFileList;
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
            <Form.Item required label="活動類型" name="activity_type"
                rules={[
                    {
                        required: true,
                        message: '請輸入活動類型!',
                    },
                ]}
            >
                <Select
                    onChange={activityTypeChange}
                    placeholder="請選擇活動類型。。。"
                    options={[{ label: '抽抽樂', value: 'DrawPrize' }, { label: '問答', value: 'Quiz' }]} />
            </Form.Item>

            <Form.Item required label="檔期名稱" name="title"
                rules={[
                    {
                        required: true,
                        message: '請輸入檔期名稱!',
                    },
                ]}
            >
                <Input placeholder="請輸入檔期名稱。。。" />
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

            <Form.Item required label="間隔日數(日)" name="play_interval"
                rules={[
                    {
                        required: true,
                        message: '請輸入間隔日數!',
                    },
                ]}>
                <InputNumber />
            </Form.Item>

            <Form.Item required label="活動介紹(150字以內)" name="description"
                rules={[
                    {
                        required: true,
                        message: '請輸入活動介紹!',
                    },
                ]}>
                <TextArea showCount maxLength={150} placeholder="請輸入活動介紹。。。" />
            </Form.Item>

            <Form.Item required label="冷卻文字(150字以內)" name="cooldown_text"
                rules={[
                    {
                        required: true,
                        message: '請輸入冷卻文字!',
                    },
                ]}>
                <TextArea showCount maxLength={150} placeholder="請輸入冷卻文字。。。" />
            </Form.Item>

            <Form.Item required label="未中獎文字(150字以內)" name="not_winning_text"
                rules={[
                    {
                        required: true,
                        message: '請輸入未中獎文字!',
                    },
                ]}>
                <TextArea showCount maxLength={150} placeholder="請輸入未中獎文字。。。" />
            </Form.Item>

            <Form.Item required label="推播文案(35字以內)" name="push_title"
                rules={[
                    {
                        required: true,
                        message: '請輸入推播文案!',
                    },
                ]}>
                <Input showCount maxLength={35} placeholder="請輸入推播文案。。。" />
            </Form.Item>

            <Form.Item
                label="推播圖示"
                name="app_image"
                getValueFromEvent={getFile}
            >
                <Upload
                    listType="picture-card"
                    fileList={pushIconFileList}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    {pushIconFileList.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item required
                noStyle={drawPrizeSettingNoStyle}
                label="中獎機率(％)"
                name="chance_of_winning"
                shouldUpdate={(prevValues, currentValues) =>
                    prevValues.activity_type !== currentValues.activity_type
                }
            >
                {
                    form.getFieldValue('activity_type') === 'DrawPrize' ? (
                        <InputNumber addonAfter="%" />
                    ) : null
                }
            </Form.Item>

            <Form.Item required label="是否免費遊玩" name="is_free"
                rules={[
                    {
                        required: true,
                        message: '請選擇是否免費遊玩!',
                    },
                ]}
            >
                <Select placeholder="請選擇是否免費遊玩。。。" options={[{ label: '否', value: '0' }, { label: '是', value: '1' }]} />
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
    );

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
                <Button type="primary" shape="round" icon={<CheckCircleOutlined />} size='large' onClick={() => { saveTags(); }}>儲存</Button>
            </Col>
        </>
    );

    return (
        <>
            {contextHolder}
            <Title level={2}>
                {type === "edit" ? "編輯活動" : "檢視版本" }-{items.map(value => { if (value.key === current) return value.label; })}
            </Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/activity/list'>活動列表</Link></Breadcrumb.Item>
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
                    let component;
                    switch (current) {
                        case "info":
                            component = formTable
                            break;
                        case "gift":
                            component = <ActivityGift id={activityID} activity={activity} type={type }></ActivityGift>;
                            break;
                        case "item":
                            component = <ActivityQBank id={activityID}></ActivityQBank>
                            break;
                        case "tag":
                            component = transferTags
                            break
                        case "push":
                            component = <DeliveryPush id={activityID} page={"AppActivity"} type={type}></DeliveryPush>
                            break;
                    }
                    console.log(component)
                    return component
                })()
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
                page='activity'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default ActivityEdit;