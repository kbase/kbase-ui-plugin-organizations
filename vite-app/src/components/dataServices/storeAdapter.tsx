import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as actions from '../../redux/actions/dataServices';
import { StoreState } from '../../redux/store/types';
import Component from './component';

export interface OwnProps {

}

interface StateProps {

}

interface DispatchProps {
    onLoad: () => void;
    onUnload: () => void;
}

function mapStateToProps(): StateProps {
    return {

    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onLoad: () => {
            dispatch(actions.load() as any);
        },
        onUnload: () => {
            dispatch(actions.unload() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component);