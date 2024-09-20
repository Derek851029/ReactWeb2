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
    Menu,
    Divider,
    Transfer,
    Col,
    InputNumber
} from 'antd';
import dayjs from 'dayjs';
import ModalShow from '../ModalControl';
const { Title } = Typography;

const OfferTipsEdit = () => {
    const navigate = useNavigate();
    const location = useLocation()

    const state = location.state.type
    const { offerTipsID } = useParams();
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [current, setCurrent] = useState('info');

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [dataInfo, setDataInfo] = useState(null)
    const [tagsData, setTagsData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);

    const [clickTypeOpts, setClickTypeOpts] = useState([
        { label: '無', value: '' },
        { label: '開啟連結至外部瀏覽器', value: 'outWebView' },
        { label: '開啟連結至內崁瀏覽器', value: 'toWebView' },
        { label: '到指定最新消息', value: 'toNews' },
        { label: '到紅利兌換列表', value: 'toRedeemCouponList' },
    ])

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

    useEffect(() => {
        getData();

        const tagsData = async () => {
            //搭配 await 等待兩個 API 都取得回應後才繼續
            const data = await Promise.all([
                getTags(),
                getofferTipsTags(),
            ]);

            tagsInfo(data);
        };

        tagsData()

        if (state === 'view') setFormShowDisable(true)
    }, [])

    const getData = () => {
        fetch('/api/offertips?type=edit&id=' + offerTipsID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const offerTipsData = data[0];
                const created = dayjs(offerTipsData.created * 1000).format('YYYY-MM-DD');
                console.log(offerTipsData.click_type)
                form.setFieldsValue({
                    app_offertips_id: offerTipsData.app_offertips_id,
                    point: offerTipsData.point,
                    tips: offerTipsData.tips,
                    coming_soon_tips: offerTipsData.coming_soon_tips,
                    click_type: offerTipsData.click_type,
                    click_value: offerTipsData.click_value,
                    createDate: dayjs(created),
                });

                setDataInfo(offerTipsData);
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
                return data;
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getofferTipsTags = () => {
        return fetch('/api/offertips' + '?type=tags&id=' + offerTipsID + '', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data;

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const tagsInfo = (tagsData) => {
        const tags = tagsData[0];
        const news = tagsData[1];

        const tempData = [];
        const tempTargetData = [];

        tags.forEach((value, index, array) => {
            if (news[index]) {
                console.log(1, news[index].tag_id);
                tempTargetData.push(news[index].tag_id);
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

    const onFinish = (values) => {
        console.log('Success:', values);

        setFormData(values);
        setFormShowDisable(true);
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        fetch('/api/offertips', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(formData), type: 'edit', OfferTipsID: offerTipsID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setOpen(false);
                setConfirmLoading(false);

                messageBox("success", "編輯點數提醒成功!");
            })
            .catch(error => {
                messageBox("error", "編輯點數提醒失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const saveTags = () => {
        const newsTags = {
            TagsData: ''
        };

        if (targetKeys.length != 0) {
            newsTags.TagsData = targetKeys.toString();
        }

        console.log(targetKeys);
        fetch('/api/offertips', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(newsTags), Type: 'tags', OfferTipsID: offerTipsID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "標籤儲存成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "標籤儲存失敗!");
                console.error('Unable to add item.', error);
            });
    }

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
                 /*       navigate("/offertips/list", { replace: true });*/
                    }
                });
                break;
        }

    };

    const menuOnClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

    const transferChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
    };

    const transfereSearch = (dir, value) => {
        /*console.log('search:', dir, value);*/
    };

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

            <Form.Item label="點擊事件" name="click_type">
                <Select placeholder="請選擇點擊事件。。。" options={clickTypeOpts} />
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
                <Button type="primary" htmlType="submit" shape="round" icon={<EditOutlined />} size='large'>編輯</Button>
            </Form.Item>
        </Form>
    )

  return (
      <>
          {contextHolder}
          <Title level={2}>
              編輯點數提醒</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item><Link to='/offertips/list'>點數提醒列表</Link></Breadcrumb.Item>
              <Breadcrumb.Item>編輯點數提醒</Breadcrumb.Item>
          </Breadcrumb>

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

export default OfferTipsEdit;