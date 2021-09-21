import React from 'react';
import '../Styles/home.css';
import QuickSearchItem from './QuickSearchItem';

class QuickSearch extends React.Component {
    render() {
        const { QuickSearchData } = this.props;
        return (
            <div>
               <div className="container filterFont">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 mt-1  Quick-Searches">Quick Searches</div>

                        <div className="col-lg-12 col-md-12 col-sm-12 Discover-restaurants">Discover restaurants by type of meal</div>
                    </div>
                </div>
                
                <div className="container">
                    <div className="row ">
                        {QuickSearchData.map((item) =>{
                            return <QuickSearchItem item = {item} />
                        }
                        )}
                        
                        

                    </div>
                </div>


            </div>
        )
    }
}

export default QuickSearch;