import React from 'react';

class FailureAlert extends React.Component{

    render() {
        return (
            <div className="alert alert-danger" role="alert">
               User Creation failed .. Please Provide valid Details ---!!!
            </div>
        );
    }
}

export default FailureAlert;