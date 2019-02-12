import * as React from "react";
import {Component, ReactNode} from "react";
import {Suspense} from "react";
import {ErrorBoundary} from "./ErrorBoundary";

/** Note dependency on Font Awesome and styles for vertical-center and text-center */
export const LoadingSpinner = () => <div className="vertical-center">
    <div className="container text-center">
        <i className="fa fa-2x fa-spinner fa-spin" style={{color: "#3b80cb"}}/>
    </div>
</div>;

export class Loading extends Component<{ loaded: boolean }> {
    render() {
        return this.props.loaded
            ? this.props.children
            : <LoadingSpinner/>;
    }
}

/** Show LoadingSpinner instead of children when React.lazy was used to import the component and we're waiting */
export const handleLazy = (child: ReactNode) => <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner/>}>{child}</Suspense>
    </ErrorBoundary>;
