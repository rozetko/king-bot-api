import { h, render, Component } from 'preact';

import { Provider, connect } from 'unistore/preact';
import createStore from 'unistore';

import Login from './login';
import lang, { languages } from '../frontend/language';

const store = createStore({ notifications: [], ...languages.en });
lang.store = store;

render(
	<Provider store={ store }>
		<Login />
	</Provider>
	, document.body);
