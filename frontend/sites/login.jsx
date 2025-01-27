import { h, render, Component } from 'preact';
import classNames from 'classnames';
import { connect } from 'unistore/preact';
import { storeKeys } from '../language';
import { Input, Button } from '../components/form';

@connect(storeKeys)
export default class Login extends Component {
	state = {
		gameworld: '',
		email: '',
		password: '',
		sitter_type: '',
		sitter_name: '',
		sitter_style: { display: 'none' },
		error_gameworld: false,
		error_email: false,
		error_password: false,
		error_sitter: false
	};

	submit() {
		const { gameworld, email, password, sitter_type, sitter_name } = this.state;

		this.setState({
			error_gameworld: !gameworld,
			error_email: !email,
			error_password: !password,
			error_sitter: sitter_type != '' && !sitter_name
		});

		if (this.state.error_gameworld || this.state.error_email ||
			this.state.error_password || this.state.error_sitter) return;

		alert(this.props.lang_login_notification);
		fetch('/api/login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				gameworld,
				email,
				password,
				sitter_type,
				sitter_name
			})
		});
	}

	setSitter(sitter_type) {
		var sitter_style = '';
		if (sitter_type == '')
			sitter_style = { display: 'none' };
		this.setState({ sitter_type, sitter_style });
	}

	render(props, {
		gameworld,
		email,
		password,
		sitter_type,
		sitter_name,
		sitter_style,
		error_gameworld,
		error_email,
		error_password,
		error_sitter
	}) {

		const input_class_gameworld = classNames({
			'input': true,
			'is-radiusless': true,
			'is-danger': error_gameworld,
		});

		const input_class_email = classNames({
			'input': true,
			'is-radiusless': true,
			'is-danger': error_email,
		});

		const input_class_password = classNames({
			'input': true,
			'is-radiusless': true,
			'is-danger': error_password,
		});

		const input_class_sitter = classNames({
			'input': true,
			'is-radiusless': true,
			'is-danger': error_sitter,
		});

		const sitter_types = [ '',
			props.lang_login_type_sitter,
			props.lang_login_type_dual
		].map(option =>
			<option	value={ option }>{option}</option>
		);

		return (
			<div class='columns is-centered'>

				<div className='column is-half'>

					<div class='notification is-danger'>
						{props.lang_login_reset_features}
					</div>

					<div class='box is-radiusless'>
						<article class='media'>
							<div class='media-content'>
								<div class='content'>
									<h1 class="title is-3">{ props.lang_login_change_login }</h1>

									<Input
										label={ props.lang_login_gameworld }
										placeholder={ props.lang_login_gameworld }
										value={ gameworld }
										onChange={ e => this.setState({ gameworld: e.target.value }) }
										className={ input_class_gameworld }
										icon='fa-crown'
									/>

									<Input
										label={ props.lang_login_email }
										placeholder={ props.lang_login_email }
										type='email'
										value={ email }
										onChange={ e => this.setState({ email: e.target.value }) }
										className={ input_class_email }
										icon='fa-envelope'
									/>

									<Input
										label={ props.lang_login_password }
										placeholder={ props.lang_login_password }
										type='password'
										value={ password }
										onChange={ e => this.setState({ password: e.target.value }) }
										className={ input_class_password }
										icon='fa-lock'
									/>

									<div class='field'>
										<label class="label">
											{props.lang_login_sitter_type}
											<i style={{ paddingLeft: '0.7em', fontWeight: 'normal' }}>{props.lang_login_optional}</i>
										</label>
										<p class='control'>
											<div class='select is-radiusless'>
												<select
													value={ sitter_type }
													onChange={ e => this.setSitter(e.target.value) }
												>
													{sitter_types}
												</select>
											</div>
										</p>
									</div>

									<div style={ sitter_style }>
										<p><small>{props.lang_login_sitter_description}</small></p>
										<Input
											label={ props.lang_login_ingame_name }
											placeholder={ props.lang_login_player_name }
											value={ sitter_name }
											onChange={ e => this.setState({ sitter_name: e.target.value }) }
											className={ input_class_sitter }
											icon='fa-user-crown'
										/>
									</div>

									<div className='control' style={{ marginTop: '30px' }}>
										<Button action={ props.lang_login_change_login } className='is-success' onClick={ this.submit.bind(this) } icon='fa-edit' />
									</div>

								</div>

							</div>

						</article>

					</div>

				</div>

			</div>
		);
	}
}
