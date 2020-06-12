import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import Main from './view';
import { StoreState } from '../../types';
import { sendTitle } from '@kbase/ui-components';
import { Params } from '@kbase/ui-components/lib/redux/integration/store';
import { MainView } from '../../types/views/Main';
import { ModelLoaded, AsyncModelState } from '../../types/common';

export interface OwnProps { }

export type MainParams = Params<'tab'>;

interface StateProps {
    // params: MainParams;
    // view: string;
    viewModel: ModelLoaded<MainView>;
}

interface DispatchProps {
    setTitle: (title: string) => void;
    // setView: (view: string) => void;
    // setParams: (params: MainParams) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        view: viewModel
        // app: {
        //     runtime: {
        //         navigation: { view, params: rawParams }
        //     }
        // }
    } = state;

    if (viewModel.loadingState !== AsyncModelState.SUCCESS) {
        throw new Error('Ugh');
    }

    // TODO: call function to coerce raw params into typed params...
    // const params: MainParams = (rawParams as unknown) as MainParams;
    // return { viewModel, view, params };
    return { viewModel };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        setTitle: (title: string) => {
            dispatch(sendTitle(title) as any);
        },
        // setView: (view: string) => {
        //     dispatch(setView(view) as any);
        // },
        // setParams: (params: MainParams) => {
        //     dispatch(setParams(params) as any);
        // }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Main);
