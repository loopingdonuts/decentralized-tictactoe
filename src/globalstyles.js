import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * { 
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Karla", sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 1.3;
  }
`;

export default GlobalStyle;
