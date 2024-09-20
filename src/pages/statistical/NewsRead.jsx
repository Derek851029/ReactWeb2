import React, { useState, useEffect } from 'react';
import {
    FileExcelOutlined, SearchOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, DatePicker, Typography, Table, Breadcrumb, message, Divider, Menu, Space, Select } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const NewsRead = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const brandOpts = [{ label: '所有', value: 'ALL' }, { label: 'PK', value: 'PK' }, { label: 'KFC', value: 'KFC' }, { label: 'Pizzahut', value: 'Pizzahut' }];
    const [messageApi, contextHolder] = message.useMessage();

    const [totalTableData, setTotalTableData] = useState([]);
    const [singleTableData, setSingleTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useState('total');

    const [searchData, setSearchData] = useState([]);


    const totalColumns = [
        {
            title: '發送篇數',
            dataIndex: 'totalNews',
        },
        {
            title: '總發送封數',
            dataIndex: 'totalSend',
        },
        {
            title: '總發送會員數(不重複)',
            dataIndex: 'totalMember',
        },
        {
            title: '成功發送數(不重複)',
            dataIndex: 'totalSendSuccess',
        },
        {
            title: '開啟數(不重複)',
            dataIndex: 'totalRead',
        },
        {
            title: '平均開啟率',
            dataIndex: 'percent',
        },
    ];

    const singleColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '活動名稱',
            dataIndex: 'title',
        },
        //{
        //    title: '總發送會員數(不重複)',
        //    dataIndex: 'member',
        //},
        {
            title: '成功發送數(不重複)',
            dataIndex: 'send',
        },
        {
            title: '開啟數(不重複)',
            dataIndex: 'open',
        },
        {
            title: '平均開啟率',
            dataIndex: 'percent',
        },
        {
            title: '點擊數(不重複)',
            dataIndex: 'click',
        },
    ];

    useEffect(() => {
        const firstDay = dayjs().startOf('month');
        const endDay = dayjs().endOf('month');
        const start = firstDay.format("YYYY-MM-DD");
        const end = endDay.format("YYYY-MM-DD");
        initData(start, end, "ALL");

        form.setFieldsValue({
            time: [firstDay, endDay],
            brand: "ALL"
        });
    }, []);

    const initData = (start, end, brand) => {
        setLoading(true);

        fetch(`/api/statistical?value=newsReadMonth&start=${start}&end=${end}&brand=${brand}`, {
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

                handleData(data);
                setSearchData(data);
                setLoading(false);

            });
    };

    const handleData = (data) => {
        const totalTable = {
            totalNews: data.totalMessage,
            totalSend: formatNumberWithCommas(data.totalMember * data.totalMessage),
            totalMember: formatNumberWithCommas(data.totalMember),
            totalSendSuccess: formatNumberWithCommas(data.totalSend), 
            totalRead: formatNumberWithCommas(data.totalRead),
            percent: `${data.percent} %`
        }
        setTotalTableData([totalTable])
        setSingleTableData(data.singleNewsData.map((obj) => {
            obj.send = formatNumberWithCommas(obj.send)
            obj.open = formatNumberWithCommas(obj.open) 
            obj.click = formatNumberWithCommas(obj.click) 
            obj.percent = `${obj.percent} %`
            
            return obj
        }))
    }

    const exportExcel = () => {
        console.log(singleTableData);
        fetch(`/api/statistical/excel`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(singleTableData), Type: 'newsReadMonth' })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.blob();
            })
            .then(data => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = '最新消息查看率統計.xlsx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            });
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        const start = dayjs(values.time[0]).format("YYYY-MM-DD");
        const end = dayjs(values.time[1]).format("YYYY-MM-DD");
        
        initData(start, end, values.brand)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const formatNumberWithCommas = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <>
            {contextHolder}
            <Title level={2}>最新消息查看率統計</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/statistical/list'>統計報表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>最新消息查看率統計</Breadcrumb.Item>
            </Breadcrumb>

            <Divider />

            <Form
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item required label="時間區間" name="time"
                    rules={[
                        {
                            required: true,
                            message: '請選擇時間區間!',
                        },
                    ]}>
                    <RangePicker />
                </Form.Item>

                <Form.Item required label="品牌" name="brand" >
                    <Select placeholder="請選擇品牌。。。" options={brandOpts} style={{width: '22%'}} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{

                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" shape="round" icon={<SearchOutlined />}>查詢</Button>
                </Form.Item>
            </Form>

            <br></br>
       
            <br></br>
            <Table
                columns={totalColumns}
                dataSource={totalTableData}
                loading={loading}
                onChange={onChange}
                pagination={false}
            />
            <br></br>
            <Button type="primary" shape="round"
                icon={<FileExcelOutlined />}
                onClick={exportExcel}
            >
                匯出Excel
            </Button>
            <Table
                columns={singleColumns}
                dataSource={singleTableData}
                loading={loading}
                onChange={onChange}
                pagination={ false}
            />

        </>
    );
};

export default NewsRead;