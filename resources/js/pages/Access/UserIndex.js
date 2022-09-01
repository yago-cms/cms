import { useQuery } from "@apollo/client";
import { faEdit, faPlus } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_USERS_PAGINATED } from "../../queries";

export const UserIndex = () => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const getUsersResult = useQuery(GET_USERS_PAGINATED, {
        variables: {
            page: 1,
        }
    });
    const navigate = useNavigate();

    const isLoading = getUsersResult.loading;
    const error = getUsersResult.error;

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
                <IconButton size="small" onClick={() => navigate(`/access/users/${params.id}`)}>
                    <FontAwesomeIcon icon={faEdit} />
                </IconButton>
            ),
        }
    ];

    const rows = getUsersResult.data.usersPaginated.data.map((user) => ({
        id: user.id,
        name: user.name,
    }));

    return (
        <Page
            heading="Users"
            fab={{
                handleClick: () => navigate('/access/users/create'),
                icon: faPlus,
            }}
        >
            <PageContent>
                <div style={{ height: '60vh', width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        paginationMode="server"
                        rowCount={getUsersResult.data.usersPaginated.paginatorInfo.total}
                        rowsPerPageOptions={[25]}
                        pageSize={25}
                        onPageChange={(page) => {
                            setIsLoadingMore(true);
                            getUsersResult.fetchMore({
                                variables: {
                                    page: page + 1,
                                }
                            }).then(() => setIsLoadingMore(false))
                        }}
                        loading={isLoadingMore}
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