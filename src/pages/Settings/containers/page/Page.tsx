import {Flex} from 'antd';

import DiagnosticsCard from '../diagnostics-card';
import DisplayCard from '../display-card';
import PasswordCard from '../password-card';
import PortCard from '../port-card';
import UpdateCard from '../update-card';

const Page = () => (
    <Flex
        gap="small"
        vertical
    >
        <PortCard/>

        <PasswordCard/>

        <DisplayCard/>

        <UpdateCard/>

        <DiagnosticsCard/>
    </Flex>
);

export default Page;
