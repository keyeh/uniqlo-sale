import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      filterBySize: "S"
    };
  }
  componentWillMount() {
    const ctx = this;
    fetch(
      "https://raw.githubusercontent.com/keyeh/uniqlo-sale-api/gh-pages/data.json"
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        ctx.setState({ products: json });
      });
  }
  renderVariants(variant) {
    return (
      <Grid item sm={3} md={2} lg={1}>
        <a href={variant.url} target="_blank" rel="noopener noreferrer">
        <Card
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <img
            style={{ width: "100%" }}
            src={variant.thumbnail}
            alt={variant.name}
          />
          <CardContent style={{ flexGrow: 1 }}>
            <Typography>
              {variant.name}
            </Typography>
            <Typography>
              {variant.stock.map(s => (s && s.inStock && <span>{s.size} &bull; </span>))}
            </Typography>
          </CardContent>
          <CardActions>
            {}
          </CardActions>
        </Card>
        </a>
      </Grid>
    );
  }

  renderProduct(product) {
    const {title,originalPrice, salePrice, variants} = product;
    const percentDiscount = (Number(originalPrice.replace('$', '')) - Number(salePrice.replace('$', ''))) / Number(originalPrice.replace('$', '')) * 100;
    return (
      <div>
        <h2>{title}</h2>
        <h3><s>{originalPrice}</s> {salePrice} ({Math.round(-percentDiscount)}%)</h3>
        <Grid container spacing={16}>
          {variants.map(this.renderVariants)}
        </Grid>
      </div>
    );
  }

  filterBySize(size) {
    if (!size) return this.state.products;

    return this.state.products
      .map(p => ({
        ...p,
        variants: p.variants.filter(
          v => v.stock.filter(s => s && s.size === "S" && s.inStock).length
        )
      }))
      .filter(p => p.variants.length);
  }

  render() {
    const filtered = this.filterBySize(this.state.filterBySize);
    return (
      <div className="App">{filtered.map(this.renderProduct.bind(this))}</div>
    );
  }
}

export default App;
