import { faAngleDown } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionDetails, AccordionSummary, List } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ContentType from "./ContentType";

export default function ContentTypeList({ typeGroups }) {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        setExpanded(typeGroups[0].name)
    }, []);

    let typeIndex = 0;

    return (
        typeGroups.map((group) => (
            <Accordion
                expanded={expanded === group.name}
                onChange={handleChange(group.name)}
                TransitionProps={{ unmountOnExit: true }}
                key={group.name}
            >
                <AccordionSummary expandIcon={<FontAwesomeIcon icon={faAngleDown} />}>
                    {group.name}
                </AccordionSummary>

                <AccordionDetails>
                    <List>
                        {group.types.map((type) => <Draggable
                            key={type.id}
                            draggableId={type.id}
                            index={++typeIndex}
                        >
                            {(provided, snapshot) =>
                                <ContentType type={type} provided={provided} />
                            }
                        </Draggable>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion >
        ))
    );
}

ContentTypeList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
};