import { useQuery } from "@apollo/client";
import { faEdit, faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_CARD_TEMPLATES } from "../../queries";

export const CardTemplateIndex = () => {
    const getCardTemplatesResult = useQuery(GET_CARD_TEMPLATES);
    const navigate = useNavigate();

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
                <IconButton size="small" onClick={() => navigate(`/pages/cards/${params.id}`)}>
                    <FontAwesomeIcon icon={faEdit} />
                </IconButton>
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