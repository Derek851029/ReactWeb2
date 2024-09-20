import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {EyeOutlined,} from '@ant-design/icons';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const CouponTransferRecordView = () => {
    const navigate = useNavigate();
    const { transferRecordID } = useParams();

    const [transferRecordInfo, setTransferRecordInfo] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '發送者',
            dataIndex: 'donor_pk_id',
        },
        {
            title: '接收者',
            dataIndex: 'grantee_pk_id',
        },
        {
            title: '詳情',
            dataIndex: 'detail',
        },
        {
            title: '備註',
            dataIndex: 'tips',
        },
        {
            title: '狀態',
            dataIndex: 'result',
        },
        {
            title: '轉移時間',
            dataIndex: 'created',
            render: (value, array, index) => (
                dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
        },
    ];

    useEffect(() => {
        getTransferRecordInfo();
    }, []);

    const getTransferRecordInfo = () => {
        setLoading(true);

        fetch(`/api/coupontransferrecord?type=view&id=${transferRecordID}`, {
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

                setTransferRecordInfo(
                    data.map((value,index) => {
                        var jsonObject = {
                            key: index,
                            donor_pk_id: value.donor_pk_id,
                            grantee_pk_id: value.grantee_pk_id,
                            detail: value.detail,
                            tips: value.tips,
                            result: value.result,
                            created: value.created
                        };
                        return jsonObject
                    })
                );
                setLoading(false);

            });
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };


  return (
      <>
          <Title level={2}>優惠券轉移資訊</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item><Link to='/coupontransferrecord/list'>優惠券轉移列表</Link></Breadcrumb.Item>
              <Breadcrumb.Item>APP優惠券轉移資訊</Breadcrumb.Item>
          </Breadcrumb>


          <Table columns={columns} dataSource={transferRecordInfo} loading={loading} onChange={onChange}></Table>
      </>
  );
}

export default CouponTransferRecordView;