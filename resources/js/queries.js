import { gql } from "@apollo/client";

// Auth
export const GET_ME = gql`
    query Me {
        me {
            id

            name
            email
        }
    }`;

export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            token
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout {
            message
        }
    }
`;

// User
export const GET_USERS = gql`
    query GetUsers {
        users {
            id

            name
            email
        }
    }
`;

export const GET_USERS_PAGINATED = gql`
    query GetUsersPaginated($page: Int!) {
        usersPaginated(first: 25, page: $page) @connection(key: "user") {
            data {
                id

                name
                email
            }

            paginatorInfo {
                total
            }
        }
    }
`;

export const GET_USER = gql`
    query GetUser($id: ID!) {
        user(id: $id) {
            id

            name
            email
        }
    }
`;

export const UPSERT_USER = gql`
    mutation UpsertUser($input: UpsertUserInput!) {
        upsertUser(input: $input) {
            id

            name
            email
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
        }
    }
`;

// Version
export const GET_CURRENT_VERSION = gql`
    query GetCurrentVersion {
        currentVersion {
            version
        }
    }
`;

export const GET_LATEST_VERSION = gql`
    query GetLatestVersion {
        latestVersion {
            version
        }
    }
`;

export const UPDATE_TO_LATEST_VERSION = gql`
    mutation UpdateToLatestVersion {
        updateToLatestVersion {
            message
        }
    }
`;

// Page template
export const GET_PAGE_TEMPLATES = gql`
    query GetPageTemplates {
        pageTemplates {
            id
            name
            pageTemplateSections {
                id
                name
                key
                pageTemplateSectionColumns {
                    id
                }
            }
        }
    }
`;

export const GET_PAGE_TEMPLATE = gql`
    query GetPageTemplate($id: ID!) {
        pageTemplate(id: $id) {
            id
            name
            pageTemplateSections {
                id
                name
                key
                pageTemplateSectionColumns {
                    id
                }
            }
        }
    }
`;

export const UPSERT_PAGE_TEMPLATE = gql`
    mutation UpsertPageTemplate($input: UpsertPageTemplateInput!) {
        upsertPageTemplate(input: $input) {
            id
            name
            pageTemplateSections {
                id
                name
                key
                pageTemplateSectionColumns {
                    id
                }
            }
        }
    }
`;

export const DELETE_PAGE_TEMPLATE = gql`
    mutation DeletePageTemplate($id: ID!) {
        deletePageTemplate(id: $id) {
            id
        }
    }
`;

// Page
export const GET_PAGES = gql`
    query GetPages {
        pages {
            id
            parent_page_id
            page_template_id
            name
            route
            is_root
            is_published
            is_shown_in_menu
            pageTemplate {
                id
                name
            }
        }
    }
`;

export const GET_PAGE = gql`
    query GetPage($id: ID!) {
        page(id: $id) {
            id
            parent_page_id
            page_template_id
            name
            route
            is_root
            is_published
            is_shown_in_menu
            pageTemplate {
                id
                name
                pageTemplateSections {
                    id
                    name
                    key
                    sorting
                    pageTemplateSectionColumns {
                        id
                    }
                }
            }
            pageBlocks {
                id
                page_template_section_id
                page_template_section_column_id
                type
                content
                sorting
            }
        }
    }
`;

export const UPSERT_PAGE = gql`
    mutation UpsertPage($input: UpsertPageInput!) {
        upsertPage(input: $input) {
            id
            parent_page_id
            page_template_id
            name
            route
            is_root
            is_published
            is_shown_in_menu
            pageTemplate {
                id
                name
                pageTemplateSections {
                    id
                    name
                    key
                    sorting
                    pageTemplateSectionColumns {
                        id
                    }
                }
            }
            pageBlocks {
                id
                page_template_section_id
                page_template_section_column_id
                type
                content
                sorting
            }
        }
    }
`;

export const DELETE_PAGES = gql`
    mutation DeletePages($input: [ID]!) {
        deletePages(input: $input)
    }
`;

export const SORT_PAGES = gql`
    mutation SortPages($input: [SortPagesInput]!) {
        sortPages(input: $input) {
            id
            parent_page_id
            name
        }
    }
