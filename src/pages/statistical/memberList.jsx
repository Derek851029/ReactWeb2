import React, { useState, useEffect } from 'react';
import {
    EditOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate,Link } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message, Pagination } from 'antd';
import dayjs from 'dayjs'

const { Title, Text } = Typography;

const MemberList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [memberList, setMemberList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: 'PK ID',
            dataIndex: 'pk_id',
        },
        {
            title: '註冊日期',
            dataIndex: 'created',
            render: (value) => (
                dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
        },
        {
            title: '開啟APP位置',
            dataIndex: 'longitude',
            render: (value, array, index) => (
                <>
                    {array.latitude}
                    <br></br>
                    {value }
                </>
            )
        },
        {
            title: '開啟APP次數',
            dataIndex: 'open_count',
        },
        {
            title: '最新消息點擊率',
            dataIndex: 'read_news_statistics',
        },
        {
            title: '最後登入時間',
            dataIndex: 'lasttime',
            render: (value) => (
                dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
        },
        {
            title: '最後登出時間',
            dataIndex: 'logout_time',
            render: (value) => (
                dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            )
        },
        {
            title: '地圖導航次數',
            dataIndex: 'navigation',
            render: (value, array, index) => (
                <>
                    {"KFC : " + array.navigation_Kfc}
                    <br></br>
                    {"Pizzahut : " + array.navigation_Pizzahut}
                </>
            )
        },
        {
            title: '地圖訂餐次數',
            dataIndex: 'map_order',
            render: (value, array, index) => (
                <>
                    {"KFC : " + array.map_order_Kfc}
                    <br></br>
                    {"Pizzahut : " + array.map_order_Pizzahut}
                </>
            )
        },
        {
            title: '前往訂餐次數',
            dataIndex: 'order',
            render: (value, array, index) => (
                <>
                    {"KFC : " + array.order_Kfc}
                    <br></br>
                    {"Pizzahut : " + array.order_Pizzahut}
                </>
            )
        },
    ];

    useEffect(() => {
        initData(1, pageSize);
    }, []);

    const initData = (page, pageSize) => {
        setLoading(true);

        fetch(`/api/statistical?value=memberList&page=${page}&pageSize=${pageSize}&brand=ALL`, {
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
        
        setMemberList(
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

    const onPageChange = (page, pageSize) => {
        console.log(page, pageSize);
     /*   getMember(page, searchValue);*/
        
        setCurrent(page);
        setPageSize(pageSize)
        initData(page, pageSize)
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>會員相關統計</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/statistical/list'>統計報表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>會員相關統計</Breadcrumb.Item>
            </Breadcrumb>


            <Table columns={columns} dataSource={memberList} loading={loading} onChange={onChange} pagination={false}></Table>

            <br></br>

            <div style={{ textAlign: 'right' }}>
                <Pagination current={current} onChange={onPageChange} total={total} pageSize={pageSize} />
            </div>
        </>
    );
};

export default MemberList;