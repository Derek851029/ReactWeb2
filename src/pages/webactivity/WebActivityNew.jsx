import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, message, Steps, Modal, Typography, Breadcrumb, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import InfoSetting from './infoSetting';
import ViewSettingDrawPrize from './viewSettingDrawPrize';
import ViewSettingSlots from './viewSettingSlots';
import ViewSettingQuiz from './ViewSettingQuiz';
import ContentSetting from './contentSetting';
import PrizeSettingDrawPrize from './prizeSettingDrawPrize';
import PrizeSettingSlots from './prizeSettingSlots';
import PrizeSettingQuiz from './prizeSettingQuiz';
import dayjs from 'dayjs';
import QuestionBank from "./QuestionBank";

const { Title, Text } = Typography;
const { Step } = Steps;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const WebActivityNew = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { webactivityID } = useParams();
    const activity = location.state ? location.state.activity : "";

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [currentStep, setCurrentStep] = useState(0);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [activity_image, setActivity_image] = useState([]);

    const [start_image, setStart_image] = useState([]);
    const [background_image, setBackground_image] = useState([]);
    const [title_image, setTitle_image] = useState([]);
    const [content_image, setContent_image] = useState([]);

    const [contentData, setContentData] = useState("");
    const [draw_image, setDraw_image] = useState([]);

    const [footer_image, setFooter_image] = useState([]);
    const [slotsfooter_image, setSlotsfooter_image] = useState([]);
    const [slotsframe_image, setSlotsframe_image] = useState([]);
    const [slotsDrawbarBall_image, setSlotsDrawbarBall_image] = useState([]);
    const [drawbar_image, setDrawbar_image] = useState([]);
    const [tip_image, setTip_image] = useState([]);

    const [option_a_image, setOption_a_image] = useState([[]]);
    const [option_b_image, setOption_b_image] = useState([[]]);

    const [win_image, setWin_image] = useState([]);
    const [no_win_image, setNo_win_image] = useState([]);
    const [cd_image, setCd_image] = useState([]);

    const [prize_image, setPrize_image] = useState([[]]);
    const [item_image, setItem_image] = useState([]);

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (webactivityID) {
            getData();
        }
    }, []);

    const getData = () => {
        setLoading(true);
        fetch(`/api/webactivity/?type=edit&activity=${activity}&id=${webactivityID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(async (data) => {
                console.log(data);
                await handleData(data);
                setLoading(false);
            });
    };

    const handleData = async (data) => {
        const type = data.activityData[0].activity_type;

        switch (type) {
            case "DrawPrize":
                await handleDrawPrize(data);
                break;
            case "Slots":
                await handleSlots(data);
                break;
            case "Quiz":
                await handleQuiz(data);
                break;
        }
    };

    const handleDrawPrize = async (data) => {
        const activityData = data.activityData[0];
        const activityInfo = data.activityInfo[0];
        const json = { ...activityData, ...activityInfo };
        const reqFormData = { ...formData };
        const pImage = [];
        let splitUrl = "";
        json.time = [dayjs(json.start_time * 1000), dayjs(json.end_time * 1000)];

        data.prize.forEach((value, index) => {
            json[`brand${index}`] = value.brand;
            json[`coupon_id${index}`] = value.coupon_id;
            json[`prize_amount${index}`] = value.prize_amount;
            json[`prize_name${index}`] = value.prize_name;

            reqFormData[`prize_id${index}`] = value.prize_id;

            splitUrl = value.prize_path.split("/");
            pImage.push([{
                uid: '1',
                name: splitUrl[splitUrl.length - 1],
                status: 'done',
                url: value.prize_path,
            }]);
        });
        setContentData(activityInfo.draw_note);

        await getFilesData(activityData.icon_fid);

        splitUrl = activityInfo.game_start_path;
        setStart_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.game_start_path,
        }]);

        splitUrl = activityInfo.game_background_path;
        setBackground_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.game_background_path,
        }]);

        splitUrl = activityInfo.game_title_path;
        setTitle_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.game_title_path,
        }]);

        splitUrl = activityInfo.game_content_path;
        setContent_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.game_content_path,
        }]);

        splitUrl = activityInfo.draw_path;
        setDraw_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.draw_path,
        }]);

        splitUrl = activityInfo.win_path;
        setWin_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.win_path,
        }]);

        splitUrl = activityInfo.no_win_path;
        setNo_win_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.no_win_path,
        }]);

        splitUrl = activityInfo.cd_path;
        setCd_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.cd_path,
        }]);

        setPrize_image(pImage);
        form.setFieldsValue(json);
        setFormData(reqFormData);
    };

    const handleSlots = async (data) => {
        const activityData = data.activityData[0];
        const activityInfo = data.activityInfo[0];
        const json = { ...activityData, ...activityInfo };
        const reqFormData = { ...formData };
        const pImage = [];
        const iImage = [];

        json.time = [dayjs(json.start_time * 1000), dayjs(json.end_time * 1000)];

        const itemUrl = data.prize[0].item_path.split("/");
        iImage.push({
            uid: '1',
            name: itemUrl[itemUrl.length - 1],
            status: 'done',
            url: data.prize[0].item_path,
        });
        data.prize.forEach((value, index) => {
            json[`brand${index}`] = value.brand;
            json[`coupon_id${index}`] = value.coupon_id;
            json[`prize_amount${index}`] = value.prize_amount;
            json[`prize_name${index}`] = value.prize_name;

            reqFormData[`prize_id${index}`] = value.prize_id;

            const prizeUrl = value.prize_path.split("/");
            /*const itemUrl = value.item_path.split("/");*/
            pImage.push([{
                uid: '1',
                name: prizeUrl[prizeUrl.length - 1],
                status: 'done',
                url: value.prize_path,
            }]);
            //iImage.push([{
            //    uid: '1',
            //    name: itemUrl[itemUrl.length - 1],
            //    status: 'done',
            //    url: value.item_path,
            //}])
        });

        await getFilesData(activityData.icon_fid);

        let imagePath = "";

        imagePath = activityInfo.cd_path;
        setCd_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.cd_path,
        }]);

        imagePath = activityInfo.footer_path;
        setFooter_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.footer_path,
        }]);

        imagePath = activityInfo.no_win_path;
        setNo_win_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.no_win_path,
        }]);

        imagePath = activityInfo.slots_drawbar_ball_path;
        setSlotsDrawbarBall_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.slots_drawbar_ball_path,
        }]);

        imagePath = activityInfo.slots_drawbar_path;
        setDrawbar_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.slots_drawbar_path,
        }]);

        imagePath = activityInfo.slots_footer_path;
        setSlotsfooter_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.slots_footer_path,
        }]);

        imagePath = activityInfo.slots_frame_path;
        setSlotsframe_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.slots_frame_path,
        }]);

        imagePath = activityInfo.slots_path;
        setDraw_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.slots_path,
        }]);

        imagePath = activityInfo.tip_path;
        setTip_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.tip_path,
        }]);

        imagePath = activityInfo.win_path;
        setWin_image([{
            uid: '1',
            name: imagePath[imagePath.length - 1],
            status: 'done',
            url: activityInfo.win_path,
        }]);

        json.draw_title = activityInfo.slots_title;
        json.draw_content = activityInfo.slots_content;
        json.draw_note = activityInfo.slots_note;
        setContentData(activityInfo.slots_note);
        setPrize_image(pImage);
        setItem_image(iImage);
        form.setFieldsValue(json);
        setFormData(reqFormData);
    };

    const handleQuiz = async (data) => {
        const activityData = data.activityData[0];
        const activityInfo = data.activityInfo[0];
        const json = { ...activityData, ...activityInfo };
        const reqFormData = { ...formData };
        const pImage = [];
        const questionAImage = [];
        const questionBImage = [];
        let splitUrl = "";
        json.time = [dayjs(json.start_time * 1000), dayjs(json.end_time * 1000)];

        data.prize.forEach((value, index) => {
            json[`brand${index}`] = value.brand;
            json[`coupon_id${index}`] = value.coupon_id;
            json[`prize_amount${index}`] = value.prize_amount;
            json[`prize_name${index}`] = value.prize_name;
            json[`option${index}`] = value.option;

            reqFormData[`prize_id${index}`] = value.prize_id;

            splitUrl = value.prize_path.split("/");
            pImage.push([{
                uid: '1',
                name: splitUrl[splitUrl.length - 1],
                status: 'done',
                url: value.prize_path,
            }]);
        });

        data.question.forEach((value, index) => {
            json[`subject${index}`] = value.subject;
            json[`option_a${index}`] = value.option_a;
            json[`option_b${index}`] = value.option_b;

            reqFormData[`question_id${index}`] = value.question_id;

            const splitAUrl = value.reply_a_path.split("/");
            const splitBUrl = value.reply_a_path.split("/");
            questionAImage.push([{
                uid: '1',
                name: splitAUrl[splitAUrl.length - 1],
                status: 'done',
                url: value.reply_a_path,
            }]);
            questionBImage.push([{
                uid: '1',
                name: splitBUrl[splitBUrl.length - 1],
                status: 'done',
                url: value.reply_b_path,
            }]);
        });
        setContentData(activityInfo.quiz_note);

        await getFilesData(activityData.icon_fid);

        splitUrl = activityInfo.game_start_path;
        setStart_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.game_start_path,
        }]);

        splitUrl = activityInfo.game_background_path;
        setBackground_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.game_background_path,
        }]);

        splitUrl = activityInfo.game_title_path;
        setTitle_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.game_title_path,
        }]);

        splitUrl = activityInfo.quiz_path;
        setDraw_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.quiz_path,
        }]);

        splitUrl = activityInfo.win_path;
        setWin_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.win_path,
        }]);

        splitUrl = activityInfo.no_win_path;
        setNo_win_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.no_win_path,
        }]);

        splitUrl = activityInfo.cd_path;
        setCd_image([{
            uid: '1',
            name: splitUrl[splitUrl.length - 1],
            status: 'done',
            url: activityInfo.cd_path,
        }]);

        setPrize_image(pImage);
        setOption_a_image(questionAImage);
        setOption_b_image(questionBImage);
        json.draw_title = activityInfo.quiz_title;
        json.draw_content = activityInfo.quiz_content;
        json.draw_note = activityInfo.quiz_note;
        form.setFieldsValue(json);
        setFormData(reqFormData);
    };

    const getFilesData = (fid) => {
        fetch('/api/file?fid=' + fid, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                var filesData = data;
                console.log(filesData.file_path);
                setActivity_image([{
                    uid: '1',
                    name: filesData.file_name,
                    status: 'done',
                    url: filesData.file_path,
                }]);
            })
            .catch(error => console.error('Unable to add item.', error));
    };

    const save = async (data) => {
        console.log("beforeCheckData:", data);
        if (!webactivityID) {
            const check = await checkData(data);

            if (!check) {
                message.error('尚有圖示未上傳，請確認設定!');
                return;
            }

        }

        data = await handleSaveData(data);

        console.log(data);
        setLoading(true);

        fetch('/api/webactivity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(data), type: webactivityID ? 'edit' : 'new', WebActivityID: webactivityID })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                setLoading(false);
                const text = webactivityID ? "編輯站外活動成功!" : "新增站外活動成功!";
                messageBox("success", text);
            })
            .catch(error => {
                const text = webactivityID ? "編輯站外活動失敗!" : "新增站外活動失敗!";
                messageBox("error", text);
                setLoading(false);
                console.error('Unable to add item.', error);
            });
    };

    const checkData = async (data) => {
        let status = true;

        switch (data.activity_type) {
            case "DrawPrize":
                if (data.Activity_image.length == 0 ||
                    data.start_image.length == 0 ||
                    data.background_image.length == 0 ||
                    data.title_image.length == 0 ||
                    data.content_image.length == 0 ||
                    data.draw_image.length == 0 ||
                    data.win_image.length == 0 ||
                    data.no_win_image.length == 0 ||
                    data.cd_image.length == 0
                ) {
                    status = false;
                }
                break;
            case "Slots":
                if (data.Activity_image.length == 0 ||
                    data.footer_image.length == 0 ||
                    data.slotsfooter_image.length == 0 ||
                    data.slotsframe_image.length == 0 ||
                    data.slotsDrawbarBall_image.length == 0 ||
                    data.drawbar_image.length == 0 ||
                    data.tip_image.length == 0 ||
                    data.draw_image.length == 0 ||
                    data.win_image.length == 0 ||
                    data.no_win_image.length == 0 ||
                    data.cd_image.length == 0 ||
                    data.item_image == 0
                ) {
                    status = false;
                }
                break;
            case "Quiz":
                if (data.Activity_image.length == 0 ||
                    data.start_image.length == 0 ||
                    data.background_image.length == 0 ||
                    data.title_image.length == 0 ||
                    data.draw_image.length == 0 ||
                    data.win_image.length == 0 ||
                    data.no_win_image.length == 0 ||
                    data.cd_image.length == 0
                ) {
                    status = false;
                }
                break;
        }

        return status;
    };

    const handleSaveData = async (data) => {

        switch (data.activity_type) {
            case "DrawPrize":
                data.Activity_image = data.Activity_image ? JSON.stringify(data.Activity_image) : undefined;
                data.start_image = data.start_image ? JSON.stringify(data.start_image) : undefined;
                data.background_image = data.background_image ? JSON.stringify(data.background_image) : undefined;
                data.title_image = data.title_image ? JSON.stringify(data.title_image) : undefined;
                data.content_image = data.content_image ? JSON.stringify(data.content_image) : undefined;
                data.draw_image = data.draw_image ? JSON.stringify(data.draw_image) : undefined;
                data.win_image = data.win_image ? JSON.stringify(data.win_image) : undefined;
                data.no_win_image = data.no_win_image ? JSON.stringify(data.no_win_image) : undefined;
                data.cd_image = data.cd_image ? JSON.stringify(data.cd_image) : undefined;

                for (let i = 0; i < 100; i++) {
                    const name = `prize_image${i.toString()}`;
                    if (data.hasOwnProperty(name)) {
                        data[name] = data[name] ? JSON.stringify(data[name]) : undefined;
                    }
                    else {
                        break;
                    }
                }
                break;
            case "Slots":
                data.Activity_image = data.Activity_image ? JSON.stringify(data.Activity_image) : undefined;
                data.footer_image = data.footer_image ? JSON.stringify(data.footer_image) : undefined;
                data.slotsfooter_image = data.slotsfooter_image ? JSON.stringify(data.slotsfooter_image) : undefined;
                data.slotsframe_image = data.slotsframe_image ? JSON.stringify(data.slotsframe_image) : undefined;
                data.slotsDrawbarBall_image = data.slotsDrawbarBall_image ? JSON.stringify(data.slotsDrawbarBall_image) : undefined;
                data.drawbar_image = data.drawbar_image ? JSON.stringify(data.drawbar_image) : undefined;
                data.tip_image = data.tip_image ? JSON.stringify(data.tip_image) : undefined;
                data.draw_image = data.draw_image ? JSON.stringify(data.draw_image) : undefined;
                data.win_image = data.win_image ? JSON.stringify(data.win_image) : undefined;
                data.no_win_image = data.no_win_image ? JSON.stringify(data.no_win_image) : undefined;
                data.cd_image = data.cd_image ? JSON.stringify(data.cd_image) : undefined;
                data.item_image = data.item_image ? JSON.stringify(data.item_image) : undefined;

                for (let i = 0; i < 100; i++) {
                    const pName = `prize_image${i.toString()}`;
                    /*const iName = `item_image${i.toString()}`;*/
                    if (data.hasOwnProperty(pName)) {
                        data[pName] = data[pName] ? JSON.stringify(data[pName]) : undefined;
                        /* data[iName] = data[iName] ? JSON.stringify(data[iName]) : undefined;*/
                    }
                    else {
                        break;
                    }
                }
                break;
            case "Quiz":
                console.log(data)
                data.Activity_image = data.Activity_image ? JSON.stringify(data.Activity_image) : undefined;
                data.start_image = data.start_image ? JSON.stringify(data.start_image) : undefined;
                data.background_image = data.background_image ? JSON.stringify(data.background_image) : undefined;
                data.title_image = data.title_image ? JSON.stringify(data.title_image) : undefined;
                data.content_image = data.content_image ? JSON.stringify(data.content_image) : undefined;
                data.draw_image = data.draw_image ? JSON.stringify(data.draw_image) : undefined;
                data.win_image = data.win_image ? JSON.stringify(data.win_image) : undefined;
                data.no_win_image = data.no_win_image ? JSON.stringify(data.no_win_image) : undefined;
                data.cd_image = data.cd_image ? JSON.stringify(data.cd_image) : undefined;

                for (let i = 0; i < 100; i++) {
                    const question_a = `option_a_image${i}`;
                    const question_b = `option_b_image${i}`;
                    if (data.hasOwnProperty(question_a)) {
                        data[question_a] = data[question_a] ? JSON.stringify(data[question_a]) : undefined;
                        data[question_b] = data[question_b] ? JSON.stringify(data[question_b]) : undefined;
                    }
                    else {
                        break;
                    }
                }

                for (let i = 0; i < 100; i++) {
                    const name = `prize_image${i}`;
                    if (data.hasOwnProperty(name)) {
                        data[name] = data[name] ? JSON.stringify(data[name]) : undefined;
                    }
                    else {
                        break;
                    }
                }
                break;
        }

        return data;
    };

    const handleStepChange = (step, data, callSave) => {
        form.validateFields().then(() => {
            const mergeData = { ...formData, ...data };
            setCurrentStep(step);
            setFormData(mergeData);
            console.log(step);
            if (callSave) {
                save(mergeData);
            }
            else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        })
            .catch((errorInfo) => {
                console.log(formData);
                if (!data) {
                    setCurrentStep(step);
                }
                console.log("error:", errorInfo);
            });
    };

    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('請上傳 JPG/PNG 類型檔案!');
            return true;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('照片尺寸需小於 2MB!');
            return true;
        }
        return false;
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = async ({ fileList: newFileList }, name, index) => {
        console.log(newFileList);
        console.log(name);
        if (newFileList.length != 0) {
            if (newFileList[0].status === "error" || newFileList[0].status === "uploading") {
                handelImage([], name, index);
            }
            else {
                newFileList[0].thumbUrl = await getBase64(newFileList[0].originFileObj);
                handelImage(newFileList, name, index);
            }
        }
        else {
            handelImage(newFileList, name, index);
        }

    };

    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrentStep(value);
    };

    const handelImage = (fileList, name, index) => {
        switch (name) {
            case "activity_image":
                setActivity_image(fileList);
                break;
            case "start_image":
                setStart_image(fileList);
                break;
            case "footer_image":
                setFooter_image(fileList);
                break;
            case "slotsfooter_image":
                setSlotsfooter_image(fileList);
                break;
            case "drawbar_image":
                setDrawbar_image(fileList);
                break;
            case "tip_image":
                setTip_image(fileList);
                break;
            case "slotsframe_image":
                setSlotsframe_image(fileList);
                break;
            case "slotsDrawbarBall_image":
                setSlotsDrawbarBall_image(fileList);
                break;
            case "background_image":
                setBackground_image(fileList);
                break;
            case "title_image":
                setTitle_image(fileList);
                break;
            case "content_image":
                setContent_image(fileList);
                break;
            case "draw_image":
                setDraw_image(fileList);
                break;
            case "win_image":
                setWin_image(fileList);
                break;
            case "no_win_image":
                setNo_win_image(fileList);
                break;
            case "cd_image":
                setCd_image(fileList);
                break;
            case "option_a_image":
                const optaImage = [...option_a_image];
                optaImage[index] = fileList;
                setOption_a_image(optaImage);
                break;
            case "option_b_image":
                const optbImage = [...option_b_image];
                optbImage[index] = fileList;
                setOption_b_image(optbImage);
                break;
            case "item_image":
                setItem_image(fileList);
                break;
            case "prize_image":
                const image = [...prize_image];
                image[index] = fileList;
                setPrize_image(image);
                break;

        }
    };

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
                    onClose: () => {
                        navigate("/webactivity/list", { replace: true });
                    }
                });
                break;
        }

    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                上傳圖示
            </div>
        </div>
    );

    const steps = [
        {
            title: '活動設定',
            content:
                <InfoSetting
                    form={form}
                    onStepChange={handleStepChange}
                    activity_image={activity_image}
                    uploadButton={uploadButton}
                    getFile={getFile}
                    beforeUpload={beforeUpload}
                    handlePreview={handlePreview}
                    handleChange={handleChange}
                >
                </InfoSetting>,
        },
        {
            title: '畫面設定',
            content: formData.activity_type === "DrawPrize" ?
                <ViewSettingDrawPrize
                    form={form}
                    onStepChange={handleStepChange}
                    start_image={start_image}
                    background_image={background_image}
                    title_image={title_image}
                    content_image={content_image}
                    uploadButton={uploadButton}
                    getFile={getFile}
                    beforeUpload={beforeUpload}
                    handlePreview={handlePreview}
                    handleChange={handleChange}
                >
                </ViewSettingDrawPrize>
                : formData.activity_type === "Slots" ?
                    <ViewSettingSlots
                        form={form}
                        onStepChange={handleStepChange}
                        footer_image={footer_image}
                        slotsfooter_image={slotsfooter_image}
                        drawbar_image={drawbar_image}
                        tip_image={tip_image}
                        slotsframe_image={slotsframe_image}
                        slotsDrawbarBall_image={slotsDrawbarBall_image}
                        uploadButton={uploadButton}
                        getFile={getFile}
                        beforeUpload={beforeUpload}
                        handlePreview={handlePreview}
                        handleChange={handleChange}
                    >
                    </ViewSettingSlots>
                    : formData.activity_type === "Quiz" ?
                        <ViewSettingQuiz
                            form={form}
                            onStepChange={handleStepChange}
                            start_image={start_image}
                            background_image={background_image}
                            title_image={title_image}
                            uploadButton={uploadButton}
                            getFile={getFile}
                            beforeUpload={beforeUpload}
                            handlePreview={handlePreview}
                            handleChange={handleChange}
                        ></ViewSettingQuiz>
                        : <></>
        },
        {

            title: '活動說明',
            content: <ContentSetting
                form={form}
                onStepChange={handleStepChange}
                draw_image={draw_image}
                uploadButton={uploadButton}
                getFile={getFile}
                beforeUpload={beforeUpload}
                handlePreview={handlePreview}
                handleChange={handleChange}
                contentData={contentData}
                setContentData={setContentData}
            >
            </ContentSetting>,
        },
        {
            title: '題庫設定',
            content: <QuestionBank
                form={form}
                onStepChange={handleStepChange}
                option_a_image={option_a_image}
                setOption_a_image={setOption_a_image}
                option_b_image={option_b_image}
                setOption_b_image={setOption_b_image}
                uploadButton={uploadButton}
                getFile={getFile}
                beforeUpload={beforeUpload}
                handlePreview={handlePreview}
                handleChange={handleChange}
            >
            </QuestionBank>
        },
        {
            title: '獎項設定',
            content: formData.activity_type === "DrawPrize" ?
                <PrizeSettingDrawPrize
                    form={form}
                    onStepChange={handleStepChange}
                    win_image={win_image}
                    no_win_image={no_win_image}
                    cd_image={cd_image}
                    prize_image={prize_image}
                    setPrize_image={setPrize_image}
                    uploadButton={uploadButton}
                    getFile={getFile}
                    beforeUpload={beforeUpload}
                    handlePreview={handlePreview}
                    handleChange={handleChange}
                    save={save}
                >
                </PrizeSettingDrawPrize>
                : formData.activity_type === "Slots" ?
                    <PrizeSettingSlots
                        form={form}
                        onStepChange={handleStepChange}
                        win_image={win_image}
                        no_win_image={no_win_image}
                        cd_image={cd_image}
                        prize_image={prize_image}
                        setPrize_image={setPrize_image}
                        item_image={item_image}
                        setItem_image={setItem_image}
                        uploadButton={uploadButton}
                        getFile={getFile}
                        beforeUpload={beforeUpload}
                        handlePreview={handlePreview}
                        handleChange={handleChange}
                        save={save}
                    >
                    </PrizeSettingSlots>
                    : formData.activity_type === "Quiz" ?
                        <PrizeSettingQuiz
                            form={form}
                            onStepChange={handleStepChange}
                            win_image={win_image}
                            no_win_image={no_win_image}
                            cd_image={cd_image}
                            prize_image={prize_image}
                            setPrize_image={setPrize_image}
                            uploadButton={uploadButton}
                            getFile={getFile}
                            beforeUpload={beforeUpload}
                            handlePreview={handlePreview}
                            handleChange={handleChange}
                            save={save}
                        >
                        </PrizeSettingQuiz>
                        : <></>
        },
    ];
    
    return (
        <>
            <Spin tip="Loading" spinning={loading} style={{ marginTop: 250 }}>
                {contextHolder}
                <Title level={2}>新增站外活動</Title>
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item><Link to='/webactivity/list'>站外活動管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>新增</Breadcrumb.Item>
                </Breadcrumb>
                {console.log(currentStep) }
                <Steps current={currentStep} >
                    {
                        /*steps.map((step, index) => (
                            <Step key={index} title={step.title} />
                        ))*/
                    }
                    {
                        formData.activity_type === "Quiz" ?
                            steps.map((step, index) => (
                                <Step key={index} title={step.title} />
                            )) :
                            steps
                                .filter((obj, index) => index !== 3)
                                .map((step, index) => (
                                    <Step key={index} title={step.title} />

                                ))
    }
                </Steps>
                <br></br>
                <div className="steps-content">{steps[currentStep].content}</div>

                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
            </Spin>
        </>
    );
};

export default WebActivityNew;