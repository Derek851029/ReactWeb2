import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
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
} from 'antd';
import dayjs from 'dayjs';

import ModalShow from '../ModalControl';
import VoucherInfoModal from "./voucherInfoModal";
const { Title } = Typography;
const { RangePicker } = DatePicker;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


const VoucherEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { voucherID } = useParams();
    const [form] = Form.useForm();
    const state = location.state.type;

    const [dataInfo, setDataInfo] = useState(null);

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState();

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [voucherInfo, setVoucherInfo] = useState({});
    const [voucherOpen, setVoucherOpen] = useState(false);

    const [infoData, setInfoData] = useState([]);
    const [voucherOpts, setVoucherOpts] = useState([]);


    useEffect(() => {
        initData();

        if (state === 'view') setFormShowDisable(true);
    }, []);

    const initData = async () => {
        const strolletData = await getStrollet();
        getData(strolletData);
    };

    const getData = (strolletData) => {
        fetch('/api/vouchersetting?type=edit&id=' + voucherID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const voucherData = data[0];
                const start_time = dayjs(voucherData.start_time * 1000).format('YYYY-MM-DD HH:MM:ss');
                const end_time = dayjs(voucherData.end_time * 1000).format('YYYY-MM-DD HH:MM:ss');
                const created = dayjs(voucherData.created * 1000).format('YYYY-MM-DD');
                const find = strolletData.find((item) => item.groupID === voucherData.group_id);

                form.setFieldsValue({
                    status: voucherData.status,
                    group_id: voucherData.group_id,
                    title: voucherData.title,
                    sub_title: voucherData.sub_title,
                    time: [dayjs(start_time), dayjs(end_time)],
                    createDate: dayjs(created),
                });
                console.log(find);
                if (find) {
                    setVoucherInfo(find);
                }

                if (isNaN(voucherData.image_url)) { //true無法轉數字, false可以轉數字

                    if (find) {
                        setVoucherInfo(find);
                    }

                    setFileList([{
                        uid: '1',
                        name: "ActivityImage",
                        status: 'done',
                        url: voucherData.image_url,
                    }]);

                }
                else {
                    getFilesData(voucherData.image_url, 'image');
                }

                setDataInfo(voucherData);
            })
            .catch(error => console.error('Unable to add item.', error));
    };

    const getStrollet = async () => {
        return fetch('/api/vouchersetting?type=strollet', {
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
                const voucherData = JSON.parse(data);

                setVoucherOpts(voucherData.category[0].group.map((value) => {
                    return {
                        label: value.groupName,
                        value: value.groupID
                    };
                }));
                setInfoData(voucherData.category[0].group);
                return (voucherData.category[0].group);
            })
            .catch(err => {
                console.log(err);

            });
    };

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
                console.log(filesData.file_path);
                /* console.log(filesData)*/
                if (type === 'image') {
                    setFileList([{
                        uid: '1',
                        name: filesData.file_name,
                        status: 'done',
                        url: filesData.file_path,
                    }]);
                }
            })
            .catch(error => console.error('Unable to add item.', error));
    };

    const handleOk = () => {
        setConfirmLoading(true);
        const data = { ...formData };
        data.Category_id = voucherInfo.categoryID;
        data.category_name = voucherInfo.categoryName;
        data.group_id = voucherInfo.groupID;
        data.groupDesc = voucherInfo.groupDesc;
        data.group_name = voucherInfo.groupName;

        console.log(fileList)

        if (fileList.length === 0) {
            data.image_url = voucherInfo.groupImage;
        }
        else {
            data.image_url = undefined
        }
        

        fetch('/api/vouchersetting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(data), type: 'edit', voucherID: voucherID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);

                messageBox("success", "編輯首頁隨饗券成功!");
            })
            .catch(error => {
                messageBox("error", "編輯首頁隨饗券失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onCancel = () => {
        setFormShowDisable(false);
        setOpen(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);

        if (fileList.length > 0) {
            values.activity_image = JSON.stringify(values.activity_image);
        }
        else {
            values.activity_image = undefined;
        }

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
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

    const handleChange = async({ fileList: newFileList }) => {
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                setFileList([]);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj)
                setFileList(newFileList);
            }
        }
        else {
            setFileList(newFileList);
        }

    };

    const voucherChange = (value, obj) => {
        const find = infoData.find((item) => item.groupID === value);

        if (find) {
            setVoucherInfo(find);
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
                        setFormShowDisable(false)
                    /*    navigate("/vouchersetting/list", { replace: true });*/
                    }
                });
                break;
        }

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

            <Form.Item required label="選擇隨饗券" name="group_id"
                rules={[
                    {
                        required: true,
                        message: '請選擇隨饗券!',
                    },
                ]}>

                <Select onChange={voucherChange} placeholder="請選擇隨饗券。。。" options={voucherOpts} />



            </Form.Item>
            {
                voucherInfo.groupID ?
                    <div style={{ marginLeft: '10%', marginBottom: '3%' }}>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<SearchOutlined />}
                            size='small'
                            onClick={() => { setVoucherOpen(true); }}>查看隨饗券
                        </Button>
                    </div> : null
            }


            <Form.Item required label="隨饗券標題"
                name="title"
                extra="※前台會顯示"
                rules={[
                    {
                        required: true,
                        message: '請輸入標題!',
                    },
                ]}>
                <Input
                    showCount
                    maxLength={20}
                    placeholder="請輸入隨饗券標題。。。"
                />
            </Form.Item>

            <Form.Item label="隨饗券副標題"
                name="sub_title"
                extra="※前台會顯示"
                rules={[
                    {
                        message: '請輸入副標題!',
                    },
                ]}>
                <Input
                    showCount
                    maxLength={30}
                    placeholder="請輸入隨饗券副標題。。。" />
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

            <Form.Item
                label="活動圖示"
                name="activity_image"
                getValueFromEvent={getFile}
                extra="請上傳1280x720圖示"
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
    );

    return (
        <>
            {contextHolder}
            <Title level={2}>編輯首頁隨饗券</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/vouchersetting/list'>首頁隨饗券列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯</Breadcrumb.Item>
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
                page='voucher'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>

            <VoucherInfoModal
                voucherOpen={voucherOpen}
                setVoucherOpen={setVoucherOpen}
                data={voucherInfo}
            ></VoucherInfoModal>
        </>
    );
};

export default VoucherEdit;