import {YogaNodeProps} from '@wonderlandengine/react-ui';
import {Container, Text} from '@wonderlandengine/react-ui/components';
import {useHandViewModel} from '../hand/useHandViewModel.ts';

import {Card, CardType} from '../../../types/Card.ts';
import {Element} from '../../../hexagonmap/Element.ts';

export const CardTooltip = (props: YogaNodeProps & {card: Card | null}) => {
    const vm = useHandViewModel();

    return (
        <Container>
            {props.card && props.card.type === CardType.manipulation && (
                <Text
                    fontSize={12}
                    text={`Card Info: ${props.card.title} - ${props.card.stat.temperature || 0} Fire, ${props.card.stat.moisture || 0} Water, ${props.card.stat.elevation || 0} Earth, ${props.card.stat.fertility || 0} Air`}
                />
            )}
        </Container>
    );
};
