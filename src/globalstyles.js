import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * { 
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "PT Sans", sans-serif;
    font-size: 20px;
    line-height: 1.3;
  }

  h1, h2, h3 {
    font-weight: 700;
  }
`;

export default GlobalStyle;
