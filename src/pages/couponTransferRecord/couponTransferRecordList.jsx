import React, { useState, useEffect } from 'react';
import {
    EyeOutlined,
    EditOutlined, HistoryOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography, Table, Breadcrumb, message, Pagination, Col } from 'antd';
import dayjs from 'dayjs'

const { Title, Text } = Typography;
const { Search } = Input;

const CouponTransferRecordList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [searchValue, setSearchValue] = useState("0")
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0)

    const [transferRecordList, setTransferRecordList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '建立時間',
            dataIndex: 'created',
            render: (value) => (
                dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
        },
        {
            title: '領取時間',
            dataIndex: 'accept_time',
            render: (value) => (
                dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
        },
        {
            title: '優惠券ID',
            dataIndex: 'sl_coupon_id',
        },
        {
            title: '品牌',
            dataIndex: 'brand',
        },
        {
            title: '傳送者ID',
            dataIndex: 'pk_id',
        },
        {
            title: '接受者ID',
            dataIndex: 'grantee_pk_id',
        },
        {
            title: '邀請碼',
            dataIndex: 'security_code',
        },
        {
            title: '啟動碼',
            dataIndex: 'security_pwd',
        },
        {
            title: '狀態',
            dataIndex: 'status_text',
        },
        {
            title: '操作',
            dataIndex: 'gift_record_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/coupontransferrecord/view/' + value, { state: { type: 'edit' } }); }}> 檢視</Button >
                    </>
                );

            }
        },
    ];

    useEffect(() => {
        getTransferRecord(current, searchValue);
    }, []);

    const getTransferRecord = (current,id) => {
        setLoading(true);

        fetch(`../api/coupontransferrecord?type=list&current=${current}&id=${id}`, {
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

                setTransferRecordList(
                    data.map((value, index) => {
                        var jsonObject = {
                            key: index,
                            gift_record_id: value.gift_record_id,
                            pk_id: value.pk_id,
                            sl_coupon_id: value.sl_coupon_id,
                            brand: value.brand,
                            security_code: value.security_code,
                            security_pwd: value.security_pwd,
                            grantee_pk_id: value.grantee_pk_id,
                            accept_time: value.accept_time,
                            status_text: value.status_text,
                            created: value.created
                        };
                        return jsonObject;
                    })
                );
                setTotal(data.length > 0 ? data[0].TotalCount : 0)
                setLoading(false);

            })
    }

    const onSearch = (value) => {
        if (value) {
            getTransferRecord(1, value);
            setSearchValue(value);
        }
        else {
            getTransferRecord(1, 0);
            setSearchValue("0");
            setCurrent(1);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const onPageChange = (page) => {
        console.log(page);
        getTransferRecord(page,searchValue);

        setCurrent(page);
    };

  return (
      <>
          {contextHolder}
          <Title level={2}>優惠券轉移紀錄列表</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item>優惠券轉移紀錄列表</Breadcrumb.Item>
          </Breadcrumb>
          <Col span={6}>
              <Search placeholder="請輸入PK ID。。。" onSearch={onSearch} enterButton />
          </Col>
          <Table columns={columns} dataSource={transferRecordList} loading={loading} onChange={onChange} pagination={false}></Table>

          <br></br>

          <div style={{ textAlign: 'right' }}>
              <Pagination current={current} onChange={onPageChange} total={total} showSizeChanger={false} />
          </div>
      </>
  );
}

export default CouponTransferRecordList;