import { faCaretDown, faCaretUp, faTimes } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup, IconButton } from "@mui/material";

export const FieldActions = ({ fields, index, swap, remove }) => {
    const isFirst = index == 0;
    const isLast = index == fields.length - 1;

    return (
        <ButtonGroup>
            {!isFirst &&
                <IconButton
                    size="small"
                    onClick={() => swap(index, index - 1)}
                >
                    <FontAwesomeIcon fixedWidth icon={faCaretUp} />
                </IconButton>
            }
            {!isLast &&
                <IconButton
                    size="small"
                    onClick={() => swap(index, index + 1)}
                >
                    <FontAwesomeIcon fixedWidth icon={faCaretDown} />
                </IconButton>
            }

            <IconButton
                size="small"
                onClick={() => remove(index)}
            >
                <FontAwesomeIcon fixedWidth icon={faTimes} />
            </IconButton>
        </ButtonGroup>
    );
};