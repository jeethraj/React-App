import React from 'react';
import '../Styles/home.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurantList: [],
            searchText: undefined,
            suggestions: []
        }
    }

    handleLocationChange = (event) => {
        const locId = event.target.value;
        sessionStorage.setItem('locationId', locId);

        axios({
            url: `http://localhost:8722/restaurants/${locId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurantList: response.data.restaurants });

            })
            .catch()

    }

    handleInputChange = (event) => {
        const { restaurantList } = this.state;
        const searchText = event.target.value;

        let searchRestaurants = [];
        if (searchText) {
            searchRestaurants = restaurantList.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }

        this.setState({ suggestions: searchRestaurants, searchText });

    }

    selectedText = (resItem) => {
        this.props.history.push(`/details?restaurant=${resItem._id}`);
    }

    renderSuggestions = () => {
        const { suggestions, searchText } = this.state;

        if (suggestions.length == 0 && searchText == "") {
            return <ul >
                <li>No Search Results Found</li>
            </ul>
        }
        return (
            <ul >
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.selectedText(item)}>{`${item.name} -   ${item.locality},${item.city}`}</li>))
                }
            </ul>
        );
    }


    render() {
        const { searchRestaurants } = this.state;
        const { locationsData } = this.props;

        return (
            <div>
                <div>
                    <div className="container-fluid">
                        <img className="img_main" src="./Assets/homepageimg.png" />
                        <div className="row">
                            <div className="wallpaper-content ">

                                <div className="col-lg-12 col-md-12 text-center">
                                    <b className="logo">e!</b>
                                </div>
                                <div className="col-lg-12 text-center headingm">Find the best restaurants, cafés, and bars</div>
                               
                                <div className="selectBoxh " styles="display: inline-block;">

                                    <select className="selectBox" onChange={this.handleLocationChange}>
                                        <option value="0" selected disabled>Please type a location</option>
                                        {locationsData.map((item) => {
                                            return <option key={item.location_id} value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                        })}

                                    </select>
                                </div>
                                <div className="restaurantSelector" styles="display: inline-block;">
                                {/* <div className="search-icon" styles="display: inline-block;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            className="bi bi-search " viewBox="0 0 16 16">
                                            <path
                                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                        </svg>
                                    </div> */}
                                    <div id="notebooks">
                                        <input className="searchBox" id="query"  type="text" placeholder="Search for Restaurants" onChange={this.handleInputChange} />
                                        {this.renderSuggestions()}</div>
                                    {/* <div id="notebooks">
                                        <input id="query" className="searchBox" type="text" placeholder="Please Enter Restaurant Name" onChange={this.handleInputChange} />
                                        {this.renderSuggestions()}
                                    </div> */}
                                    
                                </div>
                            </div>

                            {/* <span className="login-signup">
                                <a href="#" className="login">Login</a>
                                <a href="#" className="signup">Create new account</a>
                            </span> */}

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Wallpaper);