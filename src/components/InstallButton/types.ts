import {ReactNode} from 'react';

interface OwnProps {
    children: ReactNode;
    onStart?: () => void;
}

export type Props = OwnProps;
