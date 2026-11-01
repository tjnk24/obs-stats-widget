import {ButtonProps} from 'antd';

interface OwnProps {
    url: string;
    type: ButtonProps['type'];
}

export type Props = OwnProps;
