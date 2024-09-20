﻿import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {EyeOutlined,} from '@ant-design/icons';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AppContactusVersion = () => {
    const navigate = useNavigate();
    const { contactusID } = useParams();

    const [contactusList, setContactusList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '版本',
            dataIndex: 'version',
        },
        {
            title: '版本時間',
            dataIndex: 'ver_created',
            render: (value, array, index) => {
                const time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');

                return time;
            }
        },
        {
            title: '操作',
            dataIndex: 'app_contactus_id',
            render: (value, array, index) => (
                < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate('/contactus/edit/' + value, { state: { type: 'view' } }); }}> 檢視</Button >
            )
        },
    ];

    useEffect(() => {
        getContactus();
    }, []);

    const getContactus = () => {
        setLoading(true);

        fetch('/api/contactus' + '?type=version&id=' + contactusID, {
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

                setContactusList(
                    data.map((value,index) => {
                        var jsonObject = {
                            key: index,
                            app_contactus_id: value.app_contactus_id,
                            version: value.version,
                            ver_created: value.ver_created,
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
          <Title level={2}>點數提醒版本列表</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item><Link to='/contactus/list'>聯絡我們列表</Link></Breadcrumb.Item>
              <Breadcrumb.Item>聯絡我們版本列表</Breadcrumb.Item>
          </Breadcrumb>


          <Table columns={columns} dataSource={contactusList} loading={loading} onChange={onChange}></Table>
      </>
  );
}

export default AppContactusVersion;