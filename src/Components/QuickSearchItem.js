import React from 'react';
import { withRouter } from 'react-router-dom';

class QuickSearchItem extends React.Component {
    handleNavigate = (mealTypeId) => {
        //this.props.history.push(`/filter?mealtype=${mealTypeId}`);
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter?mealtype=${mealTypeId}&location=${locationId}`);
        }
        else {
            this.props.history.push(`/filter?mealtype=${mealTypeId}`);
        }
    }

    render() {
        const { item } = this.props;
        return (
            <div onClick={() => this.handleNavigate(item.meal_type)} key={item.meal_type} className="col-lg-4 col-md-6 col-sm-6 rect-1 ">
                            <div className="div-brakfast">
                                <img className="img-brakfast" src={`./${item.image}`} />
                            </div>
                            <div className="div-brakfast">
                                <div className="head-item">{item.name}</div>
                                <div className="content">{item.content}</div>
                            </div>
                        </div>        )
    }
}

export default withRouter(QuickSearchItem);