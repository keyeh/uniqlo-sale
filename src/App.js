import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "./App.css";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

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
      <Grid item sm={3} md={2} lg={2}>
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
              <Typography>{variant.name}</Typography>
              <Typography>
                {variant.stock.map(
                  s => s && s.inStock && <span>{s.size} &bull; </span>
                )}
              </Typography>
            </CardContent>
            <CardActions>{}</CardActions>
          </Card>
        </a>
      </Grid>
    );
  }

  renderProduct(product) {
    const { title, originalPrice, salePrice, variants } = product;
    const percentDiscount =
      ((Number(originalPrice.replace("$", "")) -
        Number(salePrice.replace("$", ""))) /
        Number(originalPrice.replace("$", ""))) *
      100;
    return (
      <div>
        <h2>{title}</h2>
        <h3>
          <s>{originalPrice}</s> {salePrice} ({Math.round(-percentDiscount)}%)
        </h3>
        <Grid container spacing={16}>
          {variants.map(this.renderVariants)}
        </Grid>
      </div>
    );
  }

  filterBySize(products) {
    if (!this.state.filterBySize) return products;

    return products
      .map(p => ({
        ...p,
        variants: p.variants.filter(
          v =>
            v.stock.filter(
              s =>
                s &&
                s.size.toUpperCase() === this.state.filterBySize &&
                s.inStock
            ).length
        )
      }))
      .filter(p => p.variants.length);
  }

  countVariants(products) {
    return products.reduce((acc, p) => acc + p.variants.length, 0);
  }

  render() {
    const productsFiltered = this.filterBySize(this.state.products);

    return (
      <div className="App">
        <FormControl>
          <InputLabel htmlFor="filterBySize">Filter by Size</InputLabel>
          <Input
            onChange={e =>
              this.setState({ filterBySize: e.target.value.toUpperCase() })
            }
            value={this.state.filterBySize}
          />
        </FormControl>
        Showing {productsFiltered.length} of {this.state.products.length} products
        with {this.countVariants(productsFiltered)} of {this.countVariants(this.state.products)} variants
        {productsFiltered.map(this.renderProduct.bind(this))}
      </div>
    );
  }
}

export default App;
