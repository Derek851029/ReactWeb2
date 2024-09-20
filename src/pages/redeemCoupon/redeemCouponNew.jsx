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

const RedeemCouponNew = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [statusOpts, setStatusOpts] = useState([
        { label: '發佈', value: 1 },
        { label: '不發佈', value: 0 },
    ])

    const [typeOpts, setTypeOpts] = useState([
        { label: '商品券', value: 'product' },
        { label: '現金券', value: 'cash' },
    ])

    const [brandOpts, setBrandOpts] = useState([
        { label: 'KFC', value: 'KFC' },
        { label: 'Pizzahut', value: 'Pizzahut' },
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

        fetch('../api/redeemcoupon', {
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

                messageBox("success", "新增點數兌換成功!");
            })
            .catch(error => {
                messageBox("error", "新增點數兌換失敗!");
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
                        navigate("/redeemcoupon/list", { replace: true });
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
            <Form.Item required label="是否發佈" name="status"
                rules={[
                    {
                        required: true,
                        message: '請選擇是否發佈!',
                    },
                ]}
            >
                <Select placeholder="請選擇是否發佈。。。" options={statusOpts} />
            </Form.Item>

            <Form.Item required label="點數" name="point" 
                rules={[
                    {
                        required: true,
                        message: '請輸入點數!',
                    },
                ]}
            >
                <InputNumber placeholder="請輸入點數。。。" style={{width:'100%'} } />
            </Form.Item>

            <Form.Item label="類型" name="type"
                rules={[
                    {
                        required: true,
                        message: '請選擇類型!',
                    },
                ]}
            >
                <Select placeholder="請選擇類型。。。" options={typeOpts} />
            </Form.Item>

            <Form.Item label="品牌" name="brand"
                rules={[
                    {
                        required: true,
                        message: '請選擇品牌!',
                    },
                ]}
            >
                <Select placeholder="請選擇品牌。。。" options={brandOpts} />
            </Form.Item>

            <Form.Item label="優惠券ID" name="sl_coupon_id"
                rules={[
                    {
                        required: true,
                        message: '請輸入優惠券ID!',
                    },
                ]}
            >
                <Input placeholder="請輸入優惠券ID。。。" />
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
              新增點數兌換</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item><Link to='/redeemcoupon/list'>點數兌換列表</Link></Breadcrumb.Item>
              <Breadcrumb.Item>新增點數兌換</Breadcrumb.Item>
          </Breadcrumb>

          {formTable}

          <ModalShow
              title="預覽"
              formTable={formTable}
              open={open}
              page='redeemcoupon'
              handleOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={onCancel}>
          </ModalShow>
      </>
  );
}

export default RedeemCouponNew;