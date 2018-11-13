import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import KBaseIntegration from './KBaseIntegration'
import { AppState } from '../types';

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
    const appStatus = AppState.NONE

    const onAppStart = () => { }
    const wrapper = shallow(<KBaseIntegration status={appStatus} onAppStart={onAppStart} />)

});