`;

// Page revision
export const GET_LATEST_PAGE_REVISION = gql`
    query GetLatestPageRevision($pageId: ID!) {
        latestPageRevision(page_id: $pageId, is_saved: true) {
            id
            page_id
            page_template_id
            name
            is_saved
            pageTemplate {
                id
                name
                pageTemplateSections {
                    id
                    name
                    key
                    sorting
                    pageTemplateSectionColumns {
                        id
                    }
                }
            }
            pageBlocks {
                id
                page_template_section_id
                page_template_section_column_id
                type
                content
                sorting
            }
        }
    }
`;

export const UPSERT_PAGE_REVISION = gql`
    mutation UpsertPageRevision($input: UpsertPageRevisionInput!) {
        upsertPageRevision(input: $input) {
            id
            page_id
            page_template_id
            name
            pageTemplate {
                id
                name
                pageTemplateSections {
                    id
                    name
                    key
                    sorting
                    pageTemplateSectionColumns {
                        id
                    }
                }
            }
            pageBlocks {
                id
                page_template_section_id
                page_template_section_column_id
                type
                content
                sorting
            }
        }
    }
`;

export const UPDATE_PAGE_REVISION_IS_SAVED = gql`
    mutation UpdatePageRevisionIsSaved($input: UpdatePageRevisionIsSavedInput!) {
        updatePageRevisionIsSaved(input: $input) {
            id
            is_saved
        }
    }
`;

// File
export const GET_FILES = gql`
    query GetFiles($path: String) {
        files(path: $path) {
            path
            files {
                path
                name
                type
                extension
            }
        }
    }
`;

export const MOVE_FILE = gql`
    mutation MoveFile($input: MoveFileInput!) {
        moveFile(input: $input) {
            path
            files {
                path
                name
                type
                extension
            }
        }
    }
`;

export const RENAME_FILE = gql`
    mutation RenameFile($input: RenameFileInput!) {
        renameFile(input: $input) {
            path
            files {
                path
                name
                type
                extension
            }
        }
    }
`;

export const DELETE_FILE = gql`
    mutation DeleteFile($input: DeleteFileInput!) {
        deleteFile(input: $input) {
            path
            files {
                path
                name
                type
                extension
            }
        }
    }
`;

export const UPLOAD_FILES = gql`
    mutation UploadFiles($path: String, $files: [Upload!]!) {
        uploadFiles(path: $path, files: $files)
    }
`;

export const CREATE_FOLDER = gql`
    mutation CreateFolder($input: CreateFolderInput!) {
        createFolder(input: $input) {
            path
            files {
                path
                name
                type
                extension
            }
        }
    }
`;

// Card templates
export const GET_CARD_TEMPLATES = gql`
    query GetCardTemplates {
        cardTemplates {
            id
            name
            key
            config
        }
    }
`;

export const GET_CARD_TEMPLATE = gql`
    query GetCardTemplate($id: ID!) {
        cardTemplate(id: $id) {
            id
            name
            key
            config
        }
    }
`;

export const UPSERT_CARD_TEMPLATE = gql`
    mutation UpsertCardTemplate($input: UpsertCardTemplateInput!) {
        upsertCardTemplate(input: $input) {
            id
            name
            key
            config
        }
    }
`;

export const DELETE_CARD_TEMPLATE = gql`
    mutation DeleteCardTemplate($id: ID!) {
        deleteCardTemplate(id: $id) {
            id
        }
    }
`;


// Fields
export const GET_FIELDS = gql`
    query GetFields {
        fields {
            id
            key
            name
        }
    }
`;

export const GET_FIELD = gql`
    query GetField($id: ID!) {
        field(id: $id) {
            id
            name
            key
            columns
            fieldBlocks {
                id
                column
                type
                content
                sorting
            }
        }
    }
`;

export const UPSERT_FIELD = gql`
    mutation UpsertField($input: UpsertFieldInput!) {
        upsertField(input: $input) {
            id
            name
            key
            columns
            fieldBlocks {
                id
                column
                type
                content
                sorting
            }
        }
    }
`;

export const DELETE_FIELD = gql`
    mutation DeleteField($id: ID!) {
        deleteField(id: $id) {
            id
        }
    }
`;

// Settings
export const GET_SETTINGS = gql`
    query GetSettings($id: String!) {
        settings(id: $id) {
            id
            value
        }
    }
`;

export const UPSERT_SETTINGS = gql`
    mutation UpsertSettings($id: String!, $value: String!) {
        upsertSettings(id: $id, value: $value) {
            id
            value
        }
    }
`;