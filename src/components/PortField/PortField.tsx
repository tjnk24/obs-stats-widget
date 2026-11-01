import {Form, InputNumber} from 'antd';
import {useTranslation} from 'react-i18next';

import {PORT_RULES} from './consts';
import {Props} from './types';

import style from './style.module.scss';

const PortField = ({extra}: Props) => {
    const {t} = useTranslation();

    return (
        <Form.Item
            name="port"
            label={t('portField.label')}
            extra={extra}
            rules={PORT_RULES}
            required
        >
            <InputNumber
                type="number"
                className={style.input}
                precision={0}
            />
        </Form.Item>
    );
};

export default PortField;
