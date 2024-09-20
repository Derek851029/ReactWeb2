import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { EditOutlined, MenuOutlined, TagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Typography,
    message,
    Breadcrumb,
    Select,
    Descriptions,
    Image,
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;
const { TextArea } = Input;

const AppContactusEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state.type;
    const { contactusID } = useParams();
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [current, setCurrent] = useState('info');

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState();

    const [dataInfo, setDataInfo] = useState({});
    const [imageURL, setImageURL] = useState("")

    const [replyStatusOpts, setReplyStatusOpts] = useState([
        { label: "未回覆", value: 1 },
        { label: "處理中", value: 2 },
        { label: "結案", value: 3 }
    ]);

    useEffect(() => {
        getData(state);

        if (state === 'view') setFormShowDisable(true);
    }, []);

    const getData = (state) => {
        let type = state === "view" ? "editVersion" : "edit"
        
        fetch(`/api/contactus?type=${type}&id=${contactusID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const contactusData = data[0];

                form.setFieldsValue({
                    reply_content: contactusData.reply_content,
                    reply_status: contactusData.reply_status,
                });

                setDataInfo(contactusData);

                if (contactusData.image_fid > 0) {
                    getFilesData(contactusData.image_fid, 'image');
                }
            })
            .catch(error => console.error('Unable to add item.', error));
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
                console.log(filesData)
                setImageURL(filesData.file_path)

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/contactus', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', ContactusID: contactusID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);

                messageBox("success", "編輯聯絡我們成功!");
            })
            .catch(error => {
                messageBox("error", "編輯聯絡我們失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onCancel = () => {
        setFormShowDisable(false);
        setOpen(false);
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
               /*         navigate("/contactus/list", { replace: true });*/
                    }
                });
                break;
        }

    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const userInfo = (
        <Descriptions title="提問人資料" bordered>
            <Descriptions.Item label="姓名">{dataInfo.name}</Descriptions.Item>
            <Descriptions.Item label="電話">{dataInfo.tel }</Descriptions.Item>
            <Descriptions.Item label="品牌">{dataInfo.brand }</Descriptions.Item>
            <Descriptions.Item label="裝置作業系統">{dataInfo.device_brand}</Descriptions.Item>
            <Descriptions.Item label="裝置作業系統版本">{dataInfo.device_version} </Descriptions.Item>
            <Descriptions.Item label="裝置品牌">{dataInfo.device_brand}</Descriptions.Item>
            <Descriptions.Item label="裝置型號">{dataInfo.device_model}</Descriptions.Item>
            <Descriptions.Item label="填表時間" span={2}>{dayjs(dataInfo.email_send_time * 1000).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
            <Descriptions.Item label="問題敘述" span={3}>{dataInfo.content}</Descriptions.Item>
            <Descriptions.Item label="圖片">
                <Image src={imageURL} width="20%" height ="20%"/>
            </Descriptions.Item>
        </Descriptions>
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
            <Form.Item required label="回覆狀態" name="reply_status"
                rules={[
                    {
                        required: true,
                        message: '請選擇回覆狀態!',
                    },
                ]}
            >
                <Select placeholder="請選擇回覆狀態。。。" options={replyStatusOpts} />
            </Form.Item>

            <Form.Item required label="回覆" name="reply_content"
                rules={[
                    {
                        required: true,
                        message: '請輸入回覆!',
                    },
                ]}
            >
                <TextArea placeholder="請輸入回覆。。。" />
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
            <Title level={2}>
                編輯聯絡我們</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/contactus/list'>聯絡我們列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯聯絡我們</Breadcrumb.Item>
            </Breadcrumb>

            {userInfo}
            <br />
            {formTable }

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='contactus'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>
        </>
    );
};

export default AppContactusEdit;