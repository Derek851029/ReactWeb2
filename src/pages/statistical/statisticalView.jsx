import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';

import MemberList from './memberList'
import DownloadYear from './downloadYear'
import NewsRead from "./NewsRead";
import DyncmicReport from "./DynamicReport";

const StatisticalView = () => {
    const { value } = useParams();

    const [showPage, setShowPage] = useState(null);

    useEffect(() => {
        initPage()
    }, []);

    const initPage = () => {
        let componet;
        switch (value) {
            case "newsReadMonth":
                componet = <NewsRead></NewsRead>
                break;
            case "memberList":
                componet = <MemberList></MemberList>;
                break;
            case "downloadYear":
                componet = <DownloadYear></DownloadYear>;
                break;
            case "dynamicReport":
                componet = <DyncmicReport></DyncmicReport>;
                break;
                
        }

        setShowPage(componet);
    };

    return (
        <>
            {showPage}
        </>
    );
};

export default StatisticalView;