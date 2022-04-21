import { useMutation, useQuery } from "@apollo/client";
import Tree, { moveItemOnTree, mutateTree } from "@atlaskit/tree";
import { faAngleDown, faAngleRight, faCog, faColumns, faFileAlt, faGripLines, faHamburger, faPlus, faTrashAlt } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Chip, IconButton, Typography, List, ListItemText, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { Page, PageContent } from "../../components/Page";
import { pageToNode, sortTree } from "../../components/PageTree";
import { DELETE_PAGES, GET_PAGES, SORT_PAGES } from "../../queries";
import { usePrompt } from "../../tmp-prompt";

export const PageIndex = () => {
  const [tree, setTree] = useState({
    items: {
    },
  });
  const [isDirty, setIsDirty] = useState(false);

  const navigate = useNavigate();

  const getPagesResult = useQuery(GET_PAGES);
  const [sortPages] = useMutation(SORT_PAGES, {
    refetchQueries: [
      GET_PAGES
    ]
  });
  const [deletePages] = useMutation(DELETE_PAGES, {});

  usePrompt('Are you sure you want to leave this page? You will lose any unsaved data.', isDirty);

  useEffect(() => {
    if (getPagesResult.loading == false && getPagesResult.data) {
      const tree = {
        rootId: 'root',
        items: {
          'root': {
            id: 'root',
            children: [],
            hasChildren: true,
            isExpanded: false,
            isChildrenLoading: false,
            data: {
              title: 'root',
            },
          },
        },
      };
      const pages = _.keyBy(getPagesResult.data.pages, 'id');

      _.forEach(getPagesResult.data.pages, (page) => {
        const id = page.id;

        if (!tree.items[id]) {
          tree.items[id] = pageToNode(page);
        }

        const parentId = page.parent_page_id === '0' ? 'root' : page.parent_page_id;
        let parentItem = tree.items[parentId];

        if (!parentItem) {
          tree.items[parentId] = pageToNode(pages[parentId]);
          parentItem = tree.items[parentId];
        }

        parentItem.children = _.union(parentItem.children, [id]);
      });

      setTree(tree);
    }
  }, [getPagesResult.loading, getPagesResult.data]);

  const renderItem = ({ item, onExpand, onCollapse, provided }) => {
    return <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        p: 1,
      }}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <Box
        {...provided.dragHandleProps}
      >
        <FontAwesomeIcon icon={faGripLines} />
      </Box>

      <Box>
        {item.children && item.children.length > 0
          ? item.isExpanded
            ? <IconButton onClick={() => onCollapse(item.id)}>
              <FontAwesomeIcon icon={faAngleDown} fixedWidth />
            </IconButton>
            : <IconButton onClick={() => onExpand(item.id)}>
              <FontAwesomeIcon icon={faAngleRight} fixedWidth />
            </IconButton>
          : <IconButton>
            <div style={{ width: '1.25em' }}>&bull;</div>
          </IconButton>
        }
      </Box>

      <Box onClick={() => handleShow(item.id)} sx={{ flex: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            {item.data.title}
          </Box>

          <Stack direction="row" spacing={1}>
            {item.data.isRoot && <Chip label="Root" size="small" color="info" variant="outlined" />}
            {!item.data.isPublished && <Chip label="Draft" size="small" color="info" variant="outlined" />}
            {!item.data.isShownInMenu && <Chip label="Hidden" size="small" color="info" variant="outlined" />}
          </Stack>

          <Box sx={{ p: 2 }}>
            {item.data.template}
          </Box>
        </Stack>
      </Box>


      <Stack
        direction="row"
        spacing={1}
      >
        <IconButton size="small" onClick={() => handleAdd(item.id)}>
          <FontAwesomeIcon icon={faPlus} />
        </IconButton>

        {item.children.length == 0 &&
          <IconButton size="small" color="error" onClick={() => handleRemove(item.id)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </IconButton>
        }
      </Stack>
    </Stack>
  };

  const handleShow = (id) => {
    navigate(`/pages/${id}`);
  };

  const handleAdd = (parentId) => {
    navigate(`/pages/create/${parentId}`);
  };

  const handleRemove = (id) => {
    _.forEach(tree.items, item => {
      if (item.children.includes(id)) {
        _.pull(item.children, id);

        return false;
      }
    });

    delete tree.items[id];

    setTree(_.cloneDeep(tree));

    setIsDirty(true);
  };

  const handleSave = () => {
    // Deleted pages
    const oldPages = getPagesResult.data.pages;
    const newPages = tree.items;
    const deletedPages = [];

    oldPages.forEach(oldPage => {
      let deleted = true;

      _.forEach(newPages, newPage => {
        if (oldPage.id == newPage.id) {
          deleted = false;
        }
      });

      if (deleted) {
        deletedPages.push(oldPage.id);
      }
    });

    const deletePagesInput = deletedPages;

    deletePages({
      variables: {
        input: deletePagesInput
      }
    })
      .then(() => {
        // Sort pages
        let sortPageInput = sortTree(tree, tree.items[tree.rootId].children);

        sortPageInput = sortPageInput.map(sortedPage => ({
          id: sortedPage.id,
          parent_page_id: sortedPage.parentId,
          sorting: sortedPage.sorting,
        }));

        sortPages({
          variables: {
            input: sortPageInput
          }
        });
      });

    setIsDirty(false);
  };

  const handleExpand = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: true }));
  };

  const handleCollapse = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: false }));
  };

  const handleDragEnd = (source, destination) => {
    if (!destination) {
      return;
    }

    const newTree = moveItemOnTree(tree, source, destination);
    setTree(newTree);

    setIsDirty(true);
  };

  const Footer = () => (
    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
      <Button color="secondary" onClick={handleSave} disabled={!isDirty}>Save</Button>
    </Box>
  );

  const isLoading = getPagesResult.loading;
  const error = getPagesResult.error;

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <Page
      heading="Pages"
      footer={<Footer />}
      fab={{
        handleClick: () => navigate('/pages/create/0'),
        icon: faPlus,
      }}
    >
      <PageContent>
        {getPagesResult.data.pages.length > 0 ? (
          <Tree
            tree={tree}
            renderItem={renderItem}
            onExpand={handleExpand}
            onCollapse={handleCollapse}
            onDragEnd={handleDragEnd}
            isDragEnabled
            isNestingEnabled
          />
        ) : (
          <Typography>There are no pages. <Link to="/pages/create/0">Create</Link> a page.</Typography>
        )}
      </PageContent>
    </Page>
  );
};