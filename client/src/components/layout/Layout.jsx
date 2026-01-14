import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Dropdown, Switch, Space, Tooltip } from 'antd'
import {
  DashboardOutlined,
  ProjectOutlined,
  LogoutOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore, getThemeConfig } from '../../store/themeStore'
import { ConfigProvider } from 'antd'
import './Layout.css'

const { Header, Sider, Content } = AntLayout

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: 'Projects',
    },
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ]

  const themeConfig = getThemeConfig(isDark)

  return (
    <ConfigProvider theme={themeConfig}>
      <AntLayout className={`app-layout ${isDark ? 'dark' : 'light'}`}>
        <Sider
          width={50}
          className="sidebar"
          theme="dark"
          collapsible={false}
        >
          <div className="sidebar-logo">
            <div className="logo-icon">
              <ProjectOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            </div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.map(item => ({
              key: item.key,
              icon: (
                <Tooltip title={item.label} placement="right" mouseEnterDelay={0.3}>
                  {item.icon}
                </Tooltip>
              ),
              label: null,
            }))}
            onClick={handleMenuClick}
            theme="dark"
            className="sidebar-menu"
          />
        </Sider>
        <AntLayout 
          className="main-layout"
          style={{ 
            marginLeft: 50
          }}
        >
          <Header className="header">
            <div className="header-content">
              <div className="header-left">
                <div className="app-name">FlowTrack</div>
              </div>
              <div className="header-right">
                <Space>
                  <Switch
                    checked={isDark}
                    onChange={toggleTheme}
                    checkedChildren={<MoonOutlined />}
                    unCheckedChildren={<SunOutlined />}
                  />
                  <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <Space className="user-info" style={{ cursor: 'pointer' }}>
                      <Avatar src={user?.avatar} icon={<UserOutlined />} />
                      <span>{user?.name}</span>
                    </Space>
                  </Dropdown>
                </Space>
              </div>
            </div>
          </Header>
          <Content className="content">
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </ConfigProvider>
  )
}

export default Layout
