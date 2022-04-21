export const modules = [];
export let contentTypeGroups = require('./content-editor').contentTypeGroups;
export let contentTypeModules = require('./content-editor').contentTypeModules;

export const registerModule = (module, routes, menus, moduleContentTypeGroups, moduleContentTypeModules) => {
    modules.push({
        module,
        routes,
        menus,
        moduleContentTypeGroups,
        moduleContentTypeModules,
    });

    contentTypeGroups = contentTypeGroups.concat(moduleContentTypeGroups);
    contentTypeModules = contentTypeModules.concat(moduleContentTypeModules);
};

export { Checkbox } from "./components/Form/Checkbox";
export { DatePicker } from "./components/Form/DatePicker";
export { DateTimePicker } from "./components/Form/DateTimePicker";
export { Input } from "./components/Form/Input";
export { Location } from "./components/Form/Location";
export { Select } from "./components/Form/Select";
export { SelectBreakpoint } from "./components/Form/SelectBreakpoint";
export { SelectMedia } from "./components/Form/SelectMedia";
export { SelectPage } from "./components/Form/SelectPage";
export { Textarea } from "./components/Form/Textarea";
export { TimePicker } from "./components/Form/TimePicker";
export { Wysiwyg } from "./components/Form/Wysiwyg";

export { Error } from "./components/Error";
export { Loading } from "./components/Loading";
export { Page } from "./components/Page";
export { PageContent } from "./components/Page";
export { PageCard } from "./components/PageCard";
export { FieldActions } from "./components/Field";
export * as Map from "./components/Map";
export { usePrompt } from "./tmp-prompt";
