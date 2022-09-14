import { useQuery, useMutation } from "@apollo/client";
import { faEdit, faPlus, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_CARD_TEMPLATES, DELETE_CARD_TEMPLATE } from "../../queries";

export const CardTemplateIndex = () => {
    const getCardTemplatesResult = useQuery(GET_CARD_TEMPLATES);

    const [deleteCardTemplate, deleteCardTemplateResult] = useMutation(DELETE_CARD_TEMPLATE, {
        refetchQueries: [
            {
                query: GET_CARD_TEMPLATES,
            }
        ]
    });

    const navigate = useNavigate();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this item?')) {
            deleteCardTemplate({
                variables: {
                    id
                }
            });
        }
    };

    const isLoading = getCardTemplatesResult.loading;
    const error = getCardTemplatesResult.error;

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

                    <IconButton size="small" onClick={() => navigate(`/pages/cards/${params.id}`)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                </>
            ),
        }
    ];

    const rows = getCardTemplatesResult.data.cardTemplates.map((cardTemplate) => ({
        id: cardTemplate.id,
        name: cardTemplate.name,
    }));

    return (
        <Page
            heading="Card templates"
            fab={{
                handleClick: () => navigate('/pages/cards/create'),
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