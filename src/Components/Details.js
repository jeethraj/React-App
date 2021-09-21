import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/details.css';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 1px brown'
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            itemsModalIsOpen: false,
            formModalIsOpen: false,
            galleryModalIsOpen: false,
            restaurantId: undefined,
            menuItems: [],
            subTotal: 0,
            name: undefined,
            email: undefined,
            contactNumber: undefined,
            address:undefined
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;

        axios({
            url: `http://localhost:8722/restaurant/${restaurant}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(respone => {
                this.setState({ restaurant: respone.data.restaurant, restaurantId: restaurant })
            })
            .catch()
    }

    handleOrder = () => {
        const { restaurantId } = this.state;
        axios({
            url: `http://localhost:8722/menuitems/${restaurantId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(respone => {
                this.setState({ menuItems: respone.data.items, itemsModalIsOpen: true })
            })
            .catch()
    }

    handleModalState = (state, value) => {
        this.setState({ [state]: value });
        //this.setState({ subTotal: 0 });
    }

    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty += 1;
        }
        else {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    handlePay = () => {

        this.setState({ itemsModalIsOpen: false, formModalIsOpen: true });
    }
    
    handleInputChange = (event,state) => {
                    this.setState({ [state] : event.target.value});
    }

    isDate (val) {
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        }else {
            return val
        }
    }

    buildForm = ({action, params}) => {
        const form = document.createElement('form')
        form.setAttribute('method','post')
        form.setAttribute('action',action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type','hidden')
            input.setAttribute('name',key)
            input.setAttribute('value',this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }
    
    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
          return fetch ('http://localhost:8722/payment', {
              method: "POST",
              headers: {
                    Accept: "application/json",
                    "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
    
          }).then(response => response.json()).catch(err => console.log(err))
    }

    payment =() => {

    const {subTotal , email} = this.state;
    console.log(subTotal +","+ email);
    const paymentObj = {
        amount : subTotal,
        email :email
    };
      this.getData(paymentObj).then(response => {
          var information = {
              action : "https://securegw-stage.paytm.in/order/process",
              params:response
          }
          this.post(information)
      }) 
    }

    render() {
        const { restaurant, itemsModalIsOpen, formModalIsOpen, galleryModalIsOpen,menuItems, subTotal } = this.state;
        return (
            <div>
                <div>
                    <img src={`./${restaurant.image}`} alt="No Image, Sorry for the Inconvinience" width="100%" height="400px" />

                    <button class="button" onClick = {() =>this.handleModalState('galleryModalIsOpen',true)}>Click to see Image Gallery</button>
                </div>
                <div class="heading">{restaurant.name}</div>
                <button class="btn-order" onClick={this.handleOrder}>Place Online Order</button>

                <div class="tabs">
                    <div class="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>
                        <div class="contentd">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(item => `${item.name}`)}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                        </div>
                    </div>

                    <div class="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>
                        <div class="contentd">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">{restaurant.name}</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={itemsModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('itemsModalIsOpen', false)}></div>
                        <div >
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="item-total">SubTotal : {subTotal}</h3>
                            <div> <button className="btn btn-danger order-button" style={{ float: 'right', margin: '5px' }} onClick={this.handlePay}> Pay Now</button></div>
                            {menuItems.map((item, index) => {
                                return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                    <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-price">&#8377;{item.price}</h5>
                                                    <p className="item-descp">{item.description}</p>
                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                                {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                    <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={formModalIsOpen}
                    style={customStyles}
                >
                    <div width="300px">
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('formModalIsOpen', false)}></div>
                        <div >
                            <h2 className="restaurant-name">{restaurant.name}</h2>

                        </div>
                        <div>
                            <div class="form-group">
                                <label for="usr" >Name:</label>
                                <input type="text" placeholder="Enter your Name" class="form-control" id="usr" style={{"width":"450px"}} onChange={ (event)=>this.handleInputChange(event,'name')}/>
                            </div>
                            <div class="form-group">
                                <label for="usr" >Email:</label>
                                <input type="text" placeholder="Enter your Email" class="form-control" id="usr" style={{"width":"450px"}} onChange={ (event)=>this.handleInputChange(event,'email')}/>
                            </div>
                            <div class="form-group">
                                <label for="Mno">Mobile Number</label>
                                <input type="text" placeholder="Enter your Mobile Number"  class="form-control" id="Mno" onChange={ (event)=>this.handleInputChange(event,'contactNumber')}/>
                            </div>
                            <div class="form-group">
                                <label for="comment">Address</label>
                                <textarea class="form-control" placeholder="Enter your Address" rows="5" id="comment" onChange={ (event)=>this.handleInputChange(event,'address')}></textarea>
                                <button className='btn btn-danger pbtn' onClick={ this.payment}>Proceed</button>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={galleryModalIsOpen}
                    style={customStyles}
                >
                    <div>
                    <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModalState('galleryModalIsOpen', false)}></div>
                    <Carousel
                           infiniteLoop ={false}
                           showThumbs ={false}
                           autoPlay ={false}
                    >
                        {restaurant && restaurant.thumb && restaurant.thumb.map((image) => {
                            return  <div>
                            <img src={image} height="500px" width="150px"/>
                            
                        </div>
                        })}
               
                
            </Carousel>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Details;