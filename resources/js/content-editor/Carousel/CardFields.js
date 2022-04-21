import { useQuery } from "@apollo/client";
import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Error } from "../../components/Error";
import { FieldActions } from "../../components/Field";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { SelectMedia } from "../../components/Form/SelectMedia";
import { Loading } from "../../components/Loading";
import { PageCard } from "../../components/PageCard";
import { GET_CARD_TEMPLATES } from "../../queries";
import { CardField } from "../Card";

export const CardFields = ({ isTabsEnabled, tabType }) => {
    const { reset, getValues, watch } = useFormContext();

    const [cardTemplates, setCardTemplates] = useState([]);
    const [templateCardFields, setTemplateCardFields] = useState([]);

    const getCardTemplatesResult = useQuery(GET_CARD_TEMPLATES);

    const { fields, append, swap, remove } = useFieldArray({
        name: 'cards'
    });
    const watchTemplate = watch('cardTemplate');

    const loading = getCardTemplatesResult.loading;
    const error = getCardTemplatesResult.error;

    useEffect(() => {
        if (getCardTemplatesResult.loading === false && getCardTemplatesResult.data) {
            let cardTemplates = getCardTemplatesResult.data.cardTemplates;
            cardTemplates = cardTemplates.map(cardTemplate => ({
                value: cardTemplate.id,
                label: cardTemplate.name,
            }));
            setCardTemplates(cardTemplates);
        }
    }, [getCardTemplatesResult.loading, getCardTemplatesResult.data]);

    useEffect(() => {
        if (getCardTemplatesResult.data) {
            if (watchTemplate > 0) {
                const cardTemplates = getCardTemplatesResult.data.cardTemplates;

                cardTemplates.forEach(cardTemplate => {
                    if (cardTemplate.id == watchTemplate) {
                        setTemplateCardFields(JSON.parse(cardTemplate.config));
                    }
                });
            }
        }
    }, [watchTemplate, getCardTemplatesResult.data]);

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return (
        <Box>
            <Divider textAlign="left">
                <Chip label="Cards" />
            </Divider>

            <Select
                label="Template"
                name="cardTemplate"
                options={cardTemplates}
            />

            {watchTemplate && <Box>
                {fields.map((field, fieldIndex) => {
                    return <PageCard
                        key={field.id}
                        footer={
                            <FieldActions
                                fields={fields}
                                index={fieldIndex}
                                swap={swap}
                                remove={remove}
                            />
                        }
                    >
                        {isTabsEnabled && <>
                            {tabType == 'text' && <Input
                                label="Tab text"
                                name={`tabs.${fieldIndex}.content`}
                            />}

                            {tabType == 'media' && <SelectMedia
                                label="Tab media"
                                name={`tabs.${fieldIndex}.content`}
                            />}
                        </>}

                        {templateCardFields && templateCardFields.map((templateCardField, index) => {
                            const cardField = {
                                ...templateCardField
                            };
                            cardField.id = `cards.${fieldIndex}.${cardField.id}`;

                            return <CardField
                                key={index}
                                field={cardField}
                            />
                        })}
                    </PageCard>
                })}

                <Button onClick={() => append({})}>Add card</Button>
            </Box>}
        </Box>
    );
};