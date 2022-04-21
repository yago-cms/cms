import { useQuery } from "@apollo/client";
import { forwardRef, useEffect, useState } from "react";
import { GET_SETTINGS } from "../../queries";
import { Error } from "../Error";
import { Loading } from "../Loading";
import { Select } from "./Select";

export const SelectBreakpoint = ({ label, ...props }) => {
    const [options, setOptions] = useState(null);

    const getSettingsResult = useQuery(GET_SETTINGS, {
        variables: {
            id: 'media',
        }
    });

    const isLoading = getSettingsResult.loading;
    const error = getSettingsResult.error;

    useEffect(() => {
        if (getSettingsResult.loading === false && getSettingsResult.data) {
            const { breakpointGroups } = JSON.parse(getSettingsResult.data.settings.value);

            const options = breakpointGroups.map(breakpointGroup => ({
                label: breakpointGroup.name,
                value: breakpointGroup.key,
            }));

            setOptions(options);
        }
    }, [getSettingsResult.loading, getSettingsResult.data]);

    if (isLoading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        options && <Select
            {...{ label, options, ...props }}
        />
    );
};