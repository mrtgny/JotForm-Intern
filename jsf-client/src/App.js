import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css'
//import routes from './routes';
import JSONSchemaViewer from './components/JSONSchema/JSONSchemaViewer'
import JSONSchemaForm from './components/JSONSchema/JSONSchemaForm'
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


  constructor(props, context) {
    super(props, context);
    this.state = { data: [] }
    this.reload = this.reload.bind(this);
  }

  state = { collapsed: false, };
  toggle = () => { this.setState({ collapsed: !this.state.collapsed, }); }

  componentWillMount() {
    this.reload()
  }

  createRoutes(data, parent) {
    let _data = data.filter(i => parent ? i.parent_id == parent.record_id : !i.parent_id)
    return _data.map(i => ({ ...i, children: this.createRoutes(data, i) }))
  }

  reload() {
    IotaApplication.actions.fetchQueryResult({
      path: "routes",
      params: {
        app_name: "jsf"
      },
      postAction: data => {
        this.setState({ data: this.createRoutes(data, null) })
      }
    })
  }


  render() {
    const routes = this.state.data || []
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

class ComponentRenderer extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = { data: {} }
    this.reload = this.reload.bind(this);
  }


  componentWillMount() {
    this.reload();
  }

  reload() {
    IotaApplication.actions.fetchQueryResult({
      path: "pages",
      params: {
        app_name: "jsf",
        record_id: this.props.page_id
      },
      postAction: data => {
        this.setState({ data: data[0].data })
      }
    })
  }

  render() {

    const { type } = this.props;
    return (
      <div>
        {type == "edit" ?
          <JSONSchemaForm data={this.state.data} />
          :
          <JSONSchemaViewer formData={this.state.data} />
        }
      </div>
    )
  }
}

const RouteRenderer = props => {
  const { routes, path } = props;
  return routes.map((route, index) => {
    const _path = (path || "") + (route.path ? "/" + route.path : "/:" + route.param)
    if (route.children) {
      return [
        <Route exact key={index + "s"} path={_path} component={() => <ComponentRenderer page_id={route.page_id} type={route.page_type} />} />,
        <RouteRenderer key={index} routes={route.children} path={_path} />
      ]
    } else {
      return (
        <Route exact key={index} path={_path} component={() => <ComponentRenderer page_id={route.page_id} type={route.page_type} />} />
      )
    }
  })
}

export default App;
