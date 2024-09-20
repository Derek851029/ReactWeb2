import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { EditOutlined, MenuOutlined, TagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Typography,
    message,
    Breadcrumb,
    Descriptions,
    Divider,
    Transfer,
    Col,
} from 'antd';

const { Title } = Typography;

const AppUpdatenoticeEdit = () => {
    const navigate = useNavigate();
    const location = useLocation()

    const { memberID } = useParams();
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [confirmLoading, setConfirmLoading] = useState(false);

    const [formShowDisable, setFormShowDisable] = useState(false);
    const [formData, setFormData] = useState()

    const [dataInfo, setDataInfo] = useState({})

    const [tagsData, setTagsData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);


    useEffect(() => {
        getData();

        const tagsData = async () => {
            //搭配 await 等待兩個 API 都取得回應後才繼續
            const data = await Promise.all([
                getTags(),
                getMemberTags(),
            ]);

            tagsInfo(data);
        };

        tagsData()

    }, [])

    const getData = () => {
        fetch(`/api/member?type=edit&id=${memberID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                const memberData = data[0];

                form.setFieldsValue({
                    mid: memberData.mid,
                    pk_id: memberData.pk_id,
                    login_count: memberData.login_count,
                    open_count: memberData.open_count,
                    login_time: memberData.login_time,
                    logout_time: memberData.logout_time,
                });

                setDataInfo(memberData);
            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const getTags = () => {
        return fetch('/api/tags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data;
            })
            .catch(error => console.error('Unable to add item.', error));
    };

    const getMemberTags = () => {
        return fetch('/api/member' + '?type=tags&id=' + memberID + '', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                return data;

            })
            .catch(error => console.error('Unable to add item.', error));
    }

    const tagsInfo = (tagsData) => {
        const tags = tagsData[0];
        const memberTags = tagsData[1];

        const tempData = [];
        const tempTargetData = [];

        tags.forEach((value, index, array) => {
            if (memberTags[index]) {
                console.log(1, memberTags[index].tag_id);
                tempTargetData.push(memberTags[index].tag_id);
            }

            const data = {
                key: value.tag_id,
                title: value.tag_title,
            };
            tempData.push(data);
        });

        setTagsData(tempData);
        setTargetKeys(tempTargetData);
    }

    const saveTags = () => {
        const memberTags = {
            TagsData: ''
        };

        if (targetKeys.length != 0) {
            memberTags.TagsData = targetKeys.toString();
        }

        console.log(targetKeys);
        fetch('/api/member', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(memberTags), Type: 'tags', MemberID: memberID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "標籤儲存成功!");
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "標籤儲存失敗!");
                console.error('Unable to add item.', error);
            });
    }


    const messageBox = (type, text) => {
        switch (type) {
            case 'error':
                messageApi.open({
                    type: type,
                    content: text,
                });
                break;
            case 'success':
                messageApi.open({
                    type: type,
                    content: text,
                });
                break;
        }

    };

    const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

    const transferChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
    };

    const transfereSearch = (dir, value) => {
        /*console.log('search:', dir, value);*/
    };

    const memberInfo = (
        <Descriptions title="會員基本資料" bordered>
            <Descriptions.Item label="pK Id">{dataInfo.pk_id}</Descriptions.Item>
            <Descriptions.Item label="登入APP次數">{dataInfo.login_count}</Descriptions.Item>
            <Descriptions.Item label="開啟APP次數">{dataInfo.open_count}</Descriptions.Item>
            <Descriptions.Item label="最近登入時間">{dataInfo.login_time}</Descriptions.Item>
            <Descriptions.Item label="最近登出時間">{dataInfo.logout_time} </Descriptions.Item>
        </Descriptions>
    );

    const transferTags = (
        <>
            <Title level={5}>標籤設定</Title>

            <Transfer
                dataSource={tagsData}
                showSearch
                filterOption={filterOption}
                targetKeys={targetKeys}
                onChange={transferChange}
                onSearch={transfereSearch}
                render={(item) => item.title}
                listStyle={{ width: '80%', height: 500 }}
            />
            <Divider />
            <Col span={8} offset={11}>
                <Button type="primary" shape="round" icon={<CheckCircleOutlined />} size='large' onClick={() => { saveTags(); }}>儲存</Button>
            </Col>
        </>
    )

    return (
        <>
            {contextHolder}
            <Title level={2}>編輯會員資料</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/member/list'>會員列表</Link></Breadcrumb.Item>
                <Breadcrumb.Item>編輯會員資料</Breadcrumb.Item>
            </Breadcrumb>

            <br></br>

            {memberInfo}

            <br></br>

            {transferTags}
        </>
    );
}

export default AppUpdatenoticeEdit;