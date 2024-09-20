import React, { useState, useEffect } from 'react';
import { DeleteOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb } from 'antd';
const { Title } = Typography;

const TagList = () => {
    const [tagList,setTagList] = useState([])

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const columns = [
        {
            title: '類別',
            dataIndex: 'tag_type',
            render: (tag_type) => {
                if (tag_type == "interest") {
                    return "興趣"
                }
                else {
                    return "自訂"
                }
            }
        },
        {
            title: '名稱',
            dataIndex: 'tag_title',
        },
    ]

    useEffect(() => {
        getTags()
    },[])

    const getTags = () => {
        fetch('../api/tags', {
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
            var tagData = []

            data.forEach((value, index, arr) => {
                var jsonObject = {
                    key: index,
                    tag_type: value.tag_type,
                    tag_title: value.tag_title,
                }

                tagData.push(jsonObject)
            })

            setTagList(tagData)
            setLoading(false);
        })
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (

        <>
            <Title level={2}>標籤列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>標籤</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/tag/new') }}>
                新增標籤
            </Button>

            <Table columns={columns} dataSource={tagList} loading={loading} onChange={onChange}>
            </Table>

        </>
    );
}

export default TagList