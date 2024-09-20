import React, { useState, useEffect } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined, HistoryOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';

const { Title, Text } = Typography;

const OfferTipsList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [offerTipsList, setOfferTipsList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '點數',
            dataIndex: 'point',
        },
        {
            title: '已經達成提醒文字',
            dataIndex: 'tips',
        },
        {
            title: '即將達成提醒文字',
            dataIndex: 'coming_soon_tips',
        },
        {
            title: '歷史版本',
            dataIndex: 'app_offertips_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/offertips/version/' + value); }}> 檢視版本</Button >
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'app_offertips_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/offertips/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteOfferTips(value,1)}}> 刪除</Button >
                    </>
                );

            }
        },
    ];

    useEffect(() => {
        getofferTips();
    }, []);

    const getofferTips = () => {
        setLoading(true);

        fetch('../api/offertips' + '?type=list&id=0', {
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
                console.log(data);

                setOfferTipsList(data.map((value,index) => {
                    var jsonObject = {
                        key: index,
                        app_offertips_id: value.app_offertips_id,
                        point: value.point,
                        tips: value.tips,
                        coming_soon_tips: value.coming_soon_tips,
                    };

                        return jsonObject;
                }));
                setLoading(false);

            })
    }

    const deleteOfferTips = (id, status) => {
        fetch('../api/offertips', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'delete', OfferTipsID: id, })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                console.log("data:", data);
                messageBox("success", "刪除成功!");

                getofferTips();
            })
            .catch(error => {
                messageBox("error", "刪除失敗!");
                console.error('Unable to add item.', error);
            });
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
          <Title level={2}>點數提醒列表</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item>點數提醒</Breadcrumb.Item>
          </Breadcrumb>

          <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/offertips/new'); }}>
              新增點數提醒
          </Button>


          <Table columns={columns} dataSource={offerTipsList} loading={loading} onChange={onChange}></Table>
      </>
  );
}

export default OfferTipsList;