import Routes from './pages/Routes'
import Pages from './pages/Pages/index'
import NewPage from './pages/Pages/NewPage'

const routes = [
    {
        icon: "fork",
        label: "Routes",
        path: "routes",
        component: Routes
    },
    {
        icon: "profile",
        label: "Pages",
        path: "pages",
        component: Pages,
        children: [
            {
                label: "New Page",
                path: "newpage",
                component: NewPage
            },
            {
                path: "edit",
                children: [
                    {
                        label: "Düzenle",
                        param: "page_id",
                        component: NewPage
                    }
                ]
            },
        ]
    },
]

export default routes;