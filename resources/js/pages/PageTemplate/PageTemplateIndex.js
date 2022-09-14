import { useQuery, useMutation } from "@apollo/client";
import { faEdit, faPlus, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_PAGE_TEMPLATES, DELETE_PAGE_TEMPLATE } from "../../queries";

export const PageTemplateIndex = () => {
    const getPageTemplatesResult = useQuery(GET_PAGE_TEMPLATES);

    const [deletePageTemplate, deletePageTemplateResult] = useMutation(DELETE_PAGE_TEMPLATE, {
        refetchQueries: [
            {
                query: GET_PAGE_TEMPLATES,
            }
        ]
    });

    const navigate = useNavigate();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this item?')) {
            deletePageTemplate({
                variables: {
                    id
                }
            });
        }
    };


    const isLoading = getPageTemplatesResult.loading;
    const error = getPageTemplatesResult.error;

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            renderCell: (params) => (
                <>
                    <IconButton size="small" onClick={() => handleDelete(params.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </IconButton>

                    <IconButton size="small" onClick={() => navigate(`/pages/templates/${params.id}`)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                </>
            ),
        }
    ];

    const rows = getPageTemplatesResult.data.pageTemplates.map((pageTemplate) => ({
        id: pageTemplate.id,
        name: pageTemplate.name,
    }));

    return (
        <Page
            heading="Page templates"
            fab={{
                handleClick: () => navigate('/pages/templates/create'),
                icon: faPlus,
            }}
        >
            <PageContent>
                <div style={{ height: '60vh', width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        disableColumnMenu
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        disableSelectionOnClick
                    />
                </div>
            </PageContent>
        </Page>
    );
};