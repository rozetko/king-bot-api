import { h, render, Component } from 'preact';
import Router from 'preact-router';

import { Provider, connect } from 'unistore/preact';
import createStore from 'unistore';
import axios from 'axios';

import NavBar from './navbar';
import Notifications from './components/notifications';
import Login from './sites/login';
import EditFeature from './sites/edit_feature';
import EasyScout from './extras/easy_scout';
import InactiveFinder from './extras/inactive_finder';
import CropFinder from './extras/crop_finder';
import ResourceFinder from './extras/resource_finder';
import NatureFinder from './extras/nature_finder';
import FeatureList from './sites/feature_list';
import Logger from './sites/logger';
import Settings from './sites/settings';
import lang, { languages } from './language';

const store = createStore({ notifications: [], ...languages.en });
lang.store = store;

// get stored language from server
axios.get('/api/data?ident=language')
	.then(({ data }) => lang.changeLanguage(data.language, false));
axios.get('/api/data?ident=settings')
	.then(({ data }) => document.title = `${data.gameworld}${data.avatar_name ? '/' + data.avatar_name : ''} - ${document.title}`);

const App = () => (
	<div>
		<NavBar />
		<section class='section' style={{ paddingTop: '2rem' }}>
			<div class='container is-max-desktop'>
				<Notifications />
				<Router>
					<FeatureList default path='/' />
					<Login path='/login' />
					<EditFeature path='/edit_feature/:ident/:uuid' />
					<EasyScout path='/easy_scout' />
					<InactiveFinder path='/inactive_finder' />
					<CropFinder path='/crop_finder' />
					<ResourceFinder path='/resource_finder' />
					<NatureFinder path='/nature_finder' />
					<Logger path='/logger' />
					<Settings path='/settings' />
				</Router>
			</div>
		</section>
	</div>
);

render(
	<Provider store={ store }>
		<App />
	</Provider>
	, document.body);
