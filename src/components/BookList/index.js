import { Component } from "react";
import Header from "../Header";
import PriceRange from "../PriceRange";
import SearchInput from "../SearchInput";
import BookItem from "../BookItem";
import Loader from "../Loader";
import ErrorMessage from "../ErrorMessage";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class BookList extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    booksData: [],
    priceRangeValue: [0, 0],
  };

  componentDidMount() {
    this.getBooks("");
  }

  getBooks = async (searchInputValue) => {
    let apiUrl;
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });
    if (searchInputValue === "") {
      apiUrl = `https://api.itbook.store/1.0/new`;
    } else {
      apiUrl = `https://api.itbook.store/1.0/search/${searchInputValue}`;
    }

    const response = await fetch(apiUrl);

    if (response.ok) {
      const fetchedData = await response.json();
      this.setState(
        {
          booksData: fetchedData["books"],
          apiStatus: apiStatusConstants.success,
        },
        this.setPriceRangeValue
      );
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      });
    }
  };

  onChangePriceRange = (event) => {
    this.setState({ priceRangeValue: event });
  };

  getMaxPriceOfBooks = (books) => {
    let prices = books.map((eachBook) => parseFloat(eachBook.price.slice(1)));
    let maxPrice = Math.max(...prices);
    return maxPrice;
  };

  setPriceRangeValue = () => {
    const { booksData } = this.state;
    let maxPrice = this.getMaxPriceOfBooks(booksData);
    this.setState({ ...BookItem, priceRangeValue: [0, maxPrice] });
  };

 

  getFilteredBooksByPriceRange = () => {
    const { booksData, priceRangeValue } = this.state;
    const filteredBooks = booksData.filter((eachBook) => {
      let price = parseFloat(eachBook.price.slice(1));
      return price >= priceRangeValue[0] && price <= priceRangeValue[1];
    });
    return filteredBooks;
  };

  renderBooksListView = () => {
    const filteredBooks = this.getFilteredBooksByPriceRange();
    return (
      <>
        <h1 className="book-items-heading">Books</h1>
        <ul className="book-items-list-container">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((eachbook) => (
              <BookItem key={eachbook.isbn13} bookItemDetails={eachbook} />
            ))
          ) : (
            <p className="no-items-text">No Search Results Found</p>
          )}
        </ul>
      </>
    );
  };

  renderFailureView = () => {
    return <ErrorMessage />;
  };

  renderLoadingView = () => {
    return <Loader />;
  };

  renderBooks = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooksListView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    const { priceRangeValue, booksData } = this.state;

    return (
      <>
        <Header />
        <div className="book-list-container">
          <div className="book-list-content-container">
            <SearchInput onSearchBooks={this.getBooks} />
            <div className="books-container">
              <PriceRange
                onChangePriceRange={this.onChangePriceRange}
                priceRangeValue={priceRangeValue}
                maxPrice={this.getMaxPriceOfBooks(booksData)}
              />
              <div className="book-items-container">{this.renderBooks()}</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default BookList;