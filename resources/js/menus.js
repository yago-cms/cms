import { faCogs, faFile, faImages, faSquare, faTachometer, faUsers } from "@fortawesome/pro-duotone-svg-icons";

export default [
    {
        name: 'Dashboard',
        icon: faTachometer,
        route: '/'
    },
    {
        name: 'Pages',
        icon: faFile,
        children: [
            {
                name: 'Manage',
                route: '/pages',
            },
            {
                name: 'Page templates',
                route: '/pages/templates',
            },
            {
                name: 'Card templates',
                route: '/pages/cards',
            },
        ]
    },
    {
        name: 'Fields',
        icon: faSquare,
        route: '/fields'
    },
    {
        name: 'Files',
        icon: faImages,
        route: '/files'
    },
    {
        name: 'Access',
        icon: faUsers,
        children: [
            {
                name: 'Users',
                route: '/access/users'
            },
        ]
    },
    {
        name: 'Settings',
        icon: faCogs,
        children: [
            {
                name: 'Manage',
                route: '/settings'
            },
            {
                name: 'Update',
                route: '/settings/update'
            },
            {
                name: 'Media',
                route: '/settings/media'
            },
        ],
    },
];