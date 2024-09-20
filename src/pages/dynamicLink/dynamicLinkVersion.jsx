import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const DynamicLinVersion = () => {
    const { dynamicLinkID } = useParams();

    const [dynamicLinkList, setDynamicLinkList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '版本',
            dataIndex: 'version',
        },
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
            title: '版本時間',
            dataIndex: 'version_date',
            render: (value, array, index) => {
                const time = dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss');

                return time;
            }
        },
    ];

    useEffect(() => {
        getDynamicLink();
    }, []);

    const getDynamicLink = () => {
        setLoading(true);

        fetch('/api/dynamiclink' + '?type=version&id=' + dynamicLinkID, {
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
                        version: value.version,
                        dynamic_link_id: value.dynamic_link_id,
                        dynamic_link: value.dynamic_link,
                        action: value.action,
                        action_id: value.action_id,
                        other_info: value.other_info,
                        version_date: value.version_date,
                    };

                    dynamicLinkData.push(jsonObject);
                });
                setDynamicLinkList(dynamicLinkData);
                setLoading(false);

            });
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };


  return (
      <>
          <Title level={2}>動態連結版本列表</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item><Link to='/dynamiclink/list'>動態連結列表</Link></Breadcrumb.Item>
              <Breadcrumb.Item>動態連結版本列表</Breadcrumb.Item>
          </Breadcrumb>


          <Table columns={columns} dataSource={dynamicLinkList} loading={loading} onChange={onChange}></Table>
      </>
  );
}

export default DynamicLinVersion;