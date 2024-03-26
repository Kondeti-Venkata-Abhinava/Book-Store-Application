import { Component } from "react";
import { BrowserRouter,Route, Switch,Redirect } from "react-router-dom";

import Home from './components/Home';
import BookList from './components/BookList';
import BookDetails from "./components/BookDetails"; 
import Cart from "./components/Cart";
import Checkout from './components/Checkout';
import NotFound from "./components/NotFound";
import CartContext from "./context/CartContext";

import "./App.css";

class App extends Component{
  state={cartList:[]}

  

    addToCart = (book) => {
      this.setState((prevState) => ({
        cartList: [...prevState.cartList, book],
      }));
    };

    deleteFromCart=(bookId)=>{
      const updatedCartList=this.state.cartList.filter((eachCartItem)=>
        eachCartItem.isbn13!==bookId
      );
      this.setState({cartList:updatedCartList});
    };

    resetCart=()=>{
      this.setState({cartList:[]});
    };

    render(){
      const {cartList}=this.state;
    return(
      <BrowserRouter>
       <CartContext.Provider
          value={{
            cartList,
            addToCart: this.addToCart,
            deleteFromCart: this.deleteFromCart,
            resetCart: this.resetCart
          }}
          >

          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/books" component={BookList} />
            <Route exact path="/books/:id" component={BookDetails} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/checkout" component={Checkout} />
            <Route exact path="/not-found" component={NotFound} />
            <Redirect to="not-found"/>
          </Switch>
          </CartContext.Provider>
      </BrowserRouter>
    )
  }
}
export default App;
