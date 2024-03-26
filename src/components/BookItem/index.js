import {Link} from 'react-router-dom';

import './index.css';

const BookItem=(props)=>{
    const {bookItemDetails}=props;
    const {title,subtitle,isbn13,price,image}=bookItemDetails;

    return(
        <>
          <div className="book-item-container">
              <Link to={`/books/${isbn13}`} className="nav-link">
                  <img src={image} alt={image} className="book-image"/>
                  <h1 className="book-title">{title}</h1>
                  <p className="book-text">{subtitle}</p>
                  <p className="book-text">{price}</p>
              </Link>

          </div>
        </>
    )
}
export default BookItem;