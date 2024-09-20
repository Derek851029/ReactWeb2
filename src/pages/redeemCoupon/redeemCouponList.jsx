import React, { useState, useEffect } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined, HistoryOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';

const { Title, Text } = Typography;

const RedeemCouponList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [redeemCouponList, setRedeemCouponList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '點數',
            dataIndex: 'point',
        },
        {
            title: '品牌',
            dataIndex: 'brand',
        },
        {
            title: '類型',
            dataIndex: 'type',
            render: (value) => (
                value === "product" ? "商品券" : "現金券"
            )
        },
        {
            title: '優惠券ID',
            dataIndex: 'sl_coupon_id',
        },
        {
            title: '排序',
            dataIndex: 'sortweight',
        },
        {
            title: '歷史版本',
            dataIndex: 'app_redeem_coupon_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/redeemcoupon/version/' + value); }}> 檢視版本</Button >
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'app_redeem_coupon_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/redeemcoupon/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                    </>
                );

            }
        },
    ];

    useEffect(() => {
        getRedeemCoupon();
    }, []);

    const getRedeemCoupon = () => {
        setLoading(true);

        fetch('../api/redeemcoupon' + '?type=list&id=0', {
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

                setRedeemCouponList(
                    data.map((value, index) => {
                        var jsonObject = {
                            key: index,
                            app_redeem_coupon_id: value.app_redeem_coupon_id,
                            point: value.point,
                            brand: value.brand,
                            type: value.type,
                            sl_coupon_id: value.sl_coupon_id,
                            sortweight: value.sortweight,
                        };
                        return jsonObject;
                    })
                );
                setLoading(false);

            })
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

  return (
      <>
          {contextHolder}
          <Title level={2}>點數兌換列表</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item>點數兌換</Breadcrumb.Item>
          </Breadcrumb>

          <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/redeemcoupon/new'); }}>
              新增點數兌換
          </Button>


          <Table columns={columns} dataSource={redeemCouponList} loading={loading} onChange={onChange}></Table>
      </>
  );
}

export default RedeemCouponList;