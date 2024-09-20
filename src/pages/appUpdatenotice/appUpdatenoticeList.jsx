import React, { useState, useEffect } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined, HistoryOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';

const { Title, Text } = Typography;

const AppUpdatenoticeList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [updateNoticeList, seUupdateNoticeList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '手機種類',
            dataIndex: 'device',
        },
        {
            title: '版本號',
            dataIndex: 'app_version',
        },
        {
            title: '是否強制更新',
            dataIndex: 'is_force',
            render: (value) => (
                value === 1 ? "強制" : "不強制"
            )
        },
        {
            title: '提示文字',
            dataIndex: 'tips',
        },
        {
            title: '歷史版本',
            dataIndex: 'app_update_notice_id',
            render: (value) => {
                return (
                    < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/appupdatenotice/version/' + value); }}> 檢視版本</Button >
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'app_update_notice_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/appupdatenotice/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                    </>
                );

            }
        },
    ];

    useEffect(() => {
        getUpdateNotice();
    }, []);

    const getUpdateNotice = () => {
        setLoading(true);

        fetch('../api/updatenotice' + '?type=list&id=0', {
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

                seUupdateNoticeList(
                    data.map((value, index) => {
                        var jsonObject = {
                            key: index,
                            app_update_notice_id: value.app_update_notice_id,
                            device: value.device,
                            app_version: value.app_version,
                            tips: value.tips,
                            is_force: value.is_force,
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
          <Title level={2}>APP版本控制列表</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item>APP版本控制列表</Breadcrumb.Item>
          </Breadcrumb>

          <Table columns={columns} dataSource={updateNoticeList} loading={loading} onChange={onChange}></Table>
      </>
  );
}

export default AppUpdatenoticeList;