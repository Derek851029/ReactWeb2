import React, { useState, useEffect } from 'react';
import {PlusCircleOutlined, 
    EditOutlined, DeleteOutlined, HistoryOutlined, UnorderedListOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button,  Typography, Table, Breadcrumb, message } from 'antd';

const { Title, Text } = Typography;

const StoreTypeList = () => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    const [storeTypeList, setStoreTypeList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '名稱',
            dataIndex: 'title',
        },
        {
            title: '操作',
            dataIndex: 'cat_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/storeType/edit/' + value) }}> 編輯</Button >
                    </>
                )

            }
        },
    ]

    useEffect(() => {
        getStoreType()
    }, []);

    const getStoreType = () => {
        setLoading(true);

        fetch('../api/categories' + '?type=list&id=0', {
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
                var storeTypeData = []
                console.log(data)
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        cat_id: value.cat_id,
                        title: value.title,
                    }

                    storeTypeData.push(jsonObject)
                })
                setStoreTypeList(storeTypeData)
                setLoading(false);

            })
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return(
        <>
            {contextHolder}
            <Title level={2}>門市類型列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>門市類型列表</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/storeType/new') }}>
                新增類型
            </Button>


            <Table columns={columns} dataSource={storeTypeList} loading={loading} onChange={onChange}></Table>
        </>
    )
}

export default StoreTypeList