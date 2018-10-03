import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css'
import routes from './routes';
import JSONSchemaSetter from './components/JSONSchemaSetter'
import "./css/App.css";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { IotaApplication } from './utils'

const { Header, Sider, Content } = Layout;


class App extends React.Component {

  state = { collapsed: false, };
  toggle = () => { this.setState({ collapsed: !this.state.collapsed, }); }

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed} >
            <div className="logo centered-item"> JSF WP </div>

            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              {routes.map((route, index) => {
                return (
                  <Menu.Item key={index}>
                    <Link to={route.path} replace>
                      <Icon type={route.icon} />
                      <span>{route.label}</span>
                    </Link>
                  </Menu.Item>
                )
              })}
            </Menu>

          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
            </Header>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              <RouteRenderer routes={routes} />
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

const RouteRenderer = props => {
  const { routes, path } = props;
  return routes.map((route, index) => {
    const _path = (path || "") + (route.path ? "/" + route.path : "/:" + route.param)
    if (route.children) {
      return [
        <Route exact key={index + "s"} path={_path} component={route.component} />,
        <RouteRenderer key={index} routes={route.children} path={_path} />
      ]
    } else {
      return (
        <Route exact key={index} path={_path} component={route.component} />
      )
    }
  })
}

export default App;
