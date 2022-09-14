import { useQuery, useMutation } from "@apollo/client";
import { faEdit, faPlus, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { GET_FIELDS, DELETE_FIELD } from "../../queries";

export const FieldIndex = () => {
  const getFieldsResult = useQuery(GET_FIELDS);

  const [deleteField, deleteFieldResult] = useMutation(DELETE_FIELD, {
    refetchQueries: [
      {
        query: GET_FIELDS,
      }
    ]
  });

  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this item?')) {
      deleteField({
        variables: {
          id
        }
      });
    }
  };

  const isLoading = getFieldsResult.loading;
  const error = getFieldsResult.error;

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

          <IconButton size="small" onClick={() => navigate(`/fields/${params.id}`)}>
            <FontAwesomeIcon icon={faEdit} />
          </IconButton>
        </>
      ),
    }
  ];

  const rows = getFieldsResult.data.fields.map((field) => ({
    id: field.id,
    name: field.name,
  }));

  return (
    <Page
      heading="Fields"
      fab={{
        handleClick: () => navigate('/fields/create'),
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