import {
    Alert,
    Badge,
    Card,
    Flex,
    Statistic,
    Tag,
    Tooltip,
} from 'antd';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import BitrateGraph from '../../components/bitrate-graph';
import StatList from '../../components/stat-list';
import {formatNumber} from '../../utils/formatNumber';

import {useOutputCardView} from './hooks/useOutputCardView';
import {Props} from './types';

import style from './style.module.scss';

const OutputCard = ({target}: Props) => {
    const {t} = useTranslation();

    const {
        title,
        color,
        notes,
        platformMark,
        originTag,
        healthTag,
        statusKey,
        isActive,
        bitrate,
        isBitrateLoading,
        graph,
        now,
        items,
    } = useOutputCardView(target);

    return (
        <Card
            size="small"
            classNames={{
                root: style.card,
                title: style.title,
                body: style.body,
            }}
            title={(
                <Flex
                    wrap
                    align="center"
                    gap={6}
                >
                    <Badge
                        color={color}
                        text={title}
                    />

                    {platformMark && (
                        <Tooltip title={t(platformMark.hintKey)}>
                            <span>{platformMark.emoji}</span>
                        </Tooltip>
                    )}

                    <Tooltip title={originTag.hint}>
                        <Tag
                            color={originTag.color}
                            variant="outlined"
                        >
                            {originTag.text}
                        </Tag>
                    </Tooltip>
                </Flex>
            )}
            extra={(
                <Tag
                    color={healthTag.color}
                    variant={healthTag.variant}
                >
                    {t(statusKey)}
                </Tag>
            )}
        >
            <Flex
                className={style.bitrateRow}
                align="center"
                gap="middle"
            >
                <Statistic
                    value={bitrate}
                    loading={isBitrateLoading}
                    formatter={value => (typeof value === 'number' ? formatNumber(value) : value)}
                    suffix={t('stats.bitrateUnit')}
                    classNames={{
                        root: style.bitrate,
                        content: cn(style.bitrateValue, {[style.inactiveBitrate]: !isActive}),
                        suffix: style.bitrateUnit,
                    }}
                />

                <BitrateGraph
                    points={graph}
                    now={now}
                    color={color}
                    isActive={isActive}
                />
            </Flex>

            <StatList items={items}/>

            {notes.map(({text, type}) => (
                <Alert
                    key={text}
                    className={style.note}
                    type={type}
                    title={text}
                    showIcon
                />
            ))}
        </Card>
    );
};

export default OutputCard;
