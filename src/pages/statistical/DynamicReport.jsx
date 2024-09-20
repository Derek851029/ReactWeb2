import React, { useState, useEffect } from 'react';
import {
    FileExcelOutlined, SearchOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, DatePicker, Typography, Table, Breadcrumb, message, Divider, Menu, Space } from 'antd';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const { Title, Text } = Typography;

const DyncmicReport = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [downloadYearList, setDownloadYearList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useState('total');

    const [searchData, setSearchData] = useState([]);

    const [iosChartData, setIosChartData] = useState(null);
    const [androidChartData, setAndroidChartData] = useState(null);

    const columns = [
        {
            title: '裝置種類',
            dataIndex: 'device',
        },
        {
            title: '總下載數',
            dataIndex: 'total',
        },
        {
            title: '下載率佔比',
            dataIndex: 'percent',
        },
    ];

    useEffect(() => {
        const monthAgo = dayjs().subtract(1, 'month');
        const now = dayjs();
        const start = monthAgo.format("YYYY-MM-DD");
        const end = now.format("YYYY-MM-DD");
        initData(start, end);

        //form.setFieldsValue({
        //    time: [monthAgo, now]
        //});
    }, []);

    const initData = (start, end) => {
        setLoading(true);
        console.log(start, end);
        fetch(`/api/statistical?value=dynamicReport&start=${start}&end=${end}&brand=""`, {
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

                //handleData(data, current);
                //setSearchData(data);
                setLoading(false);

            });
    };

    const handleData = (data) => {
        var android_download = 0;
        var ios_download = 0;

        const iosChart = [];
        const androidChart = [];

        for (const obj of data) {
            if (obj.device === "Android") {
                android_download += obj.total;
                androidChart.push({
                    Date: obj.rdate,
                    "下載次數": obj.total
                });
            }
            else {
                ios_download += obj.total;
                iosChart.push({
                    Date: obj.rdate,
                    "下載次數": obj.total
                });
            }



        }

        setIosChartData({
            data: iosChart,
            padding: 'auto',
            xField: 'Date',
            yField: '下載次數',
            xAxis: {
                tickCount: 5,
            },
        });

        setAndroidChartData({
            data: androidChart,
            padding: 'auto',
            xField: 'Date',
            yField: '下載次數',
            xAxis: {
                tickCount: 5,
            },
        });

        setDownloadYearList([
            {
                key: 1,
                device: "iOS",
                total: ios_download,
                percent: (ios_download / (android_download + ios_download) * 100).toFixed(4) + " %"
            },
            {
                key: 2,
                device: "Android",
                total: android_download,
                percent: (android_download / (android_download + ios_download) * 100).toFixed(4) + " %"
            }
        ]);
    };

    const exportExcel = () => {
        console.log(searchData);
        fetch(`/api/statistical/excel`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(searchData), Type: 'downloadYear' })
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
                link.download = 'APP下載次數報表.xlsx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const onFinish = (values) => {
        const start = dayjs(values.time[0]).format("YYYY-MM-DD");
        const end = dayjs(values.time[1]).format("YYYY-MM-DD");
        console.log('Success:', values);
        initData(start, end);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>動態連結報表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/statistical/list'>統計報表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>動態連結報表</Breadcrumb.Item>
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
            <Button type="primary" shape="round"
                icon={<FileExcelOutlined />}
                onClick={exportExcel}
            >
                匯出Excel
            </Button>
            <Table
                columns={columns}
                dataSource={downloadYearList}
                loading={loading}
                onChange={onChange}
                pagination={false}
            >
            </Table>
        </>
    );
};

export default DyncmicReport;