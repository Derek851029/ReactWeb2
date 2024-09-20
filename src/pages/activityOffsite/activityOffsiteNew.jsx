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
    InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
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

const ActivityOffsiteNew = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState();

    const [messageApi, contextHolder] = message.useMessage();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [activittyFileList, setActivityFileList] = useState([]);

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            createDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        });
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);
        console.log(activittyFileList);

        if (activittyFileList.length > 0) {
            values.activity_image = JSON.stringify(values.activity_image);

        }
        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('../api/activityOffsite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'new' })
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
                messageBox("success", "新增活動成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "新增活動失敗!");
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
                        navigate("/appMessage/list", { replace: true });
                    }
                });
                break;
        }

    };

  return (
    <p>Hello world!</p>
  );
}

export default ActivityOffsiteNew;