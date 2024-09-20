import React, { useState, useEffect } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined, LinkOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const DynamicLinkList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [dynamicLinkList, setDynamicLinkList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '動態連結',
            dataIndex: 'dynamic_link',
        },
        {
            title: '來源',
            dataIndex: 'other_info',
            render: (value, array, index) => {
                const object = JSON.parse(value);

                return object.source;
            }
        },
        {
            title: '連結事件',
            dataIndex: 'action',
        },
        {
            title: '事件ID',
            dataIndex: 'action_id',
        },
        {
            title: '新增時間',
            dataIndex: 'created',
            render: (value, array, index) => {
                const time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');

                return time;
            }
        },
        {
            title: '歷史版本',
            dataIndex: 'dynamic_link_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/dynamicLink/version/' + value); }}> 檢視版本</Button >
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'dynamic_link_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<LinkOutlined />} size='small'
                            onClick={
                                () => {
                                    navigator.clipboard.writeText(array.dynamic_link);
                                    messageBox("success","複製成功")
                                }}> 複製連結</Button >
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/dynamicLink/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                    </>
                );

            }
        },
    ];

    useEffect(() => {
        getDynamicLink();
    }, []);

    const getDynamicLink = () => {
        setLoading(true);

        fetch('../api/dynamiclink' + '?type=list&id=0', {
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
                var dynamicLinkData = [];
                console.log(data);
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        dynamic_link_id: value.dynamic_link_id,
                        dynamic_link: value.dynamic_link,
                        action: value.action,
                        action_id: value.action_id,
                        other_info: value.other_info,
                        created: value.created,
                    };

                    dynamicLinkData.push(jsonObject);
                });
                setDynamicLinkList(dynamicLinkData);
                setLoading(false);

            })
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const messageBox = (type, text) => {
        messageApi.open({
            type: type,
            content: text,
        });
    }

  return (
      <>
          {contextHolder}
          <Title level={2}>動態連結列表</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item>動態連結列表</Breadcrumb.Item>
          </Breadcrumb>

          <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/dynamiclink/new'); }}>
              新增動態連結
          </Button>


          <Table columns={columns} dataSource={dynamicLinkList} loading={loading} onChange={onChange}></Table>
      </>
  );
}

export default DynamicLinkList;