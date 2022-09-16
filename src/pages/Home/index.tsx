import React, { useEffect, useContext, ChangeEvent, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { BooksContext } from "context/BooksContext";

import BooksServices from "services/BooksServices";

import { Background } from "components/Background";

import { GetPage } from "helpers/getPage";

import * as s from "./style";

export const Home: React.FC = () => {
  const { dispatch, state } = useContext(BooksContext);

  const { word } = state;

  const page = GetPage();

  const history = useHistory();

  const onClickHandler = useCallback(
    async (redirect: boolean) => {
      if (!word) {
        return;
      }

      const searchBooks = await BooksServices.getBooks(word, page);

      dispatch({
        type: "SET_BOOKS_LIST",
        data: searchBooks.data.items,
      });

      dispatch({
        type: "SET_TOTAL_PAGES",
        data: Math.ceil(searchBooks.data.totalItems / 10),
      });

      if (redirect) {
        history.push(`/results/1`);
      }
    },
    [page, word, dispatch, history]
  );

  useEffect(() => {
    onClickHandler(false);
  }, [onClickHandler, page]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_WORD",
      data: e.currentTarget.value,
    });
  };

  return (
    <s.BodyContainer>
      <s.Label htmlFor="input">Book search</s.Label>
      <s.Form
        onSubmit={(e: any) => {
          e.preventDefault();
          onClickHandler(true);
        }}
      >
        <s.Input
          id="input"
          type="text"
          autoFocus
          value={word}
          onChange={onChangeHandler}
        />
        <s.Button>Go!</s.Button>
      </s.Form>
      <Background />
    </s.BodyContainer>
  );
};
