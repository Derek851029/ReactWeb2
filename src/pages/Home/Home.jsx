import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import PKHome from '../../images/banner.jpg';

const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;


const App = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout className="layout">
            <Header style={{
                        padding: 0,
                        background: colorBgContainer,
            }}> <Title level={2}>首頁</Title></Header>
            <br></br>
            <Content
                style={{
                    padding: '0 16px',
                }}
            >
                <img src={PKHome} style={{ width: '100%', height: 500 }}></img>
                <div
                    className="site-layout-content"
                    style={{
                        background: colorBgContainer,
                    }}
                >
                </div>
                <div style={{ textAlign: 'center', fontSize:64 }}>
                    歡迎使用 <br></br>
                    PK後台系統
                </div>
                
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                ©2023 PK All Rights Reserved.
            </Footer>
        </Layout>
    );
};
export default App;

