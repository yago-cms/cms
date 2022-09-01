import { UserForm } from './pages/Access/UserForm';
import { UserIndex } from './pages/Access/UserIndex';
import { CardTemplateForm } from './pages/CardTemplate/CardTemplateForm';
import { CardTemplateIndex } from './pages/CardTemplate/CardTemplateIndex';
import { DashboardIndex } from './pages/Dashboard/DashboardIndex';
import { FieldForm } from './pages/Field/FieldForm';
import { FieldIndex } from './pages/Field/FieldIndex';
import { FileIndex } from './pages/File/FileIndex';
import { PageForm } from './pages/Page/PageForm';
import { PageIndex } from './pages/Page/PageIndex';
import { PageTemplateForm } from './pages/PageTemplate/PageTemplateForm';
import { PageTemplateIndex } from './pages/PageTemplate/PageTemplateIndex';
import { SettingsIndex } from './pages/Settings/SettingsIndex';
import { SettingsMedia } from './pages/Settings/SettingsMedia';
import { SettingsUpdate } from './pages/Settings/SettingsUpdate';

export default [
    {
        path: '/',
        exact: true,
        component: <DashboardIndex />
    },
    {
        path: '/pages',
        exact: true,
        component: <PageIndex />
    },
    {
        path: '/pages/templates',
        exact: true,
        component: <PageTemplateIndex />
    },
    {
        path: '/pages/templates/create',
        exact: true,
        component: <PageTemplateForm />
    },
    {
        path: '/pages/templates/:id',
        component: <PageTemplateForm />
    },
    {
        path: '/pages/cards',
        exact: true,
        component: <CardTemplateIndex />
    },
    {
        path: '/pages/cards/create',
        exact: true,
        component: <CardTemplateForm />
    },
    {
        path: '/pages/cards/:id',
        component: <CardTemplateForm />
    },
    {
        path: '/pages/create/:parentId',
        component: <PageForm />
    },
    {
        path: '/pages/:id',
        component: <PageForm />
    },
    {
        path: '/fields',
        exact: true,
        component: <FieldIndex />,
    },
    {
        path: '/fields/create',
        component: <FieldForm />,
    },
    {
        path: '/fields/:id',
        component: <FieldForm />,
    },
    {
        path: '/files',
        exact: true,
        component: <FileIndex />
    },
    {
        path: '/files/*',
        component: <FileIndex />
    },
    {
        path: '/access/users',
        exact: true,
        component: <UserIndex />
    },
    {
        path: '/access/users/create',
        component: <UserForm />
    },
    {
        path: '/access/users/:id',
        component: <UserForm />
    },
    {
        path: '/settings',
        exact: true,
        component: <SettingsIndex />
    },
    {
        path: '/settings/update',
        component: <SettingsUpdate />
    },
    {
        path: '/settings/media',
        component: <SettingsMedia />
    },
];
