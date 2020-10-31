import styled from "styled-components";

const CenterStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;

  & p,
  strong {
    max-width: 70%;
    text-align: center;
    word-wrap: wrap;
    overflow-wrap: break-word;
    margin-bottom: 8px;
  }
`;

export default CenterStatus;
