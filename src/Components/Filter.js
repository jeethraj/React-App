import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            location: undefined,
            mealtype: undefined,
            cuisine: [],
            lcost: undefined,
            hcost: undefined,
            sort: undefined,
            page: undefined,
            pageCount: []
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { mealtype, location } = qs;

        const filterObj = {
            mealtype: mealtype,
            location: location

        };

        axios({
            url: 'http://localhost:8722/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, mealtype, location, pageCount: response.data.pageCount })
            })
            .catch()

        axios({
            url: 'http://localhost:8722/locations',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(respone => {
                this.setState({ locations: respone.data.locations })
            })
            .catch()
    }

    handleLocationChange = (event) => {
        const location = event.target.value;

        const { mealtype, cuisine, lcost, hcost, sort, page } = this.state;

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:8722/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, location, pageCount: response.data.pageCount })
            })
            .catch()


        this.props.history.push(`/filter?mealtype=${mealtype}&location=${location}`);
    }

    handleSortChange = (sort) => {

        const { location, mealtype, cuisine, lcost, hcost, page } = this.state;

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:8722/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, sort, pageCount: response.data.pageCount })
            })
            .catch()
    }

    handleCuisineChange = (cuisineId) => {

        const { location, mealtype, cuisine, sort, lcost, hcost, page } = this.state;

        const index = cuisine.indexOf(cuisineId);
        if (index >= 0) {
            cuisine.splice(index, 1);
        }
        else {
            cuisine.push(cuisineId);
        }
        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:8722/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, cuisine, pageCount: response.data.pageCount })
            })
            .catch()


    }
    handleCostChange = (lcost, hcost) => {

        const { location, mealtype, sort, cuisine, page } = this.state;

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:8722/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, lcost, hcost, pageCount: response.data.pageCount })
            })
            .catch()


    }

    handlePageChange = (page) => {
        const { location, mealtype, sort, cuisine, lcost, hcost } = this.state;
        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            url: 'http://localhost:8722/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants, pageCount: response.data.pageCount })
            })
            .catch()

    }

    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`);
    }

    render() {
        const { restaurants, locations, pageCount } = this.state;
        return (
            <div>
                <div id="myId" className="headingjp">Breakfast Places in Mumbai</div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-lg-3 filter-options">
                            <div className="collapse1 pt-1">
                                {/* <div className="filter-heading">Filters / Sort</div>
                            <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse"
                                data-target="#filter"></span> */}

                                <span classNAme="fjp"> Filter/Sort</span>
                                <span className="fas fa-chevron-down down-arrow pe-2 mt-2" styles="float: right;"
                                    data-bs-toggle="collapse" data-bs-target="#filter2"></span>

                            </div>

                            <div id="filter2" className=" collapse show">

                                <div className="Select-Location">Select Location</div>
                                <select onChange={this.handleLocationChange}>
                                    <option value="0">Select</option>
                                    {locations.map((item) => {
                                        return <option key={item.location_id} value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                    })}
                                </select>
                                <div className="Cuisine">Cuisine</div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(1)} />
                                    <span className="checkbox-items" >North Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(2)} />
                                    <span className="checkbox-items" >South Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(3)} />
                                    <span className="checkbox-items">Chineese</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(4)} />
                                    <span className="checkbox-items">Fast Food</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(5)} />
                                    <span className="checkbox-items">Street Food</span>
                                </div>
                                <div className="Cuisine">Cost For Two</div>
                                <div>
                                    <input type="radio" name='cost' onChange={() => this.handleCostChange(1, 500)} />
                                    <span className="checkbox-items">Less than &#8377; 500</span>
                                </div>
                                <div>
                                    <input type="radio" name='cost' onChange={() => this.handleCostChange(501, 1000)} />
                                    <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                </div>
                                <div>
                                    <input type="radio" name='cost' onChange={() => this.handleCostChange(1001, 1500)} />
                                    <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                </div>
                                <div>
                                    <input type="radio" name='cost' onChange={() => this.handleCostChange(1501, 2000)} />
                                    <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                </div>
                                <div>
                                    <input type="radio" name='cost' onChange={() => this.handleCostChange(2000, 10000)} />
                                    <span className="checkbox-items">&#8377; 2000 +</span>
                                </div>
                                <div className="Cuisine">Sort</div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => this.handleSortChange(1)} />
                                    <span className="checkbox-items">Price low to high</span>
                                </div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => this.handleSortChange(-1)} />
                                    <span className="checkbox-items">Price high to low</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm- > 08 col-md-8 col-lg-9">
                            {restaurants.length > 0 ? restaurants.map((item, index) => {
                                return <div className="Item" key={index} onClick={() => this.handleNavigate(item._id)}>
                                    <div>
                                        <div className="small-item vertical">
                                            <img className="img" src={`./${item.image}`} />
                                        </div>
                                        <div className="big-item">
                                            <div className="rest-name">{item.name}</div>
                                            <div className="rest-location">{item.locality}</div>
                                            <div className="rest-address">{item.city}</div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div>
                                        <div className="margin-left">
                                            <div className="Bakery">CUISINES : {item.cuisine.map((val) => `${val.name}, `)}</div>
                                            <div className="Bakery"> COST FOR TWO  : &#8377; {item.min_price} </div>
                                        </div>
                                    </div>
                                </div>
                            }) : <div class="no-records">No Records Found...</div>
                            }

                            {restaurants.length > 0 ? <div className="pagination">
                                <a href="#">&laquo;</a>
                                {pageCount.map((pageNo) => {
                                    return <a href="#" onClick={() => this.handlePageChange(pageNo)}>{pageNo}</a>
                                })}
                                <a href="#" >&raquo;</a>
                            </div> : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;