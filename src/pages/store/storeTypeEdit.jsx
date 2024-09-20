import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { PlusOutlined, EditOutlined} from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Typography,
    message,
    Breadcrumb,
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl'
const { Title } = Typography;


const StoreTypeEdit = () => {
    const navigate = useNavigate()
    const { storeTypeID } = useParams()
    const [form] = Form.useForm();

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        fetch('/api/categories?type=edit&id=' + storeTypeID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const storeTypeData = data[0]
                const created = dayjs(storeTypeData.created * 1000).format('YYYY-MM-DD')

                console.log(storeTypeData)
                form.setFieldsValue({
                    title: storeTypeData.title,
                    createDate: dayjs(created),
                })
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', StoreTypeID: storeTypeID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);

                messageBox("success", "編輯類別成功!")
            })
            .catch(error => {
                messageBox("error", "編輯類別失敗!")
                console.error('Unable to add item.', error)
            });
    };

    const onCancel = () => {
        setFormShowDisable(false)
        setOpen(false)
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values)
        setFormShowDisable(true)
        setOpen(true)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
                    /*    navigate("/storeType/list", { replace: true })*/
                    }
                });
                break;
        }

    }

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
            <Form.Item required label="名稱" name="title"
                rules={[
                    {
                        required: true,
                        message: '請輸入名稱!',
                    },
                ]}>
                <Input placeholder="請輸入名稱。。。" />
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
            
            {contextHolder}
            <Title level={2}>編輯類別</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/storeType/list'>類別列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯</Breadcrumb.Item>
            </Breadcrumb>

            {formTable}

            <ModalShow
                title="預覽"
                formTable={formTable}
                open={open}
                page='storeType'
                handleOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}>
            </ModalShow>           
        </>
    )
}

export default StoreTypeEdit