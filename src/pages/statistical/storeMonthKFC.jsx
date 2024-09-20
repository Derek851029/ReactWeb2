import React, { useState, useEffect } from 'react';
import {
    EditOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate,Link } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';
import dayjs from 'dayjs'

const { Title, Text } = Typography;

const StoreMonthKFC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [storeMonthKFCList, setStoreMonthKFCList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '門市名稱',
            dataIndex: 'store_name',
        },
        {
            title: '一月',
            dataIndex: 'one',
        },
        {
            title: '二月',
            dataIndex: 'two',
        },
        {
            title: '三月',
            dataIndex: 'three',
        },
        {
            title: '四月',
            dataIndex: 'four',
        },
        {
            title: '五月',
            dataIndex: 'five',
        },
        {
            title: '六月',
            dataIndex: 'six',
        },
        {
            title: '七月',
            dataIndex: 'seven',
        },
        {
            title: '八月',
            dataIndex: 'eight',
        },
        {
            title: '九月',
            dataIndex: 'nine',
        },
        {
            title: '十月',
            dataIndex: 'ten',
        },
        {
            title: '十一月',
            dataIndex: 'eleven',
        },
        {
            title: '十二月',
            dataIndex: 'twelve',
        },
    ];

    useEffect(() => {
        initData();
    }, []);

    const initData = (year) => {
        setLoading(true);

        fetch(`/api/statistical?value=storeMonthKFC&year=${year}`, {
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

                handleData(data)
                setLoading(false);

            })
    };

    const handleData = (data) => {
        
        setStoreMonthKFCList(
            data.map((value, index) => {
                const click_event_count_json = JSON.parse(value.click_event_count_json)

                var jsonObject = {
                    key: index,
                    mid: value.mid,
                    pk_id: value.pk_id,
                    open_count: value.open_count,
                    logout_time: value.logout_time,
                    created: value.created,
                    lasttime: value.lasttime,
                    longitude: value.longitude,
                    latitude: value.latitude,
                    navigation_Kfc: click_event_count_json.navigation_Kfc,
                    navigation_Pizzahut: click_event_count_json.navigation_Pizzahut,
                    map_order_Kfc: click_event_count_json.map_order_Kfc,
                    map_order_Pizzahut: click_event_count_json.map_order_Pizzahut,
                    order_Kfc: click_event_count_json.order_Kfc,
                    order_Pizzahut: click_event_count_json.order_Pizzahut,
                    read_news_statistics: value.read_news_statistics,
                };
                return jsonObject;
            })
        );
        setTotal(data[0].TotalCount);
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>KFC 訂餐數據統計</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/statistical/list'>統計報表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>KFC 訂餐數據統計</Breadcrumb.Item>
            </Breadcrumb>


            <Table columns={columns} dataSource={memberList} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default StoreMonthKFC;