import React, { useState, useEffect } from 'react';
import {
    AudioOutlined,
    EditOutlined, HistoryOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography, Table, Breadcrumb, message, Pagination, Col } from 'antd';

const { Title, Text } = Typography;
const { Search } = Input;

const MemberList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [searchValue, setSearchValue] = useState(0)

    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0)
    const [memberList, setMemberList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'PK ID',
            dataIndex: 'pk_id',
        },
        {
            title: '操作',
            dataIndex: 'mid',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/member/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                    </>
                );

            }
        },
    ];

    useEffect(() => {
        getMember(current, searchValue);
    }, []);

    const getMember = (current,id) => {
        setLoading(true);

        fetch(`../api/member?type=list&current=${current}&id=${id}`, {
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

                setMemberList(
                    data.map((value, index) => {
                        var jsonObject = {
                            key: index,
                            mid: value.mid,
                            pk_id: value.pk_id,
                        };
                        return jsonObject;
                    })
                );
                setTotal(data[0].TotalCount)
                setLoading(false);

            })
    }

    const onSearch = (value) => {
        if (value) {
            getMember(1, value);
            setSearchValue(value);
        }
        else {
            getMember(1, 0)
            setSearchValue(0);
            setCurrent(1)
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const onPageChange = (page) => {
        console.log(page);
        getMember(page,searchValue)

        setCurrent(page);
    };

  return (
      <>
          {contextHolder}
          <Title level={2}>APP會員列表</Title>
          <Breadcrumb
              style={{
                  margin: '16px 0',
              }}
          >
              <Breadcrumb.Item>APP會員列表</Breadcrumb.Item>
          </Breadcrumb>

          <Col span={6}>
              <Search placeholder="請輸入PK ID。。。" onSearch={onSearch} enterButton />
          </Col>

          <br></br>

          <Table columns={columns} dataSource={memberList} loading={loading} onChange={onChange} pagination={false}></Table>

          <br></br>

          <div style={{textAlign:'right'} }>
              <Pagination current={current} onChange={onPageChange} total={total} showSizeChanger={false} />
          </div>
      </>
  );
}

export default MemberList;