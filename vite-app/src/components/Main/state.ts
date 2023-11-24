import { sendTitle } from '@kbase/ui-components';
import { Params } from '@kbase/ui-components/lib/redux/integration/store';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { StoreState } from '../../redux/store/types';
import { AsyncModelState, ModelLoaded } from '../../redux/store/types/common';
import { MainView } from '../../redux/store/types/views/Main';
import Main from './view';

export interface OwnProps { }

export type MainParams = Params<'tab'>;

interface StateProps {
    viewModel: ModelLoaded<MainView>;
}

interface DispatchProps {
    setTitle: (title: string) => void;
}

function mapStateToProps(state: StoreState, _props: OwnProps): StateProps {
    const {
        view: viewModel
    } = state;

    if (viewModel.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Ugh');
    }

    // TODO: call function to coerce raw params into typed params...
    // const params: MainParams = (rawParams as unknown) as MainParams;
    // return { viewModel, view, params };
    return { viewModel };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, _ownProps: OwnProps): DispatchProps {
    return {
        setTitle: (title: string) => {
            dispatch(sendTitle(title) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Main);
