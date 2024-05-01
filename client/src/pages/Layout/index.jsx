import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';

import { Outlet } from 'react-router-dom';

import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;
export default function AppLayout() {
    return (
        <Layout className='layout'>
            {/* <Header style={{ background: '#fff', borderBottom: '1px solid #d9d9d9', position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
                <Navbar></Navbar>
            </Header> */}
            <Content style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Outlet></Outlet>
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>hedspi social ©2023 Created 科目に落ちる</Footer> */}
        </Layout>
    );
}
