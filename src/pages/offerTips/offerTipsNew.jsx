import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Typography,
    message,
    Breadcrumb,
    Select,
    InputNumber
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;

const OfferTipsNew = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [clickTypeOpts, setClickTypeOpts] = useState([
        { label: '無', value: '' },
        { label: '開啟連結至外部瀏覽器', value: 'outWebView' },
        { label: '開啟連結至內崁瀏覽器', value: 'toWebView' },
        { label: '到指定最新消息', value: 'toNews' },
        { label: '到紅利兌換列表', value: 'toRedeemCouponList' },
    ])

    useEffect(() => {
        form.setFieldsValue({
            createDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        });
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('../api/offertips', {
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

                messageBox("success", "新增點數提醒成功!");
            })
            .catch(error => {
                messageBox("error", "新增點數提醒失敗!");
                console.error('Unable to add item.', error);
            });

    };

    const onCancel = () => {
        setFormShowDisable(false);
        setOpen(false);
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
                        navigate("/offertips/list", { replace: true });
                    }
                });
                break;
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
            <Form.Item required label="點數" name="point"
                rules={[
                    {
                        required: true,
                        message: '請輸入點數!',
                    },
                ]}
            >
                <InputNumber placeholder="請輸入點數。。。" />
            </Form.Item>

            <Form.Item required label="已經達成提醒文字" name="tips"
                rules={[
                    {
                        required: true,
                        message: '請輸入已經達成提醒文字!',
                    },
                ]}
            >
                <Input placeholder="請輸入已經達成提醒文字。。。" />
            </Form.Item>

            <Form.Item required label="即將達成提醒文字" name="coming_soon_tips" extra="{remain_point}為會員點數與上方點數數字相差的差額點數代號"
                rules={[
                    {
                        required: true,
                        message: '請輸入即將達成提醒文字!',
                    },
                ]}
            >
                <Input placeholder="請輸入即將達成提醒文字。。。" />
            </Form.Item>

            <Form.Item label="點擊事件" name="click_type" >
                <Select placeholder="請選擇事件。。。" options={clickTypeOpts} />
            </Form.Item>

            <Form.Item label="點擊事件參數" name="click_value" >
                <Input placeholder="請輸入點擊事件參數。。。" />
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
          <Title level={2}>
              新增點數提醒</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item><Link to='/offertips/list'>點數提醒列表</Link></Breadcrumb.Item>
              <Breadcrumb.Item>新增點數提醒</Breadcrumb.Item>
          </Breadcrumb>

          {formTable}

          <ModalShow
              title="預覽"
              formTable={formTable}
              open={open}
              page='offertips'
              handleOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={onCancel}>
          </ModalShow>
      </>
  );
}

export default OfferTipsNew;