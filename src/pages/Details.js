import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import InputRating from '../components/InputRating';
import Footer from '../components/Footer';

class Details extends React.Component {
    state = {
      product: {},
      productList: '',
      redirect: false,
      inputRating: null,
      email: '',
      mensagem: '',
      evaluations: [],
      hasEvaluations: false,
      idItem: '',
    }

    componentDidMount() {
      this.getLocalStorageEvaluations();
      this.getLocal();
    }

    getLocal = async () => {
      const { match: { params: { id } } } = this.props;
      const url = `https://api.mercadolibre.com/items/${id}`;
      const response = await fetch(url);
      const data = await response.json();
      const list = JSON.parse(localStorage.getItem(id));
      this.setState({
        product: data,
        productList: list,
        idItem: id,
      });
    }

    getLocalStorageEvaluations = () => {
      const { match: { params: { id } } } = this.props;
      if (localStorage.getItem(id)) {
        const evaluationsList = JSON.parse(localStorage.getItem(id));
        return this.setState({ evaluations: evaluationsList, hasEvaluations: true });
      }
      this.setState({
        evaluations: [],
      });
    }

    handleBtnCart = () => {
      this.setState({
        redirect: true,
      });
    }

    handleBtnAddCart = () => {
      // changing
      const { product, productList } = this.state;
      if (productList) {
        const arr = [...productList];
        arr.push(product);
        return this.setState({ productList: arr }, () => {
          localStorage.setItem('productId', JSON.stringify(arr));
        });
      }
      const arr = [];
      arr.push(product);
      this.setState({ productList: arr }, () => {
        localStorage.setItem('productId', JSON.stringify(arr));
      });
    };

    handleChange = (event) => {
      console.log(event.target.value);
      const { target: { value, checked, name } } = event;
      const valor = name === 'email' || name === 'mensagem' ? value : checked;
      if (checked) {
        return this.setState({
          [name]: value,
        });
      }
      this.setState({
        [name]: valor,
      });
    }

    handleSubmit = (e) => {
      const { email, mensagem, inputRating, evaluations, idItem } = this.state;
      e.preventDefault();
      if (evaluations) {
        const obj = { email, mensagem, inputRating };
        const arr = [...evaluations];
        arr.push(obj);
        return this.setState({
          evaluations: arr,
          hasEvaluations: true,
          inputRating: null,
          email: '',
          mensagem: '',
        }, () => localStorage.setItem(idItem, JSON.stringify(arr)));
      }
      const obj = { email, mensagem, inputRating };
      const arr = [];
      arr.push(obj);
      this.setState({
        evaluations: arr,
        hasEvaluations: true,
        inputRating: null,
        email: '',
        mensagem: '',
      }, () => localStorage.setItem(idItem, JSON.stringify(arr)));
    }

    render() {
      const { product: { price, thumbnail, title }, redirect,
        email, mensagem, evaluations, hasEvaluations } = this.state;
      if (redirect) {
        return (
          <Redirect to="/cart" />
        );
      }
      return (
        <>
          <Header storageList={ JSON.parse(localStorage.getItem('productId')) } />
          <p data-testid="product-detail-name">{ title }</p>
          <img src={ thumbnail } alt={ title } />
          <p>{ price }</p>
          <button
            type="button"
            data-testid="product-detail-add-to-cart"
            onClick={ this.handleBtnAddCart }
          >
            Adicionar ao Carrinho
          </button>
          <div>
            <button
              data-testid="shopping-cart-button"
              type="button"
              onClick={ this.handleBtnCart }
            >
              Carrinho de compras
            </button>
          </div>
          <div>
            <h3>Avaliação</h3>
            <form>
              <label htmlFor="email">
                <input
                  type="email"
                  id="email"
                  value={ email }
                  name="email"
                  data-testid="product-detail-email"
                  placeholder="E-mail"
                  onChange={ this.handleChange }
                />
              </label>
              <br />
              <InputRating handleChange={ this.handleChange } />
              <label htmlFor="mensagem">
                <textarea
                  type="text"
                  id="mensagem"
                  value={ mensagem }
                  name="mensagem"
                  placeholder="Mensagem (opcional)"
                  data-testid="product-detail-evaluation"
                  onChange={ this.handleChange }
                />
              </label>
              <br />
              <button
                type="submit"
                data-testid="submit-review-btn"
                onClick={ this.handleSubmit }
              >
                Avaliar
              </button>
            </form>
            {hasEvaluations && (
              <div className="evaluations">
                {hasEvaluations && evaluations.map((evaluation) => (
                  <div key={ evaluation.email }>
                    <input
                      type="radio"
                      value="1"
                      name={ `inputRated${evaluation.email}` }
                      checked={ evaluation.inputRating === '1' }
                    />
                    <label htmlFor="radio-two">
                      <input
                        id="radio-two"
                        type="radio"
                        value="2"
                        name={ `inputRated${evaluation.email}` }
                        checked={ evaluation.inputRating === '2' }
                      />
                    </label>
                    <input
                      type="radio"
                      value="3"
                      name={ `inputRated${evaluation.email}` }
                      checked={ evaluation.inputRating === '3' }
                    />
                    <input
                      type="radio"
                      value="4"
                      name={ `inputRated${evaluation.email}` }
                      checked={ evaluation.inputRating === '4' }
                    />
                    <input
                      type="radio"
                      value="5"
                      name={ `inputRated${evaluation.email}` }
                      checked={ evaluation.inputRating === '5' }
                    />
                    <p>{ evaluation.email }</p>
                    <p>{ evaluation.mensagem }</p>
                  </div>
                ))}
              </div>)}
          </div>
          <Footer />
        </>
      );
    }
}

Details.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Details;
