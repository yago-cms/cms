import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import PropTypes from "prop-types";

export default function ContentType({ type, provided }) {
    return (
        <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <ListItemIcon>
                <FontAwesomeIcon icon={type.icon} />
            </ListItemIcon>

            <ListItemText primary={type.name} secondary={type.description} />
        </ListItem>
    );
}

ContentType.propTypes = {
    type: PropTypes.object.isRequired,
};